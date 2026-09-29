import ServiceContent from "../../models/serviceContent.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_SERVICE_HERO = {
  badge: "PROFESSIONAL HOME SERVICES",
  title: "Quality Services",
  highlightedTitle: "For Your Home",
  description:
    "Find reliable, verified and skilled professionals for every home service need. Fast booking, transparent pricing and 100% satisfaction guaranteed.",
  primaryButton: {
    text: "Book a Service",
    link: "/services",
  },
  secondaryButton: {
    text: "Become a Worker",
    link: "/register?role=worker",
  },
  image: "",
};

export const getAdminServiceContent = async (req, res) => {
  try {
    const content = await ServiceContent.findOne({
      key: "services-hero",
    })
      .select("key hero isActive createdAt updatedAt")
      .lean();

    return successResponse(res, "Services hero content fetched successfully", {
      hero: content?.hero || DEFAULT_SERVICE_HERO,
      isActive: content?.isActive ?? true,
    });
  } catch (error) {
    console.error("getAdminServiceContent error:", error);

    return errorResponse(res, "Failed to fetch Services hero content", 500);
  }
};

export const updateAdminServiceContent = async (req, res) => {
  try {
    const { hero } = req.body;

    if (!hero || typeof hero !== "object") {
      return errorResponse(res, "Hero data is required", 400);
    }

    const safeHero = {
      badge: hero.badge,
      title: hero.title,
      highlightedTitle: hero.highlightedTitle,
      description: hero.description,

      primaryButton: {
        text: hero.primaryButton?.text,
        link: hero.primaryButton?.link,
      },

      secondaryButton: {
        text: hero.secondaryButton?.text,
        link: hero.secondaryButton?.link,
      },

      image: hero.image,
    };

    Object.keys(safeHero).forEach((key) => {
      if (safeHero[key] === undefined) {
        delete safeHero[key];
      }
    });

    if (safeHero.primaryButton) {
      Object.keys(safeHero.primaryButton).forEach((key) => {
        if (safeHero.primaryButton[key] === undefined) {
          delete safeHero.primaryButton[key];
        }
      });
    }

    if (safeHero.secondaryButton) {
      Object.keys(safeHero.secondaryButton).forEach((key) => {
        if (safeHero.secondaryButton[key] === undefined) {
          delete safeHero.secondaryButton[key];
        }
      });
    }

    const content = await ServiceContent.findOneAndUpdate(
      {
        key: "services-hero",
      },
      {
        $set: {
          hero: safeHero,
        },
        $setOnInsert: {
          key: "services-hero",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Services hero content updated successfully",
      content
    );
  } catch (error) {
    console.error("updateAdminServiceContent error:", error);

    return errorResponse(res, "Failed to update Services hero content", 500);
  }
};

export const deleteAdminServiceContent = async (req, res) => {
  try {
    await ServiceContent.deleteOne({
      key: "services-hero",
    });

    return successResponse(res, "Services hero content deleted successfully", {
      hero: DEFAULT_SERVICE_HERO,
    });
  } catch (error) {
    console.error("deleteAdminServiceContent error:", error);

    return errorResponse(res, "Failed to delete Services hero content", 500);
  }
};
