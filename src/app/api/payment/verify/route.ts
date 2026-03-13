import { PublicKey } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { AGENT_TOKEN_MINT, CURRENCY_MINT } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wallet, amount, memo, startTime, endTime } = body;

    if (!wallet || !memo) {
      return Response.json({ error: "missing params" }, { status: 400 });
    }

    const agentMint = new PublicKey(AGENT_TOKEN_MINT);
    const agent = new PumpAgent(agentMint);

    const invoiceParams = {
      user: new PublicKey(wallet),
      currencyMint: new PublicKey(CURRENCY_MINT),
      amount: Number(amount),
      memo: Number(memo),
      startTime: Number(startTime),
      endTime: Number(endTime),
    };

    for (let attempt = 0; attempt < 10; attempt++) {
      const verified = await agent.validateInvoicePayment(invoiceParams);
      if (verified) {
        return Response.json({ paid: true });
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    return Response.json({ paid: false });
  } catch (e) {
    console.error("verify payment error:", e);
    return Response.json(
      { error: "verification failed" },
      { status: 500 },
    );
  }
}
