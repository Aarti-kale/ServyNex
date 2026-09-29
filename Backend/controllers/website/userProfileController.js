import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Review from "../../models/Review.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    }).select(
      "name email phone profileImage address dateOfBirth gender role createdAt isActive isBlocked"
    );

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (user.isBlocked) {
      return errorResponse(res, "Your account has been blocked", 403);
    }

    if (!user.isActive) {
      return errorResponse(res, "Your account is inactive", 403);
    }

    return successResponse(res, "User profile fetched successfully", user);
  } catch (error) {
    console.error("getUserProfile error:", error);

    return errorResponse(res, "Unable to fetch user profile", 500);
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 5 } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 20);
    const skip = (currentPage - 1) * perPage;

    const now = new Date();

    const query = {
      user: req.user._id,
    };

    if (status === "upcoming") {
      query.status = {
        $in: ["pending", "accepted"],
      };
      query.date = {
        $gte: now,
      };
    }

    if (status === "completed") {
      query.status = "completed";
    }

    if (status === "cancelled") {
      query.status = {
        $in: ["cancelled", "rejected"],
      };
    }

    const allowedStatuses = ["all", "upcoming", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, "Invalid booking status", 400);
    }

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(query)
        .populate("service", "name image price")
        .populate("worker", "name profileImage phone")
        .sort({ date: 1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Booking.countDocuments(query),
    ]);

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,

      service: {
        _id: booking.service?._id || null,
        name: booking.service?.name || "Service",
        image: booking.service?.image || "",
        price: booking.service?.price ?? null,
      },

      worker: booking.worker
        ? {
            _id: booking.worker._id,
            name: booking.worker.name || "",
            profileImage: booking.worker.profileImage || "",
            phone: booking.worker.phone || "",
          }
        : null,

      address: booking.address || "",

      date: booking.date,

      paymentMethod: booking.paymentMethod,

      paymentStatus: booking.paymentStatus,

      status: booking.status,

      rating: booking.rating ?? null,

      review: booking.review || "",

      createdAt: booking.createdAt,
    }));

    const [upcomingCount, completedCount, cancelledCount] = await Promise.all([
      Booking.countDocuments({
        user: req.user._id,
        status: {
          $in: ["pending", "accepted"],
        },
        date: {
          $gte: now,
        },
      }),

      Booking.countDocuments({
        user: req.user._id,
        status: "completed",
      }),

      Booking.countDocuments({
        user: req.user._id,
        status: {
          $in: ["cancelled", "rejected"],
        },
      }),
    ]);

    const totalPages = Math.ceil(totalBookings / perPage);

    return successResponse(res, "User bookings fetched successfully", {
      bookings: formattedBookings,

      counts: {
        upcoming: upcomingCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },

      pagination: {
        currentPage,
        perPage,
        totalBookings,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filter: {
        status,
      },
    });
  } catch (error) {
    console.error("getUserBookings error:", error);

    return errorResponse(res, "Unable to fetch user bookings", 500);
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    }).select("addresses");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(
      res,
      "User addresses fetched successfully",
      user.addresses || []
    );
  } catch (error) {
    console.error("getUserAddresses error:", error);

    return errorResponse(res, "Unable to fetch addresses", 500);
  }
};

export const addUserAddress = async (req, res) => {
  try {
    const {
      label,
      address,
      city,
      state,
      pincode,
      isDefault = false,
    } = req.body;

    if (!label?.trim()) {
      return errorResponse(res, "Address label is required", 400);
    }

    if (!address?.trim()) {
      return errorResponse(res, "Address is required", 400);
    }

    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const shouldBeDefault = user.addresses.length === 0 || isDefault === true;

    if (shouldBeDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({
      label: label.trim(),
      address: address.trim(),
      city: city?.trim() || "",
      state: state?.trim() || "",
      pincode: pincode?.trim() || "",
      isDefault: shouldBeDefault,
    });

    await user.save();

    return successResponse(res, "Address added successfully", user.addresses);
  } catch (error) {
    console.error("addUserAddress error:", error);

    return errorResponse(res, "Unable to add address", 500);
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const { label, address, city, state, pincode, isDefault } = req.body;

    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const savedAddress = user.addresses.id(id);

    if (!savedAddress) {
      return errorResponse(res, "Address not found", 404);
    }

    if (label !== undefined) {
      if (!label.trim()) {
        return errorResponse(res, "Address label is required", 400);
      }

      savedAddress.label = label.trim();
    }

    if (address !== undefined) {
      if (!address.trim()) {
        return errorResponse(res, "Address is required", 400);
      }

      savedAddress.address = address.trim();
    }

    if (city !== undefined) {
      savedAddress.city = city.trim();
    }

    if (state !== undefined) {
      savedAddress.state = state.trim();
    }

    if (pincode !== undefined) {
      savedAddress.pincode = pincode.trim();
    }

    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = item._id.equals(savedAddress._id) ? true : false;
      });
    }

    await user.save();

    return successResponse(res, "Address updated successfully", user.addresses);
  } catch (error) {
    console.error("updateUserAddress error:", error);

    return errorResponse(res, "Unable to update address", 500);
  }
};

export const deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const savedAddress = user.addresses.id(id);

    if (!savedAddress) {
      return errorResponse(res, "Address not found", 404);
    }

    const wasDefault = savedAddress.isDefault;

    savedAddress.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return successResponse(res, "Address deleted successfully", user.addresses);
  } catch (error) {
    console.error("deleteUserAddress error:", error);

    return errorResponse(res, "Unable to delete address", 500);
  }
};

export const setDefaultUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: req.user._id,
      role: "user",
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const selectedAddress = user.addresses.id(id);

    if (!selectedAddress) {
      return errorResponse(res, "Address not found", 404);
    }

    user.addresses.forEach((item) => {
      item.isDefault = item._id.equals(selectedAddress._id);
    });

    await user.save();

    return successResponse(
      res,
      "Default address updated successfully",
      user.addresses
    );
  } catch (error) {
    console.error("setDefaultUserAddress error:", error);

    return errorResponse(res, "Unable to set default address", 500);
  }
};
