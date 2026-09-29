import mongoose from "mongoose";

import Booking from "../../models/booking.js";
import User from "../../models/users.js";
import Review from "../../models/Review.js";
import Service from "../../models/service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("worker", "name email")
      .populate("service", "name");

    return successResponse(res, "User bookings fetched", {
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET USER BOOKINGS ERROR:", error);

    return errorResponse(
      res,
      error.message || "Unable to fetch user bookings",
      500
    );
  }
};

export const createBooking = async (req, res) => {
  try {
    const { service, address, date, paymentMethod } = req.body;

    if (!service || !address || !date || !paymentMethod) {
      return errorResponse(
        res,
        "Service, address, date and payment method are required",
        400
      );
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return errorResponse(res, "Invalid payment method", 400);
    }

    if (paymentMethod !== "cod") {
      return errorResponse(
        res,
        "Online payment must use the payment checkout flow",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(service)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const serviceData = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceData) {
      return errorResponse(res, "Service not available", 404);
    }

    const bookingDate = new Date(date);

    if (Number.isNaN(bookingDate.getTime())) {
      return errorResponse(res, "Invalid booking date", 400);
    }

    if (bookingDate <= new Date()) {
      return errorResponse(res, "Booking date must be in the future", 400);
    }
    const booking = await Booking.create({
      user: req.user._id,

      worker: null,

      service: serviceData._id,
      address: address.trim(),
      date: bookingDate,

      paymentMethod: "cod",
      paymentStatus: "pending",

      status: "pending",
    });

    const createdBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("worker", "name phone profileImage profession")
      .populate("service", "name price duration image");

    return successResponse(
      res,
      "Booking created successfully",
      createdBooking,
      201
    );
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    if (error.name === "ValidationError") {
      return errorResponse(res, error.message, 400);
    }

    if (error.name === "CastError") {
      return errorResponse(res, "Invalid booking data", 400);
    }

    return errorResponse(res, error.message || "Unable to create booking", 500);
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid booking ID", 400);
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("worker", "name phone profileImage profession rating")
      .populate("service", "name description price duration image");

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    return successResponse(res, "Booking fetched successfully", booking);
  } catch (error) {
    console.error("GET BOOKING ERROR:", error);

    return errorResponse(res, error.message || "Unable to fetch booking", 500);
  }
};
export const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      worker: req.user._id,
    })
      .populate("user", "name email")
      .populate("service", "name");

    return successResponse(res, "Worker bookings fetched", {
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET WORKER BOOKINGS ERROR:", error);

    return errorResponse(
      res,
      error.message || "Unable to fetch worker bookings",
      500
    );
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (!booking.worker) {
      return errorResponse(res, "No worker is assigned to this booking", 400);
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized for this booking", 403);
    }

    if (booking.status !== "pending") {
      return errorResponse(res, "Only pending bookings can be accepted", 400);
    }

    booking.status = "accepted";

    await booking.save();

    await User.findByIdAndUpdate(booking.worker, {
      availability: "busy",
    });

    return successResponse(res, "Booking accepted", booking);
  } catch (error) {
    console.error("ACCEPT BOOKING ERROR:", error);

    return errorResponse(res, error.message || "Unable to accept booking", 500);
  }
};

export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (!booking.worker) {
      return errorResponse(res, "No worker is assigned to this booking", 400);
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized for this booking", 403);
    }

    if (booking.status !== "accepted") {
      return errorResponse(res, "Only accepted bookings can be completed", 400);
    }

    booking.status = "completed";

    await booking.save();

    await User.findByIdAndUpdate(booking.worker, {
      availability: "available",
    });

    return successResponse(res, "Booking completed", booking);
  } catch (error) {
    console.error("COMPLETE BOOKING ERROR:", error);

    return errorResponse(
      res,
      error.message || "Unable to complete booking",
      500
    );
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized to cancel this booking", 403);
    }

    if (booking.status === "completed") {
      return errorResponse(res, "Completed booking cannot be cancelled", 400);
    }

    if (booking.status === "cancelled") {
      return errorResponse(res, "Booking already cancelled", 400);
    }

    booking.status = "cancelled";

    await booking.save();

    if (booking.worker) {
      await User.findByIdAndUpdate(booking.worker, {
        availability: "available",
      });
    }

    return successResponse(res, "Booking cancelled successfully", booking);
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);

    return errorResponse(res, error.message || "Unable to cancel booking", 500);
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (!booking.worker) {
      return errorResponse(res, "No worker is assigned to this booking", 400);
    }

    if (booking.worker.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized for this booking", 403);
    }

    if (booking.status !== "pending") {
      return errorResponse(res, "Only pending bookings can be rejected", 400);
    }

    booking.status = "rejected";

    await booking.save();

    await User.findByIdAndUpdate(booking.worker, {
      availability: "available",
    });

    return successResponse(res, "Booking rejected successfully", booking);
  } catch (error) {
    console.error("REJECT BOOKING ERROR:", error);

    return errorResponse(res, error.message || "Unable to reject booking", 500);
  }
};
export const addReview = async (req, res) => {
  try {
    const { rating, review, comment, images = [] } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return errorResponse(res, "Rating must be between 1 to 5", 400);
    }

    const reviewText = comment || review;

    if (!reviewText || !reviewText.trim()) {
      return errorResponse(res, "Review comment is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return errorResponse(res, "Invalid booking ID", 400);
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized", 403);
    }

    if (booking.status !== "completed") {
      return errorResponse(res, "Complete booking first", 400);
    }

    if (!booking.worker) {
      return errorResponse(res, "Worker is not assigned to this booking", 400);
    }

    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return errorResponse(res, "Already reviewed", 400);
    }

    const service = await Service.findById(booking.service);

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    const categoryId = booking.category || service.category;

    if (!categoryId) {
      return errorResponse(res, "Category not found for this service", 400);
    }

    const newReview = await Review.create({
      customer: booking.user,
      worker: booking.worker,
      booking: booking._id,
      service: booking.service,
      category: categoryId,

      rating: Number(rating),

      comment: reviewText.trim(),

      images: Array.isArray(images) ? images : [],

      status: "pending",
    });

    booking.rating = Number(rating);
    booking.review = reviewText.trim();

    await booking.save();

    const workerReviews = await Review.find({
      worker: booking.worker,
      status: "approved",
    }).select("rating");

    if (workerReviews.length > 0) {
      const total = workerReviews.reduce((sum, item) => sum + item.rating, 0);

      const average = total / workerReviews.length;

      await User.findByIdAndUpdate(booking.worker, {
        rating: Number(average.toFixed(1)),
      });
    }

    return successResponse(res, "Review added successfully", newReview);
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);

    if (error.code === 11000) {
      return errorResponse(res, "Already reviewed", 400);
    }

    if (error.name === "ValidationError") {
      return errorResponse(res, error.message, 400);
    }

    return errorResponse(res, error.message || "Unable to add review", 500);
  }
};
