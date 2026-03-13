"use client";

import { formatUsd } from "@/lib/metrics";
import { BUY_URL } from "@/lib/constants";

interface BuybackBannerProps {
  totalProfit: number;
}

export default function BuybackBanner({ totalProfit }: BuybackBannerProps) {
  const buybackAmount = totalProfit * 0.85;

  return (
    <div className="rounded-lg border-2 border-brrr-green/30 bg-white/90 p-4 backdrop-blur-md shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-brrr-green">
            Buyback Engine
          </h3>
          <p className="text-xs text-brrr-muted">
            All HyperLiquid profits flow into $Trader buybacks on Pump.fun
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-brrr-muted">Total Profit</p>
            <p className="font-[family-name:var(--font-pixel)] text-sm text-brrr-text">
              {formatUsd(totalProfit)}
            </p>
          </div>

          <div className="flex items-center text-brrr-green">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-brrr-muted">Buybacks</p>
            <p className="font-[family-name:var(--font-pixel)] text-sm text-brrr-green">
              {formatUsd(buybackAmount)}
            </p>
          </div>

          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-brrr-green bg-brrr-green/10 px-4 py-1.5 text-[10px] font-bold text-brrr-green transition-colors hover:bg-brrr-green hover:text-white"
          >
            BUY $TRADER
          </a>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brrr-border/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brrr-green to-brrr-cyan transition-all duration-1000"
          style={{ width: `${Math.min((buybackAmount / totalProfit) * 100, 100)}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-brrr-muted">
        <span>Bot Profits</span>
        <span>85% → Buyback &bull; 15% → Operations</span>
      </div>
    </div>
  );
}
