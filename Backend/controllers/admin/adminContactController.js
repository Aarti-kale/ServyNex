import ContactContent from "../../models/contactContent.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

const DEFAULT_CONTACT_CONTENT = {
  key: "contact",

  hero: {
    badge: "CONTACT US",

    title: "We're Here To Help You",

    description:
      "Have a question, need support, or want to become a professional? Our team is ready to help.",

    primaryButtonText: "Call Now",

    primaryButtonLink: "tel:+919876543210",

    secondaryButtonText: "Send Message",

    secondaryButtonLink: "#contact-form",

    image: "",
  },

  contactCards: [
    {
      key: "phone",
      title: "Phone",
      value: "+91 98765 43210",
      secondaryValue: "Mon – Sat, 9 AM – 8 PM",
      link: "tel:+919876543210",
      icon: "phone",
      order: 1,
      isActive: true,
    },

    {
      key: "email",
      title: "Email",
      value: "support@servynex.com",
      secondaryValue: "We reply within 15 min",
      link: "mailto:support@servynex.com",
      icon: "email",
      order: 2,
      isActive: true,
    },

    {
      key: "office",
      title: "Office Address",
      value: "123, Green Park, New Delhi",
      secondaryValue: "India – 110016",
      link: "",
      icon: "location",
      order: 3,
      isActive: true,
    },

    {
      key: "working-hours",
      title: "Working Hours",
      value: "Monday – Saturday",
      secondaryValue: "9:00 AM – 8:00 PM",
      link: "",
      icon: "clock",
      order: 4,
      isActive: true,
    },
  ],

  contactForm: {
    badge: "Send Us a Message",

    title: "We'd love to hear from you!",

    description:
      "Fill out the form and our team will get back to you as soon as possible.",

    image: "",

    submitButtonText: "Send Message",

    subjects: [
      {
        value: "booking",
        label: "Booking Support",
        order: 1,
        isActive: true,
      },

      {
        value: "payment",
        label: "Payment Support",
        order: 2,
        isActive: true,
      },

      {
        value: "worker-registration",
        label: "Worker Registration",
        order: 3,
        isActive: true,
      },

      {
        value: "general",
        label: "General Inquiry",
        order: 4,
        isActive: true,
      },
    ],
  },

  officeLocation: {
    title: "Our Office Location",

    description: "Visit us at our office. We'd love to meet you!",

    officeName: "ServyNex Office",

    address: "123, Green Park, New Delhi",

    country: "India",

    pincode: "110016",

    directionsText: "Directions",

    directionsLink: "",

    mapEmbedUrl: "",

    latitude: null,

    longitude: null,
  },

  helpSection: {
    title: "How Can We Help You?",

    description: "Choose a topic and we'll connect you to the right team.",

    topics: [
      {
        key: "booking",

        title: "Booking Support",

        description: "Need help with your booking or rescheduling?",

        link: "/help/booking",

        linkText: "Get Help",

        icon: "headset",

        order: 1,

        isActive: true,
      },

      {
        key: "payment",

        title: "Payment Support",

        description: "Questions about payments, refunds or invoices?",

        link: "/help/payment",

        linkText: "Get Help",

        icon: "payment",

        order: 2,

        isActive: true,
      },

      {
        key: "worker-registration",

        title: "Worker Registration",

        description: "Want to join our network of verified professionals?",

        link: "/become-professional",

        linkText: "Get Help",

        icon: "user",

        order: 3,

        isActive: true,
      },
    ],
  },

  supportCta: {
    title: "Still Need Help?",

    description:
      "Our support team is available every day and usually replies within 15 minutes.",

    buttonText: "Contact Support",

    buttonLink: "#contact-form",

    image: "",
  },

  isActive: true,
};

const createDefaultContactContent = async () => {
  return ContactContent.create(DEFAULT_CONTACT_CONTENT);
};
export const getAdminContact = async (req, res) => {
  try {
    let content = await ContactContent.findOne({
      key: "contact",
    }).lean();

    if (!content) {
      const created = await createDefaultContactContent();

      content = created.toObject();
    }

    return successResponse(
      res,
      "Contact page content fetched successfully",
      content
    );
  } catch (error) {
    console.error("getAdminContact error:", error);

    return errorResponse(res, "Failed to fetch Contact page content", 500);
  }
};

export const updateAdminContact = async (req, res) => {
  try {
    const body = req.body || {};

    const updateData = {};

    if (body.hero) {
      updateData.hero = {
        badge: body.hero.badge,
        title: body.hero.title,
        description: body.hero.description,
        primaryButtonText: body.hero.primaryButtonText,
        primaryButtonLink: body.hero.primaryButtonLink,
        secondaryButtonText: body.hero.secondaryButtonText,
        secondaryButtonLink: body.hero.secondaryButtonLink,
        image: body.hero.image,
      };
    }

    if (Array.isArray(body.contactCards)) {
      updateData.contactCards = body.contactCards.map((card) => ({
        key: card.key,
        title: card.title,
        value: card.value,
        secondaryValue: card.secondaryValue || "",
        link: card.link || "",
        icon: card.icon || "",
        order: Number(card.order) || 0,
        isActive: card.isActive !== false,
      }));
    }

    if (body.contactForm) {
      updateData.contactForm = {
        badge: body.contactForm.badge,
        title: body.contactForm.title,
        description: body.contactForm.description,
        image: body.contactForm.image || "",
        submitButtonText: body.contactForm.submitButtonText,

        subjects: Array.isArray(body.contactForm.subjects)
          ? body.contactForm.subjects.map((subject) => ({
              value: subject.value,
              label: subject.label,
              order: Number(subject.order) || 0,
              isActive: subject.isActive !== false,
            }))
          : [],
      };
    }

    if (body.officeLocation) {
      updateData.officeLocation = {
        title: body.officeLocation.title,

        description: body.officeLocation.description,

        officeName: body.officeLocation.officeName,

        address: body.officeLocation.address,

        country: body.officeLocation.country,

        pincode: body.officeLocation.pincode,

        directionsText: body.officeLocation.directionsText,

        directionsLink: body.officeLocation.directionsLink,

        mapEmbedUrl: body.officeLocation.mapEmbedUrl,

        latitude: body.officeLocation.latitude ?? null,

        longitude: body.officeLocation.longitude ?? null,
      };
    }

    if (body.helpSection) {
      updateData.helpSection = {
        title: body.helpSection.title,

        description: body.helpSection.description,

        topics: Array.isArray(body.helpSection.topics)
          ? body.helpSection.topics.map((topic) => ({
              key: topic.key,
              title: topic.title,
              description: topic.description || "",
              link: topic.link || "",
              linkText: topic.linkText || "Get Help",
              icon: topic.icon || "",
              order: Number(topic.order) || 0,
              isActive: topic.isActive !== false,
            }))
          : [],
      };
    }

    if (body.supportCta) {
      updateData.supportCta = {
        title: body.supportCta.title,

        description: body.supportCta.description,

        buttonText: body.supportCta.buttonText,

        buttonLink: body.supportCta.buttonLink,

        image: body.supportCta.image || "",
      };
    }

    if (typeof body.isActive === "boolean") {
      updateData.isActive = body.isActive;
    }

    const content = await ContactContent.findOneAndUpdate(
      {
        key: "contact",
      },
      {
        $set: updateData,
        $setOnInsert: {
          key: "contact",
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(res, "Contact page updated successfully", content);
  } catch (error) {
    console.error("updateAdminContact error:", error);

    return errorResponse(
      res,
      error.message || "Failed to update Contact page",
      400
    );
  }
};

export const resetAdminContact = async (req, res) => {
  try {
    const content = await ContactContent.findOneAndUpdate(
      {
        key: "contact",
      },
      {
        $set: DEFAULT_CONTACT_CONTENT,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return successResponse(res, "Contact page reset successfully", content);
  } catch (error) {
    console.error("resetAdminContact error:", error);

    return errorResponse(res, "Failed to reset Contact page", 500);
  }
};
