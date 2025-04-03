// Mock data
const todos = [
  { id: "1", title: "Learn Fastify", completed: false },
  { id: "2", title: "Build a REST API", completed: false },
  { id: "3", title: "Deploy to Vercel", completed: false },
];

async function routes(fastify, options) {
  // API root - useful for checking if API is running
  fastify.get("/", async (request, reply) => {
    return { message: "API is running" };
  });

  // Health check endpoint
  fastify.get("/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Debug endpoint
  fastify.get("/api-debug", async (request, reply) => {
    return {
      message: "API debug endpoint is working",
      url: request.url,
      method: request.method,
      headers: request.headers,
      timestamp: new Date().toISOString(),
    };
  });

  // Get all todos
  fastify.get("/todos", async (request, reply) => {
    return todos;
  });

  // Get a single todo
  fastify.get("/todos/:id", async (request, reply) => {
    const { id } = request.params;
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return reply.code(404).send({ error: "Todo not found" });
    }
    return todo;
  });
}

export default routes;
