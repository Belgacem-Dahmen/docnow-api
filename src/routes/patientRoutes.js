import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import { deletePatient, getPatientById, getPatients, updatePatient } from "../controllers/patientController.js";

const router = Router();
router.get("/",getPatients); 
router.get("/:id",getPatientById);
router.put("/:id",updatePatient); 
router.delete("/:id",deletePatient);


export default router;
