import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import {
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "../controllers/patientController.js";

const router = Router();
router.get("/", auth, getPatients);
router.get("/:id", auth, getPatientById);
router.put("/:id", auth, shouldBe("admin", "patient"), updatePatient);
router.delete("/:id", auth, shouldBe("admin"), deletePatient);

export default router;
