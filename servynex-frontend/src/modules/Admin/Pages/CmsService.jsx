import React, { useCallback, useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import API from "../../../api/api.js";

import ServiceHeader from "../../../components/AdminComponents/websiteCMS/Service/ServiceHeader.jsx";

import ServiceSectionList from "../../../components/AdminComponents/websiteCMS/Service/ServiceSectionList.jsx";

import ServiceHeroEdit from "../../../components/AdminComponents/websiteCMS/Service/ServiceHeroEdit.jsx";

const SERVICE_ENDPOINT = "/admin/web-services";

const IMAGE_UPLOAD_ENDPOINT = "/admin/upload/image";

const DEFAULT_SERVICE_DATA = {
  key: "services-hero",

  hero: {
    badge: "PROFESSIONAL HOME SERVICES",

    title: "Quality Services",

    highlightedTitle: "For Your Home",

    description:
      "Find reliable, verified and skilled professionals for every home service need. Fast booking, transparent pricing and 100% satisfaction guaranteed.",

    primaryButton: {
      text: "Book a Service",
      link: "/services",
    },

    secondaryButton: {
      text: "Become a Worker",
      link: "/register?role=worker",
    },

    image: "",
  },

  isActive: true,
};

const cloneData = (data) => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_SERVICE_DATA));
  }
};

const normalizeServiceData = (responseData) => {
  const source =
    responseData?.data && typeof responseData.data === "object"
      ? responseData.data
      : responseData || {};

  const hero =
    source.hero && typeof source.hero === "object" ? source.hero : {};

  return {
    key: source.key || DEFAULT_SERVICE_DATA.key,

    hero: {
      badge: hero.badge ?? DEFAULT_SERVICE_DATA.hero.badge,

      title: hero.title ?? DEFAULT_SERVICE_DATA.hero.title,

      highlightedTitle:
        hero.highlightedTitle ?? DEFAULT_SERVICE_DATA.hero.highlightedTitle,

      description: hero.description ?? DEFAULT_SERVICE_DATA.hero.description,

      primaryButton: {
        text:
          hero.primaryButton?.text ??
          DEFAULT_SERVICE_DATA.hero.primaryButton.text,

        link:
          hero.primaryButton?.link ??
          DEFAULT_SERVICE_DATA.hero.primaryButton.link,
      },

      secondaryButton: {
        text:
          hero.secondaryButton?.text ??
          DEFAULT_SERVICE_DATA.hero.secondaryButton.text,

        link:
          hero.secondaryButton?.link ??
          DEFAULT_SERVICE_DATA.hero.secondaryButton.link,
      },

      image:
        typeof hero.image === "string"
          ? hero.image
          : DEFAULT_SERVICE_DATA.hero.image,
    },

    isActive:
      typeof source.isActive === "boolean"
        ? source.isActive
        : DEFAULT_SERVICE_DATA.isActive,
  };
};

const isValidImageFile = (file) => {
  if (!(file instanceof File)) {
    return false;
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

  const maxSize = 5 * 1024 * 1024;

  return allowedTypes.has(file.type) && file.size <= maxSize;
};

const CmsService = () => {
  const [cmsData, setCmsData] = useState(cloneData(DEFAULT_SERVICE_DATA));

  const [savedCmsData, setSavedCmsData] = useState(
    cloneData(DEFAULT_SERVICE_DATA)
  );

  const [activeSection, setActiveSection] = useState("hero");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [sectionSaving, setSectionSaving] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const getErrorMessage = (requestError, fallback) => {
    return (
      requestError?.response?.data?.message ||
      requestError?.response?.data?.error ||
      requestError?.message ||
      fallback
    );
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const fetchServiceCms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await API.get(SERVICE_ENDPOINT);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to fetch Services CMS."
        );
      }

      const normalized = normalizeServiceData(response.data);

      setCmsData(cloneData(normalized));

      setSavedCmsData(cloneData(normalized));
    } catch (requestError) {
      console.error("[Services CMS] Fetch error:", requestError);

      setError(getErrorMessage(requestError, "Failed to load Services CMS."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceCms();
  }, [fetchServiceCms]);

  const handleHeroChange = (updatedHero) => {
    setCmsData((previousData) => ({
      ...previousData,

      hero: {
        ...previousData.hero,

        ...updatedHero,

        primaryButton: {
          ...previousData.hero?.primaryButton,

          ...(updatedHero?.primaryButton || {}),
        },

        secondaryButton: {
          ...previousData.hero?.secondaryButton,

          ...(updatedHero?.secondaryButton || {}),
        },
      },
    }));

    clearMessages();
  };

  const uploadServiceImage = async (file) => {
    if (!isValidImageFile(file)) {
      throw new Error(
        "Hero image must be JPG, PNG or WEBP and less than or equal to 5 MB."
      );
    }

    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await API.post(IMAGE_UPLOAD_ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Hero image upload failed.");
      }

      const imageUrl = response?.data?.data?.url;

      if (!imageUrl) {
        throw new Error("Image uploaded but backend did not return image URL.");
      }

      if (imageUrl.startsWith("blob:")) {
        throw new Error("Backend returned an invalid Blob image URL.");
      }

      if (imageUrl.startsWith("data:")) {
        throw new Error("Backend returned invalid Base64 image data.");
      }

      return imageUrl;
    } catch (uploadError) {
      console.error("[Services CMS] Image upload error:", uploadError);

      throw new Error(
        getErrorMessage(uploadError, "Hero image upload failed.")
      );
    }
  };

  const prepareHeroData = async (heroData) => {
    if (!heroData) {
      return {
        ...DEFAULT_SERVICE_DATA.hero,
      };
    }

    const preparedHero = {
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

      image: typeof heroData.image === "string" ? heroData.image : "",
    };

    if (heroData.imageFile instanceof File) {
      const uploadedImage = await uploadServiceImage(heroData.imageFile);

      preparedHero.image = uploadedImage;
    }

    delete preparedHero.imageFile;

    if (preparedHero.image instanceof File) {
      throw new Error("Hero image could not be prepared correctly.");
    }

    if (
      typeof preparedHero.image === "string" &&
      preparedHero.image.startsWith("blob:")
    ) {
      throw new Error("Temporary Blob URL cannot be saved.");
    }

    if (
      typeof preparedHero.image === "string" &&
      preparedHero.image.startsWith("data:")
    ) {
      throw new Error("Base64 image data cannot be saved.");
    }

    return preparedHero;
  };

  const buildServicePayload = (data) => {
    return {
      hero: {
        badge: data.hero?.badge ?? "",

        title: data.hero?.title ?? "",

        highlightedTitle: data.hero?.highlightedTitle ?? "",

        description: data.hero?.description ?? "",

        primaryButton: {
          text: data.hero?.primaryButton?.text ?? "",

          link: data.hero?.primaryButton?.link ?? "",
        },

        secondaryButton: {
          text: data.hero?.secondaryButton?.text ?? "",

          link: data.hero?.secondaryButton?.link ?? "",
        },

        image: typeof data.hero?.image === "string" ? data.hero.image : "",
      },

      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
    };
  };

  const saveServiceCms = async (sourceData = cmsData) => {
    try {
      setSaving(true);
      setSectionSaving(true);

      clearMessages();

      const preparedHero = await prepareHeroData(sourceData.hero);

      const preparedData = {
        ...sourceData,

        hero: preparedHero,
      };

      const payload = buildServicePayload(preparedData);

      const response = await API.put(SERVICE_ENDPOINT, payload);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to save Services CMS."
        );
      }

      const savedData = normalizeServiceData(response.data);

      setCmsData(cloneData(savedData));

      setSavedCmsData(cloneData(savedData));

      setSuccessMessage("Services page changes saved successfully.");

      return savedData;
    } catch (saveError) {
      console.error("[Services CMS] Save error:", saveError);

      setError(
        getErrorMessage(saveError, "Failed to save Services page changes.")
      );

      return null;
    } finally {
      setSaving(false);
      setSectionSaving(false);
    }
  };

  const handleSaveHero = async (heroData) => {
    const updatedData = {
      ...cmsData,

      hero: {
        ...cmsData.hero,

        ...heroData,

        primaryButton: {
          ...cmsData.hero?.primaryButton,

          ...(heroData?.primaryButton || {}),
        },

        secondaryButton: {
          ...cmsData.hero?.secondaryButton,

          ...(heroData?.secondaryButton || {}),
        },
      },
    };

    setCmsData(updatedData);

    return saveServiceCms(updatedData);
  };

  const handleResetHero = () => {
    clearMessages();

    setCmsData((previousData) => ({
      ...previousData,

      hero: cloneData(savedCmsData.hero),

      isActive: savedCmsData.isActive,
    }));
  };

  const handleSaveAll = async () => {
    return saveServiceCms(cmsData);
  };

  const handleSectionChange = (sectionKey) => {
    if (saving) {
      return;
    }

    clearMessages();

    if (sectionKey !== "hero") {
      return;
    }

    setActiveSection(sectionKey);
  };

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f8faf9",
      }}
    >
      <ServiceHeader onSaveAll={handleSaveAll} saving={saving} />

      <main className="pb-5">
        <div className="container-fluid px-4">
          {error && (
            <div
              className="alert d-flex align-items-center justify-content-between mb-3"
              style={{
                backgroundColor: "#fff5f5",

                border: "1px solid #ffd7d7",

                color: "#b42318",

                borderRadius: "10px",
              }}
            >
              <span>{error}</span>

              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              />
            </div>
          )}

          {successMessage && (
            <div
              className="alert mb-3"
              style={{
                backgroundColor: "#effaf4",

                border: "1px solid #ccebd9",

                color: "#08784f",

                borderRadius: "10px",
              }}
            >
              {successMessage}
            </div>
          )}

          {loading ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minHeight: "350px",
              }}
            >
              <div
                className="spinner-border"
                role="status"
                style={{
                  color: "#0e8a5f",
                }}
              />

              <p
                className="mt-3 mb-0"
                style={{
                  color: "#64748b",
                }}
              >
                Loading Services CMS...
              </p>
            </div>
          ) : (
            <div className="row g-3">
              <div className="col-xl-3 col-lg-4">
                <ServiceSectionList
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                  saving={saving}
                />
              </div>

              <div className="col-xl-9 col-lg-8">
                {activeSection === "hero" && (
                  <ServiceHeroEdit
                    data={cmsData.hero}
                    onChange={handleHeroChange}
                    onSave={handleSaveHero}
                    onReset={handleResetHero}
                    saving={sectionSaving}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CmsService;
