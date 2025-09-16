import { z } from "zod";

export const doctorSchema = z.object({
  doctor: z.object(
    {
      specialization: z
        .string()
        .nonempty({ message: "Specialization is required" }),
      rating: z
        .number()
        .min(0, { message: "rating should be between 0 & 5" })
        .max(5, { message: "rating should be between 0 & 5" })
        .optional(),
      contactNumber: z
        .string()
        .regex(/^\+?[0-9]{8,15}$/, { message: "Invalid contact number" }),
      addressText: z.string().nonempty({ message: "Address is required" }),
      addressCoordinates: z.object({
        lat: z.number({ invalid_type_error: "Latitude must be a number" }),
        lng: z.number({ invalid_type_error: "Longitude must be a number" }),
      }),
    },
    { required_error: "Doctor object is required" }
  ),

  user: z.object(
    {
      avatar: z.url({ message: "Avatar must be a valid URL" }),
      age: z
        .number()
        .int()
        .min(0, { message: "Age must be a positive number" }),
      gender: z.enum(["male", "female", "other"], {
        message: "Gender must be male, female, or other",
      }),
    },
    { required_error: "User object is required" }
  ),
});
