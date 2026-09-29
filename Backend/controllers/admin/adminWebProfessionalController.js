import ProfessionalHero from "../../models/professionalHero.js";
import ProfessionalStandards from "../../models/professionalStandards.js";
import ProfessionalVerificationProcess from "../../models/professionalVerificationProcess.js";

import BecomeProfessional from "../../models/BecomeProfessional.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_PROFESSIONAL_HERO = {
  badge: "OUR PROFESSIONALS",
  title: "Meet Our Trusted",
  highlightedTitle: "Professionals",
  description:
    "500+ verified experts delivering quality home services with professionalism and care.",

  primaryButton: {
    text: "Explore Services",
    link: "/services",
  },

  secondaryButton: {
    text: "See How It Works",
    link: "#hiring-process",
  },

  image: "",
};

export const getAdminProfessionalHero = async (req, res) => {
  try {
    const content = await ProfessionalHero.findOne({
      key: "professionals-hero",
    })
      .select("key hero isActive createdAt updatedAt")
      .lean();

    if (!content) {
      return successResponse(
        res,
        "Professionals hero content fetched successfully",
        {
          key: "professionals-hero",
          hero: DEFAULT_PROFESSIONAL_HERO,
          isActive: true,
          createdAt: null,
          updatedAt: null,
        }
      );
    }

    return successResponse(
      res,
      "Professionals hero content fetched successfully",
      content
    );
  } catch (error) {
    console.error("getAdminProfessionalHero error:", error);

    return errorResponse(
      res,
      "Failed to fetch Professionals hero content",
      500
    );
  }
};

export const updateAdminProfessionalHero = async (req, res) => {
  try {
    const { hero, isActive } = req.body;

    if (!hero || typeof hero !== "object") {
      return errorResponse(res, "Hero data is required", 400);
    }

    const safeHero = {
      badge: hero.badge,
      title: hero.title,
      highlightedTitle: hero.highlightedTitle,
      description: hero.description,

      primaryButton: {
        text: hero.primaryButton?.text,
        link: hero.primaryButton?.link,
      },

      secondaryButton: {
        text: hero.secondaryButton?.text,
        link: hero.secondaryButton?.link,
      },

      image: hero.image,
    };

    Object.keys(safeHero).forEach((key) => {
      if (safeHero[key] === undefined) {
        delete safeHero[key];
      }
    });

    if (safeHero.primaryButton) {
      Object.keys(safeHero.primaryButton).forEach((key) => {
        if (safeHero.primaryButton[key] === undefined) {
          delete safeHero.primaryButton[key];
        }
      });
    }

    if (safeHero.secondaryButton) {
      Object.keys(safeHero.secondaryButton).forEach((key) => {
        if (safeHero.secondaryButton[key] === undefined) {
          delete safeHero.secondaryButton[key];
        }
      });
    }

    const updateData = {
      hero: safeHero,
    };

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    const content = await ProfessionalHero.findOneAndUpdate(
      {
        key: "professionals-hero",
      },
      {
        $set: updateData,

        $setOnInsert: {
          key: "professionals-hero",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professionals hero content updated successfully",
      content
    );
  } catch (error) {
    console.error("updateAdminProfessionalHero error:", error);

    return errorResponse(
      res,
      "Failed to update Professionals hero content",
      500
    );
  }
};

export const resetAdminProfessionalHero = async (req, res) => {
  try {
    const content = await ProfessionalHero.findOneAndUpdate(
      {
        key: "professionals-hero",
      },
      {
        $set: {
          hero: DEFAULT_PROFESSIONAL_HERO,
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professionals hero content reset successfully",
      content
    );
  } catch (error) {
    console.error("resetAdminProfessionalHero error:", error);

    return errorResponse(
      res,
      "Failed to reset Professionals hero content",
      500
    );
  }
};

export const deleteAdminProfessionalHero = async (req, res) => {
  try {
    await ProfessionalHero.deleteOne({
      key: "professionals-hero",
    });

    return successResponse(
      res,
      "Professionals hero content deleted successfully",
      {
        key: "professionals-hero",
        hero: DEFAULT_PROFESSIONAL_HERO,
        isActive: true,
      }
    );
  } catch (error) {
    console.error("deleteAdminProfessionalHero error:", error);

    return errorResponse(
      res,
      "Failed to delete Professionals hero content",
      500
    );
  }
};

const DEFAULT_PROFESSIONAL_STANDARDS = {
  key: "professional-standards",

  title: "Our Professional Standards",

  subtitle: "Quality, safety and trust is our priority",

  standards: [
    {
      title: "Identity Verified",
      description:
        "Every professional on ServyNex completes an identity verification process.",
    },
    {
      title: "Background Checked",
      description:
        "Professionals are screened to help maintain a safe and trusted service experience.",
    },
    {
      title: "Skill Certified",
      description:
        "We focus on professionals with the skills and experience required for their services.",
    },
    {
      title: "Customer Rated",
      description:
        "Customer ratings and reviews help maintain service quality and accountability.",
    },
  ],

  isActive: true,
};

export const getAdminProfessionalStandards = async (req, res) => {
  try {
    const content = await ProfessionalStandards.findOne({
      key: "professional-standards",
    })
      .select("key title subtitle standards isActive createdAt updatedAt")
      .lean();

    if (!content) {
      return successResponse(
        res,
        "Professional Standards fetched successfully",
        {
          ...DEFAULT_PROFESSIONAL_STANDARDS,
          createdAt: null,
          updatedAt: null,
        }
      );
    }

    return successResponse(
      res,
      "Professional Standards fetched successfully",
      content
    );
  } catch (error) {
    console.error("getAdminProfessionalStandards error:", error);

    return errorResponse(res, "Failed to fetch Professional Standards", 500);
  }
};

export const updateAdminProfessionalStandards = async (req, res) => {
  try {
    const { title, subtitle, standards, isActive } = req.body;

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return errorResponse(res, "Invalid Professional Standards data", 400);
    }

    if (standards !== undefined && !Array.isArray(standards)) {
      return errorResponse(res, "Standards must be an array", 400);
    }

    const safeStandards =
      standards !== undefined
        ? standards.map((standard) => ({
            ...(standard?._id
              ? {
                  _id: standard._id,
                }
              : {}),

            title:
              typeof standard?.title === "string" ? standard.title.trim() : "",

            description:
              typeof standard?.description === "string"
                ? standard.description.trim()
                : "",
          }))
        : undefined;

    if (safeStandards) {
      const hasInvalidStandard = safeStandards.some(
        (standard) => !standard.title || !standard.description
      );

      if (hasInvalidStandard) {
        return errorResponse(
          res,
          "Each standard requires a title and description",
          400
        );
      }
    }

    const updateData = {};

    if (typeof title === "string") {
      updateData.title = title.trim();
    }

    if (typeof subtitle === "string") {
      updateData.subtitle = subtitle.trim();
    }

    if (safeStandards !== undefined) {
      updateData.standards = safeStandards;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (!Object.keys(updateData).length) {
      return errorResponse(res, "At least one valid field is required", 400);
    }
    const content = await ProfessionalStandards.findOneAndUpdate(
      {
        key: "professional-standards",
      },
      {
        $set: updateData,

        $setOnInsert: {
          key: "professional-standards",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professional Standards updated successfully",
      content
    );
  } catch (error) {
    console.error("updateAdminProfessionalStandards error:", error);

    if (error?.code === 11000) {
      return errorResponse(
        res,
        "Professional Standards content already exists",
        409
      );
    }

    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");

      return errorResponse(
        res,
        message || "Invalid Professional Standards data",
        400
      );
    }

    return errorResponse(res, "Failed to update Professional Standards", 500);
  }
};

export const resetAdminProfessionalStandards = async (req, res) => {
  try {
    const content = await ProfessionalStandards.findOneAndUpdate(
      {
        key: "professional-standards",
      },
      {
        $set: {
          title: DEFAULT_PROFESSIONAL_STANDARDS.title,

          subtitle: DEFAULT_PROFESSIONAL_STANDARDS.subtitle,

          standards: DEFAULT_PROFESSIONAL_STANDARDS.standards,

          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professional Standards reset successfully",
      content
    );
  } catch (error) {
    console.error("resetAdminProfessionalStandards error:", error);

    return errorResponse(res, "Failed to reset Professional Standards", 500);
  }
};

export const deleteAdminProfessionalStandards = async (req, res) => {
  try {
    await ProfessionalStandards.deleteOne({
      key: "professional-standards",
    });

    return successResponse(
      res,
      "Professional Standards deleted successfully",
      DEFAULT_PROFESSIONAL_STANDARDS
    );
  } catch (error) {
    console.error("deleteAdminProfessionalStandards error:", error);

    return errorResponse(res, "Failed to delete Professional Standards", 500);
  }
};

const DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS = {
  title: "Our Hiring Verification Process",

  subtitle:
    "We follow a strict process to ensure the best professionals for you",

  steps: [
    {
      step: 1,
      title: "Application",
      description: "Professional applies with required details.",
      icon: "FileEarmarkPersonFill",
    },
    {
      step: 2,
      title: "Document Verification",
      description: "We verify identity and required documents.",
      icon: "PersonVcardFill",
    },
    {
      step: 3,
      title: "Skill Assessment",
      description: "Skills are assessed to ensure service quality.",
      icon: "AwardFill",
    },
    {
      step: 4,
      title: "Background Check",
      description: "Complete background verification is performed.",
      icon: "ShieldFillCheck",
    },
    {
      step: 5,
      title: "Training",
      description: "Professionals receive training and ServyNex guidelines.",
      icon: "MortarboardFill",
    },
    {
      step: 6,
      title: "Approved Professional",
      description: "Approved professionals are ready to serve customers.",
      icon: "PeopleFill",
    },
  ],
};

export const getAdminProfessionalVerificationProcess = async (req, res) => {
  try {
    const content = await ProfessionalVerificationProcess.findOne({
      key: "professional-verification-process",
    })
      .select("key title subtitle steps isActive createdAt updatedAt")
      .lean();

    if (!content) {
      return successResponse(
        res,
        "Professional verification process fetched successfully",
        {
          key: "professional-verification-process",
          ...DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS,
          isActive: true,
        }
      );
    }

    return successResponse(
      res,
      "Professional verification process fetched successfully",
      content
    );
  } catch (error) {
    console.error("getAdminProfessionalVerificationProcess error:", error);

    return errorResponse(
      res,
      "Failed to fetch professional verification process",
      500
    );
  }
};

export const updateAdminProfessionalVerificationProcess = async (req, res) => {
  try {
    const { title, subtitle, steps, isActive } = req.body;

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return errorResponse(
          res,
          "Verification process title is required",
          400
        );
      }

      updateData.title = title.trim();
    }

    if (subtitle !== undefined) {
      if (typeof subtitle !== "string" || !subtitle.trim()) {
        return errorResponse(
          res,
          "Verification process subtitle is required",
          400
        );
      }

      updateData.subtitle = subtitle.trim();
    }

    if (steps !== undefined) {
      if (!Array.isArray(steps)) {
        return errorResponse(
          res,
          "Verification process steps must be an array",
          400
        );
      }

      updateData.steps = steps.map((item, index) => ({
        step: Number(item.step) || index + 1,

        title: String(item.title).trim(),

        description: String(item.description).trim(),

        icon: String(item.icon).trim(),
      }));
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (!Object.keys(updateData).length) {
      return errorResponse(res, "At least one valid field is required", 400);
    }
    const content = await ProfessionalVerificationProcess.findOneAndUpdate(
      {
        key: "professional-verification-process",
      },
      {
        $set: updateData,

        $setOnInsert: {
          key: "professional-verification-process",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professional verification process updated successfully",
      content
    );
  } catch (error) {
    console.error("updateAdminProfessionalVerificationProcess error:", error);

    return errorResponse(
      res,
      "Failed to update professional verification process",
      500
    );
  }
};

export const resetAdminProfessionalVerificationProcess = async (req, res) => {
  try {
    const content = await ProfessionalVerificationProcess.findOneAndUpdate(
      {
        key: "professional-verification-process",
      },
      {
        $set: {
          title: DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS.title,

          subtitle: DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS.subtitle,

          steps: DEFAULT_PROFESSIONAL_VERIFICATION_PROCESS.steps,

          isActive: true,
        },

        $setOnInsert: {
          key: "professional-verification-process",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean();

    return successResponse(
      res,
      "Professional verification process reset successfully",
      content
    );
  } catch (error) {
    console.error("resetAdminProfessionalVerificationProcess error:", error);

    return errorResponse(
      res,
      "Failed to reset professional verification process",
      500
    );
  }
};

export const deleteAdminProfessionalVerificationProcess = async (req, res) => {
  try {
    const deletedContent =
      await ProfessionalVerificationProcess.findOneAndDelete({
        key: "professional-verification-process",
      }).lean();

    if (!deletedContent) {
      return errorResponse(
        res,
        "Professional verification process not found",
        404
      );
    }

    return successResponse(
      res,
      "Professional verification process deleted successfully",
      deletedContent
    );
  } catch (error) {
    console.error("deleteAdminProfessionalVerificationProcess error:", error);

    return errorResponse(
      res,
      "Failed to delete professional verification process",
      500
    );
  }
};

const DEFAULT_BECOME_PROFESSIONAL = {
  title: "Want to become a ServyNex Professional?",

  description:
    "Join our growing network of trusted professionals and grow your business with us.",

  buttonText: "Register as a Professional",

  registrationRoute: "/register?role=worker",

  image: "",

  isActive: true,
};

const isValidRegistrationRoute = (route) => {
  if (typeof route !== "string") {
    return false;
  }

  const trimmedRoute = route.trim();

  return trimmedRoute.startsWith("/") || /^https?:\/\//i.test(trimmedRoute);
};

export const getAdminBecomeProfessional = async (req, res) => {
  try {
    const content = await BecomeProfessional.findOne({
      key: "become-professional-cta",
    })
      .select(
        "key title description buttonText registrationRoute image isActive createdAt updatedAt"
      )
      .lean();

    if (!content) {
      return successResponse(
        res,
        "Become Professional content fetched successfully",
        {
          key: "become-professional-cta",
          ...DEFAULT_BECOME_PROFESSIONAL,
          createdAt: null,
          updatedAt: null,
        }
      );
    }

    return successResponse(
      res,
      "Become Professional content fetched successfully",
      content
    );
  } catch (error) {
    console.error("getAdminBecomeProfessional error:", error);

    return errorResponse(
      res,
      "Failed to fetch Become Professional content",
      500
    );
  }
};

export const updateAdminBecomeProfessional = async (req, res) => {
  try {
    const {
      title,
      description,
      buttonText,
      registrationRoute,
      image,
      isActive,
    } = req.body;

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return errorResponse(res, "Invalid Become Professional data", 400);
    }

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return errorResponse(res, "CTA title is required", 400);
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return errorResponse(res, "CTA description is required", 400);
      }

      updateData.description = description.trim();
    }

    if (buttonText !== undefined) {
      if (typeof buttonText !== "string" || !buttonText.trim()) {
        return errorResponse(res, "Button text is required", 400);
      }

      updateData.buttonText = buttonText.trim();
    }

    if (registrationRoute !== undefined) {
      if (!isValidRegistrationRoute(registrationRoute)) {
        return errorResponse(
          res,
          "Registration route must start with / or be a valid http/https URL",
          400
        );
      }

      updateData.registrationRoute = registrationRoute.trim();
    }

    if (image !== undefined) {
      if (typeof image !== "string") {
        return errorResponse(res, "Image must be a valid image path", 400);
      }

      const trimmedImage = image.trim();

      if (
        trimmedImage.startsWith("blob:") ||
        trimmedImage.startsWith("data:")
      ) {
        return errorResponse(
          res,
          "Invalid image format. Use the uploaded image path.",
          400
        );
      }

      updateData.image = trimmedImage;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (!Object.keys(updateData).length) {
      return errorResponse(res, "At least one valid field is required", 400);
    }

    const content = await BecomeProfessional.findOneAndUpdate(
      {
        key: "become-professional-cta",
      },
      {
        $set: updateData,

        $setOnInsert: {
          key: "become-professional-cta",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Become Professional content updated successfully",
      content
    );
  } catch (error) {
    console.error("updateAdminBecomeProfessional error:", error);

    if (error?.code === 11000) {
      return errorResponse(
        res,
        "Become Professional CMS content already exists",
        409
      );
    }

    if (error?.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");

      return errorResponse(
        res,
        message || "Invalid Become Professional data",
        400
      );
    }

    return errorResponse(
      res,
      "Failed to update Become Professional content",
      500
    );
  }
};

export const resetAdminBecomeProfessional = async (req, res) => {
  try {
    const content = await BecomeProfessional.findOneAndUpdate(
      {
        key: "become-professional-cta",
      },
      {
        $set: {
          title: DEFAULT_BECOME_PROFESSIONAL.title,

          description: DEFAULT_BECOME_PROFESSIONAL.description,

          buttonText: DEFAULT_BECOME_PROFESSIONAL.buttonText,

          registrationRoute: DEFAULT_BECOME_PROFESSIONAL.registrationRoute,

          image: DEFAULT_BECOME_PROFESSIONAL.image,

          isActive: true,
        },

        $setOnInsert: {
          key: "become-professional-cta",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(
      res,
      "Become Professional content reset successfully",
      content
    );
  } catch (error) {
    console.error("resetAdminBecomeProfessional error:", error);

    return errorResponse(
      res,
      "Failed to reset Become Professional content",
      500
    );
  }
};

export const deleteAdminBecomeProfessional = async (req, res) => {
  try {
    await BecomeProfessional.deleteOne({
      key: "become-professional-cta",
    });

    return successResponse(
      res,
      "Become Professional content deleted successfully",
      {
        key: "become-professional-cta",
        ...DEFAULT_BECOME_PROFESSIONAL,
      }
    );
  } catch (error) {
    console.error("deleteAdminBecomeProfessional error:", error);

    return errorResponse(
      res,
      "Failed to delete Become Professional content",
      500
    );
  }
};
