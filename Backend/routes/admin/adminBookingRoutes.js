import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getBookingStats,
  getAdminBookings,
  getAdminBookingDetails,
  assignWorker,
  rescheduleBooking,
  cancelAdminBooking,
  completeAdminBooking,
} from "../../controllers/admin/adminBookingController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getBookingStats);

router.get("/", protect, authorizeRoles("admin"), getAdminBookings);

router.get("/:id", protect, authorizeRoles("admin"), getAdminBookingDetails);

router.put(
  "/:id/assign-worker",
  protect,
  authorizeRoles("admin"),
  assignWorker
);

router.put(
  "/:id/reschedule",
  protect,
  authorizeRoles("admin"),
  rescheduleBooking
);

router.put("/:id/cancel", protect, authorizeRoles("admin"), cancelAdminBooking);

router.put(
  "/:id/complete",
  protect,
  authorizeRoles("admin"),
  completeAdminBooking
);
export default router;
