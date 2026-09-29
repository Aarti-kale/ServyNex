import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Review from "../../models/Review.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select("-password");

    return successResponse(res, "Workers fetched", {
      count: workers.length,
      workers,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select("-password");

    if (!worker || worker.role !== "worker") {
      return errorResponse(res, "Worker not found", 404);
    }

    return successResponse(res, "Worker fetched", worker);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.user._id,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    const {
      name,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      pincode,
      profession,
      skills,
      experience,
      languages,
      serviceAreas,
      profileImage,
    } = req.body;

    if (name !== undefined) {
      worker.name = name.trim();
    }

    if (phone !== undefined) {
      worker.phone = phone.trim();
    }

    if (dateOfBirth !== undefined) {
      worker.dateOfBirth = dateOfBirth;
    }

    if (gender !== undefined) {
      worker.gender = gender;
    }

    if (address !== undefined) {
      worker.address = address.trim();
    }

    if (city !== undefined) {
      worker.city = city.trim();
    }

    if (state !== undefined) {
      worker.state = state.trim();
    }

    if (pincode !== undefined) {
      worker.pincode = pincode.trim();
    }

    if (profession !== undefined) {
      worker.profession = profession.trim();
    }

    if (skills !== undefined) {
      worker.skills = skills;
    }

    if (experience !== undefined) {
      worker.experience = Number(experience);
    }

    if (languages !== undefined) {
      worker.languages = languages;
    }

    if (serviceAreas !== undefined) {
      worker.serviceAreas = serviceAreas;
    }

    if (profileImage !== undefined) {
      worker.profileImage = profileImage;
    }

    await worker.save();

    const updatedWorker = await User.findById(worker._id).select("-password");

    return successResponse(
      res,
      "Worker profile updated successfully",
      updatedWorker
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const worker = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    ).select("-password");

    return successResponse(res, "Availability updated", worker);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const verifyWorker = async (req, res) => {
  try {
    const worker = await User.findOne({ _id: req.params.id, role: "worker" });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    if (worker.isVerified) {
      return errorResponse(res, "Worker already verified", 400);
    }

    worker.isVerified = true;
    await worker.save();

    return successResponse(res, "Worker verified successfully", worker);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const assignServicesToWorker = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id);

    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ message: "Not a worker" });
    }

    worker.services = req.body.services;

    await worker.save();

    res.json({
      message: "Services assigned",
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkerProfile = async (req, res) => {
  try {
    const workerId = req.params.id;

    const worker = await User.findOne({
      _id: workerId,
      role: "worker",
    }).select("-password");

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    const reviews = await Review.find({
      worker: workerId,
      status: "approved",
    })
      .populate("customer", "name profileImage")
      .populate("service", "name")
      .sort({
        createdAt: -1,
      })
      .lean();

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    return successResponse(res, "Worker profile fetched successfully", {
      worker,

      profile: {
        workerId: worker._id,
        memberSince: worker.createdAt,

        name: worker.name || "",
        profileImage: worker.profileImage || "",

        profession: worker.profession || "",

        phone: worker.phone || "",

        email: worker.email || "",

        dateOfBirth: worker.dateOfBirth || null,

        gender: worker.gender || "",

        address: worker.address || "",

        city: worker.city || "",

        state: worker.state || "",

        pincode: worker.pincode || "",

        skills: worker.skills || [],

        experience: worker.experience || 0,

        languages: worker.languages || [],

        serviceAreas: worker.serviceAreas || [],

        isVerified: worker.isVerified || false,

        accountStatus: worker.isBlocked ? "blocked" : "active",

        overallRating: averageRating,

        totalReviews,
      },

      reviews,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkerDashboard = async (req, res) => {
  try {
    const worker = await User.findById(req.user._id).select("-password");

    if (!worker || worker.role !== "worker") {
      return errorResponse(res, "Worker not found", 404);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayJobs = await Booking.countDocuments({
      worker: worker._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const upcomingTodayJobs = await Booking.countDocuments({
      worker: worker._id,
      date: {
        $gte: new Date(),
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "accepted"],
      },
    });

    const pendingJobs = await Booking.countDocuments({
      worker: worker._id,
      status: "pending",
    });

    const completedJobs = await Booking.countDocuments({
      worker: worker._id,
      status: "completed",
    });

    return successResponse(res, "Worker dashboard fetched successfully", {
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        role: worker.role,
        skills: worker.skills,
        experience: worker.experience,
        rating: worker.rating,
        availability: worker.availability,
        isVerified: worker.isVerified,
        createdAt: worker.createdAt,
      },

      overview: {
        todayJobs,
        upcomingTodayJobs,
        pendingJobs,
        completedJobs,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getTodayJobs = async (req, res) => {
  try {
    const workerId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const jobs = await Booking.find({
      worker: workerId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: {
        $in: ["pending", "accepted", "completed"],
      },
    })
      .populate("user", "name email phone")
      .populate("service", "name")
      .sort({ date: 1 });

    return successResponse(res, "Today's jobs fetched successfully", {
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getUpcomingSchedule = async (req, res) => {
  try {
    const workerId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      worker: workerId,
      date: { $gte: today },
      status: { $in: ["pending", "accepted"] },
    })
      .populate("user", "name")
      .populate("service", "name")
      .sort({ date: 1 })
      .limit(3);

    const schedule = bookings.map((booking) => ({
      _id: booking._id,
      date: booking.date,
      title: booking.service?.name || "Service",
      customer: booking.user?.name || "Customer",
      location: booking.address,
      status: booking.status === "accepted" ? "Upcoming" : "Pending",
    }));

    return successResponse(
      res,
      "Upcoming schedule fetched successfully",
      schedule
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Booking.find({
      worker: req.user._id,
    })
      .populate("user", "name email phone")
      .populate("service", "name price")
      .sort({ date: 1 });

    const formattedJobs = jobs.map((job) => ({
      id: job._id,

      title: job.service?.name,

      customer: {
        name: job.user?.name,
        phone: job.user?.phone,
        initial: job.user?.name?.charAt(0),
        address: job.address,
      },

      info: {
        serviceType: job.service?.name,
        problem: job.problem || "-",
        preferredTime: job.date,
        paymentMethod: job.paymentMethod || "-",
        estimatedAmount: `₹${job.service?.price || 0}`,
      },

      bookedOn: job.createdAt,

      status: job.status,

      date: job.date,
    }));

    return successResponse(res, "Worker jobs fetched successfully", {
      count: formattedJobs.length,
      jobs: formattedJobs,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
