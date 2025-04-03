// This is a Vercel serverless function that will handle all API routes
// It acts as a proxy to the Fastify backend server

const path = require("path");
const { existsSync } = require("fs");
const fs = require("fs");

// Debug function to list directory contents
function listDir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch (err) {
    return `Error reading directory: ${err.message}`;
  }
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
    console.log("Current directory:", process.cwd());
    console.log("Directory contents:", listDir(process.cwd()));

    if (existsSync("./api")) {
      console.log("API directory contents:", listDir("./api"));
    } else {
      console.log("API directory not found in current directory");
    }

    // Import the Fastify app with a relative path that works in the Vercel serverless environment
    let createApp;

    // Try multiple possible paths for the backend module
    const possiblePaths = ["./api/index", "./api", "../api/index", "../api"];

    let moduleImportError = null;

    for (const modulePath of possiblePaths) {
      try {
        console.log(`Attempting to import backend module from ${modulePath}`);
        const importedModule = require(modulePath);
        createApp = importedModule.default || importedModule;

        if (createApp && typeof createApp === "function") {
          console.log(`Successfully imported backend from ${modulePath}`);
          break;
        } else {
          console.log(
            `Module found at ${modulePath} but doesn't export a function`
          );
        }
      } catch (err) {
        console.log(`Failed to import from ${modulePath}: ${err.message}`);
        moduleImportError = err;
      }
    }

    if (!createApp || typeof createApp !== "function") {
      throw new Error(
        `Backend app export not found or not a function: ${moduleImportError?.message}`
      );
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
