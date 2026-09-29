import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      immutable: true,
      trim: true,
    },

    navbar: {
      logo: {
        type: String,
        default: "/uploads/logo.png",
        trim: true,
      },

      logoLink: {
        type: String,
        default: "/",
        trim: true,
      },

      menuItems: {
        type: [
          {
            label: {
              type: String,
              required: true,
              trim: true,
            },

            href: {
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
        default: [],
      },

      loginButton: {
        text: {
          type: String,
          default: "Log In",
          trim: true,
        },

        link: {
          type: String,
          default: "/login",
          trim: true,
        },

        enabled: {
          type: Boolean,
          default: true,
        },
      },

      signupButton: {
        text: {
          type: String,
          default: "Sign Up",
          trim: true,
        },

        link: {
          type: String,
          default: "/signup",
          trim: true,
        },

        enabled: {
          type: Boolean,
          default: true,
        },
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    footer: {
      logo: {
        type: String,
        default: "/uploads/logo.png",
        trim: true,
      },

      description: {
        type: String,
        default:
          "ServyNex is your trusted partner for home services. We connect you with verified professionals to make your life easier.",
        trim: true,
      },

      socialLinks: {
        type: [
          {
            platform: {
              type: String,
              required: true,
              trim: true,
            },

            url: {
              type: String,
              default: "#",
              trim: true,
            },

            isActive: {
              type: Boolean,
              default: true,
            },
          },
        ],
        default: [],
      },

      columns: {
        type: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },

            order: {
              type: Number,
              default: 0,
            },

            links: {
              type: [
                {
                  label: {
                    type: String,
                    required: true,
                    trim: true,
                  },

                  href: {
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
              default: [],
            },
          },
        ],
        default: [],
      },

      contact: {
        title: {
          type: String,
          default: "Contact Us",
          trim: true,
        },

        phone: {
          type: String,
          default: "+91 98765 43210",
          trim: true,
        },

        email: {
          type: String,
          default: "support@servynex.com",
          trim: true,
        },

        address: {
          type: String,
          default: "123, Green Park, New Delhi, India - 110016",
          trim: true,
        },
      },

      copyright: {
        type: String,
        default: "© 2024 ServyNex. All rights reserved.",
        trim: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    collection: "siteSettings",
  }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
