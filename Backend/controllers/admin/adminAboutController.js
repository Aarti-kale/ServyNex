import AboutContent from "../../models/aboutContent.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_ABOUT_CONTENT = {
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

    image: "",
  },

  story: {
    title: "Our Story",

    paragraphs: [
      "Finding reliable and skilled professionals for home services has always been a challenge. Unverified workers, unclear pricing, delays and inconsistent quality have created frustration for millions of households.",

      "ServyNex was founded to solve this problem through technology and trust. Our platform connects customers with verified professionals, ensuring transparent pricing, on-time service and the best experience.",
    ],

    image: "",
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

    image: "",
  },

  isActive: true,
};

export const getAdminAbout = async (req, res) => {
  try {
    let about = await AboutContent.findOne({
      isActive: true,
    }).lean();

    if (!about) {
      about = await AboutContent.create(DEFAULT_ABOUT_CONTENT);

      about = about.toObject();
    }

    return successResponse(res, "About content fetched successfully", about);
  } catch (error) {
    console.error("getAdminAbout error:", error);

    return errorResponse(res, "Failed to fetch About content", 500);
  }
};

export const updateAdminAbout = async (req, res) => {
  try {
    const { hero, story, missionVision, coreValues, journey, commitment } =
      req.body;

    let about = await AboutContent.findOne({
      isActive: true,
    });

    if (!about) {
      about = new AboutContent(DEFAULT_ABOUT_CONTENT);
    }

    if (hero !== undefined) {
      about.hero = hero;
    }

    if (story !== undefined) {
      about.story = story;
    }

    if (missionVision !== undefined) {
      about.missionVision = missionVision;
    }

    if (coreValues !== undefined) {
      about.coreValues = coreValues;
    }

    if (journey !== undefined) {
      about.journey = journey;
    }

    if (commitment !== undefined) {
      about.commitment = commitment;
    }

    await about.save();

    return successResponse(res, "About content updated successfully", about);
  } catch (error) {
    console.error("updateAdminAbout error:", error);

    if (error.name === "ValidationError") {
      return errorResponse(res, error.message, 400);
    }

    return errorResponse(res, "Failed to update About content", 500);
  }
};

export const resetAdminAbout = async (req, res) => {
  try {
    const about = await AboutContent.findOneAndUpdate(
      {
        isActive: true,
      },
      DEFAULT_ABOUT_CONTENT,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return successResponse(res, "About content reset successfully", about);
  } catch (error) {
    console.error("resetAdminAbout error:", error);

    return errorResponse(res, "Failed to reset About content", 500);
  }
};
