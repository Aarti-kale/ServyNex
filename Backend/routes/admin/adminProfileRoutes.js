import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getRecentAdminActivity,
} from "../../controllers/admin/adminProfileController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminProfile);

router.put("/", protect, authorizeRoles("admin"), updateAdminProfile);

router.put("/password", protect, authorizeRoles("admin"), changeAdminPassword);

router.get(
  "/activity",
  protect,
  authorizeRoles("admin"),
  getRecentAdminActivity
);

export default router;
