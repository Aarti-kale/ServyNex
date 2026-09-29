import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import AboutContent from "../../models/aboutContent.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const ABOUT_CONTENT = {
  hero: {
    badge: "ABOUT US",
    title: "About ServyNex",
    description:
      "We are on a mission to make home services simple, reliable and accessible for everyone.",
    highlights: [
      {
        title: "Trusted Professionals",
        description: "Verified, skilled & background checked",
        icon: "shield",
      },
      {
        title: "Customer First",
        description: "Your satisfaction is our top priority",
        icon: "users",
      },
    ],
  },

  story: {
    title: "Our Story",
    paragraphs: [
      "Finding reliable and skilled professionals for home services has always been a challenge. Unverified workers, unclear pricing, delays and inconsistent quality have created frustration for millions of households.",
      "ServyNex was founded to solve this problem through technology and trust. Our platform connects customers with verified professionals, ensuring transparent pricing, on-time service and the best experience.",
    ],
  },

  missionVision: {
    title: "Mission & Vision",

    mission: {
      title: "Our Mission",
      description:
        "To deliver reliable, safe and high-quality home services through verified professionals and technology.",
      icon: "target",
    },

    vision: {
      title: "Our Vision",
      description:
        "To become India's most trusted and preferred platform for all home service needs.",
      icon: "eye",
    },
  },

  coreValues: {
    title: "Our Core Values",

    values: [
      {
        title: "Trust",
        description:
          "We build trust through verification, transparency and reliability.",
        icon: "shield",
      },
      {
        title: "Quality",
        description:
          "We are committed to delivering the highest service quality.",
        icon: "badge",
      },
      {
        title: "Transparency",
        description:
          "Clear pricing, honest communication and no hidden charges.",
        icon: "scale",
      },
      {
        title: "Customer First",
        description: "We put our customers first in everything we do.",
        icon: "user",
      },
    ],
  },

  journey: {
    title: "Our Journey",

    milestones: [
      {
        year: 2022,
        title: "ServyNex was founded",
        icon: "flag",
      },
      {
        year: 2023,
        title: "500+ Professionals Onboarded",
        icon: "users",
      },
      {
        year: 2024,
        title: "10,000+ Happy Customers",
        icon: "building",
      },
      {
        year: 2025,
        title: "25,000+ Services Completed",
        icon: "badge",
      },
      {
        year: 2026,
        title: "Continuing to grow and improve every day",
        icon: "rocket",
      },
    ],
  },

  commitment: {
    title: "Our Commitment",

    description:
      "We are committed to creating a safe, reliable and delightful experience for every customer, every time.",

    points: [
      {
        title: "Verified & skilled professionals",
        icon: "shield",
      },
      {
        title: "On-time & dependable service",
        icon: "clock",
      },
      {
        title: "Transparent & fair pricing",
        icon: "price",
      },
    ],
  },
};

const getAboutImpactStats = async () => {
  const verifiedProfessionals = await User.countDocuments({
    role: "worker",
    isVerified: true,
    isActive: true,
    isBlocked: false,
  });

  const servicesCompleted = await Booking.countDocuments({
    status: "completed",
  });

  const ratingResult = await User.aggregate([
    {
      $match: {
        role: "worker",
        isVerified: true,
        isActive: true,
        isBlocked: false,
        rating: {
          $gt: 0,
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
    ratingResult.length > 0
      ? Number(ratingResult[0].averageRating.toFixed(1))
      : 0;

  return {
    verifiedProfessionals,
    servicesCompleted,
    averageRating,

    customerSatisfaction: 98,
  };
};

export const getAboutPage = async (req, res) => {
  try {
    const [about, impact] = await Promise.all([
      AboutContent.findOne({
        isActive: true,
      }).lean(),

      getAboutImpactStats(),
    ]);

    const content = about || DEFAULT_ABOUT_CONTENT;

    return successResponse(res, "About page fetched successfully", {
      hero: content.hero,

      story: content.story,

      missionVision: content.missionVision,

      coreValues: content.coreValues,

      journey: content.journey,

      impact: {
        title: "Our Impact",

        stats: [
          {
            label: "Verified Professionals",
            value: impact.verifiedProfessionals,

            displayValue:
              impact.verifiedProfessionals >= 500
                ? "500+"
                : `${impact.verifiedProfessionals}`,

            icon: "users",
          },

          {
            label: "Services Completed",
            value: impact.servicesCompleted,

            displayValue:
              impact.servicesCompleted >= 25000
                ? "25,000+"
                : `${impact.servicesCompleted}`,

            icon: "briefcase",
          },

          {
            label: "Average Rating",
            value: impact.averageRating,

            displayValue:
              impact.averageRating > 0
                ? impact.averageRating.toFixed(1)
                : "0.0",

            icon: "star",
          },

          {
            label: "Customer Satisfaction",
            value: 98,

            displayValue: "98%",

            icon: "smile",
          },
        ],
      },

      commitment: content.commitment,
    });
  } catch (error) {
    console.error("getAboutPage error:", error);

    return errorResponse(res, "Failed to fetch About page", 500);
  }
};
