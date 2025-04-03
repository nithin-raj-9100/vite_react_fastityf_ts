// This is a Vercel serverless function that will handle all API routes
// It acts as a proxy to the Fastify backend server

const path = require("path");
const { existsSync } = require("fs");

// Check if the file exists
function checkFile(file) {
  return existsSync(file);
}

module.exports = async (req, res) => {
  // Parse the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/^\/api/, "");

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS method for preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Import the Fastify app with a relative path that works in the Vercel serverless environment
    // First try direct module import
    let createApp;
    try {
      createApp = require("../apps/backend/dist/index").default;
    } catch (importError) {
      console.error("Failed to import backend module:", importError);
      // Fallback to commonjs
      const backend = require("../apps/backend/dist/index");
      createApp = backend.default || backend;
    }

    if (!createApp || typeof createApp !== "function") {
      throw new Error("Backend app export not found or not a function");
    }

    // Forward the request to our Fastify app
    const app = createApp();

    // Handle the request using Fastify
    await app.ready();

    // Convert Vercel request to Node.js request and respond
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
