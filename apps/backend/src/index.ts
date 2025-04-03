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

  // Register plugins
  fastify.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });
  fastify.register(sensible);

  // Register API routes
  registerRoutes(fastify);

  // Health check endpoint
  fastify.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  return fastify;
}

// Start the server if this file is run directly (not imported)
if (require.main === module) {
  const fastify = createApp();

  // Define port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

  // Server startup
  const start = async () => {
    try {
      await fastify.listen({ port, host: "0.0.0.0" });
      console.log(`Server is running on port ${port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
}

// Export for Vercel serverless functions
export default createApp;
