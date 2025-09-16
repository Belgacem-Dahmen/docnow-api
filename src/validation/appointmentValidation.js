import { z } from "zod";

export const appointmentSchema = z.object({
  doctorId: z.number({
    required_error: "Doctor ID is required",
    invalid_type_error: "Doctor ID must be a number",
  }),

  patientId: z.number({
    required_error: "Patient ID is required",
    invalid_type_error: "Patient ID must be a number",
  }),

  date: z
    .string({
      required_error: "Date is required",
      invalid_type_error: "Date must be a string",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid ISO string (e.g. 2025-09-16T14:00:00Z)",
    }),

  reason: z
    .string()
    .nonempty({ message: "Reason is required" })
    .max(255, { message: "Reason cannot exceed 255 characters" }),

  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});
