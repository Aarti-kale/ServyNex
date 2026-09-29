import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getReviewStats,
  getAdminReviews,
  getAdminReviewDetails,
  approveReview,
  hideReview,
  unhideReview,
  reportReview,
  deleteReview,
  replyToReview,
  getReviewAnalytics,
} from "../../controllers/admin/adminReviewController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("admin"), getReviewStats);

router.get("/analytics", protect, authorizeRoles("admin"), getReviewAnalytics);

router.get("/", protect, authorizeRoles("admin"), getAdminReviews);

router.put("/:id/approve", protect, authorizeRoles("admin"), approveReview);

router.put("/:id/hide", protect, authorizeRoles("admin"), hideReview);

router.put("/:id/unhide", protect, authorizeRoles("admin"), unhideReview);

router.put("/:id/report", protect, authorizeRoles("admin"), reportReview);

router.put("/:id/reply", protect, authorizeRoles("admin"), replyToReview);

router.delete("/:id", protect, authorizeRoles("admin"), deleteReview);

router.get("/:id", protect, authorizeRoles("admin"), getAdminReviewDetails);

export default router;
