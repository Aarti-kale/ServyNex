import mongoose from "mongoose";

import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import Service from "../../models/service.js";
import ProfessionalHero from "../../models/professionalHero.js";
import ProfessionalStandards from "../../models/professionalStandards.js";
import ProfessionalVerificationProcess from "../../models/professionalVerificationProcess.js";
import BecomeProfessional from "../../models/BecomeProfessional.js";
import Category from "../../models/category.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const PUBLIC_WORKER_FILTER = {
  role: "worker",
  isVerified: true,
  isActive: true,
  isBlocked: false,
};

const DEFAULT_PROFESSIONAL_HERO = {
  badge: "OUR PROFESSIONALS",

  title: "Meet Our Trusted",

  highlightedTitle: "Professionals",

  description:
    "500+ verified experts delivering quality home services with professionalism and care.",

  primaryButton: {
    text: "Explore Services",
    link: "/services",
  },

  secondaryButton: {
    text: "See How It Works",
    link: "#hiring-process",
  },

  image: "",
};

const getProfessionalHero = async () => {
  const content = await ProfessionalHero.findOne({
    key: "professionals-hero",
    isActive: true,
  })
    .select("hero")
    .lean();

  return content?.hero || DEFAULT_PROFESSIONAL_HERO;
};

const HIRING_PROCESS = [
  {
    step: 1,
    title: "Application",
    description: "Professional applies with required details",
    icon: "application",
  },

  {
    step: 2,
    title: "Document Verification",
    description: "We verify identity and documents",
    icon: "document-verification",
  },

  {
    step: 3,
    title: "Skill Assessment",
    description: "Skills are tested for quality assurance",
    icon: "skill-assessment",
  },

  {
    step: 4,
    title: "Background Check",
    description: "Complete background verification",
    icon: "background-check",
  },

  {
    step: 5,
    title: "Training",
    description: "Training and guidelines by ServyNex",
    icon: "training",
  },

  {
    step: 6,
    title: "Approved Professional",
    description: "Ready to serve you with excellence",
    icon: "approved-professional",
  },
];

const DEFAULT_PROFESSIONAL_STANDARDS = {
  title: "Our Professional Standards",

  subtitle: "Quality, safety and trust is our priority",

  standards: [
    {
      title: "Identity Verified",
      description:
        "Every professional's identity is verified through approved documents.",
      icon: "identity-verified",
    },

    {
      title: "Background Checked",
      description:
        "We ensure complete background verification for your safety.",
      icon: "background-checked",
    },

    {
      title: "Skill Certified",
      description:
        "Professionals are skilled, experienced and trained to deliver services.",
      icon: "skill-certified",
    },

    {
      title: "Customer Rated",
      description:
        "Every professional is rated by customers to maintain high service quality.",
      icon: "customer-rated",
    },
  ],
};

const getProfessionalStandards = async () => {
  const content = await ProfessionalStandards.findOne({
    key: "professional-standards",
    isActive: true,
  })
    .select("title subtitle standards")
    .lean();

  if (!content) {
    return DEFAULT_PROFESSIONAL_STANDARDS;
  }

  return {
    title: content.title || DEFAULT_PROFESSIONAL_STANDARDS.title,

    subtitle: content.subtitle || DEFAULT_PROFESSIONAL_STANDARDS.subtitle,

    standards: Array.isArray(content.standards)
      ? content.standards.map((standard) => ({
          _id: standard._id,

          title: standard.title,

          description: standard.description,

          icon:
            standard.title?.trim().toLowerCase().replace(/\s+/g, "-") ||
            "default",
        }))
      : [],
  };
};

const DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS = {
  title: "Our Hiring Verification Process",

  steps: [
    {
      step: 1,
      title: "Application",
      description: "Professional applies with required details.",
      icon: "FileEarmarkPersonFill",
    },

    {
      step: 2,
      title: "Document Verification",
      description: "We verify identity and required documents.",
      icon: "PersonVcardFill",
    },

    {
      step: 3,
      title: "Skill Assessment",
      description: "Skills are assessed to ensure service quality.",
      icon: "AwardFill",
    },

    {
      step: 4,
      title: "Background Check",
      description: "Complete background verification is performed.",
      icon: "ShieldFillCheck",
    },

    {
      step: 5,
      title: "Training",
      description: "Professionals receive training and ServyNex guidelines.",
      icon: "MortarboardFill",
    },

    {
      step: 6,
      title: "Approved Professional",
      description: "Approved professionals are ready to serve customers.",
      icon: "PeopleFill",
    },
  ],
};

const getProfessionalVerificationProcess = async () => {
  const content = await ProfessionalVerificationProcess.findOne({
    key: "professional-verification-process",
    isActive: true,
  })
    .select("title steps")
    .lean();

  if (!content) {
    return HIRING_PROCESS;
  }

  if (!Array.isArray(content.steps) || content.steps.length === 0) {
    return HIRING_PROCESS;
  }

  return content.steps.map((step, index) => ({
    _id: step._id,

    step: Number(step.step) || index + 1,

    title: step.title,

    desc: step.description,

    icon: step.icon,
  }));
};

const DEFAULT_BECOME_PROFESSIONAL = {
  title: "Want to become a ServyNex Professional?",

  description:
    "Join our growing network of trusted professionals and grow your business with us.",

  buttonText: "Register as a Professional",

  registrationRoute: "/register?role=worker",

  image: "",

  isActive: true,
};

const getBecomeProfessional = async () => {
  const content = await BecomeProfessional.findOne({
    key: "become-professional-cta",
    isActive: true,
  })
    .select("title description buttonText registrationRoute image isActive")
    .lean();

  if (!content) {
    return DEFAULT_BECOME_PROFESSIONAL;
  }

  return {
    title: content.title || DEFAULT_BECOME_PROFESSIONAL.title,

    description: content.description || DEFAULT_BECOME_PROFESSIONAL.description,

    buttonText: content.buttonText || DEFAULT_BECOME_PROFESSIONAL.buttonText,

    registrationRoute:
      content.registrationRoute ||
      DEFAULT_BECOME_PROFESSIONAL.registrationRoute,

    image: content.image || DEFAULT_BECOME_PROFESSIONAL.image,

    isActive:
      typeof content.isActive === "boolean"
        ? content.isActive
        : DEFAULT_BECOME_PROFESSIONAL.isActive,
  };
};

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatWorker = (worker, stats = {}) => {
  const services = Array.isArray(worker.services) ? worker.services : [];

  const skills = Array.isArray(worker.skills) ? worker.skills : [];

  const profession = services[0]?.name || skills[0] || "Professional";

  return {
    _id: worker._id,

    name: worker.name,

    profileImage: worker.profileImage || "",

    profession,

    skills,

    services,

    experience: Number(worker.experience || 0),

    rating: Number(Number(worker.rating || 0).toFixed(1)),

    totalReviews: Number(stats.totalReviews || 0),

    completedJobs: Number(stats.completedJobs || 0),

    availability: worker.availability || "offline",

    location: worker.location || "",

    isVerified: Boolean(worker.isVerified),
  };
};

const getWorkerStatistics = async (workerIds) => {
  if (!workerIds.length) {
    return new Map();
  }

  const statistics = await Booking.aggregate([
    {
      $match: {
        worker: {
          $in: workerIds,
        },
      },
    },

    {
      $group: {
        _id: "$worker",

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

        totalReviews: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $ne: ["$rating", null],
                  },

                  {
                    $gte: ["$rating", 1],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return new Map(
    statistics.map((item) => [
      item._id.toString(),
      {
        completedJobs: item.completedJobs || 0,

        totalReviews: item.totalReviews || 0,
      },
    ])
  );
};

const fetchFeaturedWorkers = async () => {
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

  const workerIds = workers.map((worker) => worker._id);

  const statistics = await getWorkerStatistics(workerIds);

  return workers.map((worker) => {
    const stats = statistics.get(worker._id.toString()) || {};

    return formatWorker(worker, stats);
  });
};

const getProfessionalStatistics = async () => {
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

    User.aggregate([
      {
        $match: PUBLIC_WORKER_FILTER,
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

    Booking.aggregate([
      {
        $match: {
          rating: {
            $gte: 1,
            $lte: 5,
          },
        },
      },

      {
        $group: {
          _id: null,

          totalRatedBookings: {
            $sum: 1,
          },

          satisfiedBookings: {
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

  let customerSatisfaction = 0;

  if (satisfaction && satisfaction.totalRatedBookings > 0) {
    customerSatisfaction =
      (satisfaction.satisfiedBookings / satisfaction.totalRatedBookings) * 100;
  }

  return {
    verifiedProfessionals,

    jobsCompleted: completedJobs,

    averageRating: Number(Number(averageRating).toFixed(1)),

    customerSatisfaction: Number(Number(customerSatisfaction).toFixed(1)),
  };
};

const getProfessionalCategories = async () => {
  const categories = await Category.find({
    isActive: true,
  })
    .select("name icon shortDescription image")
    .sort({
      name: 1,
    })
    .lean();
  const workerCounts = await User.aggregate([
    {
      $match: PUBLIC_WORKER_FILTER,
    },

    {
      $unwind: "$services",
    },

    {
      $lookup: {
        from: "services",

        localField: "services",

        foreignField: "_id",

        as: "service",
      },
    },

    {
      $unwind: "$service",
    },

    {
      $group: {
        _id: "$service.category",

        professionalCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const countMap = new Map(
    workerCounts.map((item) => [item._id.toString(), item.professionalCount])
  );

  return categories.map((category) => ({
    _id: category._id,

    name: category.name,

    icon: category.icon || "",

    shortDescription: category.shortDescription || "",

    image: category.image || "",

    professionalCount: countMap.get(category._id.toString()) || 0,
  }));
};

export const getWorkersOverview = async (req, res) => {
  try {
    const [
      hero,
      statistics,
      categories,
      featuredWorkers,
      professionalStandards,
      hiringProcess,
      joinProfessional,
    ] = await Promise.all([
      getProfessionalHero(),

      getProfessionalStatistics(),

      getProfessionalCategories(),

      fetchFeaturedWorkers(),

      getProfessionalStandards(),

      getProfessionalVerificationProcess(),

      getBecomeProfessional(),
    ]);

    return successResponse(res, "Workers overview fetched successfully", {
      hero,

      statistics,

      categories,

      featured: {
        count: featuredWorkers.length,

        workers: featuredWorkers,
      },

      hiringProcess,

      professionalStandards,

      joinProfessional,
    });
  } catch (error) {
    console.error("getWorkersOverview error:", error);

    return errorResponse(res, "Failed to fetch workers overview", 500);
  }
};

export const getFeaturedWorkers = async (req, res) => {
  try {
    const workers = await fetchFeaturedWorkers();

    return successResponse(res, "Featured professionals fetched successfully", {
      count: workers.length,

      workers,
    });
  } catch (error) {
    console.error("getFeaturedWorkers error:", error);

    return errorResponse(res, "Failed to fetch featured professionals", 500);
  }
};

export const getAllWorkers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      service = "",
      availability = "",
    } = req.query;

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);

    const requestedLimit = Number.parseInt(limit, 10) || 12;

    const pageLimit = Math.min(Math.max(requestedLimit, 1), 50);

    const skip = (currentPage - 1) * pageLimit;

    const filter = {
      ...PUBLIC_WORKER_FILTER,
    };

    const cleanSearch = String(search).trim();

    if (cleanSearch) {
      const searchRegex = new RegExp(escapeRegex(cleanSearch), "i");

      filter.$or = [
        {
          name: searchRegex,
        },

        {
          skills: searchRegex,
        },

        {
          location: searchRegex,
        },
      ];
    }

    if (service) {
      if (!mongoose.Types.ObjectId.isValid(service)) {
        return errorResponse(res, "Invalid service ID", 400);
      }

      filter.services = service;
    }

    if (availability) {
      const allowedAvailability = ["available", "busy", "offline"];

      if (!allowedAvailability.includes(availability)) {
        return errorResponse(res, "Invalid availability value", 400);
      }

      filter.availability = availability;
    }

    const [workers, totalWorkers] = await Promise.all([
      User.find(filter)
        .select(
          "name profileImage skills experience rating services availability location isVerified"
        )
        .populate("services", "name")
        .sort({
          rating: -1,
          experience: -1,
          createdAt: 1,
        })
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const workerIds = workers.map((worker) => worker._id);

    const statistics = await getWorkerStatistics(workerIds);

    const formattedWorkers = workers.map((worker) => {
      const stats = statistics.get(worker._id.toString()) || {};

      return formatWorker(worker, stats);
    });

    const totalPages = Math.ceil(totalWorkers / pageLimit);

    return successResponse(res, "Professionals fetched successfully", {
      workers: formattedWorkers,

      pagination: {
        currentPage,

        limit: pageLimit,

        totalWorkers,

        totalPages,

        hasNextPage: currentPage < totalPages,

        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("getAllWorkers error:", error);

    return errorResponse(res, "Failed to fetch professionals", 500);
  }
};

export const getPublicWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid professional ID", 400);
    }

    const worker = await User.findOne({
      _id: id,

      ...PUBLIC_WORKER_FILTER,
    })
      .select(
        "name profileImage skills experience rating services availability location isVerified createdAt"
      )
      .populate("services", "name description price duration image")
      .lean();

    if (!worker) {
      return errorResponse(res, "Professional not found", 404);
    }

    const statistics = await getWorkerStatistics([worker._id]);

    const stats = statistics.get(worker._id.toString()) || {};

    return successResponse(res, "Professional fetched successfully", {
      worker: formatWorker(worker, stats),
    });
  } catch (error) {
    console.error("getPublicWorkerById error:", error);

    return errorResponse(res, "Failed to fetch professional", 500);
  }
};
