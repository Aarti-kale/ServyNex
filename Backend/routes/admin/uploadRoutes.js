import express from "express";

import { uploadImage } from "../../controllers/admin/uploadController.js";

import upload from "../../middleware/uploadMiddleware.js";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.post("/image", upload.single("image"), uploadImage);

export default router;
