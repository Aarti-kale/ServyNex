import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import AdminActivityLog from "../../models/AdminActivityLog.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    }).select("-password");

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    const customersManaged = await User.countDocuments({
      role: "user",
    });

    const workersApproved = await User.countDocuments({
      role: "worker",
      isVerified: true,
    });

    const bookingsManaged = await Booking.countDocuments();

    const recentActivity = await AdminActivityLog.find({
      admin: admin._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return successResponse(res, "Admin profile fetched successfully", {
      profile: admin,

      activitySummary: {
        customersManaged,
        workersApproved,
        bookingsManaged,
        websiteUpdates: 0,
      },

      security: {
        passwordConfigured: true,
        twoFactorAuthentication: false,
      },

      recentActivity,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    });

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    const {
      name,
      phone,
      username,
      employeeId,
      dateOfBirth,
      gender,
      address,
      profileImage,
    } = req.body;

    if (name !== undefined) {
      admin.name = name.trim();
    }

    if (phone !== undefined) {
      admin.phone = phone.trim();
    }

    if (username !== undefined) {
      admin.username = username.trim();
    }

    if (employeeId !== undefined) {
      admin.employeeId = employeeId.trim();
    }

    if (dateOfBirth !== undefined) {
      admin.dateOfBirth = dateOfBirth;
    }

    if (gender !== undefined) {
      admin.gender = gender;
    }

    if (address !== undefined) {
      admin.address = address.trim();
    }

    if (profileImage !== undefined) {
      admin.profileImage = profileImage;
    }

    await admin.save();

    const updatedAdmin = await User.findById(admin._id).select("-password");

    await AdminActivityLog.create({
      admin: admin._id,
      action: "profile_updated",
      description: "Updated admin profile information",
      module: "profile",
    });

    return successResponse(
      res,
      "Admin profile updated successfully",
      updatedAdmin
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        "Current password and new password are required",
        400
      );
    }

    if (newPassword.length < 6) {
      return errorResponse(
        res,
        "New password must be at least 6 characters",
        400
      );
    }

    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return errorResponse(res, "Admin not found", 404);
    }

    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    admin.password = newPassword;

    await admin.save();

    await AdminActivityLog.create({
      admin: admin._id,
      action: "password_changed",
      description: "Changed admin account password",
      module: "profile",
    });

    return successResponse(res, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRecentAdminActivity = async (req, res) => {
  try {
    const activities = await AdminActivityLog.find({
      admin: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return successResponse(
      res,
      "Recent admin activity fetched successfully",
      activities
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
