import mongoose from "mongoose";

const verificationStepSchema = new mongoose.Schema(
  {
    step: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    _id: true,
  }
);

const professionalVerificationProcessSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "professional-verification-process",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      default: "Our Hiring Verification Process",
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
      default:
        "We follow a strict process to ensure the best professionals for you",
    },

    steps: {
      type: [verificationStepSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ProfessionalVerificationProcess",
  professionalVerificationProcessSchema
);
