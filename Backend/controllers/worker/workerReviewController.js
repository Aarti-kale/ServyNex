import Review from "../../models/Review.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getWorkerReviews = async (req, res) => {
  try {
    const workerId = req.user._id;

    const { rating = "all", page = 1, limit = 5 } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * perPage;

    const query = {
      worker: workerId,
      status: {
        $in: ["approved", "pending"],
      },
    };

    if (rating !== "all") {
      const ratingNumber = Number(rating);

      if (ratingNumber >= 1 && ratingNumber <= 5) {
        query.rating = ratingNumber;
      }
    }

    const allWorkerReviews = await Review.find({
      worker: workerId,
      status: {
        $in: ["approved", "pending"],
      },
    }).lean();

    const totalReviews = allWorkerReviews.length;

    const totalRating = allWorkerReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allWorkerReviews.forEach((review) => {
      ratingDistribution[review.rating] += 1;
    });

    const recommendableReviews = allWorkerReviews.filter(
      (review) => review.rating >= 4
    ).length;

    const wouldRecommend =
      totalReviews > 0
        ? Number(((recommendableReviews / totalReviews) * 100).toFixed(0))
        : 0;

    const repliedReviews = allWorkerReviews.filter(
      (review) => review.reply?.repliedAt
    );

    let averageResponseTimeHours = 0;

    if (repliedReviews.length > 0) {
      const totalResponseTime = repliedReviews.reduce((sum, review) => {
        const createdAt = new Date(review.createdAt).getTime();

        const repliedAt = new Date(review.reply.repliedAt).getTime();

        const hours = (repliedAt - createdAt) / (1000 * 60 * 60);

        return sum + hours;
      }, 0);

      averageResponseTimeHours = Number(
        (totalResponseTime / repliedReviews.length).toFixed(1)
      );
    }

    const filteredCount = await Review.countDocuments(query);

    const reviews = await Review.find(query)
      .populate("customer", "name email phone profileImage")
      .populate("service", "name")
      .populate("booking", "_id status date")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean();

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,

      customer: {
        _id: review.customer?._id || null,
        name: review.customer?.name || "",
        email: review.customer?.email || "",
        phone: review.customer?.phone || "",
        profileImage: review.customer?.profileImage || "",
      },

      service: {
        _id: review.service?._id || null,
        name: review.service?.name || "",
      },

      rating: review.rating,

      comment: review.comment,

      images: review.images || [],

      date: review.createdAt,

      status: review.status,

      verified: review.booking?.status === "completed",

      reply: review.reply || null,
    }));

    const totalPages = Math.ceil(filteredCount / perPage);

    return successResponse(res, "Worker reviews fetched successfully", {
      summary: {
        overallRating: averageRating,
        totalReviews,
        fiveStarReviews: ratingDistribution[5],
        fourStarReviews: ratingDistribution[4],
        threeStarReviews: ratingDistribution[3],
        twoStarReviews: ratingDistribution[2],
        oneStarReviews: ratingDistribution[1],
        wouldRecommend,
        averageResponseTimeHours,
      },

      ratingDistribution,

      reviews: formattedReviews,

      pagination: {
        currentPage,
        perPage,
        filteredReviews: filteredCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        rating,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const replyToWorkerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return errorResponse(res, "Reply text is required", 400);
    }

    const review = await Review.findOne({
      _id: id,
      worker: req.user._id,
    });

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
