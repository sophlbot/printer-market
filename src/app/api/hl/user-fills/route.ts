import { NextResponse } from "next/server";
import { fetchUserFills } from "@/lib/hyperliquid";
import { computeMetrics } from "@/lib/metrics";
import { HL_USER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const fills = await fetchUserFills(HL_USER);
    const metrics = computeMetrics(fills);
    return NextResponse.json({ fills: fills.slice(0, 200), metrics });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
