import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { AppDataSource } from "./config/data-source.js";
import routes from "./routes/index.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(loggerMiddleware);
app.use(cors({ credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", routes);
app.get("/", (req, res) => {
  res.send(
    "🚀 DocNow API is running! Use /api/... for endpoints or visit documentation /api/docs"
  );
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log("📚 Docs available at http://localhost:5000/api/docs");
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
