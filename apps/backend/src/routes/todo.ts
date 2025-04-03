// apps/backend/src/routes/todo.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js"; // Import the cached prisma instance

// Keep interfaces (or adjust if needed based on Prisma model)
interface TodoParams {
  id: string;
}

interface TodoBody {
  title: string;
  completed?: boolean;
}

export async function todoRoutes(fastify: FastifyInstance) {
  // Make the function async

  // Get all todos
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // @ts-ignore
      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: "asc" }, // Optional: order by creation time
      });
      return todos;
    } catch (error) {
      request.log.error(error, "Failed to fetch todos");
      return reply.internalServerError("Could not fetch todos");
    }
  });

  // Get a single todo
  fastify.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: TodoParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      try {
        // @ts-ignore
        const todo = await prisma.todo.findUnique({
          where: { id },
        });

        if (!todo) {
          return reply.notFound(`Todo with id ${id} not found`);
        }
        return todo;
      } catch (error) {
        request.log.error(error, `Failed to fetch todo with id ${id}`);
        return reply.internalServerError("Could not fetch todo");
      }
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

      try {
        const newTodo = await prisma.todo.create({
          data: {
            title,
            completed,
          },
        });
        return reply.code(201).send(newTodo);
      } catch (error) {
        request.log.error(error, "Failed to create todo");
        return reply.internalServerError("Could not create todo");
      }
    }
  );

  // Update a todo
  fastify.put(
    "/:id",
    async (
      request: FastifyRequest<{ Params: TodoParams; Body: Partial<TodoBody> }>, // Use Partial for updates
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { title, completed } = request.body;

      // Construct update data only with provided fields
      const updateData: { title?: string; completed?: boolean } = {};
      if (title !== undefined) updateData.title = title;
      if (completed !== undefined) updateData.completed = completed;

      if (Object.keys(updateData).length === 0) {
        return reply.badRequest(
          "No update fields provided (title or completed)"
        );
      }

      try {
        const updatedTodo = await prisma.todo.update({
          where: { id },
          data: updateData,
        });
        return updatedTodo;
      } catch (error: any) {
        // Handle specific Prisma error for record not found during update
        if (error.code === "P2025") {
          return reply.notFound(`Todo with id ${id} not found for update`);
        }
        request.log.error(error, `Failed to update todo with id ${id}`);
        return reply.internalServerError("Could not update todo");
      }
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
      try {
        await prisma.todo.delete({
          where: { id },
        });
        // Use 200 with message or 204 No Content
        return reply
          .code(200)
          .send({ message: `Todo ${id} deleted successfully` });
        // return reply.code(204).send();
      } catch (error: any) {
        // Handle specific Prisma error for record not found during delete
        if (error.code === "P2025") {
          return reply.notFound(`Todo with id ${id} not found for deletion`);
        }
        request.log.error(error, `Failed to delete todo with id ${id}`);
        return reply.internalServerError("Could not delete todo");
      }
    }
  );

  // No need for done() when using async/await with register
}
