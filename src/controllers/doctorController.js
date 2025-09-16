import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { Doctor } from "../entities/Doctor.js";

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);

// 🟢 Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.doctor", "doctor")
      .where("user.role = :role", { role: "doctor" })
      .getMany();

    // Remove password field
    const safeDoctors = doctors.map(({ password, ...rest }) => rest);

    res.json(safeDoctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟢 Get single doctor by User ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.doctor", "doctor")
      .where("user.role = :role", { role: "doctor" })
      .andWhere("user.id = :id", { id })
      .getOne();

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const { password, ...safeDoctor } = doctor;

    res.json(safeDoctor);
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟡 Update doctor by User ID
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, rating, casesCount, contactNumber, addressText, addressCoordinates } = req.body;

    // Find user with role doctor
    const user = await userRepository.findOne({ where: { id, role: "doctor" } });
    if (!user) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find doctor profile
    let doctor = await doctorRepository.findOne({ where: { userId: user.id } });
    if (!doctor) {
      doctor = doctorRepository.create({ userId: user.id });
    }

    // Update doctor fields
    if (specialization !== undefined) doctor.specialization = specialization;
    if (rating !== undefined) doctor.rating = rating;
    if (casesCount !== undefined) doctor.casesCount = casesCount;
    if (contactNumber !== undefined) doctor.contactNumber = contactNumber;
    if (addressText !== undefined) doctor.addressText = addressText;
    if (addressCoordinates !== undefined) doctor.addressCoordinates = addressCoordinates;

    await doctorRepository.save(doctor);

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔴 Delete doctor by User ID
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userRepository.findOne({ where: { id, role: "doctor" } });
    if (!user) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await userRepository.remove(user);

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
