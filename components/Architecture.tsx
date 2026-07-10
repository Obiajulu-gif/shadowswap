import { WalletIcon, LockIcon, CubeIcon, ShuffleIcon, ShieldIcon } from "./Icons";

const layers = [
  {
    icon: WalletIcon,
    title: "Frontend dApp",
    sub: "Next.js · Tailwind · wagmi",
    body: "Claymorphism UI where users deposit, encrypt orders client-side, and read their private balance.",
  },
  {
    icon: ShieldIcon,
    title: "Nox JS SDK",
    sub: "Client-side encryption",
    body: "Encrypts swap intent into handles before anything touches the chain, and decrypts results for the owner.",
  },
  {
    icon: LockIcon,
    title: "ShadowSwapVault",
    sub: "Confidential Solidity",
    body: "Holds encrypted balances and pending orders. Nox privacy primitives keep amounts hidden on-chain.",
  },
  {
    icon: ShuffleIcon,
    title: "TEE batching (Nox)",
    sub: "Intel TDX",
    body: "Nets orders per epoch and computes the single aggregate swap — all on encrypted data inside the enclave.",
  },
  {
    icon: CubeIcon,
    title: "Uniswap v3 (Sepolia)",
    sub: "Unmodified · public",
    body: "Settlement layer. One aggregate swap clears against real liquidity through SwapRouter02.",
  },
];

const badges = [
  "iExec Nox",
  "Intel TDX TEE",
  "Solidity",
  "Hardhat",
  "Next.js 14",
  "Tailwind CSS",
  "wagmi / viem",
  "Uniswap v3",
  "ETH Sepolia",
];

export default function Architecture() {
  return (
    <section id="architecture" className="pt-28">
      <div className="section-shell">
        <div className="max-w-2xl">
          <span className="clay-chip mb-5">Architecture</span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A clean{" "}
            <span className="gradient-text">privacy layer</span>, top to bottom.
          </h2>
          <p className="mt-4 text-ink-muted">
            Encrypted intent flows down; a single public swap flows back up.
            Everything between the wallet and Uniswap stays confidential.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {layers.map((layer, i) => (
            <div
              key={layer.title}
              className="clay-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4 sm:w-72 sm:shrink-0">
                <div className="clay-icon">
                  <layer.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {layer.title}
                  </h3>
                  <p className="text-xs text-ink-faint">{layer.sub}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted sm:flex-1">
                {layer.body}
              </p>
              <span className="hidden font-display text-3xl font-bold text-clay-light sm:block">
                L{i + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {badges.map((badge) => (
            <span key={badge} className="clay-chip">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
