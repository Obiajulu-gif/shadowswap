import { SEPOLIA } from "./constants";

/** Live ShadowSwapVault on Ethereum Sepolia. Override with env for redeploys. */
export const DEFAULT_SEPOLIA_VAULT_ADDRESS =
  "0x037D0Ea2dBD362D3dc186f6311591D969b9522e0" as const;

export const VAULT_ADDRESS = (
  process.env.NEXT_PUBLIC_VAULT_ADDRESS || DEFAULT_SEPOLIA_VAULT_ADDRESS
) as
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
