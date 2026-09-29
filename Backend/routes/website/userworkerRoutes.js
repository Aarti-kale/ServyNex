import express from "express";
import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";
import {
  updateWorkerProfile,
  assignServicesToWorker,
  updateAvailability,
  verifyWorker,
  getWorkerProfile,
  getWorkerDashboard,
  getTodayJobs,
  getUpcomingSchedule,
  getMyJobs,
} from "../../controllers/worker/workerController.js";
import {
  getWorkerSalary,
  getWorkerSalaryDetails,
  getWorkerBankDetails,
  updateWorkerBankDetails,
} from "../../controllers/worker/workerSalaryController.js";

import {
  getWorkerReviews,
  replyToWorkerReview,
} from "../../controllers/worker/workerReviewController.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("worker"), getWorkerDashboard);

router.get("/today-jobs", protect, authorizeRoles("worker"), getTodayJobs);
router.get(
  "/upcoming-schedule",
  protect,
  authorizeRoles("worker"),
  getUpcomingSchedule
);

router.get("/my-jobs", protect, authorizeRoles("worker"), getMyJobs);

router.put(
  "/availability",
  protect,
  authorizeRoles("worker"),
  updateAvailability
);

router.put(
  "/services",
  protect,
  authorizeRoles("worker"),
  assignServicesToWorker
);

router.get("/profile/:id", getWorkerProfile);

router.put("/profile", protect, authorizeRoles("worker"), updateWorkerProfile);

router.get("/salary", protect, authorizeRoles("worker"), getWorkerSalary);

router.get(
  "/salary/bank-details",
  protect,
  authorizeRoles("worker"),
  getWorkerBankDetails
);

router.put(
  "/salary/bank-details",
  protect,
  authorizeRoles("worker"),
  updateWorkerBankDetails
);

router.get("/reviews", protect, authorizeRoles("worker"), getWorkerReviews);

router.put(
  "/reviews/:id/reply",
  protect,
  authorizeRoles("worker"),
  replyToWorkerReview
);

router.get(
  "/salary/:id",
  protect,
  authorizeRoles("worker"),
  getWorkerSalaryDetails
);

router.put("/verify/:id", protect, authorizeRoles("admin"), verifyWorker);

export default router;
