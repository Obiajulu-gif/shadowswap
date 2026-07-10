import type { WalletClient } from "viem";

/**
 * Thin wrapper around the Nox handle JS SDK (@iexec-nox/handle).
 *
 * The SDK is imported lazily inside each call so it never runs during SSR /
 * static build — only in the browser when the user actually encrypts/decrypts.
 * The Sepolia gateway + subgraph are resolved automatically by chain id.
 */

/** Encrypt a plaintext amount into an external handle + proof for `submitOrder`. */
export async function encryptAmount(
  walletClient: WalletClient,
  vault: `0x${string}`,
  amount: bigint
): Promise<{ handle: `0x${string}`; handleProof: `0x${string}` }> {
  const { createViemHandleClient } = await import("@iexec-nox/handle");
  const client = await createViemHandleClient(walletClient);
  // The SDK takes the *plaintext* Solidity type ("uint256"); it encrypts it to
  // an euint256 handle + input proof consumed by Nox.fromExternal on-chain.
  const { handle, handleProof } = await client.encryptInput(
    amount,
    "uint256",
    vault
  );
  return {
    handle: handle as unknown as `0x${string}`,
    handleProof: handleProof as `0x${string}`,
  };
}

/** Decrypt one of the caller's own handles (deposit / output balance). */
export async function decryptHandle(
  walletClient: WalletClient,
  handle: `0x${string}`
): Promise<bigint> {
  const { createViemHandleClient } = await import("@iexec-nox/handle");
  const client = await createViemHandleClient(walletClient);
  const { value } = await client.decrypt(handle as never);
  return BigInt(value as bigint);
}
