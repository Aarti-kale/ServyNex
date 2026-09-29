import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  createWebsiteSettings,
  getAdminWebsiteSettings,
  updateNavbar,
  updateFooter,
  updateWebsiteSettings,
} from "../../controllers/admin/adminWebSettingsController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createWebsiteSettings);

router.get("/", protect, authorizeRoles("admin"), getAdminWebsiteSettings);

router.put("/navbar", protect, authorizeRoles("admin"), updateNavbar);

router.put("/footer", protect, authorizeRoles("admin"), updateFooter);

router.put("/", protect, authorizeRoles("admin"), updateWebsiteSettings);

export default router;
