import { AppDataSource } from "../config/data-source.js";
import { Appointment } from "../entities/Appointment.js";
import { Doctor } from "../entities/Doctor.js";
import { Patient } from "../entities/Patient.js";

const appointmentRepository = AppDataSource.getRepository(Appointment);
const doctorRepository = AppDataSource.getRepository(Doctor);
const patientRepository = AppDataSource.getRepository(Patient);

// 🟢 Create appointment (patients only)
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    if (req.user.role !== "patient") {
      return res
        .status(403)
        .json({ error: "Only patients and admins can book appointments" });
    }

    const patient = await patientRepository.findOne({
      where: { userId: req.user.id },
    });
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    const doctor = await doctorRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const appointment = appointmentRepository.create({
      doctor,
      patient,
      date,
    });

    await appointmentRepository.save(appointment);

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟡 Update appointment (patients can update their own, admin can update all)
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;

    const appointment = await appointmentRepository.findOne({
      where: { id },
      relations: ["patient", "doctor"],
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Role check
    if (
      req.user.role === "patient" &&
      appointment.patient.userId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this appointment" });
    }
    if (req.user.role === "doctor") {
      return res
        .status(403)
        .json({ error: "Doctors cannot update appointments" });
    }

    if (date) appointment.date = date;
    if (status) appointment.status = status;

    await appointmentRepository.save(appointment);
    res.json({ message: "Appointment updated", appointment });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔴 Cancel appointment (patients: their own, admin: all)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await appointmentRepository.findOne({
      where: { id },
      relations: ["patient"],
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (
      req.user.role === "patient" &&
      appointment.patient.userId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "Not allowed to cancel this appointment" });
    }

    appointment.status = "cancelled";
    await appointmentRepository.save(appointment);

    res.json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 👀 View appointments
export const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "doctor") {
      const doctor = await doctorRepository.findOne({
        where: { userId: req.user.id },
      });
      appointments = await appointmentRepository.find({
        where: { doctor },
        relations: ["patient", "doctor"],
      });
    } else if (req.user.role === "patient") {
      const patient = await patientRepository.findOne({
        where: { userId: req.user.id },
      });
      appointments = await appointmentRepository.find({
        where: { patient },
        relations: ["patient", "doctor"],
      });
    } else if (req.user.role === "admin") {
      appointments = await appointmentRepository.find({
        relations: ["patient", "doctor"],
      });
    }

    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentRepository.findOne({
      where: { id },
      relations: ["patient", "doctor"],
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    } else
      return res.status(200).json({
        data: appointment,
      });
  } catch (error) {}
};
