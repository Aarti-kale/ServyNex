import React, { useEffect, useRef, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  Image,
  Upload,
  Trash,
  SaveFill,
  ArrowClockwise,
} from "react-bootstrap-icons";

const ServiceHeroEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const defaultForm = {
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

    imageFile: null,
  };

  const [form, setForm] = useState(defaultForm);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm({
      ...defaultForm,

      ...data,

      primaryButton: {
        ...defaultForm.primaryButton,
        ...(data.primaryButton || {}),
      },

      secondaryButton: {
        ...defaultForm.secondaryButton,
        ...(data.secondaryButton || {}),
      },

      imageFile: data.imageFile || null,
    });
  }, [data]);

  const updateParent = (updatedForm) => {
    if (typeof onChange === "function") {
      onChange(updatedForm);
    }
  };

  const handleChange = (field, value) => {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);
    updateParent(updatedForm);
  };

  const handlePrimaryButtonChange = (field, value) => {
    const updatedForm = {
      ...form,

      primaryButton: {
        ...form.primaryButton,
        [field]: value,
      },
    };

    setForm(updatedForm);
    updateParent(updatedForm);
  };

  const handleSecondaryButtonChange = (field, value) => {
    const updatedForm = {
      ...form,

      secondaryButton: {
        ...form.secondaryButton,
        [field]: value,
      },
    };

    setForm(updatedForm);
    updateParent(updatedForm);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or WEBP image.");

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size must be less than or equal to 5 MB.");

      event.target.value = "";
      return;
    }

    const updatedForm = {
      ...form,

      image: "",

      imageFile: file,
    };

    setForm(updatedForm);
    updateParent(updatedForm);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    const updatedForm = {
      ...form,

      image: "",

      imageFile: null,
    };

    setForm(updatedForm);
    updateParent(updatedForm);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave(form);
    }
  };

  const handleReset = () => {
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    const resetForm = {
      ...defaultForm,
    };

    setForm(resetForm);
    updateParent(resetForm);
  };

  const badgeLength = form.badge?.length || 0;

  const titleLength = form.title?.length || 0;

  const highlightedTitleLength = form.highlightedTitle?.length || 0;

  const descriptionLength = form.description?.length || 0;

  const primaryTextLength = form.primaryButton?.text?.length || 0;

  const secondaryTextLength = form.secondaryButton?.text?.length || 0;

  const hasExistingImage = Boolean(form.image);

  const hasNewImage = Boolean(form.imageFile);

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div
        className="px-4 py-3 border-bottom"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <h5
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
              }}
            >
              Hero Section
            </h5>

            <p
              className="mb-0"
              style={{
                color: "#64748b",
                fontSize: "0.88rem",
              }}
            >
              Update services page hero content
            </p>
          </div>

          <span
            className="d-inline-flex align-items-center"
            style={{
              padding: "5px 13px",
              borderRadius: "20px",
              backgroundColor: "#dff5ea",
              color: "#08784f",
              fontSize: "0.78rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#0e8a5f",
                marginRight: "7px",
              }}
            />
            Active
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{
                color: "#172033",
                fontSize: "0.88rem",
              }}
            >
              Badge/Label
            </label>

            <small
              style={{
                color: "#64748b",
              }}
            >
              {badgeLength}/100
            </small>
          </div>

          <input
            type="text"
            value={form.badge || ""}
            onChange={(e) => handleChange("badge", e.target.value)}
            maxLength={100}
            className="form-control"
            placeholder="PROFESSIONAL HOME SERVICES"
            style={{
              minHeight: "44px",
              borderColor: "#dce3e8",
              borderRadius: "8px",
              color: "#172033",
            }}
          />
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{
                color: "#172033",
                fontSize: "0.88rem",
              }}
            >
              Main Title
            </label>

            <small
              style={{
                color: "#64748b",
              }}
            >
              {titleLength}/150
            </small>
          </div>

          <input
            type="text"
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            maxLength={150}
            className="form-control"
            placeholder="Quality Services"
            style={{
              minHeight: "44px",
              borderColor: "#dce3e8",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{
                color: "#172033",
                fontSize: "0.88rem",
              }}
            >
              Highlighted Title
            </label>

            <small
              style={{
                color: "#64748b",
              }}
            >
              {highlightedTitleLength}/150
            </small>
          </div>

          <input
            type="text"
            value={form.highlightedTitle || ""}
            onChange={(e) => handleChange("highlightedTitle", e.target.value)}
            maxLength={150}
            className="form-control"
            placeholder="For Your Home"
            style={{
              minHeight: "44px",
              borderColor: "#dce3e8",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{
                color: "#172033",
                fontSize: "0.88rem",
              }}
            >
              Description
            </label>

            <small
              style={{
                color: "#64748b",
              }}
            >
              {descriptionLength}/500
            </small>
          </div>

          <textarea
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            maxLength={500}
            rows={4}
            className="form-control"
            placeholder="Enter services hero description..."
            style={{
              borderColor: "#dce3e8",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold mb-2"
            style={{
              color: "#172033",
              fontSize: "0.88rem",
            }}
          >
            Primary Button
          </label>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small
                  className="fw-medium"
                  style={{
                    color: "#475569",
                  }}
                >
                  Text
                </small>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  {primaryTextLength}/100
                </small>
              </div>

              <input
                type="text"
                value={form.primaryButton?.text || ""}
                onChange={(e) =>
                  handlePrimaryButtonChange("text", e.target.value)
                }
                maxLength={100}
                className="form-control"
                placeholder="Book a Service"
                style={{
                  minHeight: "44px",
                  borderColor: "#dce3e8",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div className="col-md-6">
              <small
                className="fw-medium d-block mb-1"
                style={{
                  color: "#475569",
                }}
              >
                Link
              </small>

              <input
                type="text"
                value={form.primaryButton?.link || ""}
                onChange={(e) =>
                  handlePrimaryButtonChange("link", e.target.value)
                }
                maxLength={300}
                className="form-control"
                placeholder="/services"
                style={{
                  minHeight: "44px",
                  borderColor: "#dce3e8",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold mb-2"
            style={{
              color: "#172033",
              fontSize: "0.88rem",
            }}
          >
            Secondary Button
          </label>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small
                  className="fw-medium"
                  style={{
                    color: "#475569",
                  }}
                >
                  Text
                </small>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  {secondaryTextLength}/100
                </small>
              </div>

              <input
                type="text"
                value={form.secondaryButton?.text || ""}
                onChange={(e) =>
                  handleSecondaryButtonChange("text", e.target.value)
                }
                maxLength={100}
                className="form-control"
                placeholder="Become a Worker"
                style={{
                  minHeight: "44px",
                  borderColor: "#dce3e8",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div className="col-md-6">
              <small
                className="fw-medium d-block mb-1"
                style={{
                  color: "#475569",
                }}
              >
                Link
              </small>

              <input
                type="text"
                value={form.secondaryButton?.link || ""}
                onChange={(e) =>
                  handleSecondaryButtonChange("link", e.target.value)
                }
                maxLength={300}
                className="form-control"
                placeholder="/register?role=worker"
                style={{
                  minHeight: "44px",
                  borderColor: "#dce3e8",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold mb-2"
            style={{
              color: "#172033",
              fontSize: "0.88rem",
            }}
          >
            Hero Image
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect}
            className="d-none"
          />

          {hasExistingImage && !hasNewImage && (
            <div
              className="d-flex align-items-center justify-content-between gap-3 p-2"
              style={{
                border: "1px solid #dce3e8",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <div className="d-flex align-items-center gap-3 overflow-hidden">
                <div
                  className="flex-shrink-0"
                  style={{
                    width: "84px",
                    height: "54px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: "#f1f5f3",
                  }}
                >
                  <img
                    src={form.image}
                    alt="Hero"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="overflow-hidden">
                  <div
                    className="fw-medium text-truncate"
                    style={{
                      color: "#172033",
                      fontSize: "0.84rem",
                    }}
                  >
                    {form.image.split("/").pop() || "hero-image"}
                  </div>

                  <small
                    style={{
                      color: "#64748b",
                    }}
                  >
                    Current hero image
                  </small>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "#fff1f1",
                  color: "#dc3545",
                  border: "1px solid #ffd6d6",
                }}
                title="Remove image"
                aria-label="Remove hero image"
              >
                <Trash size={15} />
              </button>
            </div>
          )}

          {hasNewImage && (
            <div
              className="d-flex align-items-center justify-content-between gap-3 p-3"
              style={{
                border: "1px solid #bde8d3",
                borderRadius: "8px",
                backgroundColor: "#f1fbf6",
              }}
            >
              <div className="d-flex align-items-center gap-3 overflow-hidden">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "8px",
                    backgroundColor: "#dff5ea",
                    color: "#0e8a5f",
                  }}
                >
                  <Image size={20} />
                </div>

                <div className="overflow-hidden">
                  <div
                    className="fw-semibold text-truncate"
                    style={{
                      color: "#0e8a5f",
                      fontSize: "0.84rem",
                    }}
                  >
                    {form.imageFile?.name}
                  </div>

                  <small
                    style={{
                      color: "#64748b",
                    }}
                  >
                    New image selected. It will be uploaded when you save.
                  </small>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#dc3545",
                  border: "1px solid #ffd6d6",
                }}
                title="Remove selected image"
                aria-label="Remove selected image"
              >
                <Trash size={15} />
              </button>
            </div>
          )}

          {!hasExistingImage && !hasNewImage && (
            <div
              className="text-center py-4"
              style={{
                border: "1px dashed #cbd5d1",
                borderRadius: "8px",
                backgroundColor: "#f8fbf9",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#e5f6ee",
                  color: "#0e8a5f",
                }}
              >
                <Image size={19} />
              </div>

              <div
                className="fw-medium"
                style={{
                  color: "#334155",
                  fontSize: "0.86rem",
                }}
              >
                No hero image selected
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={openFilePicker}
            className="btn mt-2 d-flex align-items-center gap-2 fw-semibold"
            style={{
              color: "#0e8a5f",
              backgroundColor: "#ffffff",
              border: "1px solid #0e8a5f",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "0.84rem",
            }}
          >
            <Upload size={15} />
            Upload New Image
          </button>

          <small
            className="d-block mt-2"
            style={{
              color: "#64748b",
            }}
          >
            JPG, PNG or WEBP • Maximum 5 MB
          </small>
        </div>

        <div
          className="d-flex flex-wrap justify-content-end gap-2 pt-3"
          style={{
            borderTop: "1px solid #edf1ef",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="btn d-flex align-items-center gap-2 rounded-3 fw-semibold"
            style={{
              minHeight: "42px",
              padding: "0 16px",
              color: "#475569",
              backgroundColor: "#ffffff",
              border: "1px solid #dce3e8",
            }}
          >
            <ArrowClockwise size={15} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn text-white d-flex align-items-center gap-2 rounded-3 fw-semibold"
            style={{
              minHeight: "42px",
              minWidth: "120px",
              padding: "0 18px",
              backgroundColor: "#0e8a5f",
              border: "1px solid #0e8a5f",
              boxShadow: "0 4px 10px rgba(14, 138, 95, 0.15)",
            }}
            aria-busy={saving}
          >
            <SaveFill size={15} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroEdit;
