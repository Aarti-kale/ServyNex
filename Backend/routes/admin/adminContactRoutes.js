import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getAdminContact,
  updateAdminContact,
  resetAdminContact,
} from "../../controllers/admin/adminContactController.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminContact);

router.put("/", protect, authorizeRoles("admin"), updateAdminContact);

router.post("/reset", protect, authorizeRoles("admin"), resetAdminContact);

export default router;
