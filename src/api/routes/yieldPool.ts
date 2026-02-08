import type { FastifyInstance } from "fastify";
import { analyzeYield } from "../../agent/yield/analyzeYield.js";

export default async function yieldPoolRoute(app: FastifyInstance) {
  app.post("/yield/pool", async () => {
    
    const result = await analyzeYield();

    return {
    status: "ok",
    data: result.data,
    };
    
  });
}


