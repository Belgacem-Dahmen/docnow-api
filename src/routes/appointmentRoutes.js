import { Router } from "express";
import {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointments,
  getAppointmentById,
} from "../controllers/appointmentController.js";
import { auth, shouldBe } from "../middlewares/auth.js";
import { appointmentSchema } from "../validation/appointmentValidation.js";
import { validate } from "../middlewares/validate.js";

const router = Router();
router.get("/", auth, getAppointments); // patient/doctor/admin
router.get("/:id", auth, shouldBe("doctor", "admin"), getAppointmentById); // patient/doctor/admin

router.post(
  "/",
  auth,
  // shouldBe("patient"),
  validate(appointmentSchema),
  createAppointment
); // patient
router.put(
  "/:id",
  auth,
  shouldBe("doctor", "admin"),
  validate(appointmentSchema),
  updateAppointment
); // patient/admin
router.delete("/:id", auth, shouldBe("doctor", "admin"), cancelAppointment); // patient/admin

export default router;
