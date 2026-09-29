import mongoose from "mongoose";

const serviceContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "services-hero",
      unique: true,
      immutable: true,
    },

    hero: {
      badge: {
        type: String,
        default: "PROFESSIONAL HOME SERVICES",
        trim: true,
        maxlength: 100,
      },

      title: {
        type: String,
        default: "Quality Services",
        trim: true,
        maxlength: 150,
      },

      highlightedTitle: {
        type: String,
        default: "For Your Home",
        trim: true,
        maxlength: 150,
      },

      description: {
        type: String,
        default:
          "Find reliable, verified and skilled professionals for every home service need. Fast booking, transparent pricing and 100% satisfaction guaranteed.",
        trim: true,
        maxlength: 500,
      },

      primaryButton: {
        text: {
          type: String,
          default: "Book a Service",
          trim: true,
          maxlength: 100,
        },

        link: {
          type: String,
          default: "/services",
          trim: true,
          maxlength: 300,
        },
      },

      secondaryButton: {
        text: {
          type: String,
          default: "Become a Worker",
          trim: true,
          maxlength: 100,
        },

        link: {
          type: String,
          default: "/register?role=worker",
          trim: true,
          maxlength: 300,
        },
      },

      image: {
        type: String,
        default: "",
        trim: true,
        maxlength: 1000,
      },
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

export default mongoose.model("ServiceContent", serviceContentSchema);
