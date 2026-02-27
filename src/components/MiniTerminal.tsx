"use client";

import type { HlFill } from "@/lib/hyperliquid";

interface MiniTerminalProps {
  fills: HlFill[];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function MiniTerminal({ fills }: MiniTerminalProps) {
  const recent = fills.slice(0, 30);

  return (
    <div className="mini-terminal flex w-full flex-col overflow-hidden rounded-md backdrop-blur-sm">
      {/* pixel title bar */}
      <div className="flex items-center justify-between border-b-2 border-term-border bg-white/80 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border-2 border-term-red bg-term-red" />
          <span className="h-3 w-3 border-2 border-term-gold bg-term-gold" />
          <span className="h-3 w-3 border-2 border-term-green bg-term-green" />
        </div>
        <span className="font-[family-name:var(--font-pixel)] text-[8px] tracking-widest text-term-muted">
          printer@mint
        </span>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-pixel)] text-[8px] text-term-green">
          <span className="h-2 w-2 bg-term-green" />
          LIVE
        </span>
      </div>

      {/* log lines */}
      <div className="px-3 py-2">
        {recent.length === 0 ? (
          <div className="py-4 text-center">
            <span className="animate-blink font-[family-name:var(--font-pixel)] text-[8px] text-term-muted">
              Connecting to printer...
            </span>
          </div>
        ) : (
          recent.map((fill, i) => {
            const pnl = parseFloat(fill.closedPnl);
            const fee = parseFloat(fill.fee);
            const net = pnl - fee;
            const isClose = pnl !== 0;
            const isWin = net > 0;
            const time = formatTime(fill.time);
            const tag = isClose
              ? isWin
                ? "[WIN]"
                : "[LOSS]"
              : "[FILL]";
            const tagColor = isClose
              ? isWin
                ? "text-term-green"
                : "text-term-red"
              : "text-term-cyan";
            const detail = isClose
              ? `${fill.coin} ${fill.dir} pnl=${net >= 0 ? "+" : ""}$${net.toFixed(2)}`
              : `${fill.coin} ${fill.dir} ${parseFloat(fill.sz).toFixed(4)} @$${parseFloat(fill.px).toFixed(2)}`;

            return (
              <div
                key={fill.tid}
                className="flex gap-1 font-[family-name:var(--font-pixel)] text-[7px] leading-[22px]"
                style={{ opacity: 1 - i * 0.03 }}
              >
                <span className="text-term-muted">{time}</span>
                <span className={`font-bold ${tagColor}`}>{tag}</span>
                <span className="text-term-text">{detail}</span>
              </div>
            );
          })
        )}
        <div className="flex items-center gap-1 font-[family-name:var(--font-pixel)] text-[8px]">
          <span className="text-term-green">&gt;</span>
          <span className="animate-blink text-term-green">_</span>
        </div>
      </div>
    </div>
  );
}
