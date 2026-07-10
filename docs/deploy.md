# Phases 2–4 — Build, Verify & Deploy

Status of the moving parts, what's been **verified in this repo**, and the exact
steps to take it live on Sepolia.

## What's verified ✅

| Check | Command | Result |
| --- | --- | --- |
| Confidential contract compiles vs. **real** Nox libs | `cd contracts && npm run compile` | ✅ solc 0.8.35, ABI generated |
| Vault deploys (pipeline + constructor args) | `npx hardhat ignition deploy ignition/modules/ShadowSwap.ts` | ✅ deployed on local chain |
| Frontend production build | `npm run build` | ✅ `/` and `/app` build & prerender |
| dApp renders + wallet + graceful gating | `npm run dev` → `/app` | ✅ no console errors |

The contract is written against the actual `@iexec-nox/nox-protocol-contracts`
`Nox.sol` SDK (encrypted `euint256`, `fromExternal`, `add/sub/mul/div`,
`le/select`, `allow/allowThis`, `allowPublicDecryption`) and the frontend
encrypts orders with the real `@iexec-nox/handle` JS SDK
(`createViemHandleClient().encryptInput(amount, "uint256", vault)`).

## Architecture recap (real Nox primitives)

```
deposit(amount)            public ERC-20 in  → encrypted balance (euint256, allow(user))
submitOrder(handle,proof)  Nox.fromExternal  → encrypted order; epochTotal += amt (encrypted)
requestSettlement()        Nox.allowPublicDecryption(epochTotal)   ← reveals ONLY the aggregate
[keeper reads aggregate off-chain via handle SDK publicDecrypt]
settleEpoch(net,minOut)    ONE exactInputSingle on unmodified Uniswap v3 → pro-rata euint256 shares
requestClaim()/finalize    reveal caller's own share → withdraw tokenOut
```

NoxCompute is already live on **Ethereum Sepolia** at
`0x24Ef36Ec5b626D7DCD09a98F3083c2758F0F77bF` (from `Nox.sol`), so confidential
contracts deploy straight to Sepolia.

## Deploy to Sepolia

### 1. Contracts

```bash
cd contracts
cp .env.example .env         # set PRIVATE_KEY (funded w/ Sepolia ETH) + SEPOLIA_RPC_URL
npm install
npm run compile
npx hardhat ignition deploy ignition/modules/ShadowSwap.ts --network sepolia
```

Copy the deployed `ShadowSwapVault` address.

### 2. Frontend

```bash
cd ..
cp .env.local.example .env.local     # set NEXT_PUBLIC_VAULT_ADDRESS=<deployed address>
npm run dev                          # or: npm run build && npm start
```

The `/app` "Vault not configured" banner disappears once the address is set and
the console goes fully live.

## Settlement (keeper) flow

`settleEpoch` needs the plaintext aggregate, which is intentionally **not**
available on-chain. The keeper:

1. calls `requestSettlement()` (marks `epochTotal` publicly decryptable),
2. reads the plaintext with the handle SDK
   `client.publicDecrypt(epochTotalHandle(epoch))`,
3. calls `settleEpoch(netAmountIn, minAmountOut)` → one Uniswap swap + encrypted
   pro-rata redistribution.

A scaffold lives in [`contracts/scripts/settle.ts`](../contracts/scripts/settle.ts).

## What only YOU can do for a live end-to-end run

These need credentials / infra not available in CI and must be run locally:

- [ ] **Funded Sepolia deployer key** in `contracts/.env` (faucet).
- [ ] **WETH/USDC v3 pool liquidity on Sepolia** — confirm a liquid 0.3% pool
      exists, or create + seed one via the NonfungiblePositionManager
      (`0x1238…DA52`). A swap against an empty pool fails the "no mock data" bar.
- [ ] **Local confidential E2E tests** need the Nox offchain stack (KMS, ingestor,
      runner, handle gateway, NATS, S3) via `@iexec-nox/nox-hardhat-plugin`,
      which runs it through **Docker Compose**. Add the plugin to
      `hardhat.config.ts` `plugins: [...]` and run `npx hardhat test`.
- [ ] Set `NEXT_PUBLIC_VAULT_ADDRESS` and deploy the frontend (Vercel).

## Roadmap beyond MVP

- **Hide deposits too**: on-ramp public WETH/USDC through the Nox
  `ERC20ToERC7984Wrapper` so even deposit amounts are confidential (v1 keeps
  deposits public since Uniswap settlement needs real ERC-20 custody).
- **Dark-pool netting (v2)**: internally net opposite-direction orders and swap
  only the remainder.
- **Keeper automation**: interval/keeper network instead of manual settle.
