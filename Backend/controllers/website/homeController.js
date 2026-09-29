import User from "../../models/users.js";
import Service from "../../models/service.js";
import Booking from "../../models/booking.js";
import HomepageContent from "../../models/homeContent.js";
import Review from "../../models/Review.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const PUBLIC_WORKER_FILTER = {
  role: "worker",
  isVerified: true,
  isActive: true,
  isBlocked: false,
};

const getHomepageStatistics = async () => {
  const [
    verifiedProfessionals,
    completedJobs,
    ratingResult,
    satisfactionResult,
  ] = await Promise.all([
    User.countDocuments(PUBLIC_WORKER_FILTER),

    Booking.countDocuments({
      status: "completed",
    }),

    Review.aggregate([
      {
        $match: {
          status: "approved",
          rating: {
            $gte: 1,
            $lte: 5,
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
    ]),

    Review.aggregate([
      {
        $match: {
          status: "approved",
          rating: {
            $gte: 1,
            $lte: 5,
          },
        },
      },
      {
        $group: {
          _id: null,

          totalReviews: {
            $sum: 1,
          },

          satisfiedReviews: {
            $sum: {
              $cond: [
                {
                  $gte: ["$rating", 4],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);

  const averageRating = ratingResult[0]?.averageRating || 0;

  const satisfaction = satisfactionResult[0];

  const customerSatisfaction =
    satisfaction?.totalReviews > 0
      ? (satisfaction.satisfiedReviews / satisfaction.totalReviews) * 100
      : 0;

  return {
    verifiedProfessionals,

    completedJobs,

    averageRating: Number(averageRating.toFixed(1)),

    customerSatisfaction: Number(customerSatisfaction.toFixed(1)),
  };
};
const getPopularServices = async () => {
  return Service.find({
    isActive: true,
    isPopular: true,
  })
    .select("name shortDescription description price duration image category")
    .populate("category", "name")
    .sort({
      createdAt: -1,
    })
    .limit(8)
    .lean();
};

const getFeaturedProfessionals = async () => {
  const workers = await User.find(PUBLIC_WORKER_FILTER)
    .select(
      "name profileImage skills experience rating services availability location isVerified"
    )
    .populate("services", "name")
    .sort({
      rating: -1,
      experience: -1,
      createdAt: 1,
    })
    .limit(6)
    .lean();

  if (!workers.length) {
    return [];
  }

  const workerIds = workers.map((worker) => worker._id);

  const [reviewStatistics, bookingStatistics] = await Promise.all([
    Review.aggregate([
      {
        $match: {
          worker: {
            $in: workerIds,
          },
          status: "approved",
          rating: {
            $gte: 1,
            $lte: 5,
          },
        },
      },
      {
        $group: {
          _id: "$worker",

          totalReviews: {
            $sum: 1,
          },

          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]),

    Booking.aggregate([
      {
        $match: {
          worker: {
            $in: workerIds,
          },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$worker",

          completedJobs: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  const reviewMap = new Map(
    reviewStatistics.map((item) => [
      item._id.toString(),
      {
        totalReviews: item.totalReviews,
        averageRating: Number(item.averageRating.toFixed(1)),
      },
    ])
  );

  const bookingMap = new Map(
    bookingStatistics.map((item) => [item._id.toString(), item.completedJobs])
  );

  return workers.map((worker) => {
    const workerId = worker._id.toString();

    const reviewStats = reviewMap.get(workerId);

    return {
      _id: worker._id,

      name: worker.name,

      profileImage: worker.profileImage || "",

      profession:
        worker.services?.[0]?.name || worker.skills?.[0] || "Professional",

      experience: Number(worker.experience) || 0,

      rating:
        reviewStats?.averageRating ??
        Number(Number(worker.rating || 0).toFixed(1)),

      totalReviews: reviewStats?.totalReviews || 0,

      completedJobs: bookingMap.get(workerId) || 0,

      availability: worker.availability || "offline",

      location: worker.location || "",

      isVerified: Boolean(worker.isVerified),
    };
  });
};

const getCustomerReviews = async () => {
  return Review.find({
    status: "approved",
  })
    .select("rating comment customer service createdAt reply")
    .populate("customer", "name profileImage")
    .populate("service", "name")
    .sort({
      createdAt: -1,
    })
    .limit(8)
    .lean();
};
export const getHomepage = async (req, res) => {
  try {
    const [
      content,
      statistics,
      popularServices,
      featuredProfessionals,
      reviews,
    ] = await Promise.all([
      HomepageContent.findOne({
        isActive: true,
      })
        .select("hero howItWorks whyChoose cta faqs")
        .lean(),

      getHomepageStatistics(),

      getPopularServices(),

      getFeaturedProfessionals(),

      getCustomerReviews(),
    ]);

    const faqs = Array.isArray(content?.faqs)
      ? content.faqs
          .filter((faq) => faq.isActive !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];

    return successResponse(res, "Homepage data fetched successfully", {
      hero: content?.hero || null,

      statistics,

      popularServices,

      howItWorks: content?.howItWorks || {
        title: "How ServyNex Works",

        subtitle: "Simple steps to get your service done",

        steps: [],
      },

      whyChoose: content?.whyChoose || {
        title: "Why Choose ServyNex",

        subtitle: "We are committed to providing the best experience",

        features: [],
      },

      featuredProfessionals,

      reviews,

      cta: content?.cta || null,

      faqs,
    });
  } catch (error) {
    console.error("getHomepage error:", error);

    return errorResponse(res, "Failed to fetch homepage data", 500);
  }
};
