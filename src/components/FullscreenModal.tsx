"use client";

import { useEffect, useCallback } from "react";
import type { HlFill } from "@/lib/hyperliquid";
import type { BotMetrics } from "@/lib/metrics";
import Dashboard from "./Dashboard";

interface FullscreenModalProps {
  open: boolean;
  onClose: () => void;
  fills: HlFill[];
  metrics: BotMetrics | null;
  connected: boolean;
}

export default function FullscreenModal({
  open,
  onClose,
  fills,
  metrics,
  connected,
}: FullscreenModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/95 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-end">
        <button
          onClick={onClose}
          className="rounded border-2 border-brrr-border bg-white px-4 py-1 text-[10px] text-brrr-muted shadow-[2px_2px_0_#94a3b8] transition-colors hover:border-brrr-red hover:text-brrr-red"
        >
          ESC — CLOSE
        </button>
      </div>
      <div className="flex-1">
        <Dashboard fills={fills} metrics={metrics} connected={connected} fullscreen />
      </div>
    </div>
  );
}
