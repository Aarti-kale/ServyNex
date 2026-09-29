import React, { useEffect, useState } from "react";

import API from "../../../api/api";

import ContactHeader from "../../../components/AdminComponents/websiteCMS/Contact/ContactHeader";
import ContactSectionList from "../../../components/AdminComponents/websiteCMS/Contact/ContactSectionList";
import HeroSection from "../../../components/AdminComponents/websiteCMS/Contact/HeroSection";
import ContactInfoEdit from "../../../components/AdminComponents/websiteCMS/Contact/ContactInfoEdit";
import ContactFormEdit from "../../../components/AdminComponents/websiteCMS/Contact/ContactFormEdit";
import OfficeEdit from "../../../components/AdminComponents/websiteCMS/Contact/OfficeEdit";
import HelpEdit from "../../../components/AdminComponents/websiteCMS/Contact/HelpEdit";
import SupportCtaEdit from "../../../components/AdminComponents/websiteCMS/Contact/SupportCtaEdit";

function CmsContact() {
  const [activeSection, setActiveSection] = useState("hero");

  const [contactData, setContactData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchContactData = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await API.get("/admin/contact");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to load contact page."
        );
      }

      const data = response.data?.data;

      if (!data) {
        throw new Error("Contact page content not found.");
      }

      setContactData(data);
    } catch (err) {
      console.error("[CmsContact] Contact CMS fetch error:", err);

      console.error("[CmsContact] Fetch error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load contact page."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleSectionChange = (sectionKey, sectionData) => {
    setContactData((previousData) => {
      if (!previousData) {
        return previousData;
      }

      return {
        ...previousData,
        [sectionKey]: sectionData,
      };
    });
  };

  const uploadContactHeroImage = async (file) => {
    if (!(file instanceof File)) {
      console.warn(
        "[CmsContact] uploadContactHeroImage received invalid file:",
        file
      );

      return null;
    }

    const formData = new FormData();

    formData.append("image", file);

    const response = await API.post("/admin/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to upload hero image.");
    }

    const imageUrl = response.data?.data?.url;

    if (!imageUrl) {
      throw new Error(
        "Image uploaded but server did not return a valid image URL."
      );
    }

    return imageUrl;
  };

  const uploadContactFormImage = async (file) => {
    if (!(file instanceof File)) {
      console.warn(
        "[CmsContact] uploadContactFormImage received invalid file:",
        file
      );

      return null;
    }

    const formData = new FormData();

    formData.append("image", file);

    const response = await API.post("/admin/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to upload contact form image."
      );
    }

    const imageUrl = response.data?.data?.url;

    if (!imageUrl) {
      throw new Error(
        "Contact Form image uploaded but server did not return a valid image URL."
      );
    }

    return imageUrl;
  };

  const uploadSupportCtaImage = async (file) => {
    if (!(file instanceof File)) {
      console.warn(
        "[CmsContact] uploadSupportCtaImage received invalid file:",
        file
      );

      return null;
    }

    const formData = new FormData();

    formData.append("image", file);

    const response = await API.post("/admin/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to upload Support CTA image."
      );
    }

    const imageUrl = response.data?.data?.url;

    if (!imageUrl) {
      throw new Error(
        "Support CTA image uploaded but server did not return a valid image URL."
      );
    }

    return imageUrl;
  };

  const saveSection = async (sectionKey, sectionData, successText) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await API.put("/admin/contact", {
        [sectionKey]: sectionData,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || `Failed to save ${sectionKey} section.`
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setContactData(updatedData);
      }

      setSuccessMessage(
        successText || `${sectionKey} section saved successfully.`
      );
    } catch (err) {
      console.error(`[CmsContact] Contact ${sectionKey} save error:`, err);

      console.error(
        `[CmsContact] ${sectionKey} error response:`,
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to save ${sectionKey} section.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleHeroSave = async (data) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const heroPayload = {
        badge: data?.badge ?? "",

        title: data?.title ?? "",

        description: data?.description ?? "",

        primaryButtonText: data?.primaryButtonText ?? "",

        primaryButtonLink: data?.primaryButtonLink ?? "",

        secondaryButtonText: data?.secondaryButtonText ?? "",

        secondaryButtonLink: data?.secondaryButtonLink ?? "",

        image: data?.image ?? "",
      };

      if (data?.imageFile instanceof File) {
        const uploadedImageUrl = await uploadContactHeroImage(data.imageFile);

        heroPayload.image = uploadedImageUrl;
      } else {
      }

      const response = await API.put("/admin/contact", {
        hero: heroPayload,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save hero section."
        );
      }

      // --------------------------------------------------------
      // UPDATE LOCAL STATE
      // --------------------------------------------------------

      const updatedData = response.data?.data;

      if (updatedData) {
        setContactData(updatedData);
      }

      setSuccessMessage("Hero section saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save hero section."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleContactInformationSave = async (data) => {
    await saveSection(
      "contactCards",
      data,
      "Contact information saved successfully."
    );
  };

  const handleContactFormSave = async (data) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      let imageUrl =
        typeof data?.image === "string" && !data.image.startsWith("blob:")
          ? data.image
          : "";

      if (data?.imageFile instanceof File) {
        const uploadedImageUrl = await uploadContactFormImage(data.imageFile);

        imageUrl = uploadedImageUrl;
      } else {
      }

      const contactFormPayload = {
        badge: data?.badge ?? "",

        title: data?.title ?? "",

        description: data?.description ?? "",

        image: imageUrl,

        submitButtonText: data?.submitButtonText ?? "",

        subjects: Array.isArray(data?.subjects)
          ? data.subjects.map((subject, index) => ({
              value: subject?.value ?? "",

              label: subject?.label ?? "",

              order:
                Number(subject?.order) > 0 ? Number(subject.order) : index + 1,

              isActive: subject?.isActive !== false,
            }))
          : [],
      };

      const response = await API.put("/admin/contact", {
        contactForm: contactFormPayload,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save contact form."
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setContactData(updatedData);
      }

      setSuccessMessage("Contact form saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save contact form."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOfficeLocationSave = async (data) => {
    await saveSection(
      "officeLocation",
      data,
      "Office location saved successfully."
    );
  };

  const handleHelpSectionSave = async (data) => {
    await saveSection("helpSection", data, "Help section saved successfully.");
  };

  const handleSupportCtaSave = async (data) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const supportCtaData =
        data?.supportCta && typeof data.supportCta === "object"
          ? data.supportCta
          : data || {};

      let imageUrl =
        typeof supportCtaData?.image === "string" &&
        !supportCtaData.image.startsWith("blob:")
          ? supportCtaData.image
          : "";

      if (supportCtaData?.imageFile instanceof File) {
        const uploadedImageUrl = await uploadSupportCtaImage(
          supportCtaData.imageFile
        );

        imageUrl = uploadedImageUrl;
      } else {
      }

      const supportCtaPayload = {
        title: supportCtaData?.title ?? "",

        description: supportCtaData?.description ?? "",

        buttonText: supportCtaData?.buttonText ?? "",

        buttonLink: supportCtaData?.buttonLink ?? "",

        image: imageUrl,
      };

      const response = await API.put("/admin/contact", {
        supportCta: supportCtaPayload,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save Support CTA."
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setContactData(updatedData);
      }

      setSuccessMessage("Support CTA saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Support CTA."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!contactData) {
      console.warn("[CmsContact] Save All skipped. No contact data.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const heroPayload = {
        badge: contactData?.hero?.badge ?? "",

        title: contactData?.hero?.title ?? "",

        description: contactData?.hero?.description ?? "",

        primaryButtonText: contactData?.hero?.primaryButtonText ?? "",

        primaryButtonLink: contactData?.hero?.primaryButtonLink ?? "",

        secondaryButtonText: contactData?.hero?.secondaryButtonText ?? "",

        secondaryButtonLink: contactData?.hero?.secondaryButtonLink ?? "",

        image: contactData?.hero?.image ?? "",
      };

      const contactFormPayload = {
        badge: contactData?.contactForm?.badge ?? "",

        title: contactData?.contactForm?.title ?? "",

        description: contactData?.contactForm?.description ?? "",

        image:
          typeof contactData?.contactForm?.image === "string" &&
          !contactData.contactForm.image.startsWith("blob:")
            ? contactData.contactForm.image
            : "",

        submitButtonText: contactData?.contactForm?.submitButtonText ?? "",

        subjects: Array.isArray(contactData?.contactForm?.subjects)
          ? contactData.contactForm.subjects.map((subject, index) => ({
              value: subject?.value ?? "",

              label: subject?.label ?? "",

              order:
                Number(subject?.order) > 0 ? Number(subject.order) : index + 1,

              isActive: subject?.isActive !== false,
            }))
          : [],
      };

      const supportCtaSource =
        contactData?.supportCta?.supportCta &&
        typeof contactData.supportCta.supportCta === "object"
          ? contactData.supportCta.supportCta
          : contactData?.supportCta || {};

      const supportCtaPayload = {
        title: supportCtaSource?.title ?? "",

        description: supportCtaSource?.description ?? "",

        buttonText: supportCtaSource?.buttonText ?? "",

        buttonLink: supportCtaSource?.buttonLink ?? "",

        image:
          typeof supportCtaSource?.image === "string" &&
          !supportCtaSource.image.startsWith("blob:")
            ? supportCtaSource.image
            : "",
      };

      const payload = {
        hero: heroPayload,

        contactCards: contactData?.contactCards,

        contactForm: contactFormPayload,

        officeLocation: contactData?.officeLocation,

        helpSection: contactData?.helpSection,

        supportCta: supportCtaPayload,

        isActive: contactData?.isActive,
      };

      const response = await API.put("/admin/contact", payload);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save contact page."
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setContactData(updatedData);
      }

      setSuccessMessage("All Contact page changes saved successfully.");
    } catch (err) {
      console.error("[CmsContact] Contact CMS save-all error:", err);

      console.error(
        "[CmsContact] Save All error response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save contact page."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await API.post("/admin/contact/reset");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to reset contact page."
        );
      }

      const resetData = response.data?.data;

      if (resetData) {
        setContactData(resetData);
      }

      setActiveSection("hero");

      setSuccessMessage("Contact page reset successfully.");
    } catch (err) {
      console.error("[CmsContact] Contact CMS reset error:", err);

      console.error("[CmsContact] Reset error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset contact page."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open("/contact", "_blank", "noopener,noreferrer");
  };

  const renderEditor = () => {
    if (!contactData) {
      return null;
    }

    switch (activeSection) {
      case "hero":
        return (
          <HeroSection
            data={contactData?.hero}
            onChange={(data) => handleSectionChange("hero", data)}
            onSave={handleHeroSave}
            saving={saving}
          />
        );

      case "contactCards":
        return (
          <ContactInfoEdit
            data={{
              contactCards: Array.isArray(contactData?.contactCards)
                ? contactData.contactCards
                : [],
            }}
            saving={saving}
            onChange={(sectionData) => {
              const cards = Array.isArray(sectionData?.contactCards)
                ? sectionData.contactCards
                : [];

              handleSectionChange("contactCards", cards);
            }}
            onSave={(sectionData) => {
              const cards = Array.isArray(sectionData?.contactCards)
                ? sectionData.contactCards
                : [];

              handleContactInformationSave(cards);
            }}
            onReset={handleReset}
          />
        );

      case "contactForm":
        return (
          <ContactFormEdit
            data={contactData?.contactForm}
            onChange={(data) => handleSectionChange("contactForm", data)}
            onSave={handleContactFormSave}
            saving={saving}
          />
        );

      case "officeLocation":
        return (
          <OfficeEdit
            data={contactData?.officeLocation}
            onChange={(data) => handleSectionChange("officeLocation", data)}
            onSave={handleOfficeLocationSave}
            saving={saving}
          />
        );

      case "helpSection":
        return (
          <HelpEdit
            data={contactData?.helpSection}
            onChange={(data) => handleSectionChange("helpSection", data)}
            onSave={handleHelpSectionSave}
            saving={saving}
          />
        );

      case "supportCta":
        return (
          <SupportCtaEdit
            data={contactData?.supportCta}
            onChange={(data) => handleSectionChange("supportCta", data)}
            onSave={handleSupportCtaSave}
            saving={saving}
          />
        );

      default:
        return (
          <div
            className="rounded-4 bg-white p-5 text-center"
            style={{
              border: "1px solid #eef0f2",
            }}
          >
            <h6 className="fw-bold mb-2">Section Not Found</h6>

            <p className="text-secondary mb-0">
              Please select a valid Contact CMS section.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "#0e8a5f",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="text-secondary mt-3 mb-0">Loading contact page...</p>
        </div>
      </div>
    );
  }

  if (error && !contactData) {
    return (
      <div
        className="d-flex align-items-center justify-content-center p-4"
        style={{
          minHeight: "100vh",
        }}
      >
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <ContactHeader
        onPreview={handlePreview}
        onSaveAll={handleSaveAll}
        onReset={handleReset}
        saving={saving}
      />

      <div className="container-fluid px-4 pb-4">
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mt-3" role="alert">
            {successMessage}
          </div>
        )}

        <div className="row g-3 mt-1">
          <div className="col-lg-4">
            <ContactSectionList
              activeSection={activeSection}
              onSelectSection={setActiveSection}
            />
          </div>

          <div className="col-lg-8">{renderEditor()}</div>
        </div>
      </div>
    </div>
  );
}

export default CmsContact;
