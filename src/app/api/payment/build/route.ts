import { Connection, PublicKey, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import { PumpAgent } from "@pump-fun/agent-payments-sdk";
import { AGENT_TOKEN_MINT, SOLANA_RPC_URL, CURRENCY_MINT, PAYMENT_AMOUNT } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function generateInvoiceParams() {
  const memo = String(Math.floor(Math.random() * 900000000000) + 100000);
  const now = Math.floor(Date.now() / 1000);
  return {
    amount: PAYMENT_AMOUNT,
    memo,
    startTime: String(now),
    endTime: String(now + 86400),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userWallet = body.wallet;
    if (!userWallet) {
      return Response.json({ error: "wallet required" }, { status: 400 });
    }

    const connection = new Connection(SOLANA_RPC_URL);
    const agentMint = new PublicKey(AGENT_TOKEN_MINT);
    const currencyMint = new PublicKey(CURRENCY_MINT);
    const userPublicKey = new PublicKey(userWallet);

    const agent = new PumpAgent(agentMint, "mainnet", connection);
    const invoice = generateInvoiceParams();

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount: invoice.amount,
      memo: invoice.memo,
      startTime: invoice.startTime,
      endTime: invoice.endTime,
    });

    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
      ...instructions,
    );

    const serializedTx = tx
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    return Response.json({
      transaction: serializedTx,
      invoice: {
        amount: Number(invoice.amount),
        memo: Number(invoice.memo),
        startTime: Number(invoice.startTime),
        endTime: Number(invoice.endTime),
      },
    });
  } catch (e) {
    console.error("build payment error:", e);
    return Response.json(
      { error: "failed to build transaction" },
      { status: 500 },
    );
  }
}
