import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isRelated: {
      type: Boolean,
      default: false,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    highlights: {
      type: [String],
      default: [],
    },

    includedServices: {
      type: [String],
      default: [],
    },

    packages: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },

          description: {
            type: String,
            default: "",
            trim: true,
          },

          price: {
            type: Number,
            required: true,
            min: 0,
          },

          features: {
            type: [String],
            default: [],
          },

          isPopular: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
