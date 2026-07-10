import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ShadowSwap — Confidential Batched Swaps on Uniswap",
  description:
    "ShadowSwap adds a privacy layer on top of public Uniswap using iExec Nox. Deposit into a confidential vault, submit encrypted swap orders, and let a TEE batch them into one net trade — individual amounts, intent and balances stay private, while composability with Uniswap stays intact.",
  keywords: [
    "ShadowSwap",
    "iExec",
    "Nox",
    "confidential DeFi",
    "Uniswap",
    "privacy",
    "TEE",
    "Sepolia",
  ],
  authors: [{ name: "ShadowSwap" }],
  openGraph: {
    title: "ShadowSwap — Confidential Batched Swaps on Uniswap",
    description:
      "Private swaps on public Uniswap, powered by iExec Nox confidential smart contracts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Loaded at runtime in the browser (non-blocking); falls back to
            system fonts if unreachable. Keeps the build network-independent. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
