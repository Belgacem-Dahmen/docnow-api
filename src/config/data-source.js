import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../entities/User.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level above /src usually)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DEV_DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: { rejectUnauthorized: false },
});
