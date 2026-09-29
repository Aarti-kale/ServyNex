import mongoose from "mongoose";

const professionalHeroSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "professionals-hero",
      trim: true,
    },

    hero: {
      badge: {
        type: String,
        trim: true,
        default: "OUR PROFESSIONALS",
      },

      title: {
        type: String,
        trim: true,
        default: "Meet Our Trusted",
      },

      highlightedTitle: {
        type: String,
        trim: true,
        default: "Professionals",
      },

      description: {
        type: String,
        trim: true,
        default:
          "500+ verified experts delivering quality home services with professionalism and care.",
      },

      primaryButton: {
        text: {
          type: String,
          trim: true,
          default: "Explore Services",
        },

        link: {
          type: String,
          trim: true,
          default: "/services",
        },
      },

      secondaryButton: {
        text: {
          type: String,
          trim: true,
          default: "See How It Works",
        },

        link: {
          type: String,
          trim: true,
          default: "#hiring-process",
        },
      },

      image: {
        type: String,
        trim: true,
        default: "",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProfessionalHero = mongoose.model(
  "ProfessionalHero",
  professionalHeroSchema
);

export default ProfessionalHero;
