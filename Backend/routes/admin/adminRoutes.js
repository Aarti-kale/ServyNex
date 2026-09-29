import express from "express";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import {
  adminLogin,
  blockUser,
  createAdmin,
  getAdminDashboard,
  getPendingWorkerApprovals,
  approveWorker,
  rejectWorker,
  getRecentBookings,
  getRevenueOverview,
  getWebsiteStatus,
  updateWebsiteStatus,
  getRecentReviews,
  getDashboard,
  unblockUser,
} from "../../controllers/admin/adminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboard);
router.get(
  "/dashboard-overview",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

router.get(
  "/pending-approvals",
  protect,
  authorizeRoles("admin"),
  getPendingWorkerApprovals
);

router.patch(
  "/workers/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveWorker
);

router.patch(
  "/workers/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectWorker
);

router.get(
  "/recent-bookings",
  protect,
  authorizeRoles("admin"),
  getRecentBookings
);

router.get(
  "/revenue-overview",
  protect,
  authorizeRoles("admin"),
  getRevenueOverview
);

router.get(
  "/website-status",
  protect,
  authorizeRoles("admin"),
  getWebsiteStatus
);

router.get(
  "/recent-reviews",
  protect,
  authorizeRoles("admin"),
  getRecentReviews
);

router.patch(
  "/website-status",
  protect,
  authorizeRoles("admin"),
  updateWebsiteStatus
);

router.post("/create-admin", protect, authorizeRoles("admin"), createAdmin);

router.put("/block/:id", protect, authorizeRoles("admin"), blockUser);

router.put("/unblock/:id", protect, authorizeRoles("admin"), unblockUser);

export default router;
