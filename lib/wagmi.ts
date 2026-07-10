import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * wagmi config — ShadowSwap runs on Ethereum Sepolia only.
 * Uses the injected connector (MetaMask / Rabby / Brave) to avoid any
 * WalletConnect project-id requirement.
 */
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
    ),
  },
  ssr: true,
});
