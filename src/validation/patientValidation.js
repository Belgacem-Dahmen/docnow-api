import { z } from "zod";

export const patientSchema = z.object({
  patient: z.object({
    medicalHistory: z
      .string()
      .nonempty({ message: "Medical history is required" }),
  }, { required_error: "Patient object is required" }),

  user: z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.email({ message: "Please provide a valid Email" }),
    avatar: z.url({ message: "Avatar must be a valid URL" }),
    age: z.number().int().min(0, { message: "Age must be a positive number" }),
    gender: z.enum(["male", "female", "other"], {
      message: "Gender must be male, female, or other",
    }),
  }, { required_error: "User object is required" }),
});
