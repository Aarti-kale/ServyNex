import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getWorkerDetails,
  getWorkers,
  getWorkerActivity,
  getWorkerStats,
  getWorkerReviews,
  blockWorker,
  unblockWorker,
  addWorker,
  toggleWorkerFeatured,
} from "../../controllers/admin/adminWorkerController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), addWorker);

router.put(
  "/:id/featured",
  protect,
  authorizeRoles("admin"),
  toggleWorkerFeatured
);

router.get("/stats", protect, authorizeRoles("admin"), getWorkerStats);

router.get("/", protect, authorizeRoles("admin"), getWorkers);

router.get("/:id/reviews", protect, authorizeRoles("admin"), getWorkerReviews);

router.get(
  "/:id/activity",
  protect,
  authorizeRoles("admin"),
  getWorkerActivity
);

router.put("/:id/block", protect, authorizeRoles("admin"), blockWorker);

router.put("/:id/unblock", protect, authorizeRoles("admin"), unblockWorker);

router.get("/:id", protect, authorizeRoles("admin"), getWorkerDetails);

export default router;
