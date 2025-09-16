import { Router } from "express";

import { auth, shouldBe } from "../middlewares/auth.js";
import { deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "../controllers/doctorController.js";

const router = Router();
router.get("/",getDoctors); 
router.get("/:id", getDoctorById);
router.put("/:id",updateDoctor); 
router.delete("/:id",deleteDoctor);


export default router;
