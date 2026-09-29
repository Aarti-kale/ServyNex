import express from "express";
import multer from "multer";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getAdminAbout,
  updateAdminAbout,
  resetAdminAbout,
} from "../../controllers/admin/adminAboutController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminAbout);

router.put("/", protect, authorizeRoles("admin"), updateAdminAbout);

router.delete("/", protect, authorizeRoles("admin"), resetAdminAbout);

export default router;
