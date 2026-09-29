import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronUp,
  ChevronDown,
  CloudUploadFill,
  TrashFill,
} from "react-bootstrap-icons";

const DEFAULT_HERO = {
  badge: "ABOUT US",

  title: "About ServyNex",

  highlightedTitle: "",

  description:
    "We are on a mission to make home services simple, reliable and accessible for everyone.",

  primaryButton: {
    text: "Book a Service",
    link: "/services",
  },

  secondaryButton: {
    text: "Contact Us",
    link: "/contact",
  },

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
};

const LIMITS = {
  badge: 50,
  title: 100,
  highlightedTitle: 100,
  description: 500,

  primaryButtonText: 50,
  primaryButtonLink: 300,

  secondaryButtonText: 50,
  secondaryButtonLink: 300,

  highlightTitle: 100,
  highlightDescription: 300,
  highlightIcon: 50,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getImageUrl = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (/^blob:/i.test(image)) {
    return "";
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, "");

  const normalizedPath = image.startsWith("/") ? image : `/${image}`;

  return `${backendOrigin}${normalizedPath}`;
};

const normalizeHeroData = (data) => {
  const source = data || {};

  const highlights = Array.isArray(source.highlights)
    ? source.highlights
    : DEFAULT_HERO.highlights;

  return {
    badge: source.badge ?? DEFAULT_HERO.badge,

    title: source.title ?? DEFAULT_HERO.title,

    highlightedTitle: source.highlightedTitle ?? DEFAULT_HERO.highlightedTitle,

    description: source.description ?? DEFAULT_HERO.description,

    primaryButton: {
      text: source.primaryButton?.text ?? DEFAULT_HERO.primaryButton.text,

      link: source.primaryButton?.link ?? DEFAULT_HERO.primaryButton.link,
    },

    secondaryButton: {
      text: source.secondaryButton?.text ?? DEFAULT_HERO.secondaryButton.text,

      link: source.secondaryButton?.link ?? DEFAULT_HERO.secondaryButton.link,
    },

    highlights: highlights.map((item, index) => ({
      title: item?.title ?? DEFAULT_HERO.highlights[index]?.title ?? "",

      description:
        item?.description ?? DEFAULT_HERO.highlights[index]?.description ?? "",

      icon: item?.icon ?? DEFAULT_HERO.highlights[index]?.icon ?? "shield",
    })),

    image: typeof source.image === "string" ? source.image : DEFAULT_HERO.image,
    imageFile: null,
  };
};

const AboutHero = ({ data, onChange, onSave, onReset, saving = false }) => {
  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState(normalizeHeroData(data));

  const [imagePreview, setImagePreview] = useState("");

  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const normalized = normalizeHeroData(data);

    setForm((previous) => ({
      ...normalized,

      imageFile:
        previous?.imageFile instanceof File ? previous.imageFile : null,
    }));

    setImageError("");

    setImagePreview(getImageUrl(normalized.image));
  }, [data]);

  const updateForm = (updatedForm) => {
    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleFieldChange = (name, value) => {
    const updatedForm = {
      ...form,
      [name]: value,
    };

    updateForm(updatedForm);
  };

  const handlePrimaryButtonChange = (field, value) => {
    const updatedForm = {
      ...form,

      primaryButton: {
        ...(form.primaryButton || {}),
        [field]: value,
      },
    };

    updateForm(updatedForm);
  };

  const handleSecondaryButtonChange = (field, value) => {
    const updatedForm = {
      ...form,

      secondaryButton: {
        ...(form.secondaryButton || {}),
        [field]: value,
      },
    };

    updateForm(updatedForm);
  };

  const handleHighlightChange = (index, field, value) => {
    const updatedHighlights = [...form.highlights];

    updatedHighlights[index] = {
      ...updatedHighlights[index],
      [field]: value,
    };

    const updatedForm = {
      ...form,
      highlights: updatedHighlights,
    };

    updateForm(updatedForm);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageError("Only JPG, PNG and WEBP images are allowed.");

      event.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 2MB.");

      event.target.value = "";

      return;
    }

    const updatedForm = {
      ...form,

      image: form.image ?? "",

      imageFile: file,
    };
    setImagePreview(getImageUrl(form.image));

    updateForm(updatedForm);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    if (saving) return;

    const updatedForm = {
      ...form,

      image: "",

      imageFile: null,
    };

    setImagePreview("");

    setImageError("");

    updateForm(updatedForm);
  };
  const handleReset = () => {
    if (saving) return;

    const resetData = {
      ...normalizeHeroData(DEFAULT_HERO),

      imageFile: null,
    };

    setImagePreview("");

    setImageError("");

    setForm(resetData);

    onChange?.(resetData);

    onReset?.();
  };

  const handleSave = () => {
    if (saving) return;

    onSave?.(form);
  };

  const Field = ({
    label,
    value,
    onValueChange,
    maxLength,
    type = "text",
    rows = 4,
  }) => {
    const fieldValue = value ?? "";

    return (
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
            value={fieldValue}
            onChange={(event) => onValueChange(event.target.value)}
            rows={rows}
            maxLength={maxLength}
            className="form-control"
            disabled={saving}
          />
        ) : (
          <input
            type={type}
            value={fieldValue}
            onChange={(event) => onValueChange(event.target.value)}
            maxLength={maxLength}
            className="form-control py-2"
            disabled={saving}
          />
        )}

        {maxLength && (
          <p
            className="text-secondary text-end mb-0 mt-1"
            style={{
              fontSize: "0.72rem",
            }}
          >
            {fieldValue.length}/{maxLength}
          </p>
        )}
      </div>
    );
  };
  return (
    <div
      className="rounded-4 bg-white"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          borderBottom: "1px solid #eef0f2",
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
              }}
            >
              Hero Section
            </h5>

            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: "#e6f4ee",
                color: "#0e8a5f",
                fontSize: "0.7rem",
              }}
            >
              Active
            </span>
          </div>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.82rem",
            }}
          >
            Manage the About page hero content
          </p>
        </div>

        <button
          type="button"
          className="btn border-0 p-1"
          onClick={() => setCollapsed((previous) => !previous)}
          aria-label={
            collapsed ? "Expand Hero section" : "Collapse Hero section"
          }
        >
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {!collapsed && (
        <>
          <div
            className="px-4"
            style={{
              borderBottom: "1px solid #eef0f2",
            }}
          >
            <div
              className="d-inline-block py-3"
              style={{
                color: "#0e8a5f",
                fontWeight: 600,
                borderBottom: "2px solid #0e8a5f",
              }}
            >
              Content
            </div>
          </div>

          <div className="p-4">
            <Field
              label="Badge"
              value={form.badge}
              maxLength={LIMITS.badge}
              onValueChange={(value) => handleFieldChange("badge", value)}
            />

            <Field
              label="Main Title"
              value={form.title}
              maxLength={LIMITS.title}
              onValueChange={(value) => handleFieldChange("title", value)}
            />

            <Field
              label="Highlighted Title"
              value={form.highlightedTitle}
              maxLength={LIMITS.highlightedTitle}
              onValueChange={(value) =>
                handleFieldChange("highlightedTitle", value)
              }
            />

            <Field
              label="Description"
              value={form.description}
              type="textarea"
              rows={5}
              maxLength={LIMITS.description}
              onValueChange={(value) => handleFieldChange("description", value)}
            />

            <div className="mt-4">
              <h6
                className="fw-semibold mb-3"
                style={{
                  color: "#0f1724",
                }}
              >
                Primary Button
              </h6>

              <Field
                label="Button Text"
                value={form.primaryButton?.text}
                maxLength={LIMITS.primaryButtonText}
                onValueChange={(value) =>
                  handlePrimaryButtonChange("text", value)
                }
              />

              <Field
                label="Button Link"
                value={form.primaryButton?.link}
                maxLength={LIMITS.primaryButtonLink}
                onValueChange={(value) =>
                  handlePrimaryButtonChange("link", value)
                }
              />
            </div>

            <div className="mt-4">
              <h6
                className="fw-semibold mb-3"
                style={{
                  color: "#0f1724",
                }}
              >
                Secondary Button
              </h6>

              <Field
                label="Button Text"
                value={form.secondaryButton?.text}
                maxLength={LIMITS.secondaryButtonText}
                onValueChange={(value) =>
                  handleSecondaryButtonChange("text", value)
                }
              />

              <Field
                label="Button Link"
                value={form.secondaryButton?.link}
                maxLength={LIMITS.secondaryButtonLink}
                onValueChange={(value) =>
                  handleSecondaryButtonChange("link", value)
                }
              />
            </div>

            <div className="mt-4">
              <h6
                className="fw-semibold mb-3"
                style={{
                  color: "#0f1724",
                }}
              >
                Hero Highlights
              </h6>

              <div className="row g-3">
                {form.highlights.map((highlight, index) => (
                  <div className="col-md-6" key={index}>
                    <div
                      className="rounded-3 p-3 h-100"
                      style={{
                        backgroundColor: "#f8faf9",
                        border: "1px solid #eef0f2",
                      }}
                    >
                      <Field
                        label={`Highlight ${index + 1} Title`}
                        value={highlight.title}
                        maxLength={LIMITS.highlightTitle}
                        onValueChange={(value) =>
                          handleHighlightChange(index, "title", value)
                        }
                      />

                      <Field
                        label="Description"
                        value={highlight.description}
                        maxLength={LIMITS.highlightDescription}
                        type="textarea"
                        rows={3}
                        onValueChange={(value) =>
                          handleHighlightChange(index, "description", value)
                        }
                      />

                      <Field
                        label="Icon"
                        value={highlight.icon}
                        maxLength={LIMITS.highlightIcon}
                        onValueChange={(value) =>
                          handleHighlightChange(index, "icon", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h6
                className="fw-semibold mb-3"
                style={{
                  color: "#0f1724",
                }}
              >
                Hero Image
              </h6>

              <input
                id="aboutHeroImageUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="d-none"
                disabled={saving}
              />

              {!imagePreview ? (
                <label
                  htmlFor="aboutHeroImageUpload"
                  className="d-flex flex-column align-items-center justify-content-center text-center rounded-3 p-4"
                  style={{
                    border: "1px dashed #b7dccc",
                    backgroundColor: "#f8fcfa",
                    cursor: saving ? "not-allowed" : "pointer",
                    minHeight: "190px",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    <CloudUploadFill size={23} color="#0e8a5f" />
                  </div>

                  <span
                    className="fw-semibold"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Upload Hero Image
                  </span>

                  <small className="text-secondary mt-1">
                    Click here to select an image
                  </small>

                  <small className="text-secondary">
                    JPG, PNG or WEBP • Max 2 MB
                  </small>
                </label>
              ) : (
                <div
                  className="rounded-3 p-3"
                  style={{
                    border: "1px solid #dceee6",
                    backgroundColor: "#fbfefd",
                  }}
                >
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={imagePreview}
                      alt="About Hero"
                      style={{
                        width: "120px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="flex-grow-1">
                      <p
                        className="fw-semibold mb-1"
                        style={{
                          color: "#172033",
                        }}
                      >
                        {form.imageFile instanceof File
                          ? form.imageFile.name
                          : "Current Hero Image"}
                      </p>

                      <small className="text-secondary">
                        {form.imageFile instanceof File
                          ? `${(form.imageFile.size / 1024 / 1024).toFixed(
                              2
                            )} MB`
                          : "Existing image"}
                      </small>

                      {form.imageFile instanceof File && (
                        <div className="mt-1">
                          <small
                            style={{
                              color: "#0e8a5f",
                            }}
                          >
                            New image selected. Click Save Section to upload.
                          </small>
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="aboutHeroImageUpload"
                      className="btn btn-sm btn-outline-primary"
                      style={{
                        cursor: saving ? "not-allowed" : "pointer",
                      }}
                    >
                      Change
                    </label>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveImage}
                      disabled={saving}
                      aria-label="Remove hero image"
                    >
                      <TrashFill size={14} />
                    </button>
                  </div>
                </div>
              )}

              {imageError && (
                <div
                  className="mt-2"
                  style={{
                    color: "#dc3545",
                    fontSize: "0.78rem",
                  }}
                >
                  {imageError}
                </div>
              )}

              <p
                className="text-secondary mt-2 mb-0"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Select JPG, PNG or WEBP image under 2 MB.
              </p>
            </div>
          </div>

          <div
            className="d-flex justify-content-end gap-2 px-4 py-3"
            style={{
              borderTop: "1px solid #eef0f2",
            }}
          >
            <button
              type="button"
              className="btn btn-light px-3 rounded-3"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn text-white px-3 rounded-3"
              style={{
                backgroundColor: "#0e8a5f",
              }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Section"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AboutHero;
