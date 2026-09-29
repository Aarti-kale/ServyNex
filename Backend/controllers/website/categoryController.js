import mongoose from "mongoose";

import Category from "../../models/category.js";
import Service from "../../models/service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const categoryIds = categories.map((category) => category._id);

    const serviceCounts = await Service.aggregate([
      {
        $match: {
          category: {
            $in: categoryIds,
          },
          isActive: true,
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

    const result = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      icon: category.icon || "",
      shortDescription: category.shortDescription || "",
      image: category.image || "",
      servicesCount: countMap.get(category._id.toString()) || 0,
    }));

    return successResponse(res, "Categories fetched successfully", result);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getPublicCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid category ID", 400);
    }

    const category = await Category.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const services = await Service.find({
      category: id,
      isActive: true,
    })
      .select("name shortDescription description price duration image category")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(res, "Category fetched successfully", {
      category: {
        _id: category._id,
        name: category.name,
        icon: category.icon || "",
        shortDescription: category.shortDescription || "",
        image: category.image || "",
      },

      services,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
