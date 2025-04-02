import { FastifyInstance } from "fastify";
import { todoRoutes } from "./todo";

export function registerRoutes(fastify: FastifyInstance) {
  // Register all API routes here
  fastify.register(todoRoutes, { prefix: "/api/todos" });
}
