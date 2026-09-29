import mongoose from "mongoose";

const standardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: true,
  }
);

const professionalStandardsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "professional-standards",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      default: "Our Professional Standards",
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
      default: "Quality, safety and trust is our priority",
    },

    standards: {
      type: [standardSchema],
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
  "ProfessionalStandards",
  professionalStandardsSchema
);
