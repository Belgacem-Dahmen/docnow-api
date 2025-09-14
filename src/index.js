// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
// Middleware to handle CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
