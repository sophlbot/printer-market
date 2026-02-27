"use client";

import { formatDuration } from "@/lib/metrics";
import { BOT_START_MS } from "@/lib/constants";
import { useEffect, useState } from "react";
import LiveBadge from "./LiveBadge";

export default function TerminalLine() {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const update = () => setElapsed(formatDuration(Date.now() - BOT_START_MS));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-brrr-border bg-white/80 px-4 py-2 font-[family-name:var(--font-mono)] shadow-sm backdrop-blur-sm">
      <span className="text-sm font-bold text-brrr-cyan">printer@mint</span>
      <LiveBadge />
      <span className="text-sm text-brrr-muted">{elapsed}</span>
      <span className="animate-blink text-brrr-green">█</span>
    </div>
  );
}
