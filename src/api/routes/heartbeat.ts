import type { FastifyInstance } from "fastify";

export default async function heartbeatRoute(app: FastifyInstance) {
  app.get("/heartbeat", async () => {
    return {
      status: "ok",
      service: "xirion-api",
      timestamp: Date.now(),
    };
  });
}
