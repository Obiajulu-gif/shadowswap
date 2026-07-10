import {
  WalletIcon,
  LockIcon,
  LayersIcon,
  ShuffleIcon,
  SendIcon,
} from "./Icons";

const steps = [
  {
    icon: WalletIcon,
    tag: "01",
    title: "Deposit into the vault",
    body: "Send test tokens to the Nox confidential vault. Your balance is stored as an encrypted handle — never as plaintext on-chain.",
  },
  {
    icon: LockIcon,
    tag: "02",
    title: "Submit an encrypted order",
    body: "The JS SDK encrypts your swap intent (pair + amount) client-side. The chain only sees that an order exists, not what it is.",
  },
  {
    icon: LayersIcon,
    tag: "03",
    title: "Orders get batched",
    body: "The TEE collects every order in the current epoch and privately computes the single net swap the vault needs to make.",
  },
  {
    icon: ShuffleIcon,
    tag: "04",
    title: "Settle on real Uniswap",
    body: "The vault executes one aggregate swap on the unmodified Uniswap v3 router. Observers see a single trade, not who ordered what.",
  },
  {
    icon: SendIcon,
    tag: "05",
    title: "Redistribute privately",
    body: "The TEE splits the output pro-rata and credits each user's encrypted balance. Individual amounts stay confidential end-to-end.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-28">
      <div className="section-shell">
        <div className="max-w-2xl">
          <span className="clay-chip mb-5">How it works</span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy through <span className="gradient-text">batching</span>, not
            forking.
          </h2>
          <p className="mt-4 text-ink-muted">
            Five steps take a user from a public wallet to a confidential trade —
            without changing a single line of Uniswap.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.tag}
              className="clay-card flex flex-col gap-4 p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="clay-icon">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-2xl font-bold text-clay-light">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </article>
          ))}

          {/* Closing highlight tile */}
          <article className="clay-panel flex flex-col justify-center gap-3 p-7">
            <h3 className="font-display text-xl font-semibold">
              Composability{" "}
              <span className="gradient-text">stays intact.</span>
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              Because settlement is a normal Uniswap swap, ShadowSwap plugs into
              existing liquidity and tooling. Privacy is layered on — nothing
              underneath is modified.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
