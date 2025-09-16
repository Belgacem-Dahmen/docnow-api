import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = {};
      err.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!formattedErrors[field]) {
          formattedErrors[field] = issue.message;
        }
      });

      return res.status(400).json({
        message: "Something went wrong",
        errors: formattedErrors,
      });
    } else {
      console.error("Unexpected validation error:", err);
      return res.status(500).json({
        message: "Server error during validation",
        details: err?.message || "Unknown error",
      });
    }
  }
};
