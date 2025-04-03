// Simple hello world API route

module.exports = (req, res) => {
  const { name = "World" } = req.query;

  console.log(`Hello API called with name: ${name}`);

  res.status(200).json({
    message: `Hello ${name}!`,
  });
};
