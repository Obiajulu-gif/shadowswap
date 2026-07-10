/**
 * Wrap Sepolia ETH → WETH and inspect the WETH/USDC Uniswap v3 pools.
 *
 * The vault pulls WETH via transferFrom, so you need a WETH balance before you
 * can deposit. This wraps some ETH, then checks whether a liquid WETH/USDC pool
 * exists (settlement swaps against it).
 *
 * Usage (from contracts/, with PRIVATE_KEY + SEPOLIA_RPC_URL in .env):
 *   node scripts/wrap-and-pool.mjs            # wraps 0.02 ETH
 *   node scripts/wrap-and-pool.mjs 0.05       # wraps 0.05 ETH
 */
import "dotenv/config";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
  formatUnits,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PK = process.env.PRIVATE_KEY;
const WRAP = process.argv[2] || process.env.WRAP_ETH || "0.02";

const WETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const FACTORY = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"; // Uniswap v3 factory (Sepolia)

if (!PK) {
  console.error("✖ Set PRIVATE_KEY (and optionally SEPOLIA_RPC_URL) in contracts/.env");
  process.exit(1);
}

const account = privateKeyToAccount(PK.startsWith("0x") ? PK : `0x${PK}`);
const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC) });
const pub = createPublicClient({ chain: sepolia, transport: http(RPC) });

const wethAbi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "deposit", stateMutability: "payable", inputs: [], outputs: [] },
];
const factoryAbi = [
  { type: "function", name: "getPool", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }, { type: "uint24" }], outputs: [{ type: "address" }] },
];
const poolAbi = [
  { type: "function", name: "liquidity", stateMutability: "view", inputs: [], outputs: [{ type: "uint128" }] },
];

console.log("Account:", account.address);
console.log("ETH balance:", formatEther(await pub.getBalance({ address: account.address })));

console.log(`\n▸ Wrapping ${WRAP} ETH → WETH …`);
const hash = await wallet.writeContract({
  address: WETH,
  abi: wethAbi,
  functionName: "deposit",
  value: parseEther(WRAP),
});
console.log("  tx:", `https://sepolia.etherscan.io/tx/${hash}`);
await pub.waitForTransactionReceipt({ hash });
const wbal = await pub.readContract({ address: WETH, abi: wethAbi, functionName: "balanceOf", args: [account.address] });
console.log("  ✓ WETH balance now:", formatUnits(wbal, 18));

console.log("\n▸ WETH/USDC Uniswap v3 pools on Sepolia:");
let anyLiquidity = false;
for (const fee of [500, 3000, 10000]) {
  const pool = await pub.readContract({ address: FACTORY, abi: factoryAbi, functionName: "getPool", args: [WETH, USDC, fee] });
  if (pool === zeroAddress) {
    console.log(`  fee ${fee}\t: no pool`);
    continue;
  }
  let liq = 0n;
  try { liq = await pub.readContract({ address: pool, abi: poolAbi, functionName: "liquidity" }); } catch {}
  if (liq > 0n) anyLiquidity = true;
  console.log(`  fee ${fee}\t: ${pool}  liquidity=${liq.toString()}${fee === 3000 ? "  ← vault uses this tier" : ""}`);
}

console.log("\nSummary:");
console.log("  • You now have WETH — Approve + Deposit in the app will work.");
if (!anyLiquidity) {
  console.log("  • ⚠ No WETH/USDC pool has liquidity. settleEpoch() will revert until one is seeded");
  console.log("    (needs both WETH and USDC). Deposit + encrypted order + batching still demo fully;");
  console.log("    only the final on-chain swap needs a funded pool.");
} else {
  console.log("  • A pool has liquidity — if it's the fee-3000 tier, settlement will clear.");
}
