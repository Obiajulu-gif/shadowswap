# Phase 0 — Setup & Recon

Status: **complete**. This document is the output of Phase 0: the environment,
prerequisites, and confirmed on-chain reference data ShadowSwap builds on.

## 1. Toolchain (verified locally)

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | v24.12.0 | Frontend + Hardhat runtime |
| npm | 11.6.2 | Package manager |
| git | 2.52.0 | VCS |
| gh CLI | 2.95.0 | GitHub repo automation |

## 2. Repository layout

```
shadowswap/
├── app/                    # Next.js 14 App Router (frontend)
│   ├── layout.tsx
│   ├── page.tsx            # Claymorphism landing / product page
│   └── globals.css         # Clay design system
├── components/             # UI sections (Hero, HowItWorks, Privacy, ...)
├── lib/constants.ts        # Sepolia + Uniswap addresses
├── contracts/              # Hardhat + Nox workspace
│   ├── contracts/ShadowSwapVault.sol   # Phase 1 design skeleton
│   ├── hardhat.config.ts
│   └── .env.example
├── docs/
│   ├── phase-0-recon.md    # this file
│   └── design.md           # Phase 1 confidential-contract spec
├── README.md
└── feedback.md             # iExec/Nox tooling feedback (graded deliverable)
```

## 3. Nox — what we confirmed

- **Nox** is a privacy layer for confidential computations on encrypted data
  while preserving full DeFi composability.
- Uses off-chain **Intel TDX Trusted Execution Environments (TEE)**.
- Programming model has three pillars:
  1. **Handles** — unique identifiers pointing to encrypted off-chain data.
  2. **Access Control Lists (ACLs)** — on-chain permissions for who can decrypt.
  3. **TEE compute** — encrypted operations run inside the enclave.
- Developers write **standard Solidity** using Nox privacy primitives + a **JS SDK**
  for client-side encryption / result decryption.

**Action for Phase 2:** scaffold from
[`nox-hardhat-starter`](https://github.com/iExec-Nox/nox-hardhat-starter), add the
[`nox-hardhat-plugin`](https://github.com/iExec-Nox/nox-hardhat-plugin), and pull the
exact `@iexec-nox/*` package names + encrypted-type API from
[docs](https://docs.iex.ec/nox-protocol/getting-started/welcome). The
confidential-contract wizard at <https://cdefi-wizard.iex.ec/> generates a
starting vault.

## 4. Uniswap v3 on Ethereum Sepolia (settlement layer — unmodified)

Canonical Uniswap v3 deployments used by ShadowSwap (source: Uniswap docs,
Ethereum deployments → Sepolia):

| Contract | Address |
| --- | --- |
| SwapRouter02 | `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E` |
| UniversalRouter | `0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b` |
| UniswapV3Factory | `0x0227628f3F023bb0B980b67D528571c95c6DaC1c` |
| QuoterV2 | `0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3` |
| NonfungiblePositionManager | `0x1238536071E1c677A632429e3655c799b22cDA52` |
| WETH9 | `0xfff9976782d46cc05630d1f6ebab18b2324d6b14` |

Demo pair: **WETH / USDC**. USDC (Circle Sepolia test):
`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`.

> ⚠️ **Liquidity risk (top Phase 0 finding):** confirm a WETH/USDC v3 pool with
> real liquidity exists on Sepolia before the demo. If not, create a pool via
> the NonfungiblePositionManager and seed it, or switch to a pair that already
> has liquidity. A demo that swaps against an empty pool fails the
> "no mock data" criterion.

## 5. Prerequisites checklist

- [x] Node / git / gh installed and verified
- [x] Next.js + Tailwind frontend scaffolded (claymorphism design system)
- [x] Contracts workspace + Hardhat config scaffolded
- [x] Uniswap Sepolia addresses captured in `lib/constants.ts`
- [x] GitHub repository created
- [ ] Sepolia ETH in a throwaway deployer wallet (Phase 2)
- [ ] Nox packages installed from `nox-hardhat-starter` (Phase 2)
- [ ] WETH/USDC pool liquidity confirmed or seeded (Phase 2)

## 6. Exit gate

Phase 0 is done when the repo builds, the design system renders, and all
external addresses are captured. ✅ Proceed to Phase 2 (implement the
confidential contract against the real Nox library) — the Phase 1 spec is in
[`design.md`](./design.md).
