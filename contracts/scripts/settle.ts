/**
 * Keeper settlement script (scaffold).
 *
 * settleEpoch() needs the plaintext epoch aggregate, which is deliberately not
 * available on-chain. The keeper reveals it via Nox public decryption and calls
 * back to settle. Wire this to your deployment + a keeper key, then:
 *
 *   npx hardhat run scripts/settle.ts --network sepolia
 *
 * Requires (add to contracts deps when you run it live):
 *   npm i @iexec-nox/handle viem
 */
import { createPublicClient, createWalletClient, http, type Address } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
// import { createViemHandleClient } from "@iexec-nox/handle";
import { shadowSwapVaultAbi } from "./abi.js"; // export from artifacts, or import JSON

const VAULT = process.env.VAULT_ADDRESS as Address;
const RPC = process.env.SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";
const KEY = process.env.PRIVATE_KEY as `0x${string}`;

async function main() {
  const account = privateKeyToAccount(KEY);
  const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC) });
  const pub = createPublicClient({ chain: sepolia, transport: http(RPC) });

  const epoch = (await pub.readContract({
    address: VAULT,
    abi: shadowSwapVaultAbi,
    functionName: "currentEpoch",
  })) as bigint;

  // 1) mark the aggregate publicly decryptable
  await wallet.writeContract({
    address: VAULT,
    abi: shadowSwapVaultAbi,
    functionName: "requestSettlement",
  });

  // 2) read the aggregate handle, then decrypt it off-chain via the Nox gateway
  const totalHandle = (await pub.readContract({
    address: VAULT,
    abi: shadowSwapVaultAbi,
    functionName: "epochTotalHandle",
    args: [epoch],
  })) as `0x${string}`;

  // const handleClient = await createViemHandleClient(wallet);
  // const { value: netAmountIn } = await handleClient.publicDecrypt(totalHandle);
  const netAmountIn = 0n; // ← replace with the decrypted aggregate above
  void totalHandle;

  // 3) settle: one Uniswap swap of the aggregate + encrypted pro-rata payout
  const minAmountOut = 0n; // set a real slippage floor from a Uniswap quote
  await wallet.writeContract({
    address: VAULT,
    abi: shadowSwapVaultAbi,
    functionName: "settleEpoch",
    args: [netAmountIn, minAmountOut],
  });

  console.log(`Settled epoch ${epoch}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
