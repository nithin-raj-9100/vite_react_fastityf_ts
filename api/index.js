module.exports = async (req, res) => {
  try {
    const { default: createApp } = await import(
      "../apps/backend/dist/index.js"
    );

    const app = createApp();

    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error in Vercel function handler:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      })
    );
  }
};
