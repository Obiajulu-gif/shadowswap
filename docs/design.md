# Phase 1 — Confidential Contract Design

Status: **complete**. This is the design spec for `ShadowSwapVault`. It locks the
data model and the public/private boundary before implementation (Phase 2). The
executable-shaped skeleton lives at
[`contracts/contracts/ShadowSwapVault.sol`](../contracts/contracts/ShadowSwapVault.sol).

## 1. Goal

Let users swap on **public Uniswap** without revealing their individual amounts,
trade direction, or balances — by routing through a **Nox confidential vault**
that **batches** many orders into a single net swap. Uniswap is never modified.

## 2. The privacy boundary

| Data | Visibility | Why |
| --- | --- | --- |
| Deposit ERC-20 transfer amount | **Public** | It's a normal token transfer into the vault |
| Per-user balance | **Private** (encrypted handle) | Core privacy guarantee |
| Per-order amount | **Private** (encrypted handle) | Hides trade size / intent |
| Order existence + epoch | **Public** | Needed to batch; reveals nothing sensitive |
| Aggregate net swap per epoch | **Public** | This is the whole trick — only the sum is revealed |
| Per-user output share | **Private** (encrypted handle) | Keeps proceeds confidential |

**Design invariant:** the only number about the batch that ever gets decrypted
is the **aggregate `netAmountIn`** (and the resulting `amountOut`, which Uniswap
returns publicly anyway). No individual value is ever revealed on-chain.

## 3. State

```
swapRouter : ISwapRouter02      // Uniswap v3 SwapRouter02 (Sepolia), immutable
tokenA, tokenB : address        // the single supported pair, e.g. WETH / USDC
poolFee : uint24                // e.g. 3000

encBalance[user][token] : euint128        // encrypted balances (handles)
epochOrders[epoch] : Order[]              // queued orders per batch
currentEpoch : uint256

Order = { user: address, tokenIn: address, encAmountIn: euint128 }
```

`euint128` / `ebool` are **Nox encrypted handles** — pointers to data encrypted
inside the TEE. In Phase 2 they come from the Nox Solidity library; in the
skeleton they are placeholder aliases.

## 4. Functions

| Function | Trigger | Confidential effect |
| --- | --- | --- |
| `deposit(token, amount, encAmount)` | user | pull ERC-20; `encBalance += encAmount` (+ ACL: owner may decrypt) |
| `submitOrder(tokenIn, encAmountIn)` | user | verify `encAmountIn ≤ balance` (encrypted), debit, queue encrypted order |
| `settleEpoch(minAmountOut)` | anyone / keeper | TEE sums encrypted amounts → decrypt **only the aggregate** → one Uniswap swap → redistribute output pro-rata into encrypted balances |
| `withdraw(token, amount, encAmount)` | user | verify + debit encrypted balance; transfer ERC-20 out |
| `myBalanceHandle(token)` | user (view) | return caller's encrypted balance handle (decryptable only via ACL) |

### settleEpoch flow (the core)

1. TEE computes `encTotal = Σ encAmountIn` over the epoch's orders.
2. `netAmountIn = decrypt(encTotal)` — **only the total** leaves the enclave.
3. `approve(router, netAmountIn)` then `exactInputSingle(...)` on **unmodified**
   Uniswap → returns `amountOut`.
4. TEE computes each user's `share = encAmountIn * amountOut / encTotal` and does
   `encBalance[user][tokenB] += share` — shares stay encrypted.
5. `currentEpoch++`.

## 5. Netting model

- **v1 (MVP, ship this):** batch **same-direction** orders (all `tokenA → tokenB`)
  into one aggregate swap. Already hides *individual* amounts — the privacy claim
  holds with ≥ 2 orders in a batch.
- **v2 (stretch / roadmap):** internally net **opposite-direction** orders
  (A→B against B→A) and only swap the remainder on Uniswap — a true dark pool
  with even less public leakage and better price.

## 6. Composability & anti-MEV

- Settlement is a plain `exactInputSingle`, so ShadowSwap uses **existing
  liquidity and tooling** — nothing under it changes.
- Because only the **aggregate** hits the mempool, an observer cannot map a swap
  to a user or front-run an individual order. Batching is the anti-MEV
  mechanism.

## 7. Threat notes / open questions for Phase 2

- **Batch size ≥ 2:** a single-order epoch trivially de-anonymizes. Enforce a
  minimum batch size (or a k-anonymity threshold) before `settleEpoch`.
- **Rounding in pro-rata split:** dust from integer division should accrue to the
  vault or the next epoch; define precisely once the Nox math ops are known.
- **Encrypted comparison ops:** confirm the exact Nox primitives for
  `le` / `add` / `sub` / `mulDiv` and the `requireEnc` gating pattern.
- **ACL lifecycle:** confirm when to grant/revoke decryption rights on balance
  handles (deposit, settle, withdraw).
- **Settlement trigger:** manual "Settle" button for the demo; a keeper/interval
  for production.

## 8. Exit gate

Phase 1 is done when state, boundary, and signatures are agreed (this doc) and
reflected in the skeleton. ✅ Next: Phase 2 wires these to the real Nox library,
generating the vault base from the cDeFi Wizard.
