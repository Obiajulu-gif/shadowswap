import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
