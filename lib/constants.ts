/**
 * On-chain reference data for ShadowSwap.
 *
 * ShadowSwap settles real trades on the *unmodified* Uniswap v3 deployment on
 * Ethereum Sepolia. Addresses below are the canonical Uniswap Sepolia
 * deployments (see docs/phase-0-recon.md for sources).
 */

export const SEPOLIA = {
  chainId: 11155111,
  name: "Ethereum Sepolia",
  explorer: "https://sepolia.etherscan.io",
  uniswap: {
    swapRouter02: "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E",
    universalRouter: "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b",
    factory: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
    quoterV2: "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3",
    positionManager: "0x1238536071E1c677A632429e3655c799b22cDA52",
    weth9: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
  },
  tokens: {
    // Uniswap-listed WETH on Sepolia
    WETH: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    // Circle test USDC on Sepolia — confirm/seed pool liquidity in Phase 0
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
} as const;

export type Handle = `0x${string}`;
