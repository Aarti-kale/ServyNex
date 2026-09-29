import mongoose from "mongoose";

import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Service from "../../models/service.js";
import Review from "../../models/Review.js";
import Payment from "../../models/Payment.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const getDateRange = (startDate, endDate) => {
  const now = new Date();

  const start = startDate
    ? new Date(startDate)
    : new Date(now.getFullYear(), now.getMonth(), 1);

  const end = endDate ? new Date(endDate) : now;

  if (Number.isNaN(start.getTime())) {
    throw new Error("Invalid startDate");
  }

  if (Number.isNaN(end.getTime())) {
    throw new Error("Invalid endDate");
  }

  if (start > end) {
    throw new Error("startDate cannot be greater than endDate");
  }

  if (endDate) {
    end.setHours(23, 59, 59, 999);
  }

  return {
    start,
    end,
  };
};

export const getReportOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const totalBookings = await Booking.countDocuments({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    const cancelledBookings = await Booking.countDocuments({
      date: {
        $gte: start,
        $lte: end,
      },
      status: "cancelled",
    });

    const cancellationRate =
      totalBookings > 0
        ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1))
        : 0;

    const totalCustomers = await User.countDocuments({
      role: "user",
      createdAt: {
        $lte: end,
      },
    });

    const activeWorkers = await User.countDocuments({
      role: "worker",
      isBlocked: { $ne: true },
      isVerified: true,
    });

    const ratingResult = await Review.aggregate([
      {
        $match: {
          status: "approved",
          createdAt: {
            $gte: start,
            $lte: end,
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
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].revenue : 0;

    return successResponse(res, "Report overview fetched successfully", {
      dateRange: {
        start,
        end,
      },

      overview: {
        totalBookings,
        totalRevenue,
        totalCustomers,
        activeWorkers,
        averageRating,
        cancellationRate,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRevenueTrend = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$paymentDate",
            },
            month: {
              $month: "$paymentDate",
            },
          },

          revenue: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const trend = result.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
    }));

    return successResponse(res, "Revenue trend fetched successfully", trend);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getBookingsByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service",
        },
      },

      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "service.category",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$category._id",
          categoryName: {
            $first: "$category.name",
          },
          bookings: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },
    ]);

    return successResponse(
      res,
      "Bookings by category fetched successfully",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]);

    const total = result.reduce((sum, item) => sum + item.count, 0);

    const formatted = result.map((item) => ({
      status: item._id,
      count: item.count,
      percentage:
        total > 0 ? Number(((item.count / total) * 100).toFixed(1)) : 0,
    }));

    return successResponse(res, "Booking status fetched successfully", {
      total,
      statuses: formatted,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getServicePerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: "$service",
          bookings: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },

      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const performance = await Promise.all(
      result.map(async (item) => {
        const reviews = await Review.aggregate([
          {
            $match: {
              service: item._id,
              status: "approved",
              createdAt: {
                $gte: start,
                $lte: end,
              },
            },
          },

          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating",
              },
            },
          },
        ]);

        const revenue = await Payment.aggregate([
          {
            $match: {
              service: item._id,
              status: "paid",
              paymentDate: {
                $gte: start,
                $lte: end,
              },
            },
          },

          {
            $group: {
              _id: null,
              revenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ]);

        return {
          serviceId: item._id,
          serviceName: item.service?.name || "Unknown",
          bookings: item.bookings,
          revenue: revenue[0]?.revenue || 0,
          averageRating:
            reviews.length > 0
              ? Number(reviews[0].averageRating.toFixed(1))
              : 0,
        };
      })
    );

    return successResponse(
      res,
      "Service performance fetched successfully",
      performance
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkerPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
          worker: {
            $ne: null,
          },
        },
      },

      {
        $group: {
          _id: "$worker",

          jobsCompleted: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "completed"],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "worker",
        },
      },

      {
        $unwind: {
          path: "$worker",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const performance = await Promise.all(
      result.map(async (item) => {
        const reviews = await Review.aggregate([
          {
            $match: {
              worker: item._id,
              status: "approved",
              createdAt: {
                $gte: start,
                $lte: end,
              },
            },
          },

          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating",
              },
            },
          },
        ]);

        return {
          workerId: item._id,

          workerName: item.worker?.name || "Unknown",

          jobsCompleted: item.jobsCompleted,

          averageRating:
            reviews.length > 0
              ? Number(reviews[0].averageRating.toFixed(1))
              : 0,

          salary: item.worker?.salary || 0,
        };
      })
    );

    return successResponse(
      res,
      "Worker performance fetched successfully",
      performance
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCustomerGrowth = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const growth = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },

          customers: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return successResponse(res, "Customer growth fetched successfully", growth);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMonthlyReportSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const bookings = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$date",
            },
            month: {
              $month: "$date",
            },
          },

          totalBookings: {
            $sum: 1,
          },

          completedJobs: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "completed"],
                },
                1,
                0,
              ],
            },
          },

          cancellations: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "cancelled"],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    const summary = await Promise.all(
      bookings.map(async (item) => {
        const monthStart = new Date(item._id.year, item._id.month - 1, 1);

        const monthEnd = new Date(
          item._id.year,
          item._id.month,
          0,
          23,
          59,
          59,
          999
        );

        const revenue = await Payment.aggregate([
          {
            $match: {
              status: "paid",
              paymentDate: {
                $gte: monthStart,
                $lte: monthEnd,
              },
            },
          },

          {
            $group: {
              _id: null,
              revenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ]);

        const newCustomers = await User.countDocuments({
          role: "user",
          createdAt: {
            $gte: monthStart,
            $lte: monthEnd,
          },
        });

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        return {
          month: `${monthNames[item._id.month - 1]} ${item._id.year}`,

          totalBookings: item.totalBookings,

          revenue: revenue[0]?.revenue || 0,

          newCustomers,

          completedJobs: item.completedJobs,

          cancellations: item.cancellations,
        };
      })
    );

    return successResponse(
      res,
      "Monthly report summary fetched successfully",
      summary
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCustomerLocations = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const { start, end } = getDateRange(startDate, endDate);

    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
          user: {
            $ne: null,
          },
        },
      },

      {
        $group: {
          _id: "$user",
          bookings: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },

      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          location: {
            $ifNull: ["$customer.location", "Not Available"],
          },
          bookings: 1,
        },
      },

      {
        $group: {
          _id: "$location",
          customers: {
            $sum: 1,
          },
          bookings: {
            $sum: "$bookings",
          },
        },
      },

      {
        $sort: {
          customers: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    const total = result.reduce((sum, item) => sum + item.customers, 0);

    const locations = result.map((item) => ({
      city: item._id,
      state: "",
      customers: item.customers,
      bookings: item.bookings,
      percentage:
        total > 0 ? Number(((item.customers / total) * 100).toFixed(1)) : 0,
    }));

    return successResponse(
      res,
      "Customer locations fetched successfully",
      locations
    );
  } catch (error) {
    console.error("getCustomerLocations error:", error);

    return errorResponse(res, error.message, 500);
  }
};
