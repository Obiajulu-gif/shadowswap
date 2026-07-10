import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PrivacyComparison from "@/components/PrivacyComparison";
import Architecture from "@/components/Architecture";
import Footer from "@/components/Footer";

const stats = [
  { value: "100%", label: "Encrypted balances" },
  { value: "1", label: "Net swap per epoch" },
  { value: "0", label: "Individual orders exposed" },
  { value: "Sepolia", label: "Live testnet" },
];

export default function Home() {
  return (
    <main className="relative pb-10">
      <Navbar />
      <Hero />

      {/* Stats band */}
      <section className="pt-24">
        <div className="section-shell">
          <div className="clay-card grid grid-cols-2 gap-6 p-8 sm:p-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="gradient-text font-display text-3xl font-bold sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-ink-muted sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <PrivacyComparison />
      <Architecture />
      <Footer />
    </main>
  );
}
