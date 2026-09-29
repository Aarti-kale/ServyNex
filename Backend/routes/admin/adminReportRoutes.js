import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getReportOverview,
  getRevenueTrend,
  getBookingsByCategory,
  getBookingStatus,
  getServicePerformance,
  getWorkerPerformance,
  getCustomerGrowth,
  getMonthlyReportSummary,
  getCustomerLocations,
} from "../../controllers/admin/adminReportController.js";

const router = express.Router();

router.get("/overview", protect, authorizeRoles("admin"), getReportOverview);

router.get("/revenue-trend", protect, authorizeRoles("admin"), getRevenueTrend);

router.get(
  "/bookings-by-category",
  protect,
  authorizeRoles("admin"),
  getBookingsByCategory
);

router.get(
  "/booking-status",
  protect,
  authorizeRoles("admin"),
  getBookingStatus
);

router.get(
  "/service-performance",
  protect,
  authorizeRoles("admin"),
  getServicePerformance
);

router.get(
  "/worker-performance",
  protect,
  authorizeRoles("admin"),
  getWorkerPerformance
);

router.get(
  "/customer-growth",
  protect,
  authorizeRoles("admin"),
  getCustomerGrowth
);

router.get(
  "/monthly-summary",
  protect,
  authorizeRoles("admin"),
  getMonthlyReportSummary
);

router.get(
  "/customer-locations",
  protect,
  authorizeRoles("admin"),
  getCustomerLocations
);

export default router;
