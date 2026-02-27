"use client";

import type { HlFill } from "@/lib/hyperliquid";
import type { BotMetrics } from "@/lib/metrics";
import { formatUsd, formatDuration } from "@/lib/metrics";
import { BOT_START_MS, HL_USER } from "@/lib/constants";
import { useState, useEffect } from "react";
import TerminalLog from "./TerminalLog";
import PnlChart from "./PnlChart";
import CoinBreakdown from "./CoinBreakdown";

const EXPLORER_ADDR = "https://app.hyperliquid.xyz/explorer/address/";

interface DashboardProps {
  fills: HlFill[];
  metrics: BotMetrics | null;
  connected: boolean;
  fullscreen?: boolean;
}

function useUptime() {
  const [uptime, setUptime] = useState(formatDuration(Date.now() - BOT_START_MS));
  useEffect(() => {
    const id = setInterval(() => setUptime(formatDuration(Date.now() - BOT_START_MS)), 1000);
    return () => clearInterval(id);
  }, []);
  return uptime;
}

export default function Dashboard({
  fills,
  metrics,
  connected,
  fullscreen = false,
}: DashboardProps) {
  const uptime = useUptime();
  const winRate = metrics?.winRate.toFixed(1) ?? "—";
  const profit = metrics ? formatUsd(metrics.totalProfit) : "$0";
  const volume = metrics ? formatUsd(metrics.totalVolume) : "$0";
  const trades = metrics?.totalTrades ?? 0;
  const isProfit = (metrics?.totalProfit ?? 0) >= 0;

  const height = fullscreen ? "h-[calc(100vh-80px)]" : "h-[560px]";

  return (
    <div className="terminal-pixel relative overflow-hidden rounded-md">
      {/* PIXEL HEADER */}
      <div className="flex items-center justify-between border-b-2 border-term-border bg-white/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border-2 border-term-red bg-term-red" />
          <span className="h-3 w-3 border-2 border-term-gold bg-term-gold" />
          <span className="h-3 w-3 border-2 border-term-green bg-term-green" />
          <span className="ml-2 text-[9px] uppercase tracking-[0.1em] text-term-muted">
            BRRR TERMINAL v2.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`${EXPLORER_ADDR}${HL_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-term-cyan underline hover:text-term-green"
          >
            VIEW WALLET
          </a>
          <span className={`inline-flex items-center gap-1.5 text-[10px] ${connected ? "text-term-green" : "text-term-red"}`}>
            <span className={`h-2.5 w-2.5 ${connected ? "bg-term-green" : "bg-term-red"}`} />
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="flex flex-wrap items-center gap-4 border-b-2 border-term-border/30 bg-term-bg px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] uppercase text-term-muted">PnL</span>
          <span className={`text-[10px] font-bold ${isProfit ? "text-term-green" : "text-term-red"}`}>
            {isProfit ? "+" : ""}{profit}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] uppercase text-term-muted">WR</span>
          <span className="text-[10px] font-bold text-term-text">{winRate}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] uppercase text-term-muted">Trades</span>
          <span className="text-[10px] font-bold text-term-text">{trades}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] uppercase text-term-muted">Vol</span>
          <span className="text-[10px] font-bold text-term-text">{volume}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[7px] uppercase text-term-muted">UP</span>
          <span className="text-[10px] font-bold text-term-green">{uptime}</span>
        </div>
      </div>

      {/* 3-COLUMN LAYOUT */}
      <div className={`${height} grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.8fr]`}>
        {/* LEFT: Trade list */}
        <div className="flex flex-col border-r border-term-border/20 overflow-hidden">
          <div className="border-b border-term-border/20 px-3 py-2 text-[8px] uppercase tracking-widest text-term-muted">
            Trades
            <span className="ml-2 text-term-text">{fills.length}</span>
          </div>
          <div className="flex-1 overflow-auto">
            <TerminalLog fills={fills} compact />
          </div>
        </div>

        {/* CENTER: PnL Chart */}
        <div className="flex flex-col border-r border-term-border/20">
          <PnlChart fills={fills} />
        </div>

        {/* RIGHT: Coin breakdown */}
        <div className="flex flex-col">
          <CoinBreakdown fills={fills} />
        </div>
      </div>
    </div>
  );
}
