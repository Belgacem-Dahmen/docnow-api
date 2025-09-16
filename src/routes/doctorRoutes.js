import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import {
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";

const router = Router();
router.get("/", auth, getDoctors);
router.get("/:id", auth, getDoctorById);
router.put("/:id", auth, updateDoctor);
router.delete("/:id", auth, shouldBe("admin"), deleteDoctor);

export default router;
