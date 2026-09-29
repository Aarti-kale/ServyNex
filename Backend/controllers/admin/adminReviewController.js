import mongoose from "mongoose";

import Review from "../../models/Review.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();

    const pendingReviews = await Review.countDocuments({
      status: "pending",
    });

    const approvedReviews = await Review.countDocuments({
      status: "approved",
    });

    const reportedReviews = await Review.countDocuments({
      status: "reported",
    });

    const hiddenReviews = await Review.countDocuments({
      status: "hidden",
    });

    const ratingStats = await Review.aggregate([
      {
        $match: {
          status: {
            $in: ["approved", "pending"],
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

    const averageRating =
      ratingStats.length > 0
        ? Number(ratingStats[0].averageRating.toFixed(1))
        : 0;

    const fiveStarReviews = await Review.countDocuments({
      rating: 5,
      status: {
        $ne: "hidden",
      },
    });

    return successResponse(res, "Review stats fetched successfully", {
      totalReviews,
      averageRating,
      fiveStarReviews,
      pendingReviews,
      reportedReviews,
      hiddenReviews,
      approvedReviews,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminReviews = async (req, res) => {
  try {
    const {
      search = "",
      rating = "all",
      status = "all",
      category = "all",
      worker = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const perPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * perPage;

    const query = {};

    if (rating !== "all") {
      const ratingNumber = Number(rating);

      if (
        !Number.isNaN(ratingNumber) &&
        ratingNumber >= 1 &&
        ratingNumber <= 5
      ) {
        query.rating = ratingNumber;
      }
    }

    if (status !== "all") {
      query.status = status;
    }

    if (category !== "all" && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    if (worker !== "all" && mongoose.Types.ObjectId.isValid(worker)) {
      query.worker = worker;
    }

    if (search.trim()) {
      query.comment = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const totalReviews = await Review.countDocuments(query);

    const reviews = await Review.find(query)
      .populate("customer", "name email profileImage")
      .populate("worker", "name email profileImage rating")
      .populate("service", "name")
      .populate("category", "name")
      .populate("booking", "_id status date time")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalPages = Math.ceil(totalReviews / perPage);

    return successResponse(res, "Reviews fetched successfully", {
      reviews,

      pagination: {
        currentPage,
        perPage,
        totalReviews,
        totalPages,

        hasNextPage: currentPage < totalPages,

        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search,
        rating,
        status,
        category,
        worker,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminReviewDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id)
      .populate("customer", "name email phone profileImage")
      .populate("worker", "name email phone profileImage rating")
      .populate("service", "name description price duration")
      .populate("category", "name")
      .populate("booking")
      .populate("reportedBy", "name email")
      .populate("hiddenBy", "name email")
      .populate("reply.repliedBy", "name email")
      .lean();

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    return successResponse(res, "Review details fetched successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    review.status = "approved";

    review.reportReason = "";
    review.reportedBy = null;
    review.reportedAt = null;

    await review.save();

    return successResponse(res, "Review approved successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const hideReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    review.status = "hidden";

    review.hiddenReason = reason.trim();

    review.hiddenAt = new Date();

    review.hiddenBy = req.user._id;

    await review.save();

    return successResponse(res, "Review hidden successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const unhideReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    review.status = "approved";

    review.hiddenReason = "";
    review.hiddenAt = null;
    review.hiddenBy = null;

    await review.save();

    return successResponse(res, "Review unhidden successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Reported by admin" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    review.status = "reported";

    review.reportReason = reason.trim();

    review.reportedBy = req.user._id;

    review.reportedAt = new Date();

    await review.save();

    return successResponse(res, "Review reported successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    await Review.findByIdAndDelete(id);

    return successResponse(res, "Review deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid review ID", 400);
    }

    if (!text || !text.trim()) {
      return errorResponse(res, "Reply text is required", 400);
    }

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }

    review.reply = {
      text: text.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
    };

    await review.save();

    return successResponse(res, "Reply added successfully", review);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getReviewAnalytics = async (req, res) => {
  try {
    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    const reviewsOverTime = await Review.aggregate([
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
          count: {
            $sum: 1,
          },
          averageRating: {
            $avg: "$rating",
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

    const topRatedWorkers = await Review.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$worker",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
      {
        $match: {
          totalReviews: {
            $gte: 1,
          },
        },
      },
      {
        $sort: {
          averageRating: -1,
          totalReviews: -1,
        },
      },
      {
        $limit: 10,
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
      {
        $project: {
          _id: 1,
          averageRating: {
            $round: ["$averageRating", 1],
          },
          totalReviews: 1,
          workerName: "$worker.name",
          workerEmail: "$worker.email",
        },
      },
    ]);

    const lowestRatedWorkers = await Review.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$worker",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          averageRating: 1,
          totalReviews: -1,
        },
      },
      {
        $limit: 10,
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
      {
        $project: {
          _id: 1,
          averageRating: {
            $round: ["$averageRating", 1],
          },
          totalReviews: 1,
          workerName: "$worker.name",
          workerEmail: "$worker.email",
        },
      },
    ]);

    return successResponse(res, "Review analytics fetched successfully", {
      ratingDistribution,
      reviewsOverTime,
      topRatedWorkers,
      lowestRatedWorkers,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
