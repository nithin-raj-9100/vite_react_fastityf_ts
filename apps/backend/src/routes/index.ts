import { FastifyInstance } from "fastify";
import { todoRoutes } from "./todo.js";

export function registerRoutes(fastify: FastifyInstance) {
  // Register all API routes here
  // Since our requests will come in as /api/todos,
  // we don't need the /api prefix here - it's already in the URL
  fastify.register(todoRoutes, { prefix: "/todos" });
}
