import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronUp,
  ChevronDown,
  CloudUploadFill,
  TrashFill,
} from "react-bootstrap-icons";

const tabs = ["Content", "Settings", "Background"];

const createImageState = (imageUrl = "") => {
  if (!imageUrl) return null;

  const fileName = imageUrl.split("/").pop() || "Existing image";

  return {
    name: fileName,
    size: "Existing image",
    url: imageUrl,
  };
};

const DEFAULT_FORM = {
  badge: "#1 Home Service Platform",
  title: "Reliable Home Services, Just a Few Clicks Away",
  description:
    "Book trusted professionals for all your home service needs. Fast, reliable and hassle-free.",

  primaryButtonText: "Book a Service",
  primaryButtonLink: "/services",

  secondaryButtonText: "How It Works",
  secondaryButtonLink: "/how-it-works",

  image: "",
  imageFile: null,
};

const LIMITS = {
  badge: 100,
  title: 100,
  description: 300,
  primaryButtonText: 50,
  secondaryButtonText: 50,
};

const normalizeHeroData = (data) => ({
  badge: data?.badge ?? DEFAULT_FORM.badge,

  title: data?.title ?? DEFAULT_FORM.title,

  description: data?.description ?? DEFAULT_FORM.description,

  primaryButtonText: data?.primaryButtonText ?? DEFAULT_FORM.primaryButtonText,

  primaryButtonLink: data?.primaryButtonLink ?? DEFAULT_FORM.primaryButtonLink,

  secondaryButtonText:
    data?.secondaryButtonText ?? DEFAULT_FORM.secondaryButtonText,

  secondaryButtonLink:
    data?.secondaryButtonLink ?? DEFAULT_FORM.secondaryButtonLink,

  image: data?.image ?? DEFAULT_FORM.image,
  imageFile: null,
});

const HeroSectionEdit = ({
  data,
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const [activeTab, setActiveTab] = useState("Content");

  const [form, setForm] = useState(() => normalizeHeroData(data));

  const [image, setImage] = useState(() => createImageState(data?.image));

  useEffect(() => {
    const normalizedData = normalizeHeroData(data);

    const imageFile =
      typeof File !== "undefined" && data?.imageFile instanceof File
        ? data.imageFile
        : null;

    const updatedForm = {
      ...normalizedData,

      imageFile,
    };

    setForm(updatedForm);

    if (imageFile) {
      setImage({
        name: imageFile.name,

        size: `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`,

        url: "",
      });

      return;
    }

    setImage(createImageState(normalizedData.image));
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!allowedTypes.has(file.type)) {
      console.error("[Hero Editor] Invalid image type:", file.type);

      window.alert("Please select a JPG, PNG or WEBP image.");

      event.target.value = "";

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      console.error("[Hero Editor] Image exceeds 2MB:", file.size);

      window.alert("Image size must be less than 2MB.");

      event.target.value = "";

      return;
    }

    const updatedForm = {
      ...form,

      image: form.image || "",

      imageFile: file,
    };

    setForm(updatedForm);

    setImage({
      name: file.name,

      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,

      url: "",
    });

    onChange?.(updatedForm);
  };

  const handleRemoveImage = () => {
    const updatedForm = {
      ...form,

      image: "",

      imageFile: null,
    };

    setForm(updatedForm);

    setImage(null);

    onChange?.(updatedForm);
  };

  const handleReset = () => {
    const normalizedData = normalizeHeroData(data);

    setForm(normalizedData);

    setImage(createImageState(normalizedData.image));

    onReset?.();
  };

  const handleSave = () => {
    const payload = {
      badge: form.badge.trim(),

      title: form.title.trim(),

      description: form.description.trim(),

      primaryButtonText: form.primaryButtonText.trim(),

      primaryButtonLink: form.primaryButtonLink.trim(),

      secondaryButtonText: form.secondaryButtonText.trim(),

      secondaryButtonLink: form.secondaryButtonLink.trim(),

      image: form.image || "",
      imageFile: form.imageFile || null,
    };

    onSave?.(payload);
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
          maxLength={LIMITS[name]}
          className="form-control"
          disabled={saving}
        />
      ) : (
        <input
          name={name}
          value={form[name]}
          onChange={handleChange}
          maxLength={LIMITS[name]}
          className="form-control py-2"
          disabled={saving}
        />
      )}

      {LIMITS[name] && (
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{
            fontSize: "0.72rem",
          }}
        >
          {form[name].length}/{LIMITS[name]}
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
          onClick={() => setCollapsed((previous) => !previous)}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium flex-shrink-0"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
            fontSize: "0.85rem",
          }}
          disabled={saving}
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
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="btn px-3 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor:
                    activeTab === tab ? "#0e8a5f" : "transparent",

                  color: activeTab === tab ? "#ffffff" : "#6b7280",

                  fontSize: "0.86rem",
                }}
                disabled={saving}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Content" && (
            <>
              <Field label="Badge/Label" name="badge" />

              <Field label="Main Title" name="title" />

              <Field
                label="Description"
                name="description"
                type="textarea"
                rows={3}
              />

              <div className="row g-4 mb-3">
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
                      name="primaryButtonText"
                      value={form.primaryButtonText}
                      onChange={handleChange}
                      maxLength={50}
                      className="form-control py-2"
                      disabled={saving}
                    />

                    <p
                      className="text-secondary text-end mb-0 mt-1"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {form.primaryButtonText.length}
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
                      name="primaryButtonLink"
                      value={form.primaryButtonLink}
                      onChange={handleChange}
                      className="form-control py-2"
                      disabled={saving}
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
                      name="secondaryButtonText"
                      value={form.secondaryButtonText}
                      onChange={handleChange}
                      maxLength={50}
                      className="form-control py-2"
                      disabled={saving}
                    />

                    <p
                      className="text-secondary text-end mb-0 mt-1"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {form.secondaryButtonText.length}
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
                      name="secondaryButtonLink"
                      value={form.secondaryButtonLink}
                      onChange={handleChange}
                      className="form-control py-2"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

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
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="rounded-2"
                      style={{
                        width: "64px",
                        height: "48px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "64px",
                        height: "48px",
                        backgroundColor: "#eef7f3",
                        color: "#0e8a5f",
                        fontSize: "0.62rem",
                        textAlign: "center",
                        lineHeight: 1.1,
                      }}
                    >
                      Upload
                      <br />
                      pending
                    </div>
                  )}

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
                htmlFor="heroImageUpload"
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mb-2"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                  fontSize: "0.85rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  width: "fit-content",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <CloudUploadFill size={14} />
                Upload New Image
              </label>

              <input
                id="heroImageUpload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                disabled={saving}
                className="d-none"
              />

              <p
                className="text-secondary mb-0"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Recommended size: 1920x800px. Maximum file size: 2MB.
              </p>
            </>
          )}

          {activeTab === "Settings" && (
            <p className="text-secondary text-center py-5 mb-0">
              Section settings (visibility, animation, layout options) go here.
            </p>
          )}

          {activeTab === "Background" && (
            <p className="text-secondary text-center py-5 mb-0">
              Background color / gradient / overlay options go here.
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
                opacity: saving ? 0.7 : 1,
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

export default HeroSectionEdit;
