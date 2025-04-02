// This is a Vercel serverless function that will handle all API routes
// It acts as a proxy to the Fastify backend server

const path = require("path");
const { exec } = require("child_process");
const { createReadStream, existsSync } = require("fs");

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

  // Import the Fastify app only when needed
  const createApp = require("../apps/backend/dist/index.js");

  try {
    // Forward the request to our Fastify app
    const app = createApp();

    // Handle the request using Fastify
    await app.ready();

    // Convert Vercel request to Node.js request and respond
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
