import mongoose from "mongoose";

import Category from "../../models/category.js";
import Service from "../../models/service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();

    const activeCategories = await Category.countDocuments({
      isActive: true,
    });

    const totalServices = await Service.countDocuments();

    const popularCategory = await Service.aggregate([
      {
        $match: {
          category: {
            $exists: true,
            $ne: null,
          },
        },
      },

      {
        $group: {
          _id: "$category",
          servicesCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          servicesCount: -1,
        },
      },

      {
        $limit: 1,
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: "$category._id",
          name: "$category.name",
          servicesCount: 1,
        },
      },
    ]);

    const mostPopular = popularCategory.length > 0 ? popularCategory[0] : null;

    return successResponse(res, "Category stats fetched successfully", {
      totalCategories,
      activeCategories,

      inactiveCategories: totalCategories - activeCategories,

      totalServices,

      mostPopularCategory: mostPopular,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const { search = "", status = "all", page = 1, limit = 8 } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const perPage = Math.max(Number(limit), 1);

    const skip = (currentPage - 1) * perPage;

    const query = {};

    if (search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    const totalCategories = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(perPage)
      .lean();

    const categoryIds = categories.map((category) => category._id);

    const serviceCounts = await Service.aggregate([
      {
        $match: {
          category: {
            $in: categoryIds,
          },
        },
      },

      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const countMap = new Map();

    serviceCounts.forEach((item) => {
      countMap.set(item._id.toString(), item.count);
    });

    const formattedCategories = categories.map((category) => ({
      ...category,

      servicesCount: countMap.get(category._id.toString()) || 0,
    }));

    const totalPages = Math.ceil(totalCategories / perPage);

    return successResponse(res, "Categories fetched successfully", {
      categories: formattedCategories,

      pagination: {
        currentPage,
        perPage,
        totalCategories,
        totalPages,

        hasNextPage: currentPage < totalPages,

        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search,
        status,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getAdminCategoryDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid category ID", 400);
    }

    const category = await Category.findById(id).lean();

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const servicesCount = await Service.countDocuments({
      category: id,
    });

    const services = await Service.find({
      category: id,
    })
      .select("name price duration isActive image")
      .sort({
        createdAt: -1,
      })
      .lean();

    return successResponse(res, "Category details fetched successfully", {
      ...category,
      servicesCount,
      services,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createAdminCategory = async (req, res) => {
  try {
    const { name, icon, shortDescription, image, isActive } = req.body;

    if (!name || !shortDescription) {
      return errorResponse(
        res,
        "Category name and short description are required",
        400
      );
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return errorResponse(res, "Category already exists", 400);
    }

    const category = await Category.create({
      name: name.trim(),

      icon: icon?.trim() || "",

      shortDescription: shortDescription.trim(),

      image: image || "",

      isActive: isActive === undefined ? true : Boolean(isActive),
    });

    return successResponse(res, "Category created successfully", category, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid category ID", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const { name, icon, shortDescription, image, isActive } = req.body;

    if (name !== undefined) {
      const duplicate = await Category.findOne({
        name: name.trim(),
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return errorResponse(
          res,
          "Another category with this name already exists",
          400
        );
      }

      category.name = name.trim();
    }

    if (icon !== undefined) {
      category.icon = icon.trim();
    }

    if (shortDescription !== undefined) {
      category.shortDescription = shortDescription.trim();
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    await category.save();

    return successResponse(res, "Category updated successfully", category);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const activateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    category.isActive = true;

    await category.save();

    return successResponse(res, "Category activated successfully", category);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deactivateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    category.isActive = false;

    await category.save();

    return successResponse(res, "Category deactivated successfully", category);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid category ID", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const servicesCount = await Service.countDocuments({
      category: id,
    });

    if (servicesCount > 0) {
      return errorResponse(
        res,
        `Cannot delete category because ${servicesCount} service(s) are using it`,
        400
      );
    }

    await Category.findByIdAndDelete(id);

    return successResponse(res, "Category deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
