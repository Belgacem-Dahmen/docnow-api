// controllers/patientController.js
import { AppDataSource } from "../config/data-source.js";
import { Patient } from "../entities/Patient.js";

const patientRepository = AppDataSource.getRepository(Patient);

// 🟢 Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await patientRepository.find({
      relations: ["user"], // include user info if needed
    });
    res.json(patients);
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await patientRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Get patient by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let patient = await patientRepository.findOne({ where: { id: parseInt(id) } });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    patientRepository.merge(patient, updates);
    const result = await patientRepository.save(patient);

    res.json(result);
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await patientRepository.findOne({ where: { id: parseInt(id) } });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await patientRepository.remove(patient);

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
