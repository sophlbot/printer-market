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
            <div className="w-full max-w-xl overflow-hidden rounded-xl border-2 border-white/40 shadow-lg">
              <video
                src="/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              />
            </div>

            <h1 className="font-[family-name:var(--font-pixel)] text-2xl leading-tight text-brrr-text drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)] md:text-3xl lg:text-4xl">
              Money Printer Go Brrr
            </h1>

            <p className="max-w-lg rounded-lg bg-white/60 px-4 py-2 text-lg text-brrr-text backdrop-blur-sm md:text-xl">
              &ldquo;The printer does the work. I just watch the numbers go up.
              It&apos;s called passive income, and I learned it from a meme.&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-brrr-green bg-brrr-green px-10 py-3 font-[family-name:var(--font-pixel)] text-sm text-white shadow-md transition-all hover:bg-brrr-green/90"
              >
                Buy $Printer
              </a>
              <button
                onClick={() =>
                  document
                    .getElementById("terminal")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="rounded-lg border border-brrr-border bg-white/80 px-10 py-3 font-[family-name:var(--font-pixel)] text-sm text-brrr-text shadow-sm backdrop-blur-sm transition-colors hover:border-brrr-cyan hover:text-brrr-cyan"
              >
                Watch Me Print
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

      {/* ══════════ TRADING DASHBOARD ══════════ */}
      <section
        id="terminal"
        className="relative z-10 mx-auto max-w-7xl px-4 py-12"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
              THE MONEY PRINTER
            </h2>
            <p className="mt-1 rounded bg-white/70 px-2 py-1 text-[10px] text-brrr-muted backdrop-blur-sm">
              Real Trades &bull; Real Money &bull; Real Printing &bull; Click any trade to verify on-chain
            </p>
          </div>
          <button
            onClick={() => setFsOpen(true)}
            className="rounded border-2 border-brrr-border bg-white/80 px-5 py-1.5 text-[10px] text-brrr-muted shadow-[2px_2px_0_#94a3b8] transition-colors hover:border-brrr-green hover:text-brrr-green"
          >
            FULLSCREEN
          </button>
        </div>

        <Dashboard fills={fills} metrics={metrics} connected={connected} />
      </section>

      {/* ══════════ MARQUEE 2 ══════════ */}
      <div className="relative z-10">
        <Marquee items={SLOGANS_2} reverse />
      </div>

      {/* ══════════ WHAT IS $BRRR ══════════ */}
      <section id="about" className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-2 text-center font-[family-name:var(--font-pixel)] text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
          What Is $Printer?
        </h2>
        <p className="mx-auto mb-8 w-fit rounded bg-white/70 px-3 py-1 text-center text-base italic text-brrr-muted backdrop-blur-sm">
          &ldquo;It&apos;s like money, but louder.&rdquo;
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "The Token",
              text: "$Printer is a Solana meme coin inspired by the legendary Money Printer meme. No VC, no roadmap committee — just a token backed by a real, live trading bot that actually prints profits on Hyperliquid.",
            },
            {
              title: "The Bot",
              text: "The BRRR bot runs 24/7 on Hyperliquid, executing trades every few seconds. It grinds out small edges at scale. You can watch it work in real-time on the live dashboard above.",
            },
            {
              title: "The Edge",
              text: "Most meme coins have nothing behind them. $Printer has a transparent, verifiable trading operation. Every trade is on-chain. Every P&L number is real. The dashboard doesn't lie.",
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
            Buy $Printer
          </a>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-2 text-center font-[family-name:var(--font-pixel)] text-base text-brrr-text drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] md:text-lg">
          How It Works
        </h2>
        <p className="mx-auto mb-8 w-fit rounded bg-white/70 px-3 py-1 text-center text-sm text-brrr-muted backdrop-blur-sm">
          — The $Printer printing system, explained —
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              step: "Step 1: The Market",
              text: "Hyperliquid is a high-performance on-chain perps DEX. The bot trades BTC, ETH, and other perps around the clock, exploiting micro-inefficiencies in the order book.",
            },
            {
              step: "Step 2: The Bot",
              text: "Our trading bot analyzes the order flow and places high-frequency trades. By entering and exiting positions at favorable prices, the bot locks in an edge before the market catches up.",
            },
            {
              step: "Step 3: Execution",
              text: "Every trade is executed on Hyperliquid's on-chain infrastructure. The bot's profit comes from the spread between entry and exit, accumulated over thousands of micro-trades.",
            },
            {
              step: "Step 4: The Dashboard",
              text: "Every trade, every fill, every dollar of P&L is tracked in real-time on the live dashboard. Nothing is hidden. The wallet is public. You can verify every number yourself.",
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
          The $Printer Origin Story
        </h2>
        <p className="mx-auto mb-6 w-fit rounded bg-white/70 px-3 py-1 text-center text-sm italic text-brrr-muted backdrop-blur-sm">
          As told by the printer, at 3:47 AM, after its 10,000th trade
        </p>

        <div className="space-y-3 rounded-lg border border-brrr-border bg-white/80 p-6 text-base leading-relaxed text-brrr-text/80 shadow-sm backdrop-blur-sm">
          <p>It started with a meme.</p>
          <p>
            In 2020, when the Federal Reserve started printing money like there
            was no tomorrow, the internet responded with the greatest financial
            meme of all time: &ldquo;Haha money printer go brrr.&rdquo; The meme
            captured something real — that sometimes the dumbest-looking strategy
            is the one that works.
          </p>
          <p>
            We studied the on-chain trading landscape. Hyperliquid had emerged as
            the highest-volume on-chain perps DEX, with deep liquidity and
            sub-second execution. The perfect printing press for an autonomous bot.
          </p>
          <p>
            So we built our own printer. An autonomous trading bot that runs 24/7,
            placing and managing positions on Hyperliquid. Every trade is executed
            on-chain. Every dollar of P&L is tracked on a public dashboard. No
            black boxes. No trust required.
          </p>
          <p className="font-semibold text-brrr-green">
            $Printer is the token. The bot is the printer. The dashboard is the
            proof.
          </p>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative z-10 border-t border-brrr-border bg-white/70 py-8 text-center backdrop-blur-sm">
        <p className="font-[family-name:var(--font-pixel)] text-sm text-brrr-green">
          $Printer
        </p>
        <div className="mt-3 flex justify-center gap-6">
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brrr-muted transition-colors hover:text-brrr-green"
          >
            Buy $Printer
          </a>
          <a
            href="https://x.com/MoneyPrintBot"
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
          &ldquo;Built in the basement. Tested on the internet.&rdquo;
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
