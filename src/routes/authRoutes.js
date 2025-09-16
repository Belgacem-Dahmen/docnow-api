import { Router } from "express";
import {
  register,
  login,
  logout,
  verify,
} from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { userSchema } from "../validation/userValidation.js";
import { loginSchema } from "../validation/loginValidation.js";

const router = Router();

router.post("/register",validate(userSchema), register);
router.post("/login", validate(loginSchema),login);
router.get("/verify", verify);
router.post("/logout", auth, logout);

export default router;
