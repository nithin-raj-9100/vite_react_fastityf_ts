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
    console.log("API route handler invoked for path:", pathname);

    // Import the Fastify app with a relative path that works in the Vercel serverless environment
    let createApp;
    try {
      console.log(
        "Attempting to import backend module from ./api/backend/index"
      );
      createApp = require("./api/backend/index").default;
    } catch (importError) {
      console.error("Failed to import from ./api/backend/index:", importError);

      try {
        console.log("Attempting fallback import from ./api/backend");
        const backend = require("./api/backend");
        createApp = backend.default || backend;
      } catch (fallbackError) {
        console.error("Failed fallback import:", fallbackError);
        throw new Error(
          `Backend module could not be loaded: ${fallbackError.message}`
        );
      }
    }

    if (!createApp || typeof createApp !== "function") {
      throw new Error("Backend app export not found or not a function");
    }

    console.log("Backend module imported successfully");

    // Forward the request to our Fastify app
    const app = createApp();
    console.log("Fastify app instance created");

    // Handle the request using Fastify
    await app.ready();
    console.log("Fastify app ready");

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
