import React, { useCallback, useEffect, useMemo, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import API from "../../../api/api.js";

import ProfessionalHeroEdit from "../../../components/AdminComponents/websiteCMS/Workers/ProfessionalHeroEdit.jsx";

import ProfessionalVerificationEdit from "../../../components/AdminComponents/websiteCMS/Workers/ProfessionalVerificationEdit.jsx";

import ProfessionalStandardsEdit from "../../../components/AdminComponents/websiteCMS/Workers/ProfessionalStandardsEdit.jsx";

import BecomeProfessionalEdit from "../../../components/AdminComponents/websiteCMS/Workers/BecomeProfessionalEdit.jsx";

import ProfessionalSectionList from "../../../components/AdminComponents/websiteCMS/Workers/ProfessionalSectionList.jsx";

const SECTION_KEYS = [
  "hero",
  "verification",
  "standards",
  "achievements",
  "becomeProfessional",
];

const SECTION_API = {
  hero: {
    label: "Professional Hero",
    endpoint: "/admin/professional",
    resetEndpoint: "/admin/professional/reset",
  },

  verification: {
    label: "Verification Process",
    endpoint: "/admin/professional/verification-process",
    resetEndpoint: "/admin/professional/verification-process/reset",
  },

  standards: {
    label: "Professional Standards",
    endpoint: "/admin/professional/standards",
    resetEndpoint: "/admin/professional/standards/reset",
  },

  becomeProfessional: {
    label: "Become Professional CTA",
    endpoint: "/admin/professional/become-professional",
    resetEndpoint: "/admin/professional/become-professional/reset",
  },
};

const isFile = (value) => {
  return typeof File !== "undefined" && value instanceof File;
};

const cloneData = (data) => {
  if (!data) {
    return {};
  }

  return JSON.parse(JSON.stringify(data));
};

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || error?.message || fallbackMessage;
};

const createInitialCmsData = () => {
  return SECTION_KEYS.reduce(
    (result, sectionKey) => ({
      ...result,
      [sectionKey]: {},
    }),
    {}
  );
};

const normalizeProfessionalHeroResponse = (data) => {
  if (!data) {
    return {};
  }

  if (data.hero && typeof data.hero === "object") {
    return {
      badge: data.hero.badge ?? "",

      title: data.hero.title ?? "",

      highlightedTitle: data.hero.highlightedTitle ?? "",

      description: data.hero.description ?? "",

      primaryButton: {
        text: data.hero.primaryButton?.text ?? "",

        link: data.hero.primaryButton?.link ?? "",
      },

      secondaryButton: {
        text: data.hero.secondaryButton?.text ?? "",

        link: data.hero.secondaryButton?.link ?? "",
      },

      image: data.hero.image ?? "",

      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    };
  }

  return {
    badge: data.badge ?? "",

    title: data.title ?? "",

    highlightedTitle: data.highlightedTitle ?? "",

    description: data.description ?? "",

    primaryButton: {
      text: data.primaryButton?.text ?? "",

      link: data.primaryButton?.link ?? "",
    },

    secondaryButton: {
      text: data.secondaryButton?.text ?? "",

      link: data.secondaryButton?.link ?? "",
    },

    image: data.image ?? "",

    isActive: typeof data.isActive === "boolean" ? data.isActive : true,
  };
};

const buildProfessionalHeroPayload = (heroData) => {
  if (!heroData) {
    return {
      hero: {
        badge: "",
        title: "",
        highlightedTitle: "",
        description: "",

        primaryButton: {
          text: "",
          link: "",
        },

        secondaryButton: {
          text: "",
          link: "",
        },

        image: "",
      },

      isActive: true,
    };
  }

  return {
    hero: {
      badge: heroData.badge ?? "",

      title: heroData.title ?? "",

      highlightedTitle: heroData.highlightedTitle ?? "",

      description: heroData.description ?? "",

      primaryButton: {
        text: heroData.primaryButton?.text ?? "",

        link: heroData.primaryButton?.link ?? "",
      },

      secondaryButton: {
        text: heroData.secondaryButton?.text ?? "",

        link: heroData.secondaryButton?.link ?? "",
      },

      image: heroData.image ?? "",
    },

    isActive: typeof heroData.isActive === "boolean" ? heroData.isActive : true,
  };
};

function CmsWorker() {
  const [activeSection, setActiveSection] = useState("hero");

  const [cmsData, setCmsData] = useState(createInitialCmsData);

  const [savedCmsData, setSavedCmsData] = useState(createInitialCmsData);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const uploadProfessionalImage = useCallback(async (file, sectionName) => {
    if (!isFile(file)) {
      throw new Error(`${sectionName} image is not a valid File.`);
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!allowedTypes.has(file.type)) {
      throw new Error(`${sectionName} image must be JPG, PNG or WEBP.`);
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
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
      });
    } catch (uploadError) {
      console.error(
        `[${sectionName}] Image upload request failed:`,
        uploadError
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
      throw new Error(
        `${sectionName} image upload returned an invalid Blob URL.`
      );
    }

    if (imageUrl.startsWith("data:")) {
      throw new Error(
        `${sectionName} image upload returned invalid Base64 data.`
      );
    }

    return imageUrl;
  }, []);

  const prepareHeroData = useCallback(
    async (heroData) => {
      if (!heroData) {
        return heroData;
      }

      const preparedHero = {
        ...heroData,
      };

      if (isFile(preparedHero.imageFile)) {
        const uploadedImageUrl = await uploadProfessionalImage(
          preparedHero.imageFile,
          "Professional Hero"
        );

        preparedHero.image = uploadedImageUrl;

        delete preparedHero.imageFile;
      } else {
      }

      if (isFile(preparedHero.image)) {
        throw new Error(
          "Professional Hero image could not be prepared correctly."
        );
      }

      if (
        typeof preparedHero.image === "string" &&
        preparedHero.image.startsWith("blob:")
      ) {
        throw new Error("Professional Hero image cannot be a Blob URL.");
      }

      if (
        typeof preparedHero.image === "string" &&
        preparedHero.image.startsWith("data:")
      ) {
        throw new Error("Professional Hero image cannot be Base64 data.");
      }

      return preparedHero;
    },
    [uploadProfessionalImage]
  );

  const prepareBecomeProfessionalData = useCallback(
    async (becomeProfessionalData) => {
      if (!becomeProfessionalData) {
        return becomeProfessionalData;
      }

      const preparedData = {
        ...becomeProfessionalData,
      };

      if (isFile(preparedData.imageFile)) {
        const uploadedImageUrl = await uploadProfessionalImage(
          preparedData.imageFile,
          "Become Professional"
        );

        preparedData.image = uploadedImageUrl;

        delete preparedData.imageFile;
      } else {
      }

      if (isFile(preparedData.image)) {
        throw new Error(
          "Become Professional image could not be prepared correctly."
        );
      }

      if (
        typeof preparedData.image === "string" &&
        preparedData.image.startsWith("blob:")
      ) {
        throw new Error("Become Professional image cannot be a Blob URL.");
      }

      if (
        typeof preparedData.image === "string" &&
        preparedData.image.startsWith("data:")
      ) {
        throw new Error("Become Professional image cannot be Base64 data.");
      }

      return preparedData;
    },
    [uploadProfessionalImage]
  );

  const prepareSectionData = useCallback(
    async (sectionKey, sectionData) => {
      if (!sectionData) {
        return sectionData;
      }

      if (sectionKey === "hero") {
        const preparedHero = await prepareHeroData(sectionData);

        return buildProfessionalHeroPayload(preparedHero);
      }

      if (sectionKey === "becomeProfessional") {
        return prepareBecomeProfessionalData(sectionData);
      }

      return {
        ...sectionData,
      };
    },
    [prepareHeroData, prepareBecomeProfessionalData]
  );

  const fetchSection = useCallback(async (sectionKey) => {
    const sectionConfig = SECTION_API[sectionKey];

    if (sectionKey === "achievements") {
      return {
        sectionKey,
        data: {},
      };
    }

    if (!sectionConfig) {
      throw new Error(`API configuration is missing for ${sectionKey}.`);
    }

    const response = await API.get(sectionConfig.endpoint);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || `Failed to load ${sectionConfig.label}.`
      );
    }

    if (!response.data?.data) {
      throw new Error(`${sectionConfig.label} content was not found.`);
    }

    return {
      sectionKey,
      data: response.data.data,
    };
  }, []);

  useEffect(() => {
    const loadInitialHero = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const sectionResponse = await fetchSection("hero");

        const normalizedHero = normalizeProfessionalHeroResponse(
          sectionResponse.data
        );

        setCmsData((previousData) => ({
          ...previousData,
          hero: normalizedHero,
        }));

        setSavedCmsData((previousData) => ({
          ...previousData,
          hero: cloneData(normalizedHero),
        }));
      } catch (requestError) {
        console.error("Professional Hero fetch error:", requestError);

        setError(
          getErrorMessage(requestError, "Failed to load Professional Hero.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialHero();
  }, [fetchSection]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [successMessage]);

  const handleSectionChange = useCallback((sectionKey, updatedSectionData) => {
    if (!SECTION_KEYS.includes(sectionKey)) {
      return;
    }

    if (sectionKey === "hero") {
    }

    if (sectionKey === "becomeProfessional") {
    }

    setCmsData((previousData) => ({
      ...previousData,
      [sectionKey]: updatedSectionData || {},
    }));
  }, []);

  const handleSelectSection = useCallback(
    async (sectionKey) => {
      if (!SECTION_KEYS.includes(sectionKey)) {
        return;
      }

      setActiveSection(sectionKey);

      setError("");
      setSuccessMessage("");

      if (sectionKey === "achievements") {
        setCmsData((previousData) => ({
          ...previousData,
          achievements: {},
        }));

        setSavedCmsData((previousData) => ({
          ...previousData,
          achievements: {},
        }));

        return;
      }

      try {
        setLoading(true);

        const sectionResponse = await fetchSection(sectionKey);

        let fetchedData = sectionResponse.data;

        if (sectionKey === "hero") {
          fetchedData = normalizeProfessionalHeroResponse(fetchedData);
        } else {
          fetchedData = cloneData(fetchedData);
        }

        setCmsData((previousData) => ({
          ...previousData,
          [sectionKey]: fetchedData,
        }));

        setSavedCmsData((previousData) => ({
          ...previousData,
          [sectionKey]: cloneData(fetchedData),
        }));
      } catch (requestError) {
        console.error(`${sectionKey} fetch error:`, requestError);

        setError(
          getErrorMessage(
            requestError,
            `Failed to load ${SECTION_API[sectionKey]?.label || sectionKey}.`
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchSection]
  );

  const handleAddSection = useCallback(() => {
    setError(
      "All currently available Professionals CMS sections are already added."
    );
  }, []);

  const handleSaveSection = useCallback(
    async (sectionKey, sectionData) => {
      if (sectionKey === "achievements") {
        setError("Professional Achievements does not have a backend API.");

        return;
      }

      const sectionConfig = SECTION_API[sectionKey];

      try {
        if (!sectionConfig) {
          throw new Error(`API configuration is missing for ${sectionKey}.`);
        }

        const rawPayload = sectionData || cmsData[sectionKey];

        if (!rawPayload) {
          throw new Error(`${sectionConfig.label} data is missing.`);
        }

        setSaving(true);
        setError("");
        setSuccessMessage("");

        const finalPayload = await prepareSectionData(sectionKey, rawPayload);

        if (sectionKey === "hero") {
        }

        const response = await API.put(sectionConfig.endpoint, finalPayload);

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || `Failed to save ${sectionConfig.label}.`
          );
        }

        let savedData = response.data?.data || finalPayload;

        if (sectionKey === "hero") {
          savedData = normalizeProfessionalHeroResponse(savedData);
        } else {
          savedData = cloneData(savedData);
        }

        setCmsData((previousData) => ({
          ...previousData,
          [sectionKey]: cloneData(savedData),
        }));

        setSavedCmsData((previousData) => ({
          ...previousData,
          [sectionKey]: cloneData(savedData),
        }));

        setSuccessMessage(`${sectionConfig.label} saved successfully.`);
      } catch (requestError) {
        console.error(
          `${sectionConfig?.label || sectionKey} save error:`,
          requestError
        );

        setError(
          getErrorMessage(
            requestError,
            `Failed to save ${sectionConfig?.label || sectionKey}.`
          )
        );
      } finally {
        setSaving(false);
      }
    },
    [cmsData, prepareSectionData]
  );

  const handleResetSection = useCallback(
    (sectionKey) => {
      if (sectionKey === "achievements") {
        setError(
          "Professional Achievements does not have backend data to reset."
        );

        return;
      }

      const sectionConfig = SECTION_API[sectionKey];

      if (!sectionConfig) {
        return;
      }

      const confirmed = window.confirm(
        `Discard unsaved changes for ${sectionConfig.label}?`
      );

      if (!confirmed) {
        return;
      }

      setCmsData((previousData) => ({
        ...previousData,
        [sectionKey]: cloneData(savedCmsData[sectionKey]),
      }));

      setError("");

      setSuccessMessage(
        `${sectionConfig.label} restored to its last saved version.`
      );
    },
    [savedCmsData]
  );

  const buildFinalSectionPayload = useCallback((sectionKey, preparedData) => {
    if (sectionKey === "hero") {
      return preparedData;
    }

    return preparedData;
  }, []);

  const handleSaveAllChanges = useCallback(async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const saveableSections = SECTION_KEYS.filter(
        (sectionKey) => sectionKey !== "achievements"
      );

      const preparedSections = await Promise.all(
        saveableSections.map(async (sectionKey) => {
          const preparedData = await prepareSectionData(
            sectionKey,
            cmsData[sectionKey]
          );

          const finalPayload = buildFinalSectionPayload(
            sectionKey,
            preparedData
          );

          return {
            sectionKey,
            data: finalPayload,
          };
        })
      );

      const saveResponses = await Promise.all(
        preparedSections.map(async ({ sectionKey, data }) => {
          const sectionConfig = SECTION_API[sectionKey];

          if (!sectionConfig) {
            throw new Error(`API configuration is missing for ${sectionKey}.`);
          }

          const response = await API.put(sectionConfig.endpoint, data);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message || `Failed to save ${sectionConfig.label}.`
            );
          }

          let savedData = response.data?.data || data;

          if (sectionKey === "hero") {
            savedData = normalizeProfessionalHeroResponse(savedData);
          } else {
            savedData = cloneData(savedData);
          }

          return {
            sectionKey,
            data: savedData,
          };
        })
      );

      const updatedCmsData = saveResponses.reduce(
        (result, saveResponse) => ({
          ...result,
          [saveResponse.sectionKey]: saveResponse.data,
        }),
        createInitialCmsData()
      );

      updatedCmsData.achievements = {};

      setCmsData(cloneData(updatedCmsData));

      setSavedCmsData(cloneData(updatedCmsData));

      setSuccessMessage("All Professionals CMS changes saved successfully.");
    } catch (requestError) {
      console.error("Professionals CMS save-all error:", requestError);

      setError(
        getErrorMessage(
          requestError,
          "Failed to save all Professionals CMS changes."
        )
      );
    } finally {
      setSaving(false);
    }
  }, [cmsData, prepareSectionData, buildFinalSectionPayload]);

  const handleTopReset = useCallback(async () => {
    const confirmed = window.confirm(
      "Reset all Professionals CMS sections to default content? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const resettableSections = SECTION_KEYS.filter(
        (sectionKey) => sectionKey !== "achievements"
      );

      await Promise.all(
        resettableSections.map((sectionKey) => {
          const sectionConfig = SECTION_API[sectionKey];

          return API.put(sectionConfig.resetEndpoint);
        })
      );

      const refreshedSections = await Promise.all(
        resettableSections.map(async (sectionKey) => {
          const response = await API.get(SECTION_API[sectionKey].endpoint);

          if (!response.data?.success) {
            throw new Error(
              response.data?.message ||
                `Failed to reload ${SECTION_API[sectionKey].label}.`
            );
          }

          let refreshedData = response.data?.data || {};

          if (sectionKey === "hero") {
            refreshedData = normalizeProfessionalHeroResponse(refreshedData);
          } else {
            refreshedData = cloneData(refreshedData);
          }

          return {
            sectionKey,
            data: refreshedData,
          };
        })
      );

      const refreshedCmsData = refreshedSections.reduce(
        (result, sectionResponse) => ({
          ...result,
          [sectionResponse.sectionKey]: sectionResponse.data,
        }),
        createInitialCmsData()
      );

      refreshedCmsData.achievements = {};

      setCmsData(cloneData(refreshedCmsData));

      setSavedCmsData(cloneData(refreshedCmsData));

      setActiveSection("hero");

      setSuccessMessage("All Professionals CMS sections reset successfully.");
    } catch (requestError) {
      console.error("Professionals CMS reset error:", requestError);

      setError(
        getErrorMessage(
          requestError,
          "Failed to reset Professionals CMS content."
        )
      );
    } finally {
      setSaving(false);
    }
  }, []);

  const activeSectionData = useMemo(() => {
    return cmsData[activeSection] || {};
  }, [activeSection, cmsData]);

  const renderEditor = () => {
    if (activeSection === "achievements") {
      return (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div className="mb-3">
              <span className="badge bg-secondary px-3 py-2">No API</span>
            </div>

            <h5 className="fw-bold mb-2">Professional Achievements</h5>

            <p className="text-secondary mb-0">
              Backend API and CMS data are not available for this section yet.
            </p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: activeSectionData,

      saving,

      onChange: (updatedData) =>
        handleSectionChange(activeSection, updatedData),

      onSave: (sectionData) =>
        handleSaveSection(activeSection, sectionData || activeSectionData),

      onReset: () => handleResetSection(activeSection),
    };

    switch (activeSection) {
      case "hero":
        return <ProfessionalHeroEdit key="hero" {...commonProps} />;

      case "verification":
        return (
          <ProfessionalVerificationEdit key="verification" {...commonProps} />
        );
      case "standards":
        return <ProfessionalStandardsEdit key="standards" {...commonProps} />;

      case "becomeProfessional":
        return (
          <BecomeProfessionalEdit key="becomeProfessional" {...commonProps} />
        );

      default:
        return (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-5">
              <p className="text-secondary mb-0">
                Select a Professionals CMS section to edit.
              </p>
            </div>
          </div>
        );
    }
  };

  if (loading && !cmsData.hero) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
            aria-label="Loading Professionals CMS content"
          />

          <p className="text-secondary mt-3 mb-0">
            Loading Professionals CMS content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex flex-column flex-xl-row justify-content-xl-between align-items-xl-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Professionals Page Management</h3>

          <p className="text-secondary mb-0">
            Manage all Professionals page CMS sections.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={saving}
            onClick={handleTopReset}
          >
            {saving ? "Please wait..." : "Reset"}
          </button>

          <button
            type="button"
            className="btn btn-success"
            disabled={saving}
            onClick={handleSaveAllChanges}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {successMessage && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {successMessage}

          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSuccessMessage("")}
          />
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <ProfessionalSectionList
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
          />
        </div>

        <div className="col-12 col-xl-8">
          {loading && activeSection !== "achievements" ? (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                <div
                  className="spinner-border text-success"
                  role="status"
                  aria-label="Loading section"
                />

                <p className="text-secondary mt-3 mb-0">
                  Loading {SECTION_API[activeSection]?.label || "section"}{" "}
                  content...
                </p>
              </div>
            </div>
          ) : (
            renderEditor()
          )}
        </div>
      </div>
    </div>
  );
}

export default CmsWorker;
