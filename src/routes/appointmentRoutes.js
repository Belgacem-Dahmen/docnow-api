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
router.get("/", auth, getAppointments);
router.get("/:id", auth, shouldBe("doctor", "admin"), getAppointmentById);

router.post("/", auth, validate(appointmentSchema), createAppointment);
router.put(
  "/:id",
  auth,
  shouldBe("doctor", "admin"),
  validate(appointmentSchema),
  updateAppointment
);
router.delete("/:id", auth, shouldBe("doctor", "admin"), cancelAppointment);

export default router;
