import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, upload.single("avatar"), updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
