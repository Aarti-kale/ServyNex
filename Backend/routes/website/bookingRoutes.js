import express from "express";

import { protect, authorizeRoles } from "../../middleware/authMiddleware.js";

import {
  getUserBookings,
  getWorkerBookings,
  createBooking,
  getBookingById,
  acceptBooking,
  completeBooking,
  cancelBooking,
  rejectBooking,
  addReview,
} from "../../controllers/website/bookingController.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../controllers/website/paymentController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), createBooking);

router.post(
  "/payment/create",
  protect,
  authorizeRoles("user"),
  createPaymentOrder
);

router.post("/payment/verify", protect, authorizeRoles("user"), verifyPayment);

router.get("/user", protect, authorizeRoles("user"), getUserBookings);

router.post("/my/review/:id", protect, authorizeRoles("user"), addReview);

router.get("/my/:id", protect, authorizeRoles("user"), getBookingById);

router.put("/my/cancel/:id", protect, authorizeRoles("user"), cancelBooking);

router.get("/worker", protect, authorizeRoles("worker"), getWorkerBookings);

router.put("/accept/:id", protect, authorizeRoles("worker"), acceptBooking);

router.put("/complete/:id", protect, authorizeRoles("worker"), completeBooking);

router.put("/reject/:id", protect, authorizeRoles("worker"), rejectBooking);

export default router;
