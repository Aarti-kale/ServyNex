import HomepageContent from "../../models/homeContent.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_HOMEPAGE_CONTENT = {
  hero: {
    badge: "#1 Home Service Platform",
    title: "Reliable Home Services, Just a Few Clicks Away",
    description:
      "Book trusted professionals for all your home service needs. Fast, reliable and hassle-free.",
    primaryButtonText: "Book a Service",
    primaryButtonLink: "/services",
    secondaryButtonText: "How It Works",
    secondaryButtonLink: "/how-it-works",
    image: "",
  },

  howItWorks: {
    title: "How ServyNex Works",
    subtitle: "Simple steps to get your service done",
    steps: [],
  },

  whyChoose: {
    title: "Why Choose ServyNex",
    subtitle: "We are committed to providing the best experience",
    features: [],
  },

  cta: {
    title: "Need a Professional for Your Home?",
    description: "Book trusted professionals in just a few clicks.",
    buttonText: "Book a Service Now",
    buttonLink: "/services",
    image: "",
  },

  faqs: [],
};

const normalizeHowItWorks = (howItWorks = {}) => {
  const steps = Array.isArray(howItWorks.steps) ? howItWorks.steps : [];

  return {
    ...howItWorks,

    steps: steps.map((step, index) => ({
      ...step,

      stepNumber:
        Number(step?.stepNumber) > 0 ? Number(step.stepNumber) : index + 1,
    })),
  };
};

export const getAdminHomepage = async (req, res) => {
  try {
    const content = await HomepageContent.findOne({
      isActive: true,
    }).lean();

    if (!content) {
      return successResponse(
        res,
        "Homepage content fetched successfully",
        {
          ...DEFAULT_HOMEPAGE_CONTENT,
          isActive: false,
          isDefault: true,
        },
        200
      );
    }

    return successResponse(
      res,
      "Homepage content fetched successfully",
      content,
      200
    );
  } catch (error) {
    console.error("GET ADMIN HOMEPAGE ERROR:", error);

    return errorResponse(res, "Failed to fetch homepage content", 500);
  }
};

export const updateAdminHomepage = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return errorResponse(res, "Invalid homepage data", 400);
    }

    const { hero, howItWorks, whyChoose, cta, faqs } = req.body;

    if (howItWorks?.steps !== undefined && !Array.isArray(howItWorks.steps)) {
      return errorResponse(res, "How it works steps must be an array", 400);
    }

    const normalizedHowItWorks =
      howItWorks !== undefined ? normalizeHowItWorks(howItWorks) : undefined;

    if (
      whyChoose?.features !== undefined &&
      !Array.isArray(whyChoose.features)
    ) {
      return errorResponse(res, "Why choose features must be an array", 400);
    }

    if (faqs !== undefined && !Array.isArray(faqs)) {
      return errorResponse(res, "FAQs must be an array", 400);
    }

    let homepage = await HomepageContent.findOne({
      isActive: true,
    });

    if (!homepage) {
      homepage = new HomepageContent({
        hero: hero !== undefined ? hero : DEFAULT_HOMEPAGE_CONTENT.hero,

        howItWorks:
          normalizedHowItWorks !== undefined
            ? normalizedHowItWorks
            : DEFAULT_HOMEPAGE_CONTENT.howItWorks,

        whyChoose:
          whyChoose !== undefined
            ? whyChoose
            : DEFAULT_HOMEPAGE_CONTENT.whyChoose,

        cta: cta !== undefined ? cta : DEFAULT_HOMEPAGE_CONTENT.cta,

        faqs: faqs !== undefined ? faqs : DEFAULT_HOMEPAGE_CONTENT.faqs,

        isActive: true,
      });
    }

    if (hero !== undefined) {
      homepage.hero = hero;
    }

    if (normalizedHowItWorks !== undefined) {
      homepage.howItWorks = normalizedHowItWorks;
    }

    if (whyChoose !== undefined) {
      homepage.whyChoose = whyChoose;
    }

    if (cta !== undefined) {
      homepage.cta = cta;
    }

    if (faqs !== undefined) {
      homepage.faqs = faqs;
    }

    homepage.isActive = true;

    await homepage.save();

    const updatedHomepage = await HomepageContent.findById(homepage._id).lean();

    return successResponse(
      res,
      "Homepage content updated successfully",
      updatedHomepage,
      200
    );
  } catch (error) {
    console.error("UPDATE ADMIN HOMEPAGE ERROR:", error);

    if (error?.code === 11000) {
      return errorResponse(res, "Homepage content already exists", 409);
    }

    if (error?.name === "ValidationError") {
      const validationMessage = Object.values(error.errors || {})
        .map((item) => item.message)
        .filter(Boolean)
        .join(", ");

      return errorResponse(
        res,
        validationMessage || "Invalid homepage content",
        400
      );
    }

    if (error?.name === "CastError") {
      return errorResponse(res, "Invalid homepage data", 400);
    }

    return errorResponse(res, "Failed to update homepage content", 500);
  }
};
