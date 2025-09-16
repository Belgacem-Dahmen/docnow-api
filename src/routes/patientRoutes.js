import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import {
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "../controllers/patientController.js";
import { validate } from "../middlewares/validate.js";
import { patientSchema } from "../validation/patientValidation.js";

const router = Router();
router.get("/", auth, getPatients);
router.get("/:id", auth, getPatientById);
router.put(
  "/:id",
  auth,
  shouldBe("admin", "patient"),
  validate(patientSchema),
  updatePatient
);
router.delete("/:id", auth, shouldBe("admin"), deletePatient);

export default router;
