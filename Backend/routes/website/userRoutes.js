import express from "express";

import { protect } from "../../middleware/authMiddleware.js";
import {
  getUserProfile,
  getUserBookings,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../../controllers/website/userProfileController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);

router.get("/bookings", protect, getUserBookings);

router.get("/addresses", protect, getUserAddresses);

router.post("/addresses", protect, addUserAddress);

router.put("/addresses/:id", protect, updateUserAddress);

router.delete("/addresses/:id", protect, deleteUserAddress);

router.put("/addresses/:id/default", protect, setDefaultUserAddress);

export default router;
