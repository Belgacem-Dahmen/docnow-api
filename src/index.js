import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "./config/data-source.js";
import routes from "./routes/index.js"; //
// --------------------
// Load .env properly
// --------------------
// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from /src if needed)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middleware
app.use(cors({ credentials: true }));
app.use(express.json()); // 👈 use express.json() instead of destructured { json }
app.use("/api", routes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
