"use client";

import { useMemo } from "react";
import type { HlFill } from "@/lib/hyperliquid";

interface Bucket {
  label: string;
  pnl: number;
  count: number;
}

function adaptiveBucket(fills: HlFill[], targetBars: number): Bucket[] {
  const closed = fills.filter((f) => parseFloat(f.closedPnl) !== 0);
  if (closed.length === 0) return [];

  const times = closed.map((f) => f.time);
  const minT = Math.min(...times);
  const maxT = Math.max(...times);
  const spanMs = maxT - minT || 60_000;

  const bucketMs = Math.max(Math.floor(spanMs / targetBars), 1000);

  const formatLabel = (ts: number) => {
    const d = new Date(ts);
    if (bucketMs >= 86400_000) {
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
    if (bucketMs >= 3600_000) {
      return `${d.getDate()}d ${d.getHours()}h`;
    }
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const map = new Map<number, { pnl: number; count: number }>();

  for (const f of closed) {
    const key = Math.floor(f.time / bucketMs) * bucketMs;
    const entry = map.get(key) ?? { pnl: 0, count: 0 };
    entry.pnl += parseFloat(f.closedPnl) - parseFloat(f.fee);
    entry.count++;
    map.set(key, entry);
  }

  const sorted = [...map.entries()].sort((a, b) => a[0] - b[0]);

  return sorted.map(([ts, data]) => ({
    label: formatLabel(ts),
    pnl: data.pnl,
    count: data.count,
  }));
}

interface PnlChartProps {
  fills: HlFill[];
}

export default function PnlChart({ fills }: PnlChartProps) {
  const buckets = useMemo(() => adaptiveBucket(fills, 50), [fills]);

  if (buckets.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[10px] text-term-muted">
        No closed trades yet...
      </div>
    );
  }

  const maxAbs = Math.max(...buckets.map((b) => Math.abs(b.pnl)), 0.01);

  let cumulative = 0;
  const cumData = buckets.map((b) => {
    cumulative += b.pnl;
    return cumulative;
  });
  const cumMin = Math.min(...cumData, 0);
  const cumMax = Math.max(...cumData, 0.01);
  const cumRange = cumMax - cumMin || 1;

  const labelEvery = buckets.length <= 15 ? 1 : buckets.length <= 30 ? 3 : 5;

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b-2 border-term-border/30 px-3 py-2">
        <span className="text-[8px] uppercase tracking-widest text-term-muted">
          PnL CHART
        </span>
        <span
          className={`text-[9px] font-bold ${cumulative >= 0 ? "text-term-green" : "text-term-red"}`}
        >
          {cumulative >= 0 ? "+" : ""}${cumulative.toFixed(2)}
        </span>
      </div>

      {/* cumulative line */}
      <div className="relative mx-3 mt-2 h-[80px] border-b border-term-border/20">
        <svg
          viewBox={`0 0 ${buckets.length * 10} 80`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1={80 - ((0 - cumMin) / cumRange) * 80}
            x2={buckets.length * 10}
            y2={80 - ((0 - cumMin) / cumRange) * 80}
            stroke="currentColor"
            strokeDasharray="3,3"
            className="text-term-border"
            strokeWidth="0.5"
          />
          <polygon
            fill={cumulative >= 0 ? "var(--color-term-green)" : "var(--color-term-red)"}
            opacity="0.12"
            points={[
              `${5},${80 - ((0 - cumMin) / cumRange) * 80}`,
              ...cumData.map((v, i) => {
                const x = i * 10 + 5;
                const y = 80 - ((v - cumMin) / cumRange) * 76 - 2;
                return `${x},${y}`;
              }),
              `${(cumData.length - 1) * 10 + 5},${80 - ((0 - cumMin) / cumRange) * 80}`,
            ].join(" ")}
          />
          <polyline
            fill="none"
            stroke={cumulative >= 0 ? "var(--color-term-green)" : "var(--color-term-red)"}
            strokeWidth="2"
            points={cumData
              .map((v, i) => {
                const x = i * 10 + 5;
                const y = 80 - ((v - cumMin) / cumRange) * 76 - 2;
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
        <span className="absolute right-0 top-0 text-[7px] text-term-green">
          +${cumMax.toFixed(2)}
        </span>
        {cumMin < 0 && (
          <span className="absolute bottom-0 right-0 text-[7px] text-term-red">
            -${Math.abs(cumMin).toFixed(2)}
          </span>
        )}
      </div>

      {/* bar chart — fills entire width */}
      <div className="relative flex flex-1 items-end gap-[1px] px-2 pt-2 pb-5">
        {buckets.map((b, i) => {
          const pct = Math.max(Math.abs(b.pnl) / maxAbs, 0.03);
          const isPositive = b.pnl >= 0;
          const showLabel =
            i === 0 || i === buckets.length - 1 || i % labelEvery === 0;
          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center justify-end"
              style={{ height: "100%" }}
            >
              <div
                className={`w-full rounded-t-sm ${isPositive ? "bg-term-green" : "bg-term-red"}`}
                style={{ height: `${pct * 100}%`, minHeight: "2px" }}
              />
              {/* tooltip */}
              <div className="pointer-events-none absolute -top-14 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded border border-term-border bg-white px-2 py-1.5 text-[7px] shadow-md group-hover:block">
                <div className="font-bold text-term-text">{b.label}</div>
                <div className={isPositive ? "text-term-green" : "text-term-red"}>
                  {isPositive ? "+" : ""}${b.pnl.toFixed(2)}
                </div>
                <div className="text-term-muted">{b.count} trades</div>
              </div>
              {/* x-label */}
              {showLabel && (
                <span className="absolute -bottom-4 text-[5px] text-term-muted whitespace-nowrap">
                  {b.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
