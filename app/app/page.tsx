"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
  useReadContract,
  useWalletClient,
} from "wagmi";
import { parseUnits, formatUnits, erc20Abi, maxUint256 } from "viem";
import { shadowSwapVaultAbi } from "@/lib/abi";
import {
  VAULT_ADDRESS,
  isVaultConfigured,
  SEPOLIA_CHAIN_ID,
  TOKEN_IN,
  TOKEN_OUT,
} from "@/lib/vault";
import { encryptAmount, decryptHandle } from "@/lib/nox";
import {
  Logo,
  WalletIcon,
  LockIcon,
  ArrowRightIcon,
  ShieldIcon,
  EyeIcon,
  SendIcon,
  LayersIcon,
} from "@/components/Icons";

const vault = { address: VAULT_ADDRESS as `0x${string}`, abi: shadowSwapVaultAbi };

type Status = { kind: "idle" | "pending" | "ok" | "err"; msg?: string };

function short(a?: string) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

export default function AppPage() {
  const { address, isConnected, chainId } = useAccount();
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID;

  return (
    <main className="relative min-h-screen pb-20">
      <TopBar />

      <div className="section-shell pt-10">
        <div className="mb-8 max-w-2xl">
          <span className="clay-chip mb-4">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-cyan-glow" />
            Confidential swap console · Sepolia
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Deposit, order <span className="gradient-text">privately</span>,
            settle as one swap.
          </h1>
        </div>

        {!isVaultConfigured && <ConfigBanner />}
        {wrongNetwork && <NetworkBanner />}

        <div className="grid gap-6 lg:grid-cols-2">
          <EpochStatus />
          <DepositCard />
          <PrivateSwapCard />
          <BalancesCard />
          <ClaimCard />
          <KeeperCard />
        </div>
      </div>
    </main>
  );
}

/* ───────────────────────── Top bar / wallet ───────────────────────── */

function TopBar() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  useEffect(() => setMounted(true), []);

  // De-dupe discovered wallets (EIP-6963 can surface several) by name.
  const wallets = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.name === c.name) === i
  );
  const hasProvider =
    typeof window !== "undefined" && Boolean((window as { ethereum?: unknown }).ethereum);

  function pick(connector: (typeof connectors)[number]) {
    setShowPicker(false);
    connect({ connector });
  }

  function onConnectClick() {
    if (wallets.length > 1) {
      setShowPicker((s) => !s);
      return;
    }
    const only = wallets[0];
    // No wallet at all → send them to install MetaMask.
    if (!only || (!hasProvider && only.type === "injected")) {
      window.open("https://metamask.io/download/", "_blank", "noopener");
      return;
    }
    pick(only);
  }

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="section-shell">
        <nav className="flex items-center justify-between gap-4 rounded-clay-sm bg-clay-base/80 px-4 py-3 shadow-clay-sm backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg font-bold tracking-tight">
              Shadow<span className="gradient-text">Swap</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {mounted && isConnected && chainId !== SEPOLIA_CHAIN_ID && (
              <button
                onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}
                className="clay-btn-ghost !px-4 !py-2.5 text-sm text-pink-glow"
              >
                Switch to Sepolia
              </button>
            )}

            {mounted && isConnected ? (
              <button
                onClick={() => disconnect()}
                className="clay-btn-ghost !px-4 !py-2.5 text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-glow" />
                {short(address)}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={onConnectClick}
                  disabled={isPending}
                  className="clay-btn !px-5 !py-2.5 text-sm disabled:opacity-60"
                >
                  <WalletIcon className="h-4 w-4" />
                  {isPending ? "Connecting…" : "Connect Wallet"}
                </button>

                {showPicker && wallets.length > 1 && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-clay-sm bg-clay-base p-2 shadow-clay">
                    {wallets.map((c) => (
                      <button
                        key={c.uid}
                        onClick={() => pick(c)}
                        className="flex w-full items-center gap-2 rounded-clay-sm px-4 py-3 text-left text-sm text-ink transition-colors hover:bg-clay-light"
                      >
                        <WalletIcon className="h-4 w-4 text-cyan-glow" />
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}

                {error && (
                  <p className="absolute right-0 top-full mt-2 w-64 rounded-clay-sm bg-clay-base p-3 text-xs text-pink-glow shadow-clay-sm">
                    {error.message.split("\n")[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ───────────────────────── Banners ───────────────────────── */

function ConfigBanner() {
  return (
    <div className="clay-inset mb-6 flex items-start gap-3 p-5 text-sm">
      <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-pink-glow" />
      <p className="text-ink-muted">
        <span className="font-semibold text-ink">Vault not configured.</span>{" "}
        Deploy <code className="text-cyan-glow">ShadowSwapVault</code> to Sepolia
        (see <code>contracts/</code>) and set{" "}
        <code className="text-cyan-glow">NEXT_PUBLIC_VAULT_ADDRESS</code> in{" "}
        <code>.env.local</code>. The console below is wired and ready.
      </p>
    </div>
  );
}

function NetworkBanner() {
  return (
    <div className="clay-inset mb-6 flex items-center gap-3 p-5 text-sm">
      <LayersIcon className="h-5 w-5 shrink-0 text-pink-glow" />
      <p className="text-ink-muted">
        You&apos;re on the wrong network. Switch to{" "}
        <span className="font-semibold text-ink">Ethereum Sepolia</span> to use
        ShadowSwap.
      </p>
    </div>
  );
}

/* ───────────────────────── Epoch status ───────────────────────── */

function EpochStatus() {
  const { data: epoch } = useReadContract({
    ...vault,
    functionName: "currentEpoch",
    query: { enabled: isVaultConfigured, refetchInterval: 8000 },
  });
  const { data: orders } = useReadContract({
    ...vault,
    functionName: "ordersInEpoch",
    args: [epoch ?? 0n],
    query: { enabled: isVaultConfigured && epoch !== undefined },
  });

  return (
    <section className="clay-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="clay-icon">
          <LayersIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-semibold">Current batch</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="clay-inset p-5">
          <p className="text-xs text-ink-faint">Epoch</p>
          <p className="gradient-text font-display text-3xl font-bold">
            {epoch !== undefined ? epoch.toString() : "—"}
          </p>
        </div>
        <div className="clay-inset p-5">
          <p className="text-xs text-ink-faint">Encrypted orders</p>
          <p className="gradient-text font-display text-3xl font-bold">
            {orders !== undefined ? orders.toString() : "—"}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        Orders accumulate encrypted until the keeper settles the batch as one net
        Uniswap swap.
      </p>
    </section>
  );
}

/* ───────────────────────── Deposit ───────────────────────── */

function DepositCard() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { writeContractAsync } = useWriteContract();
  const disabled = !isConnected || !isVaultConfigured || !amount;

  async function approve() {
    try {
      setStatus({ kind: "pending", msg: "Approving WETH…" });
      await writeContractAsync({
        address: TOKEN_IN.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [vault.address, maxUint256],
      });
      setStatus({ kind: "ok", msg: "WETH approved. You can deposit now." });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  async function deposit() {
    try {
      setStatus({ kind: "pending", msg: "Depositing…" });
      await writeContractAsync({
        ...vault,
        functionName: "deposit",
        args: [parseUnits(amount, TOKEN_IN.decimals)],
      });
      setStatus({ kind: "ok", msg: "Deposited. Balance credited (encrypted)." });
      setAmount("");
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  return (
    <section className="clay-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="clay-icon">
          <WalletIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-semibold">1 · Deposit</h2>
      </div>
      <AmountInput
        value={amount}
        onChange={setAmount}
        symbol={TOKEN_IN.symbol}
        label="Amount to pool"
      />
      <div className="mt-4 flex gap-3">
        <button onClick={approve} disabled={disabled} className="clay-btn-ghost flex-1 disabled:opacity-40">
          Approve
        </button>
        <button onClick={deposit} disabled={disabled} className="clay-btn flex-1 disabled:opacity-40">
          Deposit
        </button>
      </div>
      <StatusPill status={status} />
    </section>
  );
}

/* ───────────────────────── Private swap (encrypted order) ───────────────────────── */

function PrivateSwapCard() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { writeContractAsync } = useWriteContract();
  const disabled = !isConnected || !isVaultConfigured || !amount;

  async function submit() {
    if (!walletClient) return;
    try {
      setStatus({ kind: "pending", msg: "Encrypting order client-side…" });
      const raw = parseUnits(amount, TOKEN_IN.decimals);
      const { handle, handleProof } = await encryptAmount(
        walletClient,
        vault.address,
        raw
      );
      setStatus({ kind: "pending", msg: "Submitting encrypted order…" });
      await writeContractAsync({
        ...vault,
        functionName: "submitOrder",
        args: [handle, handleProof],
      });
      setStatus({
        kind: "ok",
        msg: "Encrypted order queued. Amount hidden on-chain.",
      });
      setAmount("");
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  return (
    <section className="clay-panel p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="clay-icon">
            <LockIcon className="h-6 w-6" />
          </div>
          <h2 className="font-display text-lg font-semibold">
            2 · Private swap
          </h2>
        </div>
        <span className="clay-chip !py-1 !text-xs">
          <LockIcon className="h-3.5 w-3.5 text-cyan-glow" /> encrypted
        </span>
      </div>
      <AmountInput
        value={amount}
        onChange={setAmount}
        symbol={`${TOKEN_IN.symbol} → ${TOKEN_OUT.symbol}`}
        label="Order amount (hidden)"
      />
      <button onClick={submit} disabled={disabled} className="clay-btn mt-4 w-full disabled:opacity-40">
        <SendIcon className="h-5 w-5" />
        Encrypt &amp; submit order
      </button>
      <StatusPill status={status} />
    </section>
  );
}

/* ───────────────────────── Reveal my balances ───────────────────────── */

function BalancesCard() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [deposit, setDeposit] = useState<string>();
  const [out, setOut] = useState<string>();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const { data: depositHandle } = useReadContract({
    ...vault,
    functionName: "myDepositHandle",
    account: address,
    query: { enabled: isVaultConfigured && isConnected },
  });
  const { data: outHandle } = useReadContract({
    ...vault,
    functionName: "myOutHandle",
    account: address,
    query: { enabled: isVaultConfigured && isConnected },
  });

  async function reveal() {
    if (!walletClient) return;
    try {
      setStatus({ kind: "pending", msg: "Decrypting your handles…" });
      if (depositHandle) {
        const v = await decryptHandle(walletClient, depositHandle as `0x${string}`);
        setDeposit(formatUnits(v, TOKEN_IN.decimals));
      }
      if (outHandle) {
        const v = await decryptHandle(walletClient, outHandle as `0x${string}`);
        setOut(formatUnits(v, TOKEN_OUT.decimals));
      }
      setStatus({ kind: "ok", msg: "Decrypted locally — only you can see this." });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  return (
    <section className="clay-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="clay-icon">
          <EyeIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-semibold">
          3 · My private balances
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="clay-inset p-5">
          <p className="text-xs text-ink-faint">Pooled {TOKEN_IN.symbol}</p>
          <p className="gradient-text font-display text-xl font-bold tracking-wider">
            {deposit ?? "••••••"}
          </p>
        </div>
        <div className="clay-inset p-5">
          <p className="text-xs text-ink-faint">Claimable {TOKEN_OUT.symbol}</p>
          <p className="gradient-text font-display text-xl font-bold tracking-wider">
            {out ?? "••••••"}
          </p>
        </div>
      </div>
      <button
        onClick={reveal}
        disabled={!isConnected || !isVaultConfigured}
        className="clay-btn-ghost mt-4 w-full disabled:opacity-40"
      >
        <EyeIcon className="h-5 w-5" /> Reveal (for my eyes only)
      </button>
      <StatusPill status={status} />
    </section>
  );
}

/* ───────────────────────── Claim ───────────────────────── */

function ClaimCard() {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { writeContractAsync } = useWriteContract();

  async function requestClaim() {
    try {
      setStatus({ kind: "pending", msg: "Requesting claim reveal…" });
      await writeContractAsync({ ...vault, functionName: "requestClaim" });
      setStatus({
        kind: "ok",
        msg: "Reveal requested. Keeper finalizes your withdrawal.",
      });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  return (
    <section className="clay-card p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="clay-icon">
          <ArrowRightIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-semibold">4 · Claim output</h2>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">
        Reveal only <span className="text-ink">your</span> share of the settled
        swap, then the keeper releases your {TOKEN_OUT.symbol}.
      </p>
      <button
        onClick={requestClaim}
        disabled={!isConnected || !isVaultConfigured}
        className="clay-btn w-full disabled:opacity-40"
      >
        Request claim
      </button>
      <StatusPill status={status} />
    </section>
  );
}

/* ───────────────────────── Keeper (owner) actions ───────────────────────── */

function KeeperCard() {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { writeContractAsync } = useWriteContract();

  async function requestSettlement() {
    try {
      setStatus({ kind: "pending", msg: "Marking aggregate decryptable…" });
      await writeContractAsync({ ...vault, functionName: "requestSettlement" });
      setStatus({ kind: "ok", msg: "Aggregate revealed. Run settle off-chain." });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message.split("\n")[0] });
    }
  }

  return (
    <section className="clay-card border border-white/5 p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="clay-icon">
          <ShieldIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-lg font-semibold">Keeper · settle</h2>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">
        Owner-only. Reveals the epoch aggregate; a keeper reads the plaintext and
        calls <code className="text-cyan-glow">settleEpoch</code> to swap on
        Uniswap.
      </p>
      <button
        onClick={requestSettlement}
        disabled={!isConnected || !isVaultConfigured}
        className="clay-btn-ghost w-full disabled:opacity-40"
      >
        Request settlement
      </button>
      <StatusPill status={status} />
    </section>
  );
}

/* ───────────────────────── Shared bits ───────────────────────── */

function AmountInput({
  value,
  onChange,
  symbol,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  symbol: string;
  label: string;
}) {
  return (
    <div className="clay-inset flex items-center justify-between gap-3 p-5">
      <div className="flex-1">
        <p className="mb-1 text-xs text-ink-faint">{label}</p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="decimal"
          placeholder="0.0"
          className="w-full bg-transparent font-display text-2xl font-bold text-ink outline-none placeholder:text-ink-faint"
        />
      </div>
      <span className="clay-chip whitespace-nowrap">{symbol}</span>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  const color =
    status.kind === "ok"
      ? "text-cyan-glow"
      : status.kind === "err"
        ? "text-pink-glow"
        : "text-ink-muted";
  return (
    <p className={`mt-4 break-words text-xs ${color}`}>
      {status.kind === "pending" && (
        <span className="mr-2 inline-block h-2 w-2 animate-pulse-glow rounded-full bg-current align-middle" />
      )}
      {status.msg}
    </p>
  );
}
