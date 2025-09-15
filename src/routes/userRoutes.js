import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authorize, protect } from "../middlewares/auth.js";

const router = Router();

// 🟢 Get all users (optional role filter: /users?role=doctor)
router.get("/", getUsers);

// 🟢 Get single user by ID
router.get("/:id", getUserById);

// 🟡 Update user
router.put("/:id", updateUser);

// 🔴 Delete user
router.delete("/:id", deleteUser);

export default router;
