import express from "express";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import {
  getCustomerDetails,
  getCustomers,
  getCustomerActivity,
  getCustomerStats,
  getCustomerReviews,
} from "../../controllers/admin/admincustomerController.js";
const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getCustomerStats);

router.get("/", protect, authorizeRoles("admin"), getCustomers);

router.get(
  "/:id/reviews",
  protect,
  authorizeRoles("admin"),
  getCustomerReviews
);

router.get(
  "/:id/activity",
  protect,
  authorizeRoles("admin"),
  getCustomerActivity
);

router.get("/:id", protect, authorizeRoles("admin"), getCustomerDetails);

export default router;
