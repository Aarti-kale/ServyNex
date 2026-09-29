import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getCategoryStats,
  getAdminCategories,
  getAdminCategoryDetails,
  createAdminCategory,
  updateAdminCategory,
  activateCategory,
  deactivateCategory,
  deleteAdminCategory,
} from "../../controllers/admin/adminCategoryController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getCategoryStats);

router.get("/", protect, authorizeRoles("admin"), getAdminCategories);

router.post("/", protect, authorizeRoles("admin"), createAdminCategory);

router.get("/:id", protect, authorizeRoles("admin"), getAdminCategoryDetails);

router.put("/:id", protect, authorizeRoles("admin"), updateAdminCategory);

router.put("/:id/activate", protect, authorizeRoles("admin"), activateCategory);

router.put(
  "/:id/deactivate",
  protect,
  authorizeRoles("admin"),
  deactivateCategory
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteAdminCategory);

export default router;
