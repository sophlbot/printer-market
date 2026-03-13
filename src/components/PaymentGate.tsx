"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";

interface Invoice {
  amount: number;
  memo: number;
  startTime: number;
  endTime: number;
}

type Step = "connect" | "ready" | "building" | "signing" | "confirming" | "verifying" | "done" | "error";

export default function PaymentGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [step, setStep] = useState<Step>("connect");
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const handlePay = useCallback(async () => {
    if (!publicKey || !signTransaction) return;
    setError(null);

    try {
      setStep("building");
      const buildRes = await fetch("/api/payment/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });
      const buildData = await buildRes.json();
      if (!buildRes.ok) throw new Error(buildData.error || "build failed");

      const { transaction: txBase64, invoice } = buildData as {
        transaction: string;
        invoice: Invoice;
      };

      setStep("signing");
      const tx = Transaction.from(Buffer.from(txBase64, "base64"));
      const signedTx = await signTransaction(tx);

      setStep("confirming");
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" },
      );
      const latestBlockhash = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed",
      );

      setStep("verifying");
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          ...invoice,
        }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.paid) {
        setPaid(true);
        setStep("done");
      } else {
        throw new Error("Payment not confirmed on-chain. Try again.");
      }
    } catch (e: unknown) {
      setStep("error");
      setError(e instanceof Error ? e.message : "Payment failed");
    }
  }, [publicKey, signTransaction, connection]);

  if (paid) return <>{children}</>;

  const stepLabel: Record<Step, string> = {
    connect: "CONNECT WALLET",
    ready: "PAY 0.1 SOL",
    building: "BUILDING TX...",
    signing: "SIGN IN WALLET...",
    confirming: "CONFIRMING...",
    verifying: "VERIFYING...",
    done: "ACCESS GRANTED",
    error: "ERROR",
  };

  const isProcessing = ["building", "signing", "confirming", "verifying"].includes(step);
  const currentStep = connected && step === "connect" ? "ready" : step;

  return (
    <div className="relative rounded-xl border-2 border-brrr-border bg-white/90 p-8 text-center backdrop-blur-sm">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <h3 className="font-[family-name:var(--font-pixel)] text-sm uppercase tracking-widest text-brrr-cyan">
            Tokenized Agent Access
          </h3>
          <p className="text-xs text-brrr-muted">
            This bot is a Pump.fun Tokenized Agent. Pay 0.1 SOL to access the
            full trading dashboard. All revenue goes to $Trader buybacks.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-brrr-border bg-brrr-bg p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brrr-muted">Access fee</span>
              <span className="font-bold text-brrr-text">0.1 SOL</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-brrr-muted">Duration</span>
              <span className="font-bold text-brrr-text">24h session</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-brrr-muted">Revenue</span>
              <span className="font-bold text-brrr-green">100% → $Trader buyback</span>
            </div>
          </div>

          {!connected ? (
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          ) : (
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full rounded-lg border-2 border-brrr-green bg-brrr-green px-6 py-3 font-[family-name:var(--font-pixel)] text-xs text-white shadow-md transition-all hover:bg-brrr-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stepLabel[currentStep]}
            </button>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-xs text-brrr-muted">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-brrr-green border-t-transparent" />
              {stepLabel[currentStep]}
            </div>
          )}

          {error && (
            <p className="rounded bg-brrr-red/10 px-3 py-2 text-xs text-brrr-red">
              {error}
            </p>
          )}
        </div>

        <p className="text-[10px] text-brrr-muted/60">
          Powered by Pump.fun Tokenized Agent Protocol
        </p>
      </div>
    </div>
  );
}
