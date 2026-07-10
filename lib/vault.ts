import { SEPOLIA } from "./constants";

/** ShadowSwapVault address — set after deploying (see contracts/). */
export const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "") as
  | `0x${string}`
  | "";

export const isVaultConfigured = /^0x[a-fA-F0-9]{40}$/.test(VAULT_ADDRESS);

export const SEPOLIA_CHAIN_ID = SEPOLIA.chainId;

export const TOKEN_IN = {
  address: SEPOLIA.tokens.WETH as `0x${string}`,
  symbol: "WETH",
  decimals: 18,
};

export const TOKEN_OUT = {
  address: SEPOLIA.tokens.USDC as `0x${string}`,
  symbol: "USDC",
  decimals: 6,
};
