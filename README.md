<div align="center">

# 🌒 ShadowSwap

### Confidential batched swaps on public Uniswap — powered by iExec Nox

Private swaps on transparent infrastructure. Deposit into a Nox confidential
vault, submit an **encrypted** swap order, and a Trusted Execution Environment
batches everyone's trades into a **single net swap** on unmodified Uniswap v3.
Individual amounts, direction and balances stay hidden; composability stays
intact.

`iExec Nox` · `Intel TDX TEE` · `Uniswap v3` · `Ethereum Sepolia` · `Next.js` · `Tailwind`

</div>

---

## ✨ Why ShadowSwap

Public AMMs like Uniswap expose every trade: amount, direction, and wallet.
That leaks strategy and invites front-running/MEV. ShadowSwap adds a **privacy
layer on top** — without forking Uniswap — by:

1. Holding **encrypted balances** in a Nox confidential vault.
2. Accepting **encrypted swap intents** (the chain never sees your amount).
3. **Batching** orders per epoch inside a TEE and decrypting **only the
   aggregate**.
4. Settling that aggregate as **one ordinary swap** on real Uniswap liquidity.

> The chain sees one anonymous net swap. You keep the full private picture.

## 🏗️ Architecture

```
Wallet ──▶ Frontend (Next.js) ──▶ Nox JS SDK (encrypt)
                                        │  encrypted handles
                                        ▼
                             ShadowSwapVault (confidential Solidity)
                                        │  batch per epoch
                                        ▼
                             Nox TEE (Intel TDX) — net + decrypt AGGREGATE only
                                        │  one public swap
                                        ▼
                             Uniswap v3 SwapRouter02 (Sepolia, UNMODIFIED)
```

Full design: [`docs/design.md`](docs/design.md) · Recon &
addresses: [`docs/phase-0-recon.md`](docs/phase-0-recon.md).

## 📁 Project structure

| Path | What |
| --- | --- |
| `app/` | Next.js 14 App Router — claymorphism landing/product UI |
| `components/` | UI sections (Hero, HowItWorks, PrivacyComparison, Architecture…) |
| `lib/constants.ts` | Sepolia + Uniswap v3 addresses |
| `contracts/` | Hardhat + Nox workspace |
| `contracts/contracts/ShadowSwapVault.sol` | Confidential vault (design skeleton) |
| `docs/` | Phase-by-phase design & recon docs |
| `feedback.md` | Feedback on iExec/Nox tooling |

## 🚀 Getting started (frontend)

Requirements: Node.js ≥ 20.

```bash
git clone https://github.com/Obiajulu-gif/shadowswap.git
cd shadowswap
npm install
npm run dev
```

Open <http://localhost:3000>.

## 🔐 Contracts (Hardhat + Nox)

```bash
cd contracts
cp .env.example .env      # add PRIVATE_KEY + SEPOLIA_RPC_URL
npm install
npm run compile
npm run deploy:sepolia
```

> The confidential contract is scaffolded from the
> [Nox Hardhat starter](https://github.com/iExec-Nox/nox-hardhat-starter) and the
> [cDeFi Wizard](https://cdefi-wizard.iex.ec/) in Phase 2. The current Solidity
> file is a documented **design skeleton** (see the header in
> `ShadowSwapVault.sol`).

## 🗺️ Roadmap (build phases)

- [x] **Phase 0** — Setup & recon (env, addresses, scaffold) → `docs/phase-0-recon.md`
- [x] **Phase 1** — Confidential contract design → `docs/design.md`
- [x] **Phase 2** — Vault implemented on the **real** `@iexec-nox` Solidity SDK; **compiles** (solc 0.8.35) → `contracts/contracts/ShadowSwapVault.sol`
- [x] **Phase 3** — Functional frontend swap flow (deposit → encrypted order → reveal → claim), wired with `@iexec-nox/handle`; **`next build` passes** → `app/app/page.tsx`
- [x] **Phase 4** — Deploy pipeline verified (Ignition deploy + constructor args); readiness documented → `docs/deploy.md`
- [ ] **Phase 5** — Live deploy: contracts → Sepolia (funded key), frontend → Vercel, seed Uniswap liquidity
- [ ] **Phase 6** — `feedback.md` polish, 4-min demo video, X post tagging @iEx_ec

> Verified locally: `cd contracts && npm run compile` (green), root `npm run build` (green),
> `npx hardhat ignition deploy ignition/modules/ShadowSwap.ts` (deploys). See
> [`docs/deploy.md`](docs/deploy.md) for what a live end-to-end run additionally needs
> (funded key, Nox offchain Docker stack, pool liquidity).

## 🧾 Hackathon

Built for the **iExec WTF (Write The Future) Hackathon — Summer Edition** on the
Nox confidential smart contract layer. Deployed on **ETH Sepolia**.

## 📄 License

MIT
