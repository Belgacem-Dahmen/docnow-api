import { AppDataSource } from "../config/data-source.js";
import { Patient } from "../entities/Patient.js";
import { User } from "../entities/User.js";
import sanitizeUser from "../helpers/sanitizeUser.js";

const patientRepository = AppDataSource.getRepository(Patient);
const userRepository = AppDataSource.getRepository(User);
export const getPatients = async (req, res) => {
  try {
    const patients = await patientRepository.find({
      relations: ["user"],
    });
    res.json(patients);
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

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

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient: patientData, user: userData } = req.body;

    const patient = await patientRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (patientData) {
      patientRepository.merge(patient, patientData);
      await patientRepository.save(patient);
    }

    if (userData) {
      const user = patient.user;
      userRepository.merge(user, userData);
      await userRepository.save(user);
    }

    const updatedPatient = await patientRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    res.json({
      ...updatedPatient,
      user: sanitizeUser(updatedPatient.user),
    });
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await patientRepository.findOne({
      where: { id: parseInt(id) },
    });

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
