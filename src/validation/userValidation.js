import { z } from "zod";

export const userSchema = z.object({
  name: z.string({ message: "Name is required" }),
  age: z.number({ message: "Age is required" }),
  avatar: z.url({ message: "Please provide a valid URL for your avatar" }),
  email: z.email({ message: "Please Provide a valid Email" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["admin", "doctor", "patient"], {
    message: "Role must be doctor, or patient",
  }),
});
