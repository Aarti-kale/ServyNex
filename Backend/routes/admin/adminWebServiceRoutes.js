import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getAdminServiceContent,
  updateAdminServiceContent,
  deleteAdminServiceContent,
} from "../../controllers/admin/adminWebServiceController.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/", getAdminServiceContent);

router.put("/", updateAdminServiceContent);

router.delete("/", deleteAdminServiceContent);

export default router;
