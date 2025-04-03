import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { registerRoutes } from "./routes/index.js";

// Create and configure the Fastify app
function createApp() {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  });
  fastify.register(sensible);

  registerRoutes(fastify);

  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  fastify.get("/api-debug", async (request, reply) => {
    return {
      message: "API debug endpoint is working",
      url: request.url,
      method: request.method,
      headers: request.headers,
      timestamp: new Date().toISOString(),
    };
  });

  return fastify;
}

// Export for Vercel serverless functions
export default createApp;
