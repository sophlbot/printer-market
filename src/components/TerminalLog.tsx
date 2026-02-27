"use client";

import type { HlFill } from "@/lib/hyperliquid";
import { useRef, useEffect } from "react";

const EXPLORER_TX = "https://app.hyperliquid.xyz/explorer/tx/";

function shortDir(dir: string) {
  if (dir.includes("Open") && dir.includes("Long")) return "BUY";
  if (dir.includes("Open") && dir.includes("Short")) return "SELL";
  if (dir.includes("Close") && dir.includes("Long")) return "CL.L";
  if (dir.includes("Close") && dir.includes("Short")) return "CL.S";
  return dir.slice(0, 4);
}

function FillRow({ fill }: { fill: HlFill }) {
  const pnl = parseFloat(fill.closedPnl);
  const fee = parseFloat(fill.fee);
  const net = pnl - fee;
  const isWin = net > 0;
  const time = new Date(fill.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const coin = fill.coin.length > 6 ? fill.coin.slice(0, 6) : fill.coin;

  return (
    <a
      href={`${EXPLORER_TX}${fill.hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="trade-row flex whitespace-nowrap border-b border-term-border/20 px-2 py-1 no-underline transition-colors hover:bg-term-cyan/5"
    >
      <span className="trade-cell trade-time">{time}</span>
      <span className="trade-cell trade-coin">{coin}</span>
      <span className={`trade-cell trade-dir ${fill.side === "A" ? "text-term-green" : "text-term-red"}`}>
        {shortDir(fill.dir)}
      </span>
      <span className="trade-cell trade-size">
        {parseFloat(fill.sz).toFixed(3)}
      </span>
      <span className="trade-cell trade-price">
        ${parseFloat(fill.px).toFixed(1)}
      </span>
      <span
        className={`trade-cell trade-pnl ${
          pnl === 0 ? "text-term-muted/40" : isWin ? "text-term-green" : "text-term-red"
        }`}
      >
        {pnl === 0 ? "—" : `${isWin ? "+" : ""}$${net.toFixed(2)}`}
      </span>
    </a>
  );
}

interface TerminalLogProps {
  fills: HlFill[];
  compact?: boolean;
}

export default function TerminalLog({
  fills,
  compact = false,
}: TerminalLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [fills]);

  return (
    <div className="flex h-full flex-col">
      {!compact && (
        <div className="trade-row flex whitespace-nowrap border-b-2 border-term-border/30 px-2 py-1 text-term-muted">
          <span className="trade-cell trade-time">Time</span>
          <span className="trade-cell trade-coin">Coin</span>
          <span className="trade-cell trade-dir">Dir</span>
          <span className="trade-cell trade-size">Size</span>
          <span className="trade-cell trade-price">Price</span>
          <span className="trade-cell trade-pnl">PnL</span>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-auto">
        {fills.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-[9px] text-term-muted">
            <span className="animate-blink">Waiting for fills...</span>
          </div>
        ) : (
          fills.map((f) => <FillRow key={f.tid} fill={f} />)
        )}
      </div>
    </div>
  );
}
