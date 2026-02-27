import type { HlFill } from "./hyperliquid";

export interface BotMetrics {
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  totalVolume: number;
  wins: number;
  losses: number;
  accountValue?: number;
}

export function computeMetrics(fills: HlFill[]): BotMetrics {
  let totalProfit = 0;
  let totalVolume = 0;
  let wins = 0;
  let losses = 0;

  for (const f of fills) {
    const pnl = parseFloat(f.closedPnl);
    const fee = parseFloat(f.fee);
    const vol = parseFloat(f.px) * parseFloat(f.sz);

    totalProfit += pnl - fee;
    totalVolume += vol;

    if (pnl > 0) wins++;
    else if (pnl < 0) losses++;
  }

  const resolved = wins + losses;
  const winRate = resolved > 0 ? (wins / resolved) * 100 : 0;

  return {
    totalProfit,
    winRate,
    totalTrades: fills.length,
    totalVolume,
    wins,
    losses,
  };
}

export function formatUsd(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${mins}m`;
}
