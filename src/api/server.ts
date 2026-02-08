import Fastify from "fastify";
import heartbeatRoute from "./routes/heartbeat.js";
import analyzeTokenRoute from "./routes/analyzeToken.js";
import alphaRoute from "./routes/alpha.js";
import alphaTradeRoute from "./routes/alphaTrade.js";
import yieldPoolRoute from "./routes/yieldPool.js";

export async function startApiServer() {
  const app = Fastify({ logger: true });

  app.register(heartbeatRoute, { prefix: "/api" });
  app.register(analyzeTokenRoute, { prefix: "/api" });
  app.register(alphaRoute, { prefix: "/api" });
  app.register(alphaTradeRoute, { prefix: "/api" });
  app.register(yieldPoolRoute, { prefix: "/api" });

  await app.listen({ port: 3001, host: "0.0.0.0" });

  console.log("[API] Server running on http://localhost:3001");
}
