import mongoose from "mongoose";
import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Service from "../../models/service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const addWorker = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      username,
      employeeId,
      dateOfBirth,
      gender,

      profileImage,
      address,
      location,

      skills,
      services,
      experience,
      availability,

      isVerified,
      isActive,
      isAvailable,
      isFeatured,

      bankDetails,
    } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedName.length < 2) {
      return errorResponse(res, "Name must contain at least 2 characters", 400);
    }

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    }).select("_id");

    if (existingEmail) {
      return errorResponse(res, "A user with this email already exists", 409);
    }

    const normalizedUsername =
      username !== undefined && username !== null
        ? String(username).trim()
        : "";

    if (normalizedUsername) {
      const existingUsername = await User.findOne({
        username: normalizedUsername,
      }).select("_id");

      if (existingUsername) {
        return errorResponse(res, "Username already exists", 409);
      }
    }

    const normalizedEmployeeId =
      employeeId !== undefined && employeeId !== null
        ? String(employeeId).trim()
        : "";

    if (normalizedEmployeeId) {
      const existingEmployeeId = await User.findOne({
        employeeId: normalizedEmployeeId,
      }).select("_id");

      if (existingEmployeeId) {
        return errorResponse(res, "Employee ID already exists", 409);
      }
    }

    let validServices = [];

    if (services !== undefined) {
      if (!Array.isArray(services)) {
        return errorResponse(res, "Services must be an array", 400);
      }

      const invalidServiceId = services.find(
        (serviceId) => !mongoose.Types.ObjectId.isValid(serviceId)
      );

      if (invalidServiceId) {
        return errorResponse(
          res,
          `Invalid service ID: ${invalidServiceId}`,
          400
        );
      }

      const existingServices = await Service.find({
        _id: { $in: services },
      }).select("_id");

      if (existingServices.length !== services.length) {
        return errorResponse(
          res,
          "One or more selected services were not found",
          400
        );
      }

      validServices = existingServices.map((service) => service._id);
    }

    const validSkills = Array.isArray(skills)
      ? [
          ...new Set(
            skills.map((skill) => String(skill).trim()).filter(Boolean)
          ),
        ]
      : [];

    const workerExperience =
      experience === undefined || experience === null || experience === ""
        ? 0
        : Number(experience);

    if (!Number.isFinite(workerExperience) || workerExperience < 0) {
      return errorResponse(
        res,
        "Experience must be a valid non-negative number",
        400
      );
    }

    const allowedAvailability = ["available", "busy", "offline"];

    const workerAvailability = availability || "available";

    if (!allowedAvailability.includes(workerAvailability)) {
      return errorResponse(res, "Invalid availability value", 400);
    }

    const allowedGender = ["male", "female", "other"];

    if (
      gender !== undefined &&
      gender !== null &&
      gender !== "" &&
      !allowedGender.includes(gender)
    ) {
      return errorResponse(res, "Invalid gender value", 400);
    }

    const worker = new User({
      name: normalizedName,
      email: normalizedEmail,
      password,

      phone: phone !== undefined && phone !== null ? String(phone).trim() : "",

      role: "worker",

      services: validServices,
      skills: validSkills,

      experience: workerExperience,

      rating: 0,

      isBlocked: false,

      isActive: typeof isActive === "boolean" ? isActive : true,

      isVerified: typeof isVerified === "boolean" ? isVerified : false,

      isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,

      availability: workerAvailability,

      location:
        location !== undefined && location !== null
          ? String(location).trim()
          : "",

      isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,

      username: normalizedUsername || undefined,

      employeeId: normalizedEmployeeId || undefined,

      dateOfBirth: dateOfBirth || null,

      gender: gender || null,

      address:
        address !== undefined && address !== null ? String(address).trim() : "",

      profileImage:
        profileImage !== undefined && profileImage !== null
          ? String(profileImage).trim()
          : "",

      lastLoginAt: null,
      lastLoginIp: "",

      bankDetails: {
        bankName: bankDetails?.bankName?.trim() || "",

        accountNumber: bankDetails?.accountNumber?.trim() || "",

        ifscCode: bankDetails?.ifscCode?.trim() || "",

        branch: bankDetails?.branch?.trim() || "",

        addresses: Array.isArray(bankDetails?.addresses)
          ? bankDetails.addresses
          : [],
      },
    });

    await worker.save();

    const workerResponse = worker.toObject();

    delete workerResponse.password;

    return successResponse(
      res,
      "Worker added successfully",
      workerResponse,
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return errorResponse(
        res,
        `${duplicateField || "Field"} already exists`,
        409
      );
    }

    console.error("Admin addWorker error:", error);

    return errorResponse(res, error.message || "Failed to add worker", 500);
  }
};

export const getWorkerStats = async (req, res) => {
  try {
    const [
      totalWorkers,
      activeWorkers,
      blockedWorkers,
      verifiedWorkers,
      unverifiedWorkers,
      featuredWorkers,
    ] = await Promise.all([
      User.countDocuments({
        role: "worker",
      }),

      User.countDocuments({
        role: "worker",
        isBlocked: { $ne: true },
      }),

      User.countDocuments({
        role: "worker",
        isBlocked: true,
      }),

      User.countDocuments({
        role: "worker",
        isVerified: true,
      }),

      User.countDocuments({
        role: "worker",
        isVerified: { $ne: true },
      }),

      User.countDocuments({
        role: "worker",
        isFeatured: true,
      }),
    ]);

    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await User.countDocuments({
      role: "worker",
      createdAt: {
        $gte: startOfMonth,
      },
    });

    return successResponse(res, "Worker statistics fetched successfully", {
      totalWorkers,
      activeWorkers,
      blockedWorkers,
      verifiedWorkers,
      unverifiedWorkers,
      featuredWorkers,
      newThisMonth,
    });
  } catch (error) {
    console.error("Admin getWorkerStats error:", error);

    return errorResponse(
      res,
      error.message || "Failed to fetch worker statistics",
      500
    );
  }
};

export const getWorkers = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      verification = "all",
      featured = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const requestedPage = Number(page);
    const requestedLimit = Number(limit);

    const currentPage =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const perPage =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 100)
        : 10;

    const skip = (currentPage - 1) * perPage;

    const query = {
      role: "worker",
    };

    const normalizedSearch = String(search).trim();

    if (normalizedSearch) {
      const escapedSearch = normalizedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(escapedSearch, "i");

      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (status === "active") {
      query.isBlocked = { $ne: true };
    }

    if (status === "blocked") {
      query.isBlocked = true;
    }

    if (verification === "verified") {
      query.isVerified = true;
    }

    if (verification === "unverified") {
      query.isVerified = { $ne: true };
    }

    if (featured === "featured") {
      query.isFeatured = true;
    }

    if (featured === "not-featured") {
      query.isFeatured = { $ne: true };
    }

    const [totalWorkers, workers] = await Promise.all([
      User.countDocuments(query),

      User.find(query)
        .select("-password")
        .populate("services", "name")
        .sort({
          isFeatured: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalWorkers / perPage);

    return successResponse(res, "Workers fetched successfully", {
      count: workers.length,
      workers,

      pagination: {
        currentPage,
        perPage,
        totalWorkers,
        totalPages,

        hasNextPage: currentPage < totalPages,

        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search: normalizedSearch,
        status,
        verification,
        featured,
      },
    });
  } catch (error) {
    console.error("Admin getWorkers error:", error);

    return errorResponse(res, error.message || "Failed to fetch workers", 500);
  }
};

export const getWorkerDetails = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    })
      .select("-password")
      .populate("services", "name")
      .lean();

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    const [
      totalBookings,
      pendingBookings,
      acceptedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      Booking.countDocuments({
        worker: workerId,
      }),

      Booking.countDocuments({
        worker: workerId,
        status: "pending",
      }),

      Booking.countDocuments({
        worker: workerId,
        status: "accepted",
      }),

      Booking.countDocuments({
        worker: workerId,
        status: "completed",
      }),

      Booking.countDocuments({
        worker: workerId,
        status: "cancelled",
      }),
    ]);

    const recentBookings = await Booking.find({
      worker: workerId,
    })
      .populate("user", "name email phone")
      .populate("service", "name")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    const ratingData = await Booking.aggregate([
      {
        $match: {
          worker: worker._id,
          rating: {
            $exists: true,
            $ne: null,
          },
        },
      },

      {
        $group: {
          _id: null,

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      ratingData.length > 0
        ? Number(ratingData[0].averageRating.toFixed(1))
        : 0;

    const totalReviews = ratingData.length > 0 ? ratingData[0].totalReviews : 0;

    return successResponse(res, "Worker details fetched successfully", {
      worker,

      statistics: {
        totalBookings,
        pendingBookings,
        acceptedBookings,
        completedBookings,
        cancelledBookings,
        averageRating,
        totalReviews,
      },

      recentBookings,
    });
  } catch (error) {
    console.error("Admin getWorkerDetails error:", error);

    return errorResponse(
      res,
      error.message || "Failed to fetch worker details",
      500
    );
  }
};

export const getWorkerReviews = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    }).select("name email");

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    const reviews = await Booking.find({
      worker: workerId,

      rating: {
        $exists: true,
        $ne: null,
      },

      review: {
        $exists: true,
        $ne: "",
      },
    })
      .populate("user", "name email")
      .populate("service", "name")
      .select("rating review user service date createdAt")
      .sort({
        createdAt: -1,
      })
      .lean();

    return successResponse(res, "Worker reviews fetched successfully", {
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
      },

      count: reviews.length,

      reviews,
    });
  } catch (error) {
    console.error("Admin getWorkerReviews error:", error);

    return errorResponse(
      res,
      error.message || "Failed to fetch worker reviews",
      500
    );
  }
};

export const getWorkerActivity = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    }).select("name email");

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    const activities = await Booking.find({
      worker: workerId,
    })
      .populate("user", "name email phone")
      .populate("service", "name")
      .select("user service date status rating review createdAt updatedAt")
      .sort({
        createdAt: -1,
      })
      .lean();

    return successResponse(res, "Worker activity fetched successfully", {
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
      },

      count: activities.length,

      activities,
    });
  } catch (error) {
    console.error("Admin getWorkerActivity error:", error);

    return errorResponse(
      res,
      error.message || "Failed to fetch worker activity",
      500
    );
  }
};

export const toggleWorkerFeatured = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    }).select("name isFeatured isVerified isActive isBlocked");

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    if (!worker.isActive || worker.isBlocked || !worker.isVerified) {
      return errorResponse(
        res,
        "Only active, verified and unblocked workers can be featured",
        400
      );
    }

    worker.isFeatured = !worker.isFeatured;

    await worker.save();

    return successResponse(
      res,
      worker.isFeatured
        ? "Worker featured successfully"
        : "Worker removed from featured",
      {
        _id: worker._id,
        name: worker.name,
        isFeatured: worker.isFeatured,
      }
    );
  } catch (error) {
    console.error("Admin toggleWorkerFeatured error:", error);

    return errorResponse(
      res,
      error.message || "Failed to update featured status",
      500
    );
  }
};

export const blockWorker = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    worker.isBlocked = true;
    worker.isFeatured = false;

    await worker.save();

    return successResponse(res, "Worker blocked successfully", {
      _id: worker._id,
      name: worker.name,
      isBlocked: worker.isBlocked,
      isFeatured: worker.isFeatured,
    });
  } catch (error) {
    console.error("Admin blockWorker error:", error);

    return errorResponse(res, error.message || "Failed to block worker", 500);
  }
};

export const unblockWorker = async (req, res) => {
  try {
    const workerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return errorResponse(res, "Invalid worker ID", 400);
    }

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    worker.isBlocked = false;

    await worker.save();

    return successResponse(res, "Worker unblocked successfully", {
      _id: worker._id,
      name: worker.name,
      isBlocked: worker.isBlocked,
      isFeatured: worker.isFeatured,
    });
  } catch (error) {
    console.error("Admin unblockWorker error:", error);

    return errorResponse(res, error.message || "Failed to unblock worker", 500);
  }
};
