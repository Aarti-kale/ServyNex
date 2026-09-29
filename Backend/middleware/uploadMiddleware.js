import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDirectory = path.resolve("uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName = `${Date.now()}-${crypto
      .randomBytes(12)
      .toString("hex")}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

  const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

  const extension = path.extname(file.originalname).toLowerCase();

  const isValidMimeType = allowedMimeTypes.has(file.mimetype);

  const isValidExtension = allowedExtensions.has(extension);

  if (isValidMimeType && isValidExtension) {
    return cb(null, true);
  }

  return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
