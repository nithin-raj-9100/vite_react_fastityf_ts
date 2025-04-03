// Serverless function for /api/todos/[id] endpoint

// Mock todos data - this mimics what would come from the backend
const todos = [
  { id: "1", title: "Learn Vercel Serverless Functions", completed: false },
  { id: "2", title: "Set up API endpoints", completed: false },
  { id: "3", title: "Connect frontend to backend", completed: false },
];

module.exports = async (req, res) => {
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

  // Get the todo ID from the URL path
  const { id } = req.query;
  console.log(`Processing request for todo ID: ${id}`);

  // Find the todo by ID
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with ID ${id} not found` });
  }

  // Handle different HTTP methods
  try {
    switch (req.method) {
      case "GET":
        // Return the specific todo
        console.log(`GET /api/todos/${id} - Returning todo:`, todo);
        return res.status(200).json(todo);

      case "PUT":
        // Update the todo
        const body = JSON.parse(req.body || "{}");

        const updatedTodo = {
          ...todo,
          ...(body.title !== undefined && { title: body.title }),
          ...(body.completed !== undefined && { completed: body.completed }),
        };

        console.log(`PUT /api/todos/${id} - Updated todo:`, updatedTodo);
        return res.status(200).json(updatedTodo);

      case "DELETE":
        // Delete the todo (in a real app, we would modify the array)
        console.log(`DELETE /api/todos/${id} - Deleted todo:`, todo);
        return res
          .status(200)
          .json({ message: `Todo ${id} deleted successfully` });

      default:
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(`Error in /api/todos/${id}:`, error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
