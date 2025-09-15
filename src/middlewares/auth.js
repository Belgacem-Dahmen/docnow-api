import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";

const userRepository = AppDataSource.getRepository(User);

// 🟢 Authenticate user with JWT
export const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      req.user = user; // attach user to request
      next();
    } else {
      return res.status(401).json({ error: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Not authorized, invalid token" });
  }
};

// 🔒 Restrict access by role(s)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }
    next();
  };
};
