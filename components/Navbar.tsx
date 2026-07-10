import { Logo, WalletIcon, GithubIcon } from "./Icons";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#privacy" },
  { label: "Architecture", href: "#architecture" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="section-shell">
        <nav className="flex items-center justify-between gap-4 rounded-clay-sm bg-clay-base/80 px-4 py-3 shadow-clay-sm backdrop-blur-xl sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg font-bold tracking-tight">
              Shadow<span className="gradient-text">Swap</span>
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Obiajulu-gif/shadowswap"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="clay-icon !h-11 !w-11 text-ink-muted hover:text-ink"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="/app" className="clay-btn !px-4 !py-2.5 text-sm sm:!px-5">
              <WalletIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Launch App</span>
              <span className="sm:hidden">App</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
