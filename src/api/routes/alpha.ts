import type { FastifyInstance } from "fastify";
import { alphaDetectionCore } from "../../agent/skills/alphaDetection.js";

export default async function alphaRoute(app: FastifyInstance) {
  app.post("/alpha", async (req) => {
    const { agent } = req.body as { agent: string };

    const result = await alphaDetectionCore(agent, "api");

    return {
      status: "ok",
      data: result,
    };
  });
}
