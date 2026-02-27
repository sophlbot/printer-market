"use client";

import { useMemo } from "react";
import type { HlFill } from "@/lib/hyperliquid";

interface CoinStats {
  coin: string;
  trades: number;
  pnl: number;
  wins: number;
  losses: number;
}

function aggregateByCoins(fills: HlFill[]): CoinStats[] {
  const map = new Map<string, CoinStats>();

  for (const f of fills) {
    const pnl = parseFloat(f.closedPnl);
    const fee = parseFloat(f.fee);
    const net = pnl - fee;

    const entry = map.get(f.coin) ?? {
      coin: f.coin,
      trades: 0,
      pnl: 0,
      wins: 0,
      losses: 0,
    };

    entry.trades++;
    entry.pnl += net;
    if (pnl > 0) entry.wins++;
    else if (pnl < 0) entry.losses++;

    map.set(f.coin, entry);
  }

  return [...map.values()].sort((a, b) => b.trades - a.trades);
}

interface CoinBreakdownProps {
  fills: HlFill[];
}

export default function CoinBreakdown({ fills }: CoinBreakdownProps) {
  const coins = useMemo(() => aggregateByCoins(fills), [fills]);

  if (coins.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[10px] text-term-muted">
        No data yet...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b-2 border-term-border/30 px-3 py-2">
        <span className="text-[8px] uppercase tracking-widest text-term-muted">
          Coins
        </span>
        <span className="text-[8px] text-term-muted">
          {coins.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {coins.map((c) => {
          const resolved = c.wins + c.losses;
          const winRate = resolved > 0 ? ((c.wins / resolved) * 100).toFixed(0) : "—";
          const isProfit = c.pnl >= 0;

          return (
            <div
              key={c.coin}
              className="border-b border-term-border/10 px-3 py-2 transition-colors hover:bg-term-green/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-term-cyan">{c.coin}</span>
                <span className={`text-[9px] font-bold ${isProfit ? "text-term-green" : "text-term-red"}`}>
                  {isProfit ? "+" : ""}${c.pnl.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[7px] text-term-muted">
                <span>{c.trades}t</span>
                <span className="text-term-green">{c.wins}W</span>
                <span className="text-term-red">{c.losses}L</span>
                <span>{winRate}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
