import Contact from "../../models/contact.js";
import ContactContent from "../../models/contactContent.js";

import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getContactPage = async (req, res) => {
  try {
    const content = await ContactContent.findOne({
      key: "contact",
      isActive: true,
    }).lean();

    if (!content) {
      return errorResponse(res, "Contact page content not found", 404);
    }

    const response = {
      hero: content.hero,

      contactCards:
        content.contactCards
          ?.filter((item) => item.isActive)
          ?.sort((a, b) => a.order - b.order) || [],

      contactForm: {
        badge: content.contactForm?.badge,

        title: content.contactForm?.title,

        description: content.contactForm?.description,

        image: content.contactForm?.image,

        submitButtonText: content.contactForm?.submitButtonText,

        subjects:
          content.contactForm?.subjects
            ?.filter((item) => item.isActive)
            ?.sort((a, b) => a.order - b.order) || [],
      },

      officeLocation: content.officeLocation,

      helpSection: {
        title: content.helpSection?.title,

        description: content.helpSection?.description,

        topics:
          content.helpSection?.topics
            ?.filter((item) => item.isActive)
            ?.sort((a, b) => a.order - b.order) || [],
      },

      supportCta: content.supportCta,
    };

    return successResponse(res, "Contact page fetched successfully", response);
  } catch (error) {
    console.error("getContactPage error:", error);

    return errorResponse(res, "Failed to fetch Contact page", 500);
  }
};

export const getContactInfo = async (req, res) => {
  try {
    const content = await ContactContent.findOne({
      key: "contact",
      isActive: true,
    }).lean();

    if (!content) {
      return errorResponse(res, "Contact information not found", 404);
    }

    const cards =
      content.contactCards
        ?.filter((item) => item.isActive)
        ?.sort((a, b) => a.order - b.order) || [];

    const phone = cards.find((item) => item.key === "phone");

    const email = cards.find((item) => item.key === "email");

    const office = cards.find((item) => item.key === "office");

    const workingHours = cards.find((item) => item.key === "working-hours");

    return successResponse(res, "Contact information fetched successfully", {
      phone: phone?.value || "",

      email: email?.value || "",

      office: {
        address: office?.value || "",

        country: content.officeLocation?.country || "",

        pincode: content.officeLocation?.pincode || "",
      },

      workingHours: {
        days: workingHours?.value || "",

        time: workingHours?.secondaryValue || "",
      },

      support: {
        available: "24/7",

        responseTime: "Usually replies within 15 minutes",
      },

      helpTopics:
        content.helpSection?.topics
          ?.filter((item) => item.isActive)
          ?.sort((a, b) => a.order - b.order) || [],
    });
  } catch (error) {
    console.error("getContactInfo error:", error);

    return errorResponse(res, "Failed to fetch contact information", 500);
  }
};

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(
        res,
        "Name, email, subject and message are required",
        400
      );
    }

    const trimmedName = name.trim();

    const trimmedEmail = email.trim().toLowerCase();

    const trimmedSubject = subject.trim();

    const trimmedMessage = message.trim();

    const trimmedPhone = phone?.trim() || "";

    if (trimmedName.length < 2) {
      return errorResponse(res, "Name must contain at least 2 characters", 400);
    }

    if (trimmedMessage.length < 10) {
      return errorResponse(
        res,
        "Message must contain at least 10 characters",
        400
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return errorResponse(res, "Invalid email address", 400);
    }

    const contactMessage = await Contact.create({
      name: trimmedName,

      email: trimmedEmail,

      phone: trimmedPhone,

      subject: trimmedSubject,

      message: trimmedMessage,
    });

    return successResponse(
      res,
      "Your message has been sent successfully. Our team will contact you soon.",
      {
        id: contactMessage._id,

        status: contactMessage.status,

        createdAt: contactMessage.createdAt,
      },
      201
    );
  } catch (error) {
    console.error("submitContactMessage error:", error);

    return errorResponse(res, "Failed to send your message", 500);
  }
};
