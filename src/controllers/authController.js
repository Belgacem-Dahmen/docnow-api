import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { Patient } from "../entities/Patient.js";
import { Doctor } from "../entities/Doctor.js";

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);
const patientRepository = AppDataSource.getRepository(Patient);

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      avatar,
      specialization,
      contactNumber,
      addressText,
      addressCoordinates,
      role,
    } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      avatar,
      role: role || "user",
    });

    await userRepository.save(newUser);

    if (newUser.role === "doctor") {
      const newDoctor = doctorRepository.create({
        userId: newUser.id,
        specialization,
        contactNumber,
        addressText,
        addressCoordinates,
      });
      await doctorRepository.save(newDoctor);
    } else if (newUser.role === "patient") {
      const newPatient = patientRepository.create({
        userId: newUser.id,
      });
      await patientRepository.save(newPatient);
    }
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verify = async (req, res) => {
  try {
    const user = req.user;
    res.json({ message: "true", user });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
