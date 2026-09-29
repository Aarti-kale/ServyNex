import mongoose from "mongoose";
import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingAssignment = await Booking.countDocuments({
      status: "pending",
    });
    const assigned = await Booking.countDocuments({
      status: "accepted",
    });

    const inProgress = 0;

    const completed = await Booking.countDocuments({
      status: "completed",
    });

    const cancelled = await Booking.countDocuments({
      status: "cancelled",
    });

    return successResponse(res, "Booking statistics fetched successfully", {
      totalBookings,
      pendingAssignment,
      assigned,
      inProgress,
      completed,
      cancelled,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminBookings = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      service = "all",
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * perPage;

    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (service !== "all") {
      query.service = service;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        query.date.$lte = end;
      }
    }
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      const escapedSearch = trimmedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(escapedSearch, "i");

      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      }).select("_id");

      const userIds = users.map((user) => user._id);

      const searchConditions = [
        { user: { $in: userIds } },
        { worker: { $in: userIds } },
      ];

      if (mongoose.Types.ObjectId.isValid(trimmedSearch)) {
        searchConditions.push({
          _id: trimmedSearch,
        });
      }

      query.$or = searchConditions;
    }

    const totalBookings = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name")
      .sort({ date: -1 })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(totalBookings / perPage);

    return successResponse(res, "Admin bookings fetched successfully", {
      count: bookings.length,
      bookings,

      pagination: {
        currentPage,
        perPage,
        totalBookings,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search,
        status,
        service,
        startDate: startDate || null,
        endDate: endDate || null,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user", "name email phone address city state pincode isBlocked")
      .populate(
        "worker",
        "name email phone address city state pincode isBlocked isVerified"
      )
      .populate("service", "name description isActive");

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    return successResponse(
      res,
      "Booking details fetched successfully",
      booking
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const assignWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    if (!workerId) {
      return errorResponse(res, "Worker ID is required", 400);
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    if (worker.isBlocked) {
      return errorResponse(
        res,
        "This worker is blocked and cannot be assigned",
        400
      );
    }

    booking.worker = worker._id;

    booking.status = "accepted";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name description");

    return successResponse(res, "Worker assigned successfully", updatedBooking);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return errorResponse(res, "New booking date is required", 400);
    }

    const newDate = new Date(date);

    if (isNaN(newDate.getTime())) {
      return errorResponse(res, "Invalid booking date", 400);
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return errorResponse(
        res,
        `Booking cannot be rescheduled because it is ${booking.status}`,
        400
      );
    }

    booking.date = newDate;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name description");

    return successResponse(
      res,
      "Booking rescheduled successfully",
      updatedBooking
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const cancelAdminBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.status === "completed") {
      return errorResponse(res, "Completed booking cannot be cancelled", 400);
    }

    if (booking.status === "cancelled") {
      return errorResponse(res, "Booking is already cancelled", 400);
    }

    booking.status = "cancelled";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name description");

    return successResponse(
      res,
      "Booking cancelled successfully",
      updatedBooking
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const completeAdminBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.status === "completed") {
      return errorResponse(res, "Booking is already completed", 400);
    }

    if (booking.status === "cancelled") {
      return errorResponse(
        res,
        "Cancelled booking cannot be marked as completed",
        400
      );
    }

    if (!booking.worker) {
      return errorResponse(
        res,
        "Cannot complete booking without an assigned worker",
        400
      );
    }

    booking.status = "completed";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name description");

    return successResponse(
      res,
      "Booking marked as completed successfully",
      updatedBooking
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
