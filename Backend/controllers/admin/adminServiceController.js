import mongoose from "mongoose";

import Service from "../../models/service.js";
import Category from "../../models/category.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

const parsePrice = (value) => {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    return null;
  }

  return price;
};

const parseDuration = (value) => {
  const duration = Number(value);

  if (!Number.isInteger(duration) || duration < 1) {
    return null;
  }

  return duration;
};

export const getServiceStats = async (req, res) => {
  try {
    const [totalServices, activeServices, inactiveServices, totalCategories] =
      await Promise.all([
        Service.countDocuments(),
        Service.countDocuments({ isActive: true }),
        Service.countDocuments({ isActive: false }),
        Category.countDocuments(),
      ]);

    return successResponse(res, "Service stats fetched successfully", {
      totalServices,
      activeServices,
      inactiveServices,
      totalCategories,
    });
  } catch (error) {
    console.error("GET SERVICE STATS ERROR:", error);

    return errorResponse(res, "Failed to fetch service statistics", 500);
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const {
      search = "",
      category = "all",
      status = "all",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (currentPage - 1) * perPage;

    const query = {};

    const trimmedSearch = String(search).trim();

    if (trimmedSearch) {
      const escapedSearch = trimmedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

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

    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    const [totalServices, services] = await Promise.all([
      Service.countDocuments(query),

      Service.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
    ]);

    const totalPages = Math.ceil(totalServices / perPage);

    return successResponse(res, "Services fetched successfully", {
      services,

      pagination: {
        currentPage,
        perPage,
        totalServices,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search: trimmedSearch,
        category,
        status,
      },
    });
  } catch (error) {
    console.error("GET ADMIN SERVICES ERROR:", error);

    return errorResponse(res, "Failed to fetch services", 500);
  }
};

export const getAdminServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findById(id)
      .populate("category", "name")
      .lean();

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    return successResponse(
      res,
      "Service details fetched successfully",
      service
    );
  } catch (error) {
    console.error("GET SERVICE DETAILS ERROR:", error);

    return errorResponse(res, "Failed to fetch service details", 500);
  }
};

export const createAdminService = async (req, res) => {
  try {
    const {
      name,
      category,
      shortDescription,
      description,
      price,
      duration,
      image,
      highlights,
      includedServices,
      packages,
      isActive,
      isPopular,
      isFeatured,
      isRelated,
    } = req.body;

    const serviceName = String(name || "").trim();

    const serviceShortDescription = String(shortDescription || "").trim();

    const serviceDescription = String(description || "").trim();

    if (
      !serviceName ||
      !category ||
      !serviceShortDescription ||
      price === undefined ||
      duration === undefined
    ) {
      return errorResponse(
        res,
        "Name, category, short description, price and duration are required",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return errorResponse(res, "Invalid category ID", 400);
    }

    const categoryExists = await Category.exists({
      _id: category,
    });

    if (!categoryExists) {
      return errorResponse(res, "Category not found", 404);
    }

    const parsedPrice = parsePrice(price);
    const parsedDuration = parseDuration(duration);

    if (parsedPrice === null) {
      return errorResponse(
        res,
        "Price must be a valid non-negative number",
        400
      );
    }

    if (parsedDuration === null) {
      return errorResponse(res, "Duration must be a positive integer", 400);
    }

    const existingService = await Service.findOne({
      name: serviceName,
    });

    if (existingService) {
      return errorResponse(res, "Service already exists", 400);
    }

    const service = await Service.create({
      name: serviceName,

      category,

      shortDescription: serviceShortDescription,

      description: serviceDescription,

      price: parsedPrice,

      duration: parsedDuration,

      image: typeof image === "string" ? image.trim() : "",

      isActive: parseBoolean(isActive, true),

      isPopular: parseBoolean(isPopular, false),

      isFeatured: parseBoolean(isFeatured, false),

      isRelated: parseBoolean(isRelated, false),

      highlights: Array.isArray(highlights) ? highlights : [],

      includedServices: Array.isArray(includedServices) ? includedServices : [],

      packages: Array.isArray(packages) ? packages : [],
    });

    const populatedService = await Service.findById(service._id)
      .populate("category", "name")
      .lean();

    return successResponse(
      res,
      "Service created successfully",
      populatedService,
      201
    );
  } catch (error) {
    console.error("CREATE ADMIN SERVICE ERROR:", error);

    if (error?.code === 11000) {
      return errorResponse(res, "A service with this name already exists", 400);
    }

    return errorResponse(res, "Failed to create service", 500);
  }
};

export const updateAdminService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findById(id);

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    const {
      name,
      category,
      shortDescription,
      description,
      price,
      duration,
      image,
      highlights,
      includedServices,
      packages,
      isActive,
      isPopular,
      isFeatured,
      isRelated,
    } = req.body;

    if (name !== undefined) {
      const serviceName = String(name).trim();

      if (!serviceName) {
        return errorResponse(res, "Service name cannot be empty", 400);
      }

      const duplicate = await Service.findOne({
        name: serviceName,
        _id: { $ne: id },
      });

      if (duplicate) {
        return errorResponse(
          res,
          "Another service with this name already exists",
          400
        );
      }

      service.name = serviceName;
    }

    if (category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return errorResponse(res, "Invalid category ID", 400);
      }

      const categoryExists = await Category.exists({
        _id: category,
      });

      if (!categoryExists) {
        return errorResponse(res, "Category not found", 404);
      }

      service.category = category;
    }

    if (shortDescription !== undefined) {
      const value = String(shortDescription).trim();

      if (!value) {
        return errorResponse(res, "Short description cannot be empty", 400);
      }

      if (value.length > 100) {
        return errorResponse(
          res,
          "Short description cannot exceed 100 characters",
          400
        );
      }

      service.shortDescription = value;
    }

    if (description !== undefined) {
      const value = String(description).trim();

      if (value.length > 500) {
        return errorResponse(
          res,
          "Description cannot exceed 500 characters",
          400
        );
      }

      service.description = value;
    }

    if (price !== undefined) {
      const parsedPrice = parsePrice(price);

      if (parsedPrice === null) {
        return errorResponse(
          res,
          "Price must be a valid non-negative number",
          400
        );
      }

      service.price = parsedPrice;
    }

    if (duration !== undefined) {
      const parsedDuration = parseDuration(duration);

      if (parsedDuration === null) {
        return errorResponse(res, "Duration must be a positive integer", 400);
      }

      service.duration = parsedDuration;
    }

    if (image !== undefined) {
      if (typeof image !== "string") {
        return errorResponse(res, "Image must be a valid URL string", 400);
      }

      service.image = image.trim();
    }

    if (highlights !== undefined) {
      service.highlights = Array.isArray(highlights) ? highlights : [];
    }

    if (includedServices !== undefined) {
      service.includedServices = Array.isArray(includedServices)
        ? includedServices
        : [];
    }

    if (packages !== undefined) {
      service.packages = Array.isArray(packages) ? packages : [];
    }

    if (isActive !== undefined) {
      service.isActive = parseBoolean(isActive);
    }

    if (isPopular !== undefined) {
      service.isPopular = parseBoolean(isPopular);
    }

    if (isFeatured !== undefined) {
      service.isFeatured = parseBoolean(isFeatured);
    }

    if (isRelated !== undefined) {
      service.isRelated = parseBoolean(isRelated);
    }

    await service.save();

    const updatedService = await Service.findById(id)
      .populate("category", "name")
      .lean();

    return successResponse(res, "Service updated successfully", updatedService);
  } catch (error) {
    console.error("UPDATE ADMIN SERVICE ERROR:", error);

    if (error?.code === 11000) {
      return errorResponse(res, "A service with this name already exists", 400);
    }

    return errorResponse(res, "Failed to update service", 500);
  }
};

export const activateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findById(id);

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    service.isActive = true;

    await service.save();

    return successResponse(res, "Service activated successfully", service);
  } catch (error) {
    console.error("ACTIVATE SERVICE ERROR:", error);

    return errorResponse(res, "Failed to activate service", 500);
  }
};

export const deactivateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findById(id);

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    service.isActive = false;

    await service.save();

    return successResponse(res, "Service deactivated successfully", service);
  } catch (error) {
    console.error("DEACTIVATE SERVICE ERROR:", error);

    return errorResponse(res, "Failed to deactivate service", 500);
  }
};

export const deleteAdminService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const service = await Service.findById(id);

    if (!service) {
      return errorResponse(res, "Service not found", 404);
    }

    await Service.findByIdAndDelete(id);

    return successResponse(res, "Service deleted successfully");
  } catch (error) {
    console.error("DELETE ADMIN SERVICE ERROR:", error);

    return errorResponse(res, "Failed to delete service", 500);
  }
};
