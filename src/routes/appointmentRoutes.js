import { Router } from "express";
import {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointments,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/", protect, createAppointment);          // patient
router.put("/:id", protect, updateAppointment);        // patient/admin
router.delete("/:id", protect, cancelAppointment);     // patient/admin
router.get("/", protect, getAppointments);             // patient/doctor/admin

export default router;
