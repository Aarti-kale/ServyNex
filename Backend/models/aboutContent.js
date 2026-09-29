import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: {
        type: String,
        default: "ABOUT US",
        trim: true,
        maxlength: 50,
      },

      mainTitle: {
        type: String,
        default: "About ServyNex",
        trim: true,
        maxlength: 100,
      },

      highlightedTitle: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      description: {
        type: String,
        default:
          "We are on a mission to make home services simple, reliable and accessible for everyone.",
        trim: true,
        maxlength: 300,
      },

      primaryButton: {
        text: {
          type: String,
          default: "Book a Service",
          trim: true,
          maxlength: 50,
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
          default: "Contact Us",
          trim: true,
          maxlength: 50,
        },

        link: {
          type: String,
          default: "/contact",
          trim: true,
          maxlength: 300,
        },
      },

      highlights: {
        type: [
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
        default: [],
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },
    },
    story: {
      title: {
        type: String,
        default: "Our Story",
        trim: true,
      },

      paragraphs: {
        type: [String],
        default: [],
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },
    },

    missionVision: {
      title: {
        type: String,
        default: "Mission & Vision",
        trim: true,
      },

      mission: {
        title: {
          type: String,
          default: "Our Mission",
          trim: true,
        },

        description: {
          type: String,
          default: "",
          trim: true,
        },

        icon: {
          type: String,
          default: "target",
          trim: true,
        },
      },

      vision: {
        title: {
          type: String,
          default: "Our Vision",
          trim: true,
        },

        description: {
          type: String,
          default: "",
          trim: true,
        },

        icon: {
          type: String,
          default: "eye",
          trim: true,
        },
      },
    },

    coreValues: {
      title: {
        type: String,
        default: "Our Core Values",
        trim: true,
      },

      values: {
        type: [
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
        default: [],
      },
    },

    journey: {
      title: {
        type: String,
        default: "Our Journey",
        trim: true,
      },

      milestones: {
        type: [
          {
            year: {
              type: Number,
              required: true,
            },

            title: {
              type: String,
              required: true,
              trim: true,
            },

            icon: {
              type: String,
              default: "",
              trim: true,
            },
          },
        ],
        default: [],
      },
    },

    commitment: {
      title: {
        type: String,
        default: "Our Commitment",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      points: {
        type: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },

            icon: {
              type: String,
              default: "",
              trim: true,
            },
          },
        ],
        default: [],
      },

      image: {
        type: String,
        default: "",
        trim: true,
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

aboutContentSchema.index({ isActive: 1 }, { unique: true });

const AboutContent = mongoose.model("AboutContent", aboutContentSchema);

export default AboutContent;
