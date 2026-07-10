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

## Phase 2–3 (implementation)

### What worked well
- **`Nox.sol` is genuinely ergonomic.** Writing the vault felt like normal
  Solidity: `Nox.fromExternal(externalEuint256, proof)`, `Nox.add/sub/mul/div`,
  `Nox.le` + `Nox.select` for branch-free clamping, `Nox.allow/allowThis` for
  ACLs, and `Nox.allowPublicDecryption` to reveal just an aggregate. The whole
  "reveal the sum, hide the addends" pattern we needed dropped out naturally.
- **It compiled first try against the real libraries** (solc 0.8.35) once we
  matched the Hardhat 3 example project. `ERC7984` + the `ERC20ToERC7984Wrapper`
  are a great base — more confidential DeFi is possible than we expected.
- **The handle JS SDK is clean**: `createViemHandleClient(walletClient)` then
  `encryptInput(amount, "uint256", vaultAddr)` returns exactly the
  `{ handle, handleProof }` that `submitOrder(externalEuint256, bytes)` wants.
  `resolveNetworkConfig(chainId)` meant zero manual gateway wiring for Sepolia.

### Friction / papercuts
- **`encryptInput` takes the plaintext type (`"uint256"`), not `"euint256"`.**
  Intuitive in hindsight, but the type name collision cost us a build cycle. One
  line in the README example would prevent this.
- **`@iexec-nox/handle` pulls `ethers` via its index** even if you only use the
  viem client, so a viem-only Next.js app must still install `ethers` or the
  build fails on module resolution. Splitting the ethers/viem factories into
  separate entrypoints (or making `ethers` optional) would keep viem apps lean.
- **Hardhat 3 + local E2E requires Docker** (KMS/ingestor/runner/gateway/NATS/S3
  via the plugin). Powerful, but heavy for a quick hackathon loop — a hosted
  shared testnet gateway (which Sepolia effectively is) is the faster path, and
  worth signposting earlier in the docs.
- Discovering the package names (`nox-protocol-contracts`,
  `nox-confidential-contracts`, `handle`) still meant reading the plugin repo;
  the earlier "cheat-sheet" ask stands.

## Phase 4 (deploy)
- Deploying to a local chain via **Ignition worked immediately**; constructor-only
  deploy needs no NoxCompute, and `Nox.noxComputeContract()` already hard-codes
  Sepolia (`0x24Ef…77bF`), so Sepolia deployment is friction-free. 👍

---

_Overall so far: the model is a genuinely good fit for adding privacy to public
DeFi. The main ask is more concrete, example-first reference material for the
Solidity primitives and the selective-decryption pattern._
