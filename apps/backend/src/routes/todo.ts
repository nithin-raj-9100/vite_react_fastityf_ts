import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// Mock data - in a real app, this would come from a database
let todos = [
  { id: "1", title: "Learn Fastify", completed: false },
  { id: "2", title: "Build a REST API", completed: false },
  { id: "3", title: "Deploy to Vercel", completed: false },
];

interface TodoParams {
  id: string;
}

interface TodoBody {
  title: string;
  completed?: boolean;
}

export function todoRoutes(
  fastify: FastifyInstance,
  options: object,
  done: () => void
) {
  // Get all todos
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return todos;
  });

  // Get a single todo
  fastify.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: TodoParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const todo = todos.find((t) => t.id === id);

      if (!todo) {
        return reply.notFound(`Todo with id ${id} not found`);
      }

      return todo;
    }
  );

  // Create a new todo
  fastify.post(
    "/",
    async (
      request: FastifyRequest<{ Body: TodoBody }>,
      reply: FastifyReply
    ) => {
      const { title, completed = false } = request.body;

      if (!title) {
        return reply.badRequest("Title is required");
      }

      const newTodo = {
        id: Date.now().toString(),
        title,
        completed,
      };

      todos.push(newTodo);

      return reply.code(201).send(newTodo);
    }
  );

  // Update a todo
  fastify.put(
    "/:id",
    async (
      request: FastifyRequest<{ Params: TodoParams; Body: TodoBody }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { title, completed } = request.body;

      const todoIndex = todos.findIndex((t) => t.id === id);

      if (todoIndex === -1) {
        return reply.notFound(`Todo with id ${id} not found`);
      }

      todos[todoIndex] = {
        ...todos[todoIndex],
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      };

      return todos[todoIndex];
    }
  );

  // Delete a todo
  fastify.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: TodoParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      const todoIndex = todos.findIndex((t) => t.id === id);

      if (todoIndex === -1) {
        return reply.notFound(`Todo with id ${id} not found`);
      }

      todos = todos.filter((t) => t.id !== id);

      return reply.code(204).send();
    }
  );

  done();
}
