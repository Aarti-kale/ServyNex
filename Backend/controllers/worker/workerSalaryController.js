import Payment from "../../models/Payment.js";
import User from "../../models/users.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getWorkerSalary = async (req, res) => {
  try {
    const workerId = req.user._id;

    const { period = "month", search = "", page = 1, limit = 5 } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);

    const now = new Date();

    let rangeStart = null;
    let rangeEnd = new Date();

    if (period === "today") {
      rangeStart = new Date();
      rangeStart.setHours(0, 0, 0, 0);
    }

    if (period === "week") {
      rangeStart = new Date();
      rangeStart.setDate(rangeStart.getDate() - 6);
      rangeStart.setHours(0, 0, 0, 0);
    }

    if (period === "month") {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (period === "all") {
      rangeStart = null;
    }

    const allPayments = await Payment.find({
      worker: workerId,
    })
      .populate("customer", "name phone email")
      .populate("service", "name")
      .populate("booking")
      .sort({
        paymentDate: -1,
        createdAt: -1,
      })
      .lean();

    const paidPayments = allPayments.filter(
      (payment) => payment.status === "paid"
    );

    const totalSalary = paidPayments.reduce(
      (sum, payment) => sum + (payment.totalAmount || 0),
      0
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySalary = paidPayments
      .filter((payment) => {
        const paymentDate = payment.paymentDate || payment.createdAt;

        return (
          new Date(paymentDate) >= todayStart &&
          new Date(paymentDate) <= todayEnd
        );
      })
      .reduce((sum, payment) => sum + (payment.totalAmount || 0), 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekSalary = paidPayments
      .filter((payment) => {
        const paymentDate = payment.paymentDate || payment.createdAt;

        return new Date(paymentDate) >= weekStart;
      })
      .reduce((sum, payment) => sum + (payment.totalAmount || 0), 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthSalary = paidPayments
      .filter((payment) => {
        const paymentDate = payment.paymentDate || payment.createdAt;

        return new Date(paymentDate) >= monthStart;
      })
      .reduce((sum, payment) => sum + (payment.totalAmount || 0), 0);

    let salaryHistory = allPayments.filter((payment) => {
      const paymentDate = payment.paymentDate || payment.createdAt;

      const date = new Date(paymentDate);

      if (rangeStart) {
        if (date < rangeStart || date > rangeEnd) {
          return false;
        }
      }

      if (search.trim()) {
        const text = search.trim().toLowerCase();

        const serviceName = payment.service?.name?.toLowerCase() || "";

        const customerName = payment.customer?.name?.toLowerCase() || "";

        const customerPhone = payment.customer?.phone?.toLowerCase() || "";

        const paymentId = payment.paymentId?.toLowerCase() || "";

        if (
          !serviceName.includes(text) &&
          !customerName.includes(text) &&
          !customerPhone.includes(text) &&
          !paymentId.includes(text)
        ) {
          return false;
        }
      }

      return true;
    });

    const totalHistory = salaryHistory.length;

    const totalPages = Math.ceil(totalHistory / perPage);

    const startIndex = (currentPage - 1) * perPage;

    salaryHistory = salaryHistory.slice(startIndex, startIndex + perPage);

    const paidAmount = paidPayments.reduce(
      (sum, payment) => sum + (payment.totalAmount || 0),
      0
    );

    const pendingAmount = allPayments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + (payment.totalAmount || 0), 0);

    const processingAmount = allPayments
      .filter((payment) => payment.status === "processing")
      .reduce((sum, payment) => sum + (payment.totalAmount || 0), 0);

    const recentTransactions = allPayments.slice(0, 5);

    return successResponse(res, "Worker salary fetched successfully", {
      salary: {
        today: todaySalary,
        week: weekSalary,
        month: monthSalary,
        total: totalSalary,
      },

      history: salaryHistory,

      salarySummary: {
        paid: paidAmount,
        pending: pendingAmount,
        processing: processingAmount,
        total: paidAmount + pendingAmount + processingAmount,
      },

      recentTransactions,

      pagination: {
        currentPage,
        perPage,
        totalHistory,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      filters: {
        period,
        search,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkerSalaryDetails = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      worker: req.user._id,
    })
      .populate("customer", "name phone email")
      .populate("service", "name description")
      .populate("booking");

    if (!payment) {
      return errorResponse(res, "Salary record not found", 404);
    }

    return successResponse(res, "Salary details fetched successfully", payment);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getWorkerBankDetails = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.user._id,
      role: "worker",
    }).select("bankDetails");

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    return successResponse(
      res,
      "Bank details fetched successfully",
      worker.bankDetails || {}
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateWorkerBankDetails = async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, branch } = req.body;

    if (!bankName || !accountNumber || !ifscCode || !branch) {
      return errorResponse(
        res,
        "Bank name, account number, IFSC code and branch are required",
        400
      );
    }

    const worker = await User.findOne({
      _id: req.user._id,
      role: "worker",
    });

    if (!worker) {
      return errorResponse(res, "Worker not found", 404);
    }

    worker.bankDetails = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      branch: branch.trim(),
    };

    await worker.save();

    return successResponse(
      res,
      "Bank details updated successfully",
      worker.bankDetails
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
