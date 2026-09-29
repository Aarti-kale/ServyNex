import crypto from "crypto";
import mongoose from "mongoose";

import razorpay from "../../config/razorpay.js";
import Booking from "../../models/booking.js";
import Service from "../../models/service.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { service, address, date } = req.body;

    if (!service || !address || !date) {
      return errorResponse(res, "Service, address and date are required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(service)) {
      return errorResponse(res, "Invalid service ID", 400);
    }

    const serviceData = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!serviceData) {
      return errorResponse(res, "Service not available", 404);
    }

    const bookingDate = new Date(date);

    if (Number.isNaN(bookingDate.getTime())) {
      return errorResponse(res, "Invalid booking date", 400);
    }

    if (bookingDate <= new Date()) {
      return errorResponse(res, "Booking date must be in the future", 400);
    }

    const amountInPaise = Math.round(Number(serviceData.price) * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return errorResponse(res, "Invalid service price", 400);
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        serviceId: serviceData._id.toString(),
      },
    });

    const booking = await Booking.create({
      user: req.user._id,
      worker: null,
      service: serviceData._id,
      address: address.trim(),
      date: bookingDate,
      paymentMethod: "online",
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return successResponse(
      res,
      "Payment order created successfully",
      {
        bookingId: booking._id,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        service: {
          id: serviceData._id,
          name: serviceData.name,
          price: serviceData.price,
        },
      },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return errorResponse(res, "Payment verification data is incomplete", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return errorResponse(res, "Invalid booking ID", 400);
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      return errorResponse(res, "Booking not found", 404);
    }

    if (booking.paymentStatus === "paid") {
      return successResponse(res, "Payment already verified", {
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
      });
    }
    if (booking.razorpayOrderId !== razorpay_order_id) {
      return errorResponse(res, "Payment order mismatch", 400);
    }

    const signaturePayload = `${booking.razorpayOrderId}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      booking.paymentStatus = "failed";
      await booking.save();

      return errorResponse(res, "Payment verification failed", 400);
    }

    booking.razorpayPaymentId = razorpay_payment_id;

    booking.paymentStatus = "paid";
    booking.paidAt = new Date();

    await booking.save();

    return successResponse(res, "Payment verified successfully", {
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
      paymentId: booking.razorpayPaymentId,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
