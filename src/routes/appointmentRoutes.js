import { Router } from "express";
import {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointments,
} from "../controllers/appointmentController.js";
import { auth, shouldBe } from "../middlewares/auth.js";

const router = Router();
router.get("/", auth, shouldBe("patient"),getAppointments); // patient/doctor/admin
router.post("/", auth, createAppointment); // patient
router.put("/:id", auth, updateAppointment); // patient/admin
router.delete("/:id", auth, shouldBe("admin", "doctor"), cancelAppointment); // patient/admin


export default router;
