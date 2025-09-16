import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import {
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";
import { validate } from "../middlewares/validate.js";
import { doctorSchema } from "../validation/doctorValidation.js";

const router = Router();
router.get("/", auth, getDoctors);
router.get("/:id", auth, getDoctorById);
router.put("/:id", auth, validate(doctorSchema), updateDoctor);
router.delete("/:id", auth, shouldBe("admin"), deleteDoctor);

export default router;
