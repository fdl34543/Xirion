import type { FastifyInstance } from "fastify";
import { analyzeToken } from "../../agent/analyzeToken.js";

export default async function analyzeTokenRoute(app: FastifyInstance) {
  app.post("/analyzeToken", async (req) => {
    const { tokenAddress, twitter } = req.body as {
      tokenAddress: string;
      twitter?: string;
    };

    if (!tokenAddress) {
      return { error: "tokenAddress is required" };
    }

    const result = await analyzeToken({
      address: tokenAddress,
      twitter,
    });

    return {
      status: "ok",
      data: result,
    };
  });
}
