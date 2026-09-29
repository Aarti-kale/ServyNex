import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "reported", "hidden"],
      default: "pending",
      index: true,
    },

    reportReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reportedAt: {
      type: Date,
      default: null,
    },

    hiddenReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    hiddenAt: {
      type: Date,
      default: null,
    },

    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reply: {
      text: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      repliedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
