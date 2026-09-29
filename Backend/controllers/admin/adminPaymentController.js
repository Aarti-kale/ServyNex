import mongoose from "mongoose";

import Payment from "../../models/Payment.js";
import Refund from "../../models/Refund.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getPaymentStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const stats = await Payment.aggregate([
      {
        $facet: {
          revenue: [
            {
              $match: {
                status: "paid",
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: "$totalAmount",
                },
              },
            },
          ],

          todayCollection: [
            {
              $match: {
                status: "paid",
                $or: [
                  {
                    paymentDate: {
                      $gte: todayStart,
                    },
                  },
                  {
                    paymentDate: null,
                    createdAt: {
                      $gte: todayStart,
                    },
                  },
                ],
              },
            },
            {
              $group: {
                _id: null,
                amount: {
                  $sum: "$totalAmount",
                },
              },
            },
          ],

          pending: [
            {
              $match: {
                status: "pending",
              },
            },
            {
              $group: {
                _id: null,
                amount: {
                  $sum: "$totalAmount",
                },
                count: {
                  $sum: 1,
                },
              },
            },
          ],

          successful: [
            {
              $match: {
                status: "paid",
              },
            },
            {
              $group: {
                _id: null,
                amount: {
                  $sum: "$totalAmount",
                },
                count: {
                  $sum: 1,
                },
              },
            },
          ],

          refunded: [
            {
              $match: {
                refundStatus: {
                  $in: ["approved", "completed"],
                },
              },
            },
            {
              $group: {
                _id: null,
                amount: {
                  $sum: {
                    $ifNull: ["$refundAmount", 0],
                  },
                },
              },
            },
          ],

          gst: [
            {
              $match: {
                status: "paid",
              },
            },
            {
              $group: {
                _id: null,
                amount: {
                  $sum: {
                    $ifNull: ["$gst", 0],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];

    return successResponse(res, "Payment stats fetched successfully", {
      totalRevenue: result.revenue[0]?.totalRevenue || 0,

      todayCollection: result.todayCollection[0]?.amount || 0,

      pendingPayments: result.pending[0]?.amount || 0,

      successfulPayments: result.successful[0]?.amount || 0,

      refundedAmount: result.refunded[0]?.amount || 0,

      gstCollected: result.gst[0]?.amount || 0,

      counts: {
        pending: result.pending[0]?.count || 0,

        successful: result.successful[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("getPaymentStats error:", error);

    return errorResponse(res, "Failed to fetch payment statistics", 500);
  }
};
export const getPayments = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      method = "all",
      startDate,
      endDate,
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 5, 1), 100);

    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    if (method !== "all") {
      query.paymentMethod = method;
    }

    if (startDate || endDate) {
      query.paymentDate = {};

      if (startDate) {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return errorResponse(res, "Invalid start date", 400);
        }

        start.setHours(0, 0, 0, 0);
        query.paymentDate.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return errorResponse(res, "Invalid end date", 400);
        }

        end.setHours(23, 59, 59, 999);
        query.paymentDate.$lte = end;
      }
    }

    const searchText = search.trim();

    if (searchText) {
      const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        {
          paymentId: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          transactionId: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    const totalPayments = await Payment.countDocuments(query);

    const skip = (currentPage - 1) * perPage;

    const payments = await Payment.find(query)
      .populate("customer", "name email phone profileImage")
      .populate("worker", "name email phone profileImage")
      .populate("service", "name")
      .populate("category", "name")
      .populate("booking", "_id bookingId status date time")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalPages = Math.ceil(totalPayments / perPage);

    return successResponse(res, "Payments fetched successfully", {
      payments,
      pagination: {
        currentPage,
        perPage,
        totalPayments,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("getPayments error:", error);

    return errorResponse(res, "Failed to fetch payments", 500);
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid payment ID", 400);
    }

    const payment = await Payment.findById(id)
      .populate("customer", "name email phone profileImage")
      .populate("worker", "name email phone profileImage rating")
      .populate("service", "name description price duration")
      .populate("category", "name")
      .populate("booking");

    if (!payment) {
      return errorResponse(res, "Payment not found", 404);
    }

    const refunds = await Refund.find({
      payment: payment._id,
    })
      .populate("processedBy", "name email")
      .sort({
        createdAt: -1,
      });

    return successResponse(res, "Payment details fetched successfully", {
      payment,
      refunds,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPaymentMethodBreakdown = async (req, res) => {
  try {
    const breakdown = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          amount: {
            $sum: "$totalAmount",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    const result = breakdown.map((item) => ({
      method: item._id,
      amount: item.amount,
      count: item.count,
      percentage:
        total > 0 ? Number(((item.amount / total) * 100).toFixed(1)) : 0,
    }));

    return successResponse(res, "Payment methods fetched successfully", {
      total,
      breakdown: result,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRevenueOverview = async (req, res) => {
  try {
    const revenue = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: {
            $ne: null,
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

          orders: {
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

      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: {
            $round: ["$revenue", 2],
          },
          orders: 1,
        },
      },
    ]);

    return successResponse(
      res,
      "Revenue overview fetched successfully",
      revenue
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getRefundRequests = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 10 } = req.query;

    const query = {};

    if (status !== "all") {
      query.status = status;
    }

    const currentPage = Math.max(Number(page), 1);

    const perPage = Math.max(Number(limit), 1);

    const total = await Refund.countDocuments(query);

    const refunds = await Refund.find(query)
      .populate("customer", "name email phone")
      .populate("booking", "bookingId status")
      .populate("payment", "paymentId totalAmount")
      .sort({
        createdAt: -1,
      })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return successResponse(res, "Refund requests fetched successfully", {
      refunds,

      pagination: {
        currentPage,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const approveRefund = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid refund ID", 400);
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return errorResponse(res, "Refund request not found", 404);
    }

    if (refund.status !== "pending") {
      return errorResponse(res, "Refund request already processed", 400);
    }

    refund.status = "approved";
    refund.processedBy = req.user._id;
    refund.processedAt = new Date();

    await refund.save();

    await Payment.findByIdAndUpdate(refund.payment, {
      refundStatus: "approved",
      refundAmount: Payment.refundamount,
    });

    return successResponse(res, "Refund approved successfully", refund);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const rejectRefund = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid refund ID", 400);
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return errorResponse(res, "Refund request not found", 404);
    }

    if (refund.status !== "pending") {
      return errorResponse(res, "Refund request already processed", 400);
    }

    refund.status = "rejected";
    refund.processedBy = req.user._id;
    refund.processedAt = new Date();

    await refund.save();

    await Payment.findByIdAndUpdate(refund.payment, {
      refundStatus: "rejected",
    });

    return successResponse(res, "Refund rejected successfully", refund);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const completeRefund = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid refund ID", 400);
    }

    const refund = await Refund.findById(id);

    if (!refund) {
      return errorResponse(res, "Refund request not found", 404);
    }

    if (refund.status !== "approved") {
      return errorResponse(res, "Refund must be approved first", 400);
    }

    refund.status = "completed";
    refund.processedBy = req.user._id;
    refund.processedAt = new Date();

    await refund.save();

    await Payment.findByIdAndUpdate(refund.payment, {
      status: "refunded",
      refundStatus: "completed",
      refundAmount: Payment.refundamount,
    });

    return successResponse(res, "Refund completed successfully", refund);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getMonthlyRevenueSummary = async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          paymentDate: {
            $ne: null,
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

          orders: {
            $sum: 1,
          },

          avgOrderValue: {
            $avg: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },

      {
        $limit: 12,
      },

      {
        $project: {
          _id: 0,

          year: "$_id.year",
          month: "$_id.month",

          revenue: {
            $round: ["$revenue", 2],
          },

          orders: 1,

          avgOrderValue: {
            $round: ["$avgOrderValue", 2],
          },
        },
      },
    ]);

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

    const formattedSummary = summary.map((item) => ({
      month: `${monthNames[item.month - 1]} ${item.year}`,
      revenue: item.revenue,
      orders: item.orders,
      avgOrderValue: item.avgOrderValue,
    }));

    return successResponse(
      res,
      "Monthly revenue summary fetched successfully",
      {
        summary: formattedSummary,
      }
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
