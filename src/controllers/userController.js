import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { Doctor } from "../entities/Doctor.js";
import { Patient } from "../entities/Patient.js";
import path from "path";
import fs from "fs";
import { removeAvatar,uploadAvatar } from "../helpers/avatar.js";

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

    const safeUsers = users.map(({ password, ...rest }) => rest);

    res.json(safeUsers);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "doctor") {
      user.doctor = await doctorRepository.findOne({
        where: { userId: user.id },
      });
    } else if (user.role === "patient") {
      user.patient = await patientRepository.findOne({
        where: { userId: user.id },
      });
    }

    res.json((({ password, ...safeUser }) => safeUser)(user));
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      gender,
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

    // 🎨 update simple fields
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (role) user.role = role;

    // 📸 handle avatar if new file is uploaded
    if (req.file) {
      if (user.avatar) {
        removeAvatar(user.avatar); // utilitaire helper
      }
      user.avatar = uploadAvatar(req.file, req); // utilitaire helper
    }

    await userRepository.save(user);

    // 🩺 if doctor, update doctor info
    if (user.role === "doctor") {
      let doctor = await doctorRepository.findOne({ where: { userId: user.id } });
      if (!doctor) {
        doctor = doctorRepository.create({ userId: user.id });
      }
      if (specialization) doctor.specialization = specialization;
      if (contactNumber) doctor.contactNumber = contactNumber;
      if (addressText) doctor.addressText = addressText;
      if (addressCoordinates) doctor.addressCoordinates = addressCoordinates;

      await doctorRepository.save(doctor);
    }

    // 👤 if patient, ensure patient exists
    if (user.role === "patient") {
      let patient = await patientRepository.findOne({ where: { userId: user.id } });
      if (!patient) {
        patient = patientRepository.create({ userId: user.id });
      }
      await patientRepository.save(patient);
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.avatar) {
      removeAvatar(user.avatar);
    }

    await userRepository.remove(user);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
