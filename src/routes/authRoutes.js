import { Router } from "express";
import {
  register,
  login,
  logout,
  verify,
} from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", verify);
router.post("/logout", auth, logout);

export default router;
