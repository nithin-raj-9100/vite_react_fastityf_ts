// Import the createApp function from the backend
import createApp from "../apps/backend/dist/index.js";

export default async function handler(req, res) {
  // Create a new Fastify app instance
  const fastify = createApp();

  // Setup a fake HTTP request to be handled by Fastify
  await fastify.ready();

  // Pass the request to Fastify and pipe the response back
  fastify.server.emit("request", req, res);
}
