import express from "express";

import {
  getAdminHomepage,
  updateAdminHomepage,
} from "../../controllers/admin/adminwebhomeController.js";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminHomepage);

router.put("/", protect, authorizeRoles("admin"), updateAdminHomepage);

export default router;
