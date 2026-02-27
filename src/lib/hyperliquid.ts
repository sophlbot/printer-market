import { HL_INFO_URL } from "./constants";

export interface HlFill {
  coin: string;
  px: string;
  sz: string;
  side: "A" | "B";
  time: number;
  startPosition: string;
  dir: string;
  closedPnl: string;
  hash: string;
  oid: number;
  crossed: boolean;
  fee: string;
  tid: number;
  feeToken: string;
}

export async function fetchUserFills(user: string): Promise<HlFill[]> {
  const res = await fetch(HL_INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "userFills", user }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HL API error: ${res.status}`);
  return res.json();
}

export async function fetchUserFillsByTime(
  user: string,
  startTime: number,
  endTime?: number
): Promise<HlFill[]> {
  const body: Record<string, unknown> = {
    type: "userFillsByTime",
    user,
    startTime,
  };
  if (endTime) body.endTime = endTime;

  const res = await fetch(HL_INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HL API error: ${res.status}`);
  return res.json();
}

export interface PortfolioStats {
  pnl: number;
  volume: number;
  accountValue: number;
}

export async function fetchPortfolio(user: string): Promise<PortfolioStats> {
  const res = await fetch(HL_INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "portfolio", user }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HL API error: ${res.status}`);
  const data = await res.json();
  if (!data || !Array.isArray(data)) {
    return { pnl: 0, volume: 0, accountValue: 0 };
  }

  let bestPnl = 0;
  let bestVlm = 0;
  let accountValue = 0;

  for (const [, periodData] of data) {
    const vlm = parseFloat(periodData.vlm || "0");
    if (vlm > bestVlm) bestVlm = vlm;

    const pnlArr = periodData.pnlHistory;
    if (pnlArr && pnlArr.length > 0) {
      const lastPnl = parseFloat(pnlArr[pnlArr.length - 1][1]);
      if (Math.abs(lastPnl) > Math.abs(bestPnl)) bestPnl = lastPnl;
    }

    const avArr = periodData.accountValueHistory;
    if (avArr && avArr.length > 0) {
      const lastAv = parseFloat(avArr[avArr.length - 1][1]);
      if (lastAv > accountValue) accountValue = lastAv;
    }
  }

  return { pnl: bestPnl, volume: bestVlm, accountValue };
}
