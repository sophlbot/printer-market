"use client";

import { useState, useEffect } from "react";
import { useLiveData } from "@/hooks/useLiveData";
import { formatUsd, formatDuration } from "@/lib/metrics";
import {
  BUY_URL,
  BOT_START_MS,
  HL_USER,
  SLOGANS,
  SLOGANS_2,
} from "@/lib/constants";

import StatCard from "@/components/StatCard";
import CopyAddress from "@/components/CopyAddress";
import Marquee from "@/components/Marquee";
import TerminalLine from "@/components/TerminalLine";
import FullscreenModal from "@/components/FullscreenModal";
import PixelBackground from "@/components/PixelBackground";
import MiniTerminal from "@/components/MiniTerminal";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import PaymentGate from "@/components/PaymentGate";
import BuybackBanner from "@/components/BuybackBanner";

function useUptime() {
  const [uptime, setUptime] = useState(
    formatDuration(Date.now() - BOT_START_MS)
  );
  useEffect(() => {
    const id = setInterval(
      () => setUptime(formatDuration(Date.now() - BOT_START_MS)),
      1000
    );
    return () => clearInterval(id);
  }, []);
  return uptime;
}

export default function Home() {
  const { fills, metrics, connected } = useLiveData();
  const [fsOpen, setFsOpen] = useState(false);
  const uptime = useUptime();

  const winRate = metrics?.winRate.toFixed(1) ?? "—";
  const profit = metrics ? formatUsd(metrics.totalProfit) : "$0";
  const volume = metrics ? formatUsd(metrics.totalVolume) : "$0";
  const trades = metrics?.totalTrades ?? 0;
  const accountValue = metrics?.accountValue ? formatUsd(metrics.accountValue) : null;

  const explorerUrl = `https://app.hyperliquid.xyz/explorer/address/${HL_USER}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <PixelBackground />
      <Header />

      {/* ══════════ FIRST SCREEN — everything visible ══════════ */}
      <section id="hero" className="relative z-10 mx-auto flex h-screen max-w-7xl flex-col px-4 pt-14 pb-4">
        {/* TOP ROW: hero left + terminal right */}
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          {/* LEFT: banner + text + CTAs */}
          <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <img
              src="/traderbot.png"
              alt="Trader Bot"
              className="mx-auto h-48 w-48 drop-shadow-[0_4px_12px_rgba(22,163,74,0.3)] md:h-56 md:w-56 lg:mx-0"
              data-pixel
            />
            <h1 className="font-[family-name:var(--font-pixel)] text-2xl leading-tight text-brrr-text drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)] md:text-3xl lg:text-4xl">
              Trader Bot
            </h1>

            <p className="max-w-lg rounded-lg bg-white/60 px-4 py-2 text-lg text-brrr-text backdrop-blur-sm md:text-xl">
              &ldquo;The bot does the work. I just watch the numbers go up.
              High-frequency trading on Hyperliquid, 24/7.&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-brrr-green bg-brrr-green px-10 py-3 font-[family-name:var(--font-pixel)] text-sm text-white shadow-md transition-all hover:bg-brrr-green/90"
              >
                Buy $Trader
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById("terminal")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-lg border border-brrr-border bg-white/80 px-10 py-3 font-[family-name:var(--font-pixel)] text-sm text-brrr-text shadow-sm backdrop-blur-sm transition-colors hover:border-brrr-cyan hover:text-brrr-cyan"
              >
                Watch Live Trades
              </button>
            </div>

            <CopyAddress />
          </div>

          {/* RIGHT: mini terminal */}
          <div className="w-full min-w-0 flex-1">
            <MiniTerminal fills={fills} />
          </div>
        </div>

        {/* BOTTOM: KPI row + terminal line */}
        <div className="mt-auto pb-2 pt-4">
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value={profit} label="All-Time PnL" />
            <StatCard value={volume} label="Total Volume" />
            <StatCard value={winRate} label="Win Rate %" sub={`${trades} trades`} />
            <StatCard value={accountValue ?? uptime} label={accountValue ? "Account Value" : "Time Running"} />
          </div>
        </div>
      </section>

      {/* ══════════ MARQUEE 1 ══════════ */}
      <div className="relative z-10">
        <Marquee items={SLOGANS} />
      </div>

      {/* ══════════ BUYBACK ENGINE ══════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-4">
        <BuybackBanner totalProfit={metrics?.totalProfit ?? 0} />
      </section>

      {/* ══════════ TRADING DASHBOARD ══════════ */}
      <section
        id="terminal"
        className="relative z-10 mx-auto max-w-7xl px-4 py-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] md:text-lg">
              TRADER BOT TERMINAL
            </h2>
            <p className="mt-1 rounded bg-white/90 px-2 py-1 text-[10px] text-brrr-muted backdrop-blur-md">
              Pump.fun Tokenized Agent &bull; HFT on Hyperliquid &bull; All profits → buybacks
            </p>
          </div>
          <button
            onClick={() => setFsOpen(true)}
            className="rounded border-2 border-brrr-border bg-white/90 px-5 py-1.5 text-[10px] text-brrr-muted shadow-[2px_2px_0_#94a3b8] backdrop-blur-md transition-colors hover:border-brrr-green hover:text-brrr-green"
          >
            FULLSCREEN
          </button>
        </div>

        <PaymentGate>
          <Dashboard fills={fills} metrics={metrics} connected={connected} />
        </PaymentGate>
      </section>

      {/* ══════════ MARQUEE 2 ══════════ */}
      <div className="relative z-10">
        <Marquee items={SLOGANS_2} reverse />
      </div>

      {/* ══════════ WHAT IS $BRRR ══════════ */}
      <section id="about" className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-2 text-center font-[family-name:var(--font-pixel)] text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
          What Is Trader Bot?
        </h2>
        <p className="mx-auto mb-8 w-fit rounded bg-white/70 px-3 py-1 text-center text-base italic text-brrr-muted backdrop-blur-sm">
          &ldquo;An AI that trades. A token that captures the alpha.&rdquo;
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Tokenized Agent",
              text: "$Trader is a Pump.fun Tokenized Agent — an AI trading bot whose revenue is linked to its token. Every dollar the bot earns on Hyperliquid flows directly into $Trader buybacks.",
            },
            {
              title: "HFT Engine",
              text: "The bot runs 24/7 on Hyperliquid, executing high-frequency trades every few seconds. It grinds out small edges at scale. All profits are converted into $Trader buybacks on Pump.fun.",
            },
            {
              title: "The Flywheel",
              text: "More profit → more buybacks → higher token value → more attention → more users paying for dashboard access → more buybacks. A self-reinforcing value machine.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-brrr-border bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <h3 className="mb-2 font-[family-name:var(--font-pixel)] text-xs uppercase tracking-widest text-brrr-cyan">
                {card.title}
              </h3>
              <p className="text-base leading-relaxed text-brrr-text/80">
                {card.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-2 border-brrr-green bg-brrr-green px-10 py-3 font-[family-name:var(--font-pixel)] text-sm text-white shadow-md transition-all hover:bg-brrr-green/90"
          >
            Buy $Trader
          </a>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-2 text-center font-[family-name:var(--font-pixel)] text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
          How It Works
        </h2>
        <p className="mx-auto mb-8 w-fit rounded bg-white/70 px-3 py-1 text-center text-sm text-brrr-muted backdrop-blur-sm">
          — The Trader Bot system, explained —
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              step: "Step 1: HFT on Hyperliquid",
              text: "The bot trades BTC, ETH, and other perps around the clock on Hyperliquid — the highest-volume on-chain perps DEX. Micro-inefficiencies in the order book are the edge.",
            },
            {
              step: "Step 2: Profit Capture",
              text: "High-frequency execution locks in small edges at scale. Thousands of trades per day, each capturing micro-alpha from order flow analysis and spread capture.",
            },
            {
              step: "Step 3: Buyback Engine",
              text: "All bot profits are routed to buy $Trader tokens on Pump.fun. This constant buy pressure creates a direct link between trading performance and token value.",
            },
            {
              step: "Step 4: Pay-to-Access",
              text: "Users pay 0.1 SOL via Pump.fun's Tokenized Agent protocol to access the live dashboard. 100% of access fees also flow into $Trader buybacks. Revenue = buybacks.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg border border-brrr-border bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <h3 className="mb-2 font-[family-name:var(--font-pixel)] text-xs uppercase tracking-widest text-brrr-gold">
                {item.step}
              </h3>
              <p className="text-base leading-relaxed text-brrr-text/80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ ORIGIN STORY ══════════ */}
      <section id="story" className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-2 text-center font-[family-name:var(--font-pixel)] text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
          The Trader Bot Origin Story
        </h2>
        <p className="mx-auto mb-6 w-fit rounded bg-white/70 px-3 py-1 text-center text-sm italic text-brrr-muted backdrop-blur-sm">
          As told by the bot, at 3:47 AM, after its 10,000th trade
        </p>

        <div className="space-y-3 rounded-lg border border-brrr-border bg-white/80 p-6 text-base leading-relaxed text-brrr-text/80 shadow-sm backdrop-blur-sm">
          <p>It started with a simple idea.</p>
          <p>
            What if you could build an AI trading bot that runs autonomously,
            captures alpha on the most liquid on-chain perps DEX, and links
            every dollar of profit directly to a token via buybacks?
          </p>
          <p>
            We studied the on-chain trading landscape. Hyperliquid had emerged as
            the highest-volume on-chain perps DEX, with deep liquidity and
            sub-second execution. The perfect arena for a high-frequency bot.
          </p>
          <p>
            So we built Trader Bot. An autonomous HFT agent that runs 24/7,
            placing and managing positions on Hyperliquid. Every trade is executed
            on-chain. Every dollar of P&L is tracked on a public dashboard. No
            black boxes. No trust required.
          </p>
          <p className="font-semibold text-brrr-green">
            $Trader is the token. The bot is the alpha engine. The dashboard is the
            proof.
          </p>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative z-10 border-t border-brrr-border bg-white/70 py-8 text-center backdrop-blur-sm">
        <p className="font-[family-name:var(--font-pixel)] text-sm text-brrr-green">
          Trader Bot
        </p>
        <div className="mt-3 flex justify-center gap-6">
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brrr-muted transition-colors hover:text-brrr-green"
          >
            Buy $Trader
          </a>
          <a
            href="https://x.com/liamscalzulli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brrr-muted transition-colors hover:text-brrr-cyan"
          >
            Twitter
          </a>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brrr-muted transition-colors hover:text-brrr-cyan"
          >
            Explorer
          </a>
        </div>
        <p className="mt-4 text-sm text-brrr-muted/60">
          &ldquo;Built by degens. Tested on Hyperliquid.&rdquo;
        </p>
      </footer>

      {/* ══════════ FULLSCREEN MODAL ══════════ */}
      <FullscreenModal
        open={fsOpen}
        onClose={() => setFsOpen(false)}
        fills={fills}
        metrics={metrics}
        connected={connected}
      />
    </main>
  );
}
