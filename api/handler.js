// Import the createApp function from the backend
import createApp from "../api/backend-dist/index.js";

export default async function handler(req, res) {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);

    // Create a new Fastify app instance
    const fastify = createApp();

    // Make sure all routes are properly prefixed
    // This ensures requests like /api/todos work correctly
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api")) {
      // The request already has /api, make sure Fastify routes match
      console.log(`Request path starts with /api: ${url.pathname}`);
    }

    // Setup a fake HTTP request to be handled by Fastify
    await fastify.ready();

    // Pass the request to Fastify and pipe the response back
    fastify.server.emit("request", req, res);
  } catch (error) {
    console.error("Error in Fastify handler:", error);
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
