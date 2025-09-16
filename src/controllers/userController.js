import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { Doctor } from "../entities/Doctor.js";
import { Patient } from "../entities/Patient.js";

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);
const patientRepository = AppDataSource.getRepository(Patient);




export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.doctor", "doctor")
      .leftJoinAndSelect("user.patient", "patient");

    if (role) {
      query = query.where("user.role = :role", { role });
    }

    const users = await query.getMany();

    // Remove password before sending response
    const safeUsers = users.map(({ password, ...rest }) => rest);

    res.json(safeUsers);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// 🟢 Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Load role-specific relation only if needed
    if (user.role === "doctor") {
      user.doctor = await doctorRepository.findOne({
        where: { userId: user.id },
      });
    } else if (user.role === "patient") {
      user.patient = await patientRepository.findOne({
        where: { userId: user.id },
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🟡 Update user (basic fields + role-specific updates)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      gender,
      avatar,
      role,
      specialization,
      contactNumber,
      addressText,
      addressCoordinates,
    } = req.body;

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update base user fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (avatar) user.avatar = avatar;
    if (role) user.role = role;

    await userRepository.save(user);

    // Update doctor-specific fields
    if (user.role === "doctor") {
      let doctor = await doctorRepository.findOne({
        where: { userId: user.id },
      });
      if (!doctor) {
        doctor = doctorRepository.create({ userId: user.id });
      }
      if (specialization) doctor.specialization = specialization;
      if (contactNumber) doctor.contactNumber = contactNumber;
      if (addressText) doctor.addressText = addressText;
      if (addressCoordinates) doctor.addressCoordinates = addressCoordinates;

      await doctorRepository.save(doctor);
    }

    // Update patient-specific fields
    if (user.role === "patient") {
      let patient = await patientRepository.findOne({
        where: { userId: user.id },
      });
      if (!patient) {
        patient = patientRepository.create({ userId: user.id });
      }
      // you can extend patient-specific updates here
      await patientRepository.save(patient);
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔴 Delete user (cascade removes doctor/patient)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRepository.remove(user);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
