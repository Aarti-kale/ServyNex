import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getServiceStats,
  getAdminServices,
  getAdminServiceDetails,
  createAdminService,
  updateAdminService,
  activateService,
  deactivateService,
  deleteAdminService,
} from "../../controllers/admin/adminServiceController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getServiceStats);

router.get("/", protect, authorizeRoles("admin"), getAdminServices);

router.post("/", protect, authorizeRoles("admin"), createAdminService);

router.get("/:id", protect, authorizeRoles("admin"), getAdminServiceDetails);

router.put("/:id", protect, authorizeRoles("admin"), updateAdminService);

router.put("/:id/activate", protect, authorizeRoles("admin"), activateService);

router.put(
  "/:id/deactivate",
  protect,
  authorizeRoles("admin"),
  deactivateService
);

router.delete("/:id", protect, authorizeRoles("admin"), deleteAdminService);

export default router;
