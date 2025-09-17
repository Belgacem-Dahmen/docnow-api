import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Please Provide a valid Email" }),
  password: z
    .string({ message: "Password is required" })
    .nonempty()
    .min(6, { message: "Password must be at least 6 characters" }),
});
