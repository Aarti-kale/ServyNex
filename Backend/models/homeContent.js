import mongoose from "mongoose";

const homepageContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: {
        type: String,
        default: "#1 Home Service Platform",
        trim: true,
      },

      title: {
        type: String,
        default: "Reliable Home Services, Just a Few Clicks Away",
        trim: true,
      },

      description: {
        type: String,
        default:
          "Book trusted professionals for all your home service needs. Fast, reliable and hassle-free.",
        trim: true,
      },

      primaryButtonText: {
        type: String,
        default: "Book a Service",
        trim: true,
      },

      primaryButtonLink: {
        type: String,
        default: "/services",
        trim: true,
      },

      secondaryButtonText: {
        type: String,
        default: "How It Works",
        trim: true,
      },

      secondaryButtonLink: {
        type: String,
        default: "/how-it-works",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },
    },

    howItWorks: {
      title: {
        type: String,
        default: "How ServyNex Works",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "Simple steps to get your service done",
        trim: true,
      },

      steps: [
        {
          stepNumber: {
            type: Number,
            required: true,
          },

          title: {
            type: String,
            required: true,
            trim: true,
          },

          description: {
            type: String,
            default: "",
            trim: true,
          },

          icon: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
    },

    whyChoose: {
      title: {
        type: String,
        default: "Why Choose ServyNex",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "We are committed to providing the best experience",
        trim: true,
      },

      features: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },

          description: {
            type: String,
            default: "",
            trim: true,
          },

          icon: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],
    },

    cta: {
      title: {
        type: String,
        default: "Need a Professional for Your Home?",
        trim: true,
      },

      description: {
        type: String,
        default: "Book trusted professionals in just a few clicks.",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Book a Service Now",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "/services",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },
    },

    faqs: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },

        answer: {
          type: String,
          required: true,
          trim: true,
        },

        isActive: {
          type: Boolean,
          default: true,
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],

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

homepageContentSchema.index({ isActive: 1 }, { unique: true });

const HomepageContent = mongoose.model(
  "HomepageContent",
  homepageContentSchema
);

export default HomepageContent;
