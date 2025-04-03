// Simple test API endpoint to verify routing
export default function handler(req, res) {
  console.log("Test API endpoint called:", req.url);

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    success: true,
    message: "API test endpoint is working",
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}
