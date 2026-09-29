import SiteSettings from "../../models/siteSettings.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_SETTINGS = {
  key: "global",

  navbar: {
    logo: "/uploads/logo.png",
    logoLink: "/",

    menuItems: [
      {
        label: "Home",
        href: "/",
        isActive: true,
        order: 1,
      },
      {
        label: "Services",
        href: "/services",
        isActive: true,
        order: 2,
      },
      {
        label: "Workers",
        href: "/workers",
        isActive: true,
        order: 3,
      },
      {
        label: "About Us",
        href: "/about",
        isActive: true,
        order: 4,
      },
      {
        label: "Contact",
        href: "/contact",
        isActive: true,
        order: 5,
      },
    ],

    loginButton: {
      text: "Log In",
      link: "/login",
      enabled: true,
    },

    signupButton: {
      text: "Sign Up",
      link: "/signup",
      enabled: true,
    },

    isActive: true,
  },

  footer: {
    logo: "/uploads/logo.png",

    description:
      "ServyNex is your trusted partner for home services. We connect you with verified professionals to make your life easier.",

    socialLinks: [
      {
        platform: "facebook",
        url: "#",
        isActive: true,
      },
      {
        platform: "instagram",
        url: "#",
        isActive: true,
      },
      {
        platform: "twitter",
        url: "#",
        isActive: true,
      },
      {
        platform: "youtube",
        url: "#",
        isActive: true,
      },
    ],

    columns: [
      {
        title: "Quick Links",
        order: 1,
        links: [
          {
            label: "Home",
            href: "/",
            isActive: true,
            order: 1,
          },
          {
            label: "Services",
            href: "/services",
            isActive: true,
            order: 2,
          },
          {
            label: "Workers",
            href: "/workers",
            isActive: true,
            order: 3,
          },
          {
            label: "About Us",
            href: "/about",
            isActive: true,
            order: 4,
          },
          {
            label: "Contact",
            href: "/contact",
            isActive: true,
            order: 5,
          },
        ],
      },

      {
        title: "For Customers",
        order: 2,
        links: [
          {
            label: "How It Works",
            href: "/how-it-works",
            isActive: true,
            order: 1,
          },
          {
            label: "Book a Service",
            href: "/services",
            isActive: true,
            order: 2,
          },
          {
            label: "My Bookings",
            href: "/customer-dashboard",
            isActive: true,
            order: 3,
          },
          {
            label: "Help & Support",
            href: "/contact",
            isActive: true,
            order: 4,
          },
          {
            label: "Terms & Conditions",
            href: "/terms",
            isActive: true,
            order: 5,
          },
        ],
      },

      {
        title: "For Professionals",
        order: 3,
        links: [
          {
            label: "Become a Professional",
            href: "/worker-register",
            isActive: true,
            order: 1,
          },
          {
            label: "Professional Login",
            href: "/worker-login",
            isActive: true,
            order: 2,
          },
          {
            label: "Training & Guidelines",
            href: "/training",
            isActive: true,
            order: 3,
          },
          {
            label: "FAQs",
            href: "/faq",
            isActive: true,
            order: 4,
          },
        ],
      },
    ],

    contact: {
      title: "Contact Us",
      phone: "+91 98765 43210",
      email: "support@servynex.com",
      address: "123, Green Park, New Delhi, India - 110016",
    },

    copyright: "© 2024 ServyNex. All rights reserved.",

    isActive: true,
  },
};

export const createWebsiteSettings = async (req, res) => {
  try {
    const existing = await SiteSettings.findOne({
      key: "global",
    });

    if (existing) {
      return errorResponse(res, "Website settings already exist", 409);
    }

    const settings = await SiteSettings.create(DEFAULT_SETTINGS);

    return successResponse(
      res,
      "Website settings created successfully",
      settings,
      201
    );
  } catch (error) {
    console.error("createWebsiteSettings error:", error);

    return errorResponse(res, "Failed to create website settings", 500);
  }
};

export const getAdminWebsiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne({
      key: "global",
    }).lean();

    if (!settings) {
      return errorResponse(res, "Website settings not found", 404);
    }

    return successResponse(
      res,
      "Website settings fetched successfully",
      settings
    );
  } catch (error) {
    console.error("getAdminWebsiteSettings error:", error);

    return errorResponse(res, "Failed to fetch website settings", 500);
  }
};

export const updateNavbar = async (req, res) => {
  try {
    const { logo, logoLink, menuItems, loginButton, signupButton, isActive } =
      req.body;

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          ...(logo !== undefined && {
            "navbar.logo": logo,
          }),

          ...(logoLink !== undefined && {
            "navbar.logoLink": logoLink,
          }),

          ...(menuItems !== undefined && {
            "navbar.menuItems": menuItems,
          }),

          ...(loginButton !== undefined && {
            "navbar.loginButton": loginButton,
          }),

          ...(signupButton !== undefined && {
            "navbar.signupButton": signupButton,
          }),

          ...(isActive !== undefined && {
            "navbar.isActive": isActive,
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!settings) {
      return errorResponse(res, "Website settings not found", 404);
    }

    return successResponse(res, "Navbar updated successfully", settings.navbar);
  } catch (error) {
    console.error("updateNavbar error:", error);

    return errorResponse(res, "Failed to update navbar", 500);
  }
};

export const updateFooter = async (req, res) => {
  try {
    const {
      logo,
      description,
      socialLinks,
      columns,
      contact,
      copyright,
      isActive,
    } = req.body;

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          ...(logo !== undefined && {
            "footer.logo": logo,
          }),

          ...(description !== undefined && {
            "footer.description": description,
          }),

          ...(socialLinks !== undefined && {
            "footer.socialLinks": socialLinks,
          }),

          ...(columns !== undefined && {
            "footer.columns": columns,
          }),

          ...(contact !== undefined && {
            "footer.contact": contact,
          }),

          ...(copyright !== undefined && {
            "footer.copyright": copyright,
          }),

          ...(isActive !== undefined && {
            "footer.isActive": isActive,
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!settings) {
      return errorResponse(res, "Website settings not found", 404);
    }

    return successResponse(res, "Footer updated successfully", settings.footer);
  } catch (error) {
    console.error("updateFooter error:", error);

    return errorResponse(res, "Failed to update footer", 500);
  }
};

export const updateWebsiteSettings = async (req, res) => {
  try {
    const { navbar, footer } = req.body;

    const update = {};

    if (navbar !== undefined) {
      update.navbar = navbar;
    }

    if (footer !== undefined) {
      update.footer = footer;
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!settings) {
      return errorResponse(res, "Website settings not found", 404);
    }

    return successResponse(
      res,
      "Website settings updated successfully",
      settings
    );
  } catch (error) {
    console.error("updateWebsiteSettings error:", error);

    return errorResponse(res, "Failed to update website settings", 500);
  }
};
