// Self-contained handler for Fastify
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";

// Mock data
const todos = [
  { id: "1", title: "Learn Fastify", completed: false },
  { id: "2", title: "Build a REST API", completed: false },
  { id: "3", title: "Deploy to Vercel", completed: false },
];

export default async function handler(req, res) {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);

    // Create a new Fastify app
    const app = Fastify({
      logger: true,
      disableRequestLogging: false,
    });

    // Register plugins
    await app.register(cors, {
      origin: "*",
      credentials: true,
    });
    await app.register(sensible);

    // Register routes directly here
    app.get("/todos", async () => {
      return todos;
    });

    app.get("/api-debug", async (request) => {
      return {
        message: "API debug endpoint is working",
        url: request.url,
        method: request.method,
        headers: request.headers,
        timestamp: new Date().toISOString(),
      };
    });

    app.get("/health", async () => {
      return { status: "ok", timestamp: new Date().toISOString() };
    });

    // Parse the URL to handle path correctly
    const url = new URL(req.url, `http://${req.headers.host}`);
    let path = url.pathname;

    // Remove /api prefix for Fastify routing
    if (path.startsWith("/api/")) {
      path = path.slice(4); // Remove /api/
    }

    console.log(`Processing path: ${path} (original: ${url.pathname})`);

    // Initialize Fastify
    await app.ready();

    // Create a modified request object with the adjusted path
    const modifiedReq = Object.assign({}, req, {
      url: path + url.search,
    });

    // Handle the request using Fastify
    app.server.emit("request", modifiedReq, res);
  } catch (error) {
    console.error("Error in API handler:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      })
    );
  }
}
