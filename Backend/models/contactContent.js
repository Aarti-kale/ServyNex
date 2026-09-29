import mongoose from "mongoose";

const contactCardSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    secondaryValue: {
      type: String,
      default: "",
      trim: true,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const subjectSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const helpTopicSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
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

    link: {
      type: String,
      default: "",
      trim: true,
    },

    linkText: {
      type: String,
      default: "Get Help",
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const contactContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "contact",
      trim: true,
    },

    hero: {
      badge: {
        type: String,
        default: "CONTACT US",
        trim: true,
      },

      title: {
        type: String,
        default: "We're Here To Help You",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      primaryButtonText: {
        type: String,
        default: "Call Now",
        trim: true,
      },

      primaryButtonLink: {
        type: String,
        default: "",
        trim: true,
      },

      secondaryButtonText: {
        type: String,
        default: "Send Message",
        trim: true,
      },

      secondaryButtonLink: {
        type: String,
        default: "#contact-form",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },
    },

    contactCards: {
      type: [contactCardSchema],
      default: [],
    },

    contactForm: {
      badge: {
        type: String,
        default: "Send Us a Message",
        trim: true,
      },

      title: {
        type: String,
        default: "We'd love to hear from you!",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      image: {
        type: String,
        default: "",
        trim: true,
      },

      submitButtonText: {
        type: String,
        default: "Send Message",
        trim: true,
      },

      subjects: {
        type: [subjectSchema],
        default: [],
      },
    },

    officeLocation: {
      title: {
        type: String,
        default: "Our Office Location",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      officeName: {
        type: String,
        default: "ServyNex Office",
        trim: true,
      },

      address: {
        type: String,
        default: "",
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },

      directionsText: {
        type: String,
        default: "Directions",
        trim: true,
      },

      directionsLink: {
        type: String,
        default: "",
        trim: true,
      },

      mapEmbedUrl: {
        type: String,
        default: "",
        trim: true,
      },

      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    helpSection: {
      title: {
        type: String,
        default: "How Can We Help You?",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      topics: {
        type: [helpTopicSchema],
        default: [],
      },
    },

    supportCta: {
      title: {
        type: String,
        default: "Still Need Help?",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      buttonText: {
        type: String,
        default: "Contact Support",
        trim: true,
      },

      buttonLink: {
        type: String,
        default: "#contact-form",
        trim: true,
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
    },
  },
  {
    timestamps: true,
  }
);

const ContactContent =
  mongoose.models.ContactContent ||
  mongoose.model("ContactContent", contactContentSchema, "contactContent");

export default ContactContent;
