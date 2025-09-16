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
    const { doctor: doctorData, user: userData } = req.body;

    // 🟢 find doctor with relation to user
    const doctor = await doctorRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // 🟢 update doctor info
    if (doctorData) {
      doctorRepository.merge(doctor, doctorData);
      await doctorRepository.save(doctor);
    }

    // 🟢 update user info
    if (userData) {
      const user = doctor.user; // already joined
      userRepository.merge(user, userData);
      await userRepository.save(user);
    }

    // 🟢 fetch updated doctor with user
    const updatedDoctor = await doctorRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    res.json(updatedDoctor);
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
