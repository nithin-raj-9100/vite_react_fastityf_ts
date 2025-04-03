// Serverless function for /api/todos endpoint

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

  // Handle different HTTP methods
  try {
    switch (req.method) {
      case "GET":
        // Return all todos
        console.log("GET /api/todos - Returning todos:", todos);
        return res.status(200).json(todos);

      case "POST":
        // Create a new todo
        const body = JSON.parse(req.body || "{}");

        if (!body.title) {
          return res.status(400).json({ error: "Title is required" });
        }

        const newTodo = {
          id: Date.now().toString(),
          title: body.title,
          completed: body.completed || false,
        };

        console.log("POST /api/todos - Created new todo:", newTodo);
        return res.status(201).json(newTodo);

      default:
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error in /api/todos:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
