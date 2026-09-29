import jwt from "jsonwebtoken";
import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Service from "../../models/service.js";
import WebsiteStatus from "../../models/WebsiteStatus.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please enter email and password", 400);
    }

    const admin = await User.findOne({ email }).select("+password");

    if (!admin) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    if (admin.role !== "admin") {
      return errorResponse(res, "Access denied. Admin only.", 403);
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return successResponse(res, "Admin Login Successful", {
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "All fields required", 400);
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return errorResponse(res, "User already exists", 400);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    return successResponse(res, "Admin created successfully", admin, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalWorkers = await User.countDocuments({ role: "worker" });

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const verifiedWorkers = await User.countDocuments({
      role: "worker",
      isVerified: true,
    });

    const unverifiedWorkers = await User.countDocuments({
      role: "worker",
      isVerified: false,
    });

    return successResponse(res, "Dashboard data fetched", {
      users: totalUsers,
      workers: totalWorkers,
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        completed: completedBookings,
      },
      workersVerification: {
        verified: verifiedWorkers,
        unverified: unverifiedWorkers,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalWorkers,
      totalServices,
      todayBookings,
      pendingApprovals,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
      }),

      User.countDocuments({
        role: "worker",
      }),

      Service.countDocuments(),

      Booking.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),

      User.countDocuments({
        role: "worker",
        isVerified: false,
      }),
    ]);

    const header = {
      totalCustomers,
      totalWorkers,
      totalServices,
      todayBookings,
      pendingApprovals,
      monthlyRevenue: 0,
    };

    const recentBookings = await Booking.find()
      .populate("user", "name")
      .populate("worker", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, "Admin Dashboard", {
      header,
      recentBookings,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPendingWorkerApprovals = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
      isVerified: false,
      isBlocked: false,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      "Pending worker approvals fetched successfully",
      {
        count: workers.length,
        workers,
      }
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const approveWorker = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    if (worker.isVerified) {
      return errorResponse(res, "Worker is already verified", 400);
    }

    worker.isVerified = true;

    await worker.save();

    return successResponse(res, "Worker approved successfully", {
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        role: worker.role,
        isVerified: worker.isVerified,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const rejectWorker = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    worker.isBlocked = true;
    worker.isActive = false;

    await worker.save();

    return successResponse(res, "Worker rejected successfully", {
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        role: worker.role,
        isVerified: worker.isVerified,
        isBlocked: worker.isBlocked,
        isActive: worker.isActive,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("worker", "name email phone")
      .populate("service", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    return successResponse(res, "Recent bookings fetched successfully", {
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRevenueOverview = async (req, res) => {
  try {
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const currentMonthBookings = await Booking.countDocuments({
      status: "completed",
      createdAt: {
        $gte: currentMonthStart,
        $lt: nextMonthStart,
      },
    });

    const previousMonthBookings = await Booking.countDocuments({
      status: "completed",
      createdAt: {
        $gte: previousMonthStart,
        $lt: currentMonthStart,
      },
    });

    const totalCompletedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const currentRevenue = 0;
    const previousRevenue = 0;

    let growthPercentage = 0;

    if (previousRevenue > 0) {
      growthPercentage =
        ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    }

    return successResponse(res, "Revenue overview fetched successfully", {
      currentMonth: {
        completedBookings: currentMonthBookings,
        revenue: currentRevenue,
      },

      previousMonth: {
        completedBookings: previousMonthBookings,
        revenue: previousRevenue,
      },

      totalCompletedBookings,

      growthPercentage: Number(growthPercentage.toFixed(2)),
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWebsiteStatus = async (req, res) => {
  try {
    let websiteStatus = await WebsiteStatus.findOne();

    if (!websiteStatus) {
      websiteStatus = await WebsiteStatus.create({
        status: "online",
        message: "Website is currently running normally.",
        updatedBy: req.user._id,
      });
    }

    return successResponse(
      res,
      "Website status fetched successfully",
      websiteStatus
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateWebsiteStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!status) {
      return errorResponse(res, "Website status is required", 400);
    }

    if (!["online", "maintenance"].includes(status)) {
      return errorResponse(res, "Invalid website status", 400);
    }

    let websiteStatus = await WebsiteStatus.findOne();

    if (!websiteStatus) {
      websiteStatus = new WebsiteStatus();
    }

    websiteStatus.status = status;

    if (message !== undefined) {
      websiteStatus.message = message;
    }

    websiteStatus.updatedBy = req.user._id;

    await websiteStatus.save();

    return successResponse(
      res,
      "Website status updated successfully",
      websiteStatus
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecentReviews = async (req, res) => {
  try {
    const reviews = await Booking.find({
      rating: { $exists: true, $ne: null },
      review: { $exists: true, $ne: "" },
    })
      .populate("user", "name")
      .populate("worker", "name")
      .populate("service", "name")
      .sort({ updatedAt: -1 })
      .limit(5);

    return successResponse(res, "Recent reviews fetched successfully", {
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.isBlocked = true;
    await user.save();

    return successResponse(res, "User blocked successfully", user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.isBlocked = false;
    await user.save();

    return successResponse(res, "User unblocked successfully", user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
