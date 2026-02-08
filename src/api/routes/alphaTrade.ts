import type { FastifyInstance } from "fastify";
import { alphaTrade } from "../../agent/trade/alphaTrade.js";
import { DummySolanaSigner } from "../../agent/signer/DummySolanaSigner.js";

export default async function alphaTradeRoute(app: FastifyInstance) {
  app.post("/alpha/trade", async (req) => {
    const {
      agent,
      tokenAddress,
      symbol,
      score,
      confidence,
      mode = "dry-run",
    } = req.body as any;

    if (!agent || !tokenAddress || !symbol) {
      return { error: "Invalid trade input" };
    }

    if (mode !== "dry-run") {
      return {
        error: "Live trading via API is disabled",
      };
    }

    const signer = new DummySolanaSigner();

    const result = await alphaTrade(
      {
        agent,
        address: tokenAddress,
        symbol,
        score,
        confidence,
      },
      signer
    );

    return {
      status: "ok",
      data: result,
    };
  });
}
