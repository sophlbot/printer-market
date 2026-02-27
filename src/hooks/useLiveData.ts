"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { HlFill } from "@/lib/hyperliquid";
import type { BotMetrics } from "@/lib/metrics";

interface LiveData {
  fills: HlFill[];
  metrics: BotMetrics | null;
  connected: boolean;
}

const EMPTY_METRICS: BotMetrics = {
  totalProfit: 0,
  winRate: 0,
  totalTrades: 0,
  totalVolume: 0,
  wins: 0,
  losses: 0,
};

export function useLiveData(): LiveData {
  const [fills, setFills] = useState<HlFill[]>([]);
  const [metrics, setMetrics] = useState<BotMetrics | null>(null);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const connect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource("/api/stream");
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) return;
        setFills(data.fills ?? []);
        setMetrics(data.metrics ?? EMPTY_METRICS);
      } catch {
        /* malformed */
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      retryRef.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connect]);

  return { fills, metrics, connected };
}
