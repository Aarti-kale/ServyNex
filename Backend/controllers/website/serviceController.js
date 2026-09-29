import mongoose from "mongoose";
import Service from "../../models/service.js";
import ServiceiceContent from "../../models/serviceContent.js";

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

export const getServices = async (req, res) => {
  try {
    const {
      search = "",
      category = "all",
      popular = "false",
      featured = "false",
      related = "false",
    } = req.query;

    const query = {
      isActive: true,
    };

    if (search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.name = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    if (category !== "all") {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return errorResponse(res, "Invalid category ID", 400);
      }

      query.category = category;
    }

    if (popular === "true") {
      query.isPopular = true;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (related === "true") {
      query.isRelated = true;
    }

    const services = await Service.find(query)
      .select(
        [
          "name",
          "shortDescription",
          "description",
          "category",
          "price",
          "duration",
          "image",
          "highlights",
          "includedServices",
          "packages",
          "isPopular",
          "isFeatured",
          "isRelated",
        ].join(" ")
      )
      .populate("category", "name icon image")
      .sort({
        isFeatured: -1,
        isPopular: -1,
        isRelated: -1,
        createdAt: -1,
      })
      .lean();

    return successResponse(res, "Services fetched successfully", services);
  } catch (error) {
    console.error("getServices error:", error);

    return errorResponse(res, "Failed to fetch services", 500);
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findOne({
      _id: id,
      isActive: true,
    })
      .select(
        [
          "name",
          "shortDescription",
          "description",
          "category",
          "price",
          "duration",
          "image",
          "highlights",
          "includedServices",
          "packages",
          "isPopular",
          "isFeatured",
          "isRelated",
        ].join(" ")
      )
      .populate("category", "name icon image shortDescription")
      .lean();

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    return successResponse(res, "Service fetched successfully", service);
  } catch (error) {
    console.error("getServiceById error:", error);

    return errorResponse(res, "Failed to fetch service", 500);
  }
};
export const getServiceHero = async (req, res) => {
  try {
    const content = await ServiceiceContent.findOne({
      key: "services-hero",
      isActive: true,
    })
      .select("hero")
      .lean();

    return successResponse(res, "Services hero content fetched successfully", {
      hero: content?.hero || DEFAULT_SERVICE_HERO,
    });
  } catch (error) {
    console.error("getServiceHero error:", error);

    return errorResponse(res, "Failed to fetch Services hero content", 500);
  }
};
