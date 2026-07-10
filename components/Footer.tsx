import { Logo, GithubIcon, ArrowRightIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="pb-10 pt-28">
      <div className="section-shell">
        <div className="clay-panel flex flex-col items-start justify-between gap-8 p-10 sm:flex-row sm:items-center">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <span className="font-display text-lg font-bold">
                Shadow<span className="gradient-text">Swap</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              Confidential batched swaps on public Uniswap, built for the iExec
              WTF Hackathon on the Nox confidential smart contract layer.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a href="/app" className="clay-btn">
              Launch App
              <ArrowRightIcon className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/Obiajulu-gif/shadowswap"
              target="_blank"
              rel="noreferrer"
              className="clay-btn-ghost"
            >
              <GithubIcon className="h-5 w-5" />
              View on GitHub
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} ShadowSwap · Built on iExec Nox · Deployed
          to Ethereum Sepolia
        </p>
      </div>
    </footer>
  );
}
