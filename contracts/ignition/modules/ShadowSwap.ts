import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Uniswap v3 on Ethereum Sepolia (unmodified settlement layer)
const SWAP_ROUTER_02 = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const WETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";
const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const POOL_FEE = 3000; // 0.3%

/**
 * Deploy the ShadowSwapVault for the WETH → USDC pair on Sepolia.
 *
 *   npx hardhat ignition deploy ignition/modules/ShadowSwap.ts --network sepolia
 */
export default buildModule("ShadowSwap", (m) => {
  const router = m.getParameter("router", SWAP_ROUTER_02);
  const tokenIn = m.getParameter("tokenIn", WETH);
  const tokenOut = m.getParameter("tokenOut", USDC);
  const fee = m.getParameter("fee", POOL_FEE);

  const vault = m.contract("ShadowSwapVault", [router, tokenIn, tokenOut, fee]);

  return { vault };
});
