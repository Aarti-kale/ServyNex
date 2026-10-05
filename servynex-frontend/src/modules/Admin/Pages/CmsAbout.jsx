import React, { useCallback, useEffect, useState } from "react";

import API from "../../../api/api.js";

import AboutHero from "../../../components/AdminComponents/websiteCMS/About/AboutHero";
import AboutHeader from "../../../components/AdminComponents/websiteCMS/About/AboutHeader";
import AboutSectionList from "../../../components/AdminComponents/websiteCMS/About/AboutSectionList";

import AboutStoryEdit from "../../../components/AdminComponents/websiteCMS/About/AboutStoryEdit.jsx";
import AboutMissionVisionEdit from "../../../components/AdminComponents/websiteCMS/About/AboutMissionVisionEdit.jsx";
import AboutCoreValuesEdit from "../../../components/AdminComponents/websiteCMS/About/AboutCoreValuesEdit.jsx";
import AboutJourneyEdit from "../../../components/AdminComponents/websiteCMS/About/AboutJourneyEdit.jsx";
import AboutCommitmentEdit from "../../../components/AdminComponents/websiteCMS/About/AboutCommitmentEdit.jsx";

const DEFAULT_ABOUT_DATA = {
  hero: {
    badge: "ABOUT US",
    title: "About ServyNex",
    description:
      "We are on a mission to make home services simple, reliable and accessible for everyone.",
    highlights: [
      {
        title: "Trusted Professionals",
        description: "Verified, skilled & background checked",
        icon: "shield",
      },
      {
        title: "Customer First",
        description: "Your satisfaction is our top priority",
        icon: "users",
      },
    ],
    image: "",
  },

  story: {
    title: "Our Story",
    paragraphs: [
      "Finding reliable and skilled professionals for home services has always been a challenge. Unverified workers, unclear pricing, delays and inconsistent quality have created frustration for millions of households.",
      "ServyNex was founded to solve this problem through technology and trust. Our platform connects customers with verified professionals, ensuring transparent pricing, on-time service and the best experience.",
    ],
    image: "",
  },

  missionVision: {
    title: "Mission & Vision",
    mission: {
      title: "Our Mission",
      description:
        "To deliver reliable, safe and high-quality home services through verified professionals and technology.",
      icon: "target",
    },
    vision: {
      title: "Our Vision",
      description:
        "To become India's most trusted and preferred platform for all home service needs.",
      icon: "eye",
    },
  },

  coreValues: {
    title: "Our Core Values",
    values: [
      {
        title: "Trust",
        description:
          "We build trust through verification, transparency and reliability.",
        icon: "shield",
      },
      {
        title: "Quality",
        description:
          "We are committed to delivering the highest service quality.",
        icon: "badge",
      },
      {
        title: "Transparency",
        description:
          "Clear pricing, honest communication and no hidden charges.",
        icon: "scale",
      },
      {
        title: "Customer First",
        description: "We put our customers first in everything we do.",
        icon: "user",
      },
    ],
  },

  journey: {
    title: "Our Journey",
    milestones: [
      {
        year: 2022,
        title: "ServyNex was founded",
        icon: "flag",
      },
      {
        year: 2023,
        title: "500+ Professionals Onboarded",
        icon: "users",
      },
      {
        year: 2024,
        title: "10,000+ Happy Customers",
        icon: "building",
      },
      {
        year: 2025,
        title: "25,000+ Services Completed",
        icon: "badge",
      },
      {
        year: 2026,
        title: "Continuing to grow and improve every day",
        icon: "rocket",
      },
    ],
  },

  commitment: {
    title: "Our Commitment",
    description:
      "We are committed to creating a safe, reliable and delightful experience for every customer, every time.",
    points: [
      {
        title: "Verified & skilled professionals",
        icon: "shield",
      },
      {
        title: "On-time & dependable service",
        icon: "clock",
      },
      {
        title: "Transparent & fair pricing",
        icon: "price",
      },
    ],
    image: "",
  },

  isActive: true,
};

const cloneAboutData = (data) => {
  if (!data) {
    return DEFAULT_ABOUT_DATA;
  }

  return {
    ...data,

    hero: {
      ...DEFAULT_ABOUT_DATA.hero,
      ...(data.hero || {}),
      highlights: Array.isArray(data.hero?.highlights)
        ? data.hero.highlights.map((item) => ({
            ...item,
          }))
        : DEFAULT_ABOUT_DATA.hero.highlights.map((item) => ({
            ...item,
          })),
    },

    story: {
      ...DEFAULT_ABOUT_DATA.story,
      ...(data.story || {}),
      paragraphs: Array.isArray(data.story?.paragraphs)
        ? [...data.story.paragraphs]
        : [...DEFAULT_ABOUT_DATA.story.paragraphs],
    },

    missionVision: {
      ...DEFAULT_ABOUT_DATA.missionVision,
      ...(data.missionVision || {}),
      mission: {
        ...DEFAULT_ABOUT_DATA.missionVision.mission,
        ...(data.missionVision?.mission || {}),
      },
      vision: {
        ...DEFAULT_ABOUT_DATA.missionVision.vision,
        ...(data.missionVision?.vision || {}),
      },
    },

    coreValues: {
      ...DEFAULT_ABOUT_DATA.coreValues,
      ...(data.coreValues || {}),
      values: Array.isArray(data.coreValues?.values)
        ? data.coreValues.values.map((item) => ({
            ...item,
          }))
        : DEFAULT_ABOUT_DATA.coreValues.values.map((item) => ({
            ...item,
          })),
    },

    journey: {
      ...DEFAULT_ABOUT_DATA.journey,
      ...(data.journey || {}),
      milestones: Array.isArray(data.journey?.milestones)
        ? data.journey.milestones.map((item) => ({
            ...item,
          }))
        : DEFAULT_ABOUT_DATA.journey.milestones.map((item) => ({
            ...item,
          })),
    },

    commitment: {
      ...DEFAULT_ABOUT_DATA.commitment,
      ...(data.commitment || {}),
      points: Array.isArray(data.commitment?.points)
        ? data.commitment.points.map((item) => ({
            ...item,
          }))
        : DEFAULT_ABOUT_DATA.commitment.points.map((item) => ({
            ...item,
          })),
    },
  };
};

const isFile = (value) => {
  return typeof File !== "undefined" && value instanceof File;
};

const uploadAboutImage = async (file) => {
  if (!isFile(file)) {
    throw new Error("Invalid image file");
  }

  const formData = new FormData();

  formData.append("image", file);

  const response = await API.post("/admin/upload/image", formData);

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Image upload failed");
  }

  const imageUrl = response.data?.data?.url;

  if (!imageUrl) {
    throw new Error("Image uploaded but server did not return image URL");
  }

  return imageUrl;
};

const prepareSectionData = async (sectionData) => {
  if (!sectionData) {
    return sectionData;
  }

  const preparedData = {
    ...sectionData,
  };

  if (isFile(preparedData.image)) {
    preparedData.image = await uploadAboutImage(preparedData.image);
  } else if (isFile(preparedData.imageFile)) {
    preparedData.image = await uploadAboutImage(preparedData.imageFile);
  }

  delete preparedData.imageFile;

  if (preparedData.image === null || preparedData.image === undefined) {
    preparedData.image = "";
  }

  return preparedData;
};

const cleanSectionData = (sectionData) => {
  if (!sectionData) {
    return sectionData;
  }

  const cleanedData = {
    ...sectionData,
  };

  delete cleanedData.imageFile;

  return cleanedData;
};

const CmsAbout = () => {
  const [activeSection, setActiveSection] = useState("hero");

  const [aboutData, setAboutData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const fetchAboutContent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await API.get("/admin/about");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to load About content"
        );
      }

      const data = response.data?.data;

      if (!data) {
        throw new Error("About content not found");
      }

      setAboutData(cloneAboutData(data));
    } catch (err) {
      console.error("About CMS fetch error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load About content"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  const handleSectionChange = useCallback((sectionName, sectionData) => {
    setAboutData((previousData) => {
      if (!previousData) {
        return previousData;
      }

      return {
        ...previousData,
        [sectionName]: sectionData,
      };
    });
  }, []);

  const handleSectionSave = async (sectionName, sectionData) => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!sectionData) {
        throw new Error(`${sectionName} data is missing`);
      }

      const preparedSection = await prepareSectionData(sectionData);
      if (
        sectionName === "commitment" &&
        !preparedSection.image &&
        aboutData?.commitment?.image
      ) {
        preparedSection.image = aboutData.commitment.image;
      }
      const cleanedSection = cleanSectionData(preparedSection);

      const response = await API.put("/admin/about", {
        [sectionName]: cleanedSection,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || `Failed to save ${sectionName}`
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setAboutData(cloneAboutData(updatedData));
      } else {
        setAboutData((previousData) => ({
          ...previousData,
          [sectionName]: cleanedSection,
        }));
      }

      setSuccessMessage(`${sectionName} section saved successfully.`);
    } catch (err) {
      console.error(`About ${sectionName} save error:`, err);

      console.error("API error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to save ${sectionName}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset the About page to default content?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await API.delete("/admin/about");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to reset About content"
        );
      }

      const resetData = response.data?.data;

      if (resetData) {
        setAboutData(cloneAboutData(resetData));
      } else {
        await fetchAboutContent();
      }

      setSuccessMessage("About content reset successfully.");
    } catch (err) {
      console.error("About CMS reset error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset About content"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (!aboutData) {
        throw new Error("About content is not loaded");
      }

      const [hero, story, missionVision, coreValues, journey, commitment] =
        await Promise.all([
          prepareSectionData(aboutData.hero),
          prepareSectionData(aboutData.story),
          prepareSectionData(aboutData.missionVision),
          prepareSectionData(aboutData.coreValues),
          prepareSectionData(aboutData.journey),
          prepareSectionData(aboutData.commitment),
        ]);

      const payload = {
        hero: cleanSectionData(hero),
        story: cleanSectionData(story),
        missionVision: cleanSectionData(missionVision),
        coreValues: cleanSectionData(coreValues),
        journey: cleanSectionData(journey),
        commitment: cleanSectionData(commitment),
      };

      const response = await API.put("/admin/about", payload);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to save About content"
        );
      }

      const updatedData = response.data?.data;

      if (updatedData) {
        setAboutData(cloneAboutData(updatedData));
      }

      setSuccessMessage("All About page changes saved successfully.");
    } catch (err) {
      console.error("About CMS save-all error:", err);

      console.error("API error response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save About content"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open("/about", "_blank", "noopener,noreferrer");
  };

  const renderEditor = () => {
    if (!aboutData) {
      return null;
    }

    switch (activeSection) {
      case "hero":
        return (
          <AboutHero
            data={aboutData.hero}
            onChange={(sectionData) => handleSectionChange("hero", sectionData)}
            onSave={(sectionData) => handleSectionSave("hero", sectionData)}
            onReset={handleReset}
            saving={saving}
          />
        );

      case "story":
        return (
          <AboutStoryEdit
            data={aboutData.story}
            onChange={(sectionData) =>
              handleSectionChange("story", sectionData)
            }
            onSave={(sectionData) => handleSectionSave("story", sectionData)}
            onReset={handleReset}
            saving={saving}
          />
        );

      case "missionVision":
        return (
          <AboutMissionVisionEdit
            data={aboutData.missionVision}
            onChange={(sectionData) =>
              handleSectionChange("missionVision", sectionData)
            }
            onSave={(sectionData) =>
              handleSectionSave("missionVision", sectionData)
            }
            onReset={handleReset}
            saving={saving}
          />
        );

      case "coreValues":
        return (
          <AboutCoreValuesEdit
            data={aboutData.coreValues}
            onChange={(sectionData) =>
              handleSectionChange("coreValues", sectionData)
            }
            onSave={(sectionData) =>
              handleSectionSave("coreValues", sectionData)
            }
            onReset={handleReset}
            saving={saving}
          />
        );

      case "journey":
        return (
          <AboutJourneyEdit
            data={aboutData.journey}
            onChange={(sectionData) =>
              handleSectionChange("journey", sectionData)
            }
            onSave={(sectionData) => handleSectionSave("journey", sectionData)}
            onReset={handleReset}
            saving={saving}
          />
        );

      case "commitment":
        return (
          <AboutCommitmentEdit
            data={aboutData.commitment}
            onChange={(sectionData) =>
              handleSectionChange("commitment", sectionData)
            }
            onSave={(sectionData) =>
              handleSectionSave("commitment", sectionData)
            }
            onReset={handleReset}
            saving={saving}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div
            className="spinner-border"
            style={{
              color: "#0e8a5f",
            }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f8fbfa",
        minHeight: "100vh",
      }}
    >
      <AboutHeader
        onPreview={handlePreview}
        onSaveAll={handleSaveAll}
        saving={saving}
      />

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <div className="fw-semibold">Failed</div>

          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

      <div className="row g-4 mt-1">
        <div className="col-lg-3">
          <AboutSectionList
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            data={aboutData}
          />
        </div>

        <div className="col-lg-9">{renderEditor()}</div>
      </div>
    </div>
  );
};

export default CmsAbout;
