import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getPaymentStats,
  getPayments,
  getPaymentDetails,
  getPaymentMethodBreakdown,
  getRevenueOverview,
  getRefundRequests,
  approveRefund,
  rejectRefund,
  completeRefund,
  getMonthlyRevenueSummary,
} from "../../controllers/admin/adminPaymentController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getPaymentStats);

router.get(
  "/methods",
  protect,
  authorizeRoles("admin"),
  getPaymentMethodBreakdown
);

router.get("/revenue", protect, authorizeRoles("admin"), getRevenueOverview);

router.get("/refunds", protect, authorizeRoles("admin"), getRefundRequests);

router.put(
  "/refunds/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveRefund
);

router.put(
  "/refunds/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectRefund
);

router.put(
  "/refunds/:id/complete",
  protect,
  authorizeRoles("admin"),
  completeRefund
);

router.get(
  "/monthly-summary",
  protect,
  authorizeRoles("admin"),
  getMonthlyRevenueSummary
);

router.get("/", protect, authorizeRoles("admin"), getPayments);

router.get("/:id", protect, authorizeRoles("admin"), getPaymentDetails);

export default router;
