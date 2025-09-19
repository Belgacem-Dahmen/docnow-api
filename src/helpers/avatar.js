import fs from "fs";
import path from "path";

/**
 * Save an avatar file from memory buffer to disk
 * @param {Object} file - Multer file object (req.file)
 * @param {Object} req - Express request (for protocol/host)
 * @returns {string} - Public URL of the saved file
 */
export function uploadAvatar(file, req) {
  if (!file) return null;

  // ensure directory exists
  const uploadDir = path.join(process.cwd(), "uploads/avatars");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // save new file
  const fileName = Date.now() + "-" + file.originalname;
  const uploadPath = path.join(uploadDir, fileName);
  fs.writeFileSync(uploadPath, file.buffer);

  // return public URL
  return `${req.protocol}://${req.get("host")}/uploads/avatars/${fileName}`;
}

/**
 * Remove an avatar file from disk
 * @param {string} avatarUrl - The stored URL of the avatar
 */
export function removeAvatar(avatarUrl) {
  if (!avatarUrl) return;

  const filePath = path.join(process.cwd(), "uploads/avatars", path.basename(avatarUrl));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
