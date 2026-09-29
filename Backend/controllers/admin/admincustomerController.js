import User from "../../models/users.js";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: "user",
    });

    const activeCustomers = await User.countDocuments({
      role: "user",
      isBlocked: false,
    });

    const blockedCustomers = await User.countDocuments({
      role: "user",
      isBlocked: true,
    });

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newThisMonth = await User.countDocuments({
      role: "user",
      createdAt: {
        $gte: startOfMonth,
      },
    });

    return successResponse(res, "Customer statistics fetched successfully", {
      totalCustomers,
      activeCustomers,
      newThisMonth,
      blockedCustomers,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const getCustomers = async (req, res) => {
  try {
    const {
      search = "",
      status = "all",
      city = "",
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(
      Math.max(Number.parseInt(limit, 10) || 10, 1),
      100
    );
    const skip = (currentPage - 1) * perPage;

    const query = {
      role: "user",
    };

    const escapeRegex = (value) => {
      return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");

      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (status === "blocked") {
      query.isBlocked = true;
    } else if (status === "active") {
      query.isBlocked = { $ne: true };
    }

    const trimmedCity = city.trim();

    if (trimmedCity) {
      query.location = {
        $regex: escapeRegex(trimmedCity),
        $options: "i",
      };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      nameAsc: { name: 1 },
      nameDesc: { name: -1 },
    };

    const sortQuery = sortOptions[sort] || sortOptions.newest;

    const totalCustomers = await User.countDocuments(query);

    const customers = await User.find(query)
      .select("-password")
      .sort(sortQuery)
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalPages = Math.ceil(totalCustomers / perPage);

    return successResponse(res, "Customers fetched successfully", {
      count: customers.length,
      customers,

      pagination: {
        currentPage,
        perPage,
        totalCustomers,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        search: trimmedSearch,
        status,
        city: trimmedCity,
        sort,
      },
    });
  } catch (error) {
    console.error("getCustomers error:", error);

    return errorResponse(res, "Failed to fetch customers", 500);
  }
};

export const getCustomerDetails = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "user",
    }).select("-password");

    if (!customer) {
      return errorResponse(res, "Customer not found", 404);
    }

    const bookings = await Booking.find({
      user: customer._id,
    })
      .populate("worker", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    const totalSpent = 0;

    const averageSpend =
      totalBookings > 0 ? Math.round(totalSpent / totalBookings) : 0;

    const ratings = bookings
      .filter((booking) => booking.rating)
      .map((booking) => booking.rating);

    const averageRating =
      ratings.length > 0
        ? Number(
            (
              ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            ).toFixed(1)
          )
        : 0;

    const recentBookings = bookings.slice(0, 5);

    return successResponse(res, "Customer details fetched successfully", {
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        isBlocked: customer.isBlocked,
        createdAt: customer.createdAt,
      },

      statistics: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        totalSpent,
        averageSpend,
        averageRating,
      },

      recentBookings,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
export const getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await User.findOne({
      _id: customerId,
      role: "user",
    }).select("name email");

    if (!customer) {
      return errorResponse(res, "Customer not found", 404);
    }

    const reviews = await Booking.find({
      user: customerId,
      rating: { $exists: true, $ne: null },
      review: { $exists: true, $ne: "" },
    })
      .populate("worker", "name")
      .populate("service", "name")
      .select("rating review worker service date createdAt")
      .sort({ createdAt: -1 });

    return successResponse(res, "Customer reviews fetched successfully", {
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
      },

      count: reviews.length,

      reviews,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getCustomerActivity = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await User.findOne({
      _id: customerId,
      role: "user",
    }).select("name email");

    if (!customer) {
      return errorResponse(res, "Customer not found", 404);
    }

    const activities = await Booking.find({
      user: customerId,
    })
      .populate("worker", "name")
      .populate("service", "name")
      .select("service worker date status rating review createdAt updatedAt")
      .sort({ createdAt: -1 });

    return successResponse(res, "Customer activity fetched successfully", {
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
      },

      count: activities.length,

      activities,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
