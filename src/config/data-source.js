import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../entities/User.js";
import { Patient } from "../entities/Patient.js";
import { Doctor } from "../entities/Doctor.js";
import { Appointment } from "../entities/Appointment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Patient, Doctor, Appointment],
  migrations: [],
  subscribers: [],
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});
