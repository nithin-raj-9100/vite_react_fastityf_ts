// Serverless function for /api/todos endpoint

// Mock todos data
const todos = [
  { id: "1", title: "Learn Vercel Serverless Functions", completed: false },
  { id: "2", title: "Set up API endpoints", completed: false },
  { id: "3", title: "Connect frontend to backend", completed: false },
];

module.exports = (req, res) => {
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
    return res.status(200).end();
  }

  // Log for debugging
  console.log("API route /api/todos called with method:", req.method);

  // Handle different HTTP methods
  if (req.method === "GET") {
    return res.status(200).json(todos);
  }

  // For any other HTTP method, return 405
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};
