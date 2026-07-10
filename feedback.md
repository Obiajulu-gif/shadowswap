# Feedback on iExec Nox tooling

> A required hackathon deliverable. This log captures our honest, running
> experience building ShadowSwap with the Nox stack. Updated per phase.

## Context

- **Project:** ShadowSwap — confidential batched swaps layered on public Uniswap v3.
- **Nox surface used (so far):** docs, cDeFi Wizard, Nox Hardhat starter/plugin
  (planned Phase 2), JS SDK (planned Phase 3).

## Phase 0–1 (setup, recon, contract design)

### What worked well
- The Nox mental model (**Handles + ACLs + TEE**) maps cleanly onto a
  "public-by-default protocol + private layer on top" design. It made the
  public/private boundary for ShadowSwap easy to reason about.
- Positioning Nox as "**standard Solidity + privacy primitives**" (rather than a
  new language) lowered the design cost — we could sketch the vault as normal
  Solidity and mark where encrypted types slot in.
- Full **DeFi composability** being a first-class promise is exactly what our use
  case needs (settle on unmodified Uniswap).

### Friction / questions we hit
- We could not, from the getting-started page alone, pin down the **exact
  encrypted-type names and math ops** (`euint*`, `add`/`sub`/`le`/`mulDiv`) or the
  precise **npm package names**. We had to defer those to the starter repo. A
  single "cheat-sheet" page (types + ops + package names + minimal example) would
  speed up Phase 1 a lot.
- Guidance on the **TEE decryption / reveal pattern** — how to decrypt *only* an
  aggregate while keeping components encrypted — is central to our design; a
  documented recipe for "reveal the sum, hide the addends" would be gold.
- The **network/chain** Nox targets wasn't explicit on the welcome page; we
  confirmed Sepolia via the hackathon rules. Stating supported networks up front
  would help.

### Suggestions
- Add a copy-pasteable **"confidential vault with encrypted balances"** example
  (deposit/withdraw + owner-only decrypt via ACL) — it's the 80% starting point
  for most DeFi privacy layers.
- Document **ACL lifecycle best practices** (when to grant/revoke decrypt rights).
- Note gotchas for **integer/rounding** in encrypted pro-rata math.

## Phase 2+ (implementation) — _to be filled in_

- cDeFi Wizard output quality: _TBD_
- Nox Hardhat plugin DX (compile/deploy): _TBD_
- JS SDK encryption ergonomics on the frontend: _TBD_
- Testing confidential contracts locally: _TBD_

---

_Overall so far: the model is a genuinely good fit for adding privacy to public
DeFi. The main ask is more concrete, example-first reference material for the
Solidity primitives and the selective-decryption pattern._
