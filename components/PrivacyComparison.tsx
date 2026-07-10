import { EyeOffIcon, EyeIcon } from "./Icons";

const chainSees = [
  { label: "Order count", value: "1 net swap / epoch" },
  { label: "Individual amounts", value: "Hidden" },
  { label: "Trade direction", value: "Hidden" },
  { label: "Per-user balance", value: "Encrypted handle" },
];

const youKnow = [
  { label: "Your amount in", value: "2.00 WETH" },
  { label: "Your amount out", value: "6,412.55 USDC" },
  { label: "Your direction", value: "WETH → USDC" },
  { label: "Your balance", value: "Fully visible to you" },
];

export default function PrivacyComparison() {
  return (
    <section id="privacy" className="pt-28">
      <div className="section-shell">
        <div className="max-w-2xl">
          <span className="clay-chip mb-5">The privacy guarantee</span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What the chain sees vs.{" "}
            <span className="gradient-text">what you did.</span>
          </h2>
          <p className="mt-4 text-ink-muted">
            The same trade, two views. Front-runners and chain analysts see an
            anonymous aggregate. You keep the full picture.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Chain view */}
          <div className="clay-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="clay-icon !text-ink-muted">
                <EyeOffIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  What the chain sees
                </h3>
                <p className="text-xs text-ink-faint">
                  Public — anyone watching Sepolia
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {chainSees.map((row) => (
                <li
                  key={row.label}
                  className="clay-inset flex items-center justify-between px-5 py-4"
                >
                  <span className="text-sm text-ink-faint">{row.label}</span>
                  <span className="font-display text-sm font-semibold text-ink-muted">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Your view */}
          <div className="clay-panel p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="clay-icon">
                <EyeIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  What you did
                </h3>
                <p className="text-xs text-ink-faint">
                  Private — decrypted only for you
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {youKnow.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between rounded-clay-sm bg-clay-base px-5 py-4 shadow-clay-sm"
                >
                  <span className="text-sm text-ink-faint">{row.label}</span>
                  <span className="gradient-text font-display text-sm font-semibold">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
