// api/index.js

// Use require for compatibility in Vercel's Node.js runtime.
// Adjust the path based on where your backend builds relative to the root.
// After 'turbo run build', the backend code should be in 'apps/backend/dist'.
const { default: createApp } = require("../apps/backend/dist/index.js");

// Create the Fastify app instance
const app = createApp();

// Export the handler for Vercel
module.exports = async (req, res) => {
  try {
    // Ensure the Fastify app is ready
    await app.ready();
    // Let Fastify handle the request
    app.server.emit("request", req, res);
  } catch (error) {
    app.log.error(error); // Use Fastify's logger
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
        // Avoid leaking stack trace in production
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      })
    );
  }
};
