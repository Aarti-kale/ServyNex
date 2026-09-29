import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronUp,
  ChevronDown,
  CloudUploadFill,
  TrashFill,
} from "react-bootstrap-icons";

const tabs = ["Content", "Settings", "Background"];
const mapBackendToForm = (data = {}) => ({
  badge: data.badge ?? "",
  mainTitle: data.title ?? "",
  description: data.description ?? "",
  primaryText: data.primaryButtonText ?? "",
  primaryLink: data.primaryButtonLink ?? "",
  secondaryText: data.secondaryButtonText ?? "",
  secondaryLink: data.secondaryButtonLink ?? "",
});
const mapBackendToImage = (image) => {
  const mappedImage = {
    name: image.split("/").pop() || "contact-hero.jpg",
    size: "Uploaded image",
    url: image,
  };

  return mappedImage;
};

const HeroSection = ({ data, onChange, onSave, onReset, saving = false }) => {
  const [collapsed, setCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState("Content");
  const [form, setForm] = useState(() => mapBackendToForm(data));

  const [image, setImage] = useState(() => mapBackendToImage(data?.image));

  const limits = {
    badge: 50,
    mainTitle: 100,
    description: 300,
    primaryText: 50,
    secondaryText: 50,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    if (typeof onChange === "function") {
      const payload = {
        badge: updatedForm.badge,
        title: updatedForm.mainTitle,
        description: updatedForm.description,
        primaryButtonText: updatedForm.primaryText,
        primaryButtonLink: updatedForm.primaryLink,
        secondaryButtonText: updatedForm.secondaryText,
        secondaryButtonLink: updatedForm.secondaryLink,

        image: data?.image ?? "",
      };

      onChange(payload);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("[HeroSection] No file selected.");

      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("[HeroSection] Invalid file type:", file.type);

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("[HeroSection] Image exceeds 5 MB limit:", file.size);

      e.target.value = "";

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const newImage = {
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      url: previewUrl,

      file,
    };

    setImage(newImage);
    if (typeof onChange === "function") {
      const payload = {
        ...form,

        badge: form.badge,
        title: form.mainTitle,
        description: form.description,
        primaryButtonText: form.primaryText,
        primaryButtonLink: form.primaryLink,
        secondaryButtonText: form.secondaryText,
        secondaryButtonLink: form.secondaryLink,

        imageFile: file,

        image: data?.image ?? "",
      };

      onChange(payload);
    } else {
      console.warn("[HeroSection] onChange function is not available.");
    }

    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    setImage(null);

    if (typeof onChange === "function") {
      const payload = {
        ...form,
        image: "",
        imageFile: null,
      };

      onChange(payload);
    }
  };
  const handleReset = () => {
    const resetForm = mapBackendToForm(data);

    const resetImage = mapBackendToImage(data?.image);

    setForm(resetForm);
    setImage(resetImage);

    if (typeof onReset === "function") {
      onReset();
    }
  };

  const handleSave = () => {
    if (typeof onSave !== "function") {
      console.error("[HeroSection] onSave function is NOT available.");

      return;
    }

    const payload = {
      badge: form.badge,
      title: form.mainTitle,
      description: form.description,

      primaryButtonText: form.primaryText,

      primaryButtonLink: form.primaryLink,

      secondaryButtonText: form.secondaryText,

      secondaryButtonLink: form.secondaryLink,

      image: data?.image ?? "",

      imageFile: image?.file instanceof File ? image.file : null,
    };

    onSave(payload);
  };

  const Field = ({ label, name, type = "text", rows }) => (
    <div className="mb-3">
      <label
        className="form-label fw-medium mb-1"
        style={{
          color: "#0f1724",
          fontSize: "0.88rem",
        }}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={rows}
          maxLength={limits[name]}
          className="form-control"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          maxLength={limits[name]}
          className="form-control py-2"
        />
      )}

      {limits[name] && (
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{
            fontSize: "0.72rem",
          }}
        >
          {form[name].length}/{limits[name]}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="rounded-4 bg-white"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-start p-4 pb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5
              className="fw-bold mb-0"
              style={{
                color: "#0f1724",
              }}
            >
              Hero Section
            </h5>

            <span
              className="badge rounded-pill fw-medium"
              style={{
                backgroundColor: "#e6f4ee",
                color: "#0e8a5f",
                fontSize: "0.72rem",
              }}
            >
              Active
            </span>
          </div>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.85rem",
            }}
          >
            Update hero section content and settings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium flex-shrink-0"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
            fontSize: "0.85rem",
          }}
        >
          {collapsed ? "Expand" : "Collapse"}

          {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4">
          <div
            className="d-flex gap-2 mb-4 p-1 rounded-3"
            style={{
              backgroundColor: "#f3f4f6",
              width: "fit-content",
            }}
          >
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn px-3 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor:
                    activeTab === tab ? "#0e8a5f" : "transparent",

                  color: activeTab === tab ? "#ffffff" : "#6b7280",

                  fontSize: "0.86rem",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Content" && (
            <>
              <Field label="Badge / Label" name="badge" />

              <Field label="Main Title" name="mainTitle" />

              <Field
                label="Description"
                name="description"
                type="textarea"
                rows={3}
              />

              <p
                className="fw-semibold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                Hero Image
              </p>

              {image && (
                <div
                  className="d-flex align-items-center gap-3 rounded-3 p-2 mb-3"
                  style={{
                    border: "1px solid #eef0f2",
                    maxWidth: "420px",
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="rounded-2"
                    style={{
                      width: "64px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                    onLoad={() => {}}
                    onError={(error) => {
                      console.error(
                        "[HeroSection] Image preview FAILED to load:",
                        {
                          url: image.url,
                          error,
                        }
                      );
                    }}
                  />

                  <div className="flex-grow-1">
                    <p
                      className="fw-medium mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      {image.name}
                    </p>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.76rem",
                      }}
                    >
                      {image.size}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={saving}
                    aria-label="Remove hero image"
                    className="btn btn-sm d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                    style={{
                      width: "30px",
                      height: "30px",
                      color: "#dc3545",
                    }}
                  >
                    <TrashFill size={14} />
                  </button>
                </div>
              )}

              <label
                htmlFor="contactHeroImageUpload"
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mb-2"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <CloudUploadFill size={14} />
                Upload New Image
              </label>

              <input
                id="contactHeroImageUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="d-none"
                disabled={saving}
              />

              <p
                className="text-secondary mb-4"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Recommended size: 1920x800px. Maximum file size: 5 MB.
              </p>

              <div className="row g-4">
                <div className="col-md-6">
                  <p
                    className="fw-semibold mb-2"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.88rem",
                    }}
                  >
                    Primary Button
                  </p>

                  <div className="mb-2">
                    <label
                      className="form-label mb-1 text-secondary"
                      style={{
                        fontSize: "0.8rem",
                      }}
                    >
                      Text
                    </label>

                    <input
                      name="primaryText"
                      value={form.primaryText}
                      onChange={handleChange}
                      maxLength={50}
                      className="form-control py-2"
                    />

                    <p
                      className="text-secondary text-end mb-0 mt-1"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {form.primaryText.length}
                      /50
                    </p>
                  </div>

                  <div>
                    <label
                      className="form-label mb-1 text-secondary"
                      style={{
                        fontSize: "0.8rem",
                      }}
                    >
                      Link
                    </label>

                    <input
                      name="primaryLink"
                      value={form.primaryLink}
                      onChange={handleChange}
                      className="form-control py-2"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <p
                    className="fw-semibold mb-2"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.88rem",
                    }}
                  >
                    Secondary Button
                  </p>

                  <div className="mb-2">
                    <label
                      className="form-label mb-1 text-secondary"
                      style={{
                        fontSize: "0.8rem",
                      }}
                    >
                      Text
                    </label>

                    <input
                      name="secondaryText"
                      value={form.secondaryText}
                      onChange={handleChange}
                      maxLength={50}
                      className="form-control py-2"
                    />

                    <p
                      className="text-secondary text-end mb-0 mt-1"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {form.secondaryText.length}
                      /50
                    </p>
                  </div>

                  <div>
                    <label
                      className="form-label mb-1 text-secondary"
                      style={{
                        fontSize: "0.8rem",
                      }}
                    >
                      Link
                    </label>

                    <input
                      name="secondaryLink"
                      value={form.secondaryLink}
                      onChange={handleChange}
                      className="form-control py-2"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Settings" && (
            <p className="text-secondary text-center py-5 mb-0">
              Section settings will be added here.
            </p>
          )}

          {activeTab === "Background" && (
            <p className="text-secondary text-center py-5 mb-0">
              Background options will be added here.
            </p>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="btn px-4 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
              }}
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn text-white px-4 py-2 rounded-3 fw-semibold"
              style={{
                backgroundColor: "#0e8a5f",
              }}
            >
              {saving ? "Saving..." : "Save Section"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
