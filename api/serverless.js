"use strict";

// Require the framework
import Fastify from "fastify";
import cors from "@fastify/cors";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Add plugins
app.register(cors, {
  origin: "*",
  credentials: true,
});

// Register your application as a normal plugin.
app.register(import("./app.js"));

export default async (req, res) => {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error handling request:", error);
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
};
