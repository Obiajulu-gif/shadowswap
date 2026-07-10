import { ArrowRightIcon, ShieldIcon, LockIcon, LayersIcon, BoltIcon } from "./Icons";

export default function Hero() {
  return (
    <section id="top" className="relative pt-16 sm:pt-24">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div>
          <span className="clay-chip mb-6">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-cyan-glow" />
            Powered by iExec Nox · Live on Sepolia
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Private swaps on{" "}
            <span className="gradient-text">public Uniswap.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            ShadowSwap wraps Uniswap in a confidential layer. Deposit into a Nox
            vault, submit an <span className="text-ink">encrypted</span> swap
            order, and a Trusted Execution Environment batches everyone&apos;s
            trades into a single net swap. Your amount, direction and balance
            stay hidden — Uniswap stays untouched.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="/app" className="clay-btn text-base">
              Launch App
              <ArrowRightIcon className="h-5 w-5" />
            </a>
            <a href="#how-it-works" className="clay-btn-ghost text-base">
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-ink-faint">
            <span className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-cyan-glow" /> Intel TDX TEE
            </span>
            <span className="flex items-center gap-2">
              <LockIcon className="h-4 w-4 text-violet-glow" /> Encrypted balances
            </span>
            <span className="flex items-center gap-2">
              <LayersIcon className="h-4 w-4 text-pink-glow" /> No protocol forks
            </span>
          </div>
        </div>

        {/* Right: floating clay visual */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="clay-panel relative overflow-hidden p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-ink-muted">
                Confidential Order
              </span>
              <span className="clay-chip !py-1 !text-xs">
                <LockIcon className="h-3.5 w-3.5 text-cyan-glow" /> encrypted
              </span>
            </div>

            <div className="clay-inset mb-4 flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-ink-faint">You pay</p>
                <p className="font-display text-2xl font-bold tracking-widest text-ink">
                  ••••••
                </p>
              </div>
              <span className="clay-chip">WETH</span>
            </div>

            <div className="mx-auto -my-2 flex h-11 w-11 items-center justify-center rounded-full bg-clay-light shadow-clay-sm">
              <BoltIcon className="h-5 w-5 text-cyan-glow" />
            </div>

            <div className="clay-inset mt-4 flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-ink-faint">You receive</p>
                <p className="font-display text-2xl font-bold tracking-widest text-ink">
                  ••••••
                </p>
              </div>
              <span className="clay-chip">USDC</span>
            </div>

            <div className="mt-6 rounded-clay-sm bg-clay-base p-4 shadow-clay-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-faint">Batched with</span>
                <span className="font-semibold text-ink">14 orders</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-ink-faint">Chain sees</span>
                <span className="font-semibold text-cyan-glow">1 net swap</span>
              </div>
            </div>
          </div>

          {/* floating accent blobs */}
          <div className="absolute -right-6 -top-6 h-20 w-20 animate-float rounded-clay-sm bg-gradient-to-br from-violet-glow to-cyan-glow opacity-80 shadow-glow" />
          <div className="absolute -bottom-7 -left-7 h-16 w-16 animate-float-slow rounded-full bg-gradient-to-br from-pink-glow to-violet-glow opacity-70 shadow-glow" />
        </div>
      </div>
    </section>
  );
}
