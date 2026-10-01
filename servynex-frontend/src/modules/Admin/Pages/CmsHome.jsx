import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import API from "../../../api/api";

import HeroSectionEdit from "../../../components/AdminComponents/websiteCMS/Home/HeroSectionEdit";
import HowItworksEdit from "../../../components/AdminComponents/websiteCMS/Home/HowItworksEdit"
import WhyChooseEdit from "../../../components/AdminComponents/websiteCMS/Home/WhyChooseEdit";
import CtaEdit from "../../../components/AdminComponents/websiteCMS/Home/CtaEdit";
import FaqEdit from "../../../components/AdminComponents/websiteCMS/Home/FaqEdit";

import HomeHeader from "../../../components/AdminComponents/websiteCMS/Home/HomeHeader";
import PageSectionsList from "../../../components/AdminComponents/websiteCMS/Home/PageSectionList";

export default function CmsHomepage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [homepageData, setHomepageData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isFile = (value) => {
    return typeof File !== "undefined" && value instanceof File;
  };

  const uploadHomepageImage = async (file, sectionName) => {
    if (!isFile(file)) {
      throw new Error(`${sectionName} image is not a valid File.`);
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.has(file.type)) {
      console.error(`[${sectionName}] Invalid image type:`, file.type);

      throw new Error(`${sectionName} image must be JPG, PNG or WEBP.`);
    }

    if (file.size > maxSize) {
      console.error(`[${sectionName}] Image exceeds 5MB:`, file.size);

      throw new Error(
        `${sectionName} image must be less than or equal to 5 MB.`
      );
    }

    const formData = new FormData();

    formData.append("image", file);

    let uploadResponse;

    try {
      uploadResponse = await API.post("/admin/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",

        },
        timeout: 60000,

      });
    } catch (uploadError) {
      console.error(`[${sectionName}] IMAGE UPLOAD API ERROR:`, uploadError);

      console.error(
        `[${sectionName}] Upload error response:`,
        uploadError?.response?.data
      );

      throw new Error(
        uploadError?.response?.data?.message ||
          `${sectionName} image upload failed.`
      );
    }

    if (!uploadResponse?.data?.success) {
      throw new Error(
        uploadResponse?.data?.message || `${sectionName} image upload failed.`
      );
    }

    const imageUrl = uploadResponse?.data?.data?.url;

    if (!imageUrl) {
      throw new Error(
        `${sectionName} image uploaded but backend did not return image URL.`
      );
    }
    if (imageUrl.startsWith("blob:")) {
      console.error(
        `[${sectionName}] ERROR: Backend returned Blob URL!`,
        imageUrl
      );

      throw new Error(
        `${sectionName} image upload returned an invalid Blob URL.`
      );
    }

    if (imageUrl.startsWith("data:")) {
      console.error(`[${sectionName}] ERROR: Backend returned Base64 image!`);

      throw new Error(
        `${sectionName} image upload returned invalid Base64 data.`
      );
    }

    return imageUrl;
  };

  const prepareHeroData = async (heroData) => {
    if (!heroData) {
      return heroData;
    }

    const preparedHero = {
      ...heroData,
    };

    if (isFile(preparedHero.imageFile)) {
      preparedHero.image = await uploadHomepageImage(
        preparedHero.imageFile,
        "Hero"
      );
      delete preparedHero.imageFile;
    } else {
    }

    if (isFile(preparedHero.image)) {
      console.error(
        "[Hero] ERROR: image is still a File before save.",
        preparedHero.image
      );

      throw new Error("Hero image could not be prepared correctly.");
    }

    return preparedHero;
  };

  const prepareCtaData = async (ctaData) => {
    if (!ctaData) {
      return ctaData;
    }

    const preparedCta = {
      ...ctaData,
    };

    if (isFile(preparedCta.imageFile)) {
      preparedCta.image = await uploadHomepageImage(
        preparedCta.imageFile,
        "CTA"
      );

      delete preparedCta.imageFile;
    } else {
    }

    // Safety check
    if (isFile(preparedCta.image)) {
      console.error(
        "[CTA] ERROR: image is still a File before save.",
        preparedCta.image
      );

      throw new Error("CTA image could not be prepared correctly.");
    }

    return preparedCta;
  };

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/webhome");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to load homepage content."
        );
      }

      setHomepageData(response.data.data);
    } catch (err) {
      console.error("Homepage CMS fetch error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load homepage content."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const handleSectionChange = (sectionKey, sectionData) => {
    if (sectionKey === "hero") {
    }

    if (sectionKey === "cta") {
    }

    setHomepageData((previousData) => {
      if (!previousData) return previousData;

      return {
        ...previousData,
        [sectionKey]: sectionData,
      };
    });
  };

  const handleHeroSave = async (heroData) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const preparedHero = await prepareHeroData(heroData);

      const finalPayload = {
        hero: preparedHero,
      };

      const response = await API.put("/admin/webhome", finalPayload);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save Hero section."
        );
      }

      setHomepageData(response.data.data);

      setSuccessMessage("Hero section saved successfully.");
    } catch (err) {
      console.error("Hero section save error:", err);

      console.error("[Hero Save] Error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Hero section."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCtaSave = async (ctaData) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const preparedCta = await prepareCtaData(ctaData);

      const response = await API.put("/admin/webhome", {
        cta: preparedCta,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save CTA section."
        );
      }

      setHomepageData(response.data.data);

      setSuccessMessage("CTA section saved successfully.");
    } catch (err) {
      console.error("CTA section save error:", err);

      console.error(
        "[CTA Save] Error response:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save CTA section."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!homepageData) return;

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const preparedHero = await prepareHeroData(homepageData.hero);
      const preparedCta = await prepareCtaData(homepageData.cta);

      const finalPayload = {
        hero: preparedHero,
        howItWorks: homepageData.howItWorks,
        whyChoose: homepageData.whyChoose,
        cta: preparedCta,
        faqs: homepageData.faqs,
      };

      const response = await API.put("/admin/webhome", finalPayload);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save homepage content."
        );
      }

      setHomepageData(response.data.data);

      setSuccessMessage("All homepage changes saved successfully.");
    } catch (err) {
      console.error("Homepage save-all error:", err);

      console.error("[SAVE ALL] Error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save homepage content."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleHeroReset = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const defaultHero = {
        badge: "#1 Home Service Platform",
        title: "Reliable Home Services, Just a Few Clicks Away",
        description:
          "Book trusted professionals for all your home service needs. Fast, reliable and hassle-free.",
        primaryButtonText: "Book a Service",
        primaryButtonLink: "/services",
        secondaryButtonText: "How It Works",
        secondaryButtonLink: "/how-it-works",
        image: "",
      };

      const response = await API.put("/admin/webhome", {
        hero: defaultHero,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to reset Hero section."
        );
      }

      setHomepageData(response.data.data);

      setSuccessMessage("Hero section reset successfully.");
    } catch (err) {
      console.error("Hero reset error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset Hero section."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open("/", "_blank", "noopener,noreferrer");
  };

  const renderEditor = () => {
    if (!homepageData) return null;

    switch (activeSection) {
      case "hero":
        return (
          <HeroSectionEdit
            data={homepageData.hero}
            onChange={(data) => handleSectionChange("hero", data)}
            onSave={handleHeroSave}
            onReset={handleHeroReset}
            saving={saving}
          />
        );

      case "howItWorks":
        return (
          <HowItworksEdit
            data={homepageData.howItWorks}
            onChange={(data) => handleSectionChange("howItWorks", data)}
            saving={saving}
          />
        );

      case "whyChoose":
        return (
          <WhyChooseEdit
            data={homepageData.whyChoose}
            onChange={(data) => handleSectionChange("whyChoose", data)}
            saving={saving}
          />
        );

      case "cta":
        return (
          <CtaEdit
            data={homepageData.cta}
            onChange={(data) => handleSectionChange("cta", data)}
            onSave={handleCtaSave}
            saving={saving}
          />
        );

      case "faqs":
        return (
          <FaqEdit
            data={homepageData.faqs}
            onChange={(data) => handleSectionChange("faqs", data)}
            saving={saving}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#0e8a5f" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>

          <p className="text-secondary mt-3 mb-0">Loading homepage...</p>
        </div>
      </div>
    );
  }

  if (error && !homepageData) {
    return (
      <div
        className="d-flex align-items-center justify-content-center p-4"
        style={{ minHeight: "100vh" }}
      >
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <HomeHeader
        onPreview={handlePreview}
        onSaveAll={handleSaveAll}
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
            <PageSectionsList
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              onAddSection={() => {}}
            />
          </div>

          <div className="col-lg-8">{renderEditor()}</div>
        </div>
      </div>
    </div>
  );
}
