import React, { useEffect, useRef, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import { FaImage, FaUpload, FaTrash, FaCheckCircle } from "react-icons/fa";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const isFile = (value) => {
  return typeof File !== "undefined" && value instanceof File;
};

const normalizeHeroData = (data) => {
  return {
    badge: data?.badge || "",

    title: data?.title || "",

    highlightedTitle: data?.highlightedTitle || "",

    description: data?.description || "",

    primaryButton: {
      text: data?.primaryButton?.text || "",

      link: data?.primaryButton?.link || "",
    },

    secondaryButton: {
      text: data?.secondaryButton?.text || "",

      link: data?.secondaryButton?.link || "",
    },

    image: data?.image || "",

    imageFile: null,

    isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
  };
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith("blob:")) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${backendUrl}${cleanPath}`;
};
const ProfessionalHeroEdit = ({ data, saving, onChange, onSave, onReset }) => {
  const [form, setForm] = useState(normalizeHeroData(data));

  const [imagePreview, setImagePreview] = useState("");

  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const previousForm = form;

    const normalizedData = normalizeHeroData(data);

    const existingImageFile = isFile(previousForm?.imageFile)
      ? previousForm.imageFile
      : null;

    setForm({
      ...normalizedData,

      image: existingImageFile ? "" : normalizedData.image,

      imageFile: existingImageFile,
    });

    if (existingImageFile) {
      return;
    }

    if (normalizedData.image) {
      setImagePreview(getImageUrl(normalizedData.image));
    } else {
      setImagePreview("");
    }

    setImageError("");
  }, [data]);

  const handleChange = (field, value) => {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleButtonChange = (buttonName, field, value) => {
    const updatedForm = {
      ...form,

      [buttonName]: {
        ...form[buttonName],
        [field]: value,
      },
    };

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleIsActiveChange = (value) => {
    const updatedForm = {
      ...form,
      isActive: value,
    };

    setForm(updatedForm);

    onChange?.(updatedForm);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.has(selectedFile.type)) {
      setImageError("Only JPG, PNG and WEBP images are allowed.");

      event.target.value = "";

      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than or equal to 2 MB.");

      event.target.value = "";

      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    setImagePreview(previewUrl);

    const updatedForm = {
      ...form,

      image: "",

      imageFile: selectedFile,
    };

    setForm(updatedForm);

    onChange?.(updatedForm);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    const updatedForm = {
      ...form,

      image: "",

      imageFile: null,
    };

    setForm(updatedForm);

    setImagePreview("");

    setImageError("");

    onChange?.(updatedForm);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const cleanedForm = {
      badge: form.badge?.trim() || "",

      title: form.title?.trim() || "",

      highlightedTitle: form.highlightedTitle?.trim() || "",

      description: form.description?.trim() || "",

      primaryButton: {
        text: form.primaryButton?.text?.trim() || "",

        link: form.primaryButton?.link?.trim() || "",
      },

      secondaryButton: {
        text: form.secondaryButton?.text?.trim() || "",

        link: form.secondaryButton?.link?.trim() || "",
      },

      image: form.image || "",

      imageFile: form.imageFile || null,

      isActive: typeof form.isActive === "boolean" ? form.isActive : true,
    };

    onSave?.(cleanedForm);
  };

  const handleReset = () => {
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onReset?.();
  };

  const hasImage = Boolean(imagePreview || form.image);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold">Professional Hero</h5>

            <p className="text-muted mb-0 small">
              Manage the Professionals page hero section.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="small fw-semibold">Status</span>

            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="professionalHeroIsActive"
                checked={Boolean(form.isActive)}
                onChange={(event) => handleIsActiveChange(event.target.checked)}
                disabled={saving}
              />

              <label
                className="form-check-label small"
                htmlFor="professionalHeroIsActive"
              >
                {form.isActive ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-4">
          <div className="col-12">
            <label htmlFor="heroBadge" className="form-label fw-semibold">
              Badge
            </label>

            <input
              id="heroBadge"
              type="text"
              className="form-control"
              value={form.badge}
              onChange={(event) => handleChange("badge", event.target.value)}
              disabled={saving}
              placeholder="OUR PROFESSIONALS"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="heroTitle" className="form-label fw-semibold">
              Title
            </label>

            <input
              id="heroTitle"
              type="text"
              className="form-control"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              disabled={saving}
              placeholder="Meet Our Trusted"
            />
          </div>

          <div className="col-md-6">
            <label
              htmlFor="heroHighlightedTitle"
              className="form-label fw-semibold"
            >
              Highlighted Title
            </label>

            <input
              id="heroHighlightedTitle"
              type="text"
              className="form-control"
              value={form.highlightedTitle}
              onChange={(event) =>
                handleChange("highlightedTitle", event.target.value)
              }
              disabled={saving}
              placeholder="Professionals"
            />
          </div>

          <div className="col-12">
            <label htmlFor="heroDescription" className="form-label fw-semibold">
              Description
            </label>

            <textarea
              id="heroDescription"
              className="form-control"
              rows="4"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              disabled={saving}
              placeholder="Enter hero description..."
            />
          </div>

          <div className="col-12">
            <div className="border rounded p-3">
              <h6 className="fw-bold mb-3">Primary Button</h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="primaryButtonText" className="form-label">
                    Button Text
                  </label>

                  <input
                    id="primaryButtonText"
                    type="text"
                    className="form-control"
                    value={form.primaryButton?.text || ""}
                    onChange={(event) =>
                      handleButtonChange(
                        "primaryButton",
                        "text",
                        event.target.value
                      )
                    }
                    disabled={saving}
                    placeholder="Explore Services"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="primaryButtonLink" className="form-label">
                    Button Link
                  </label>

                  <input
                    id="primaryButtonLink"
                    type="text"
                    className="form-control"
                    value={form.primaryButton?.link || ""}
                    onChange={(event) =>
                      handleButtonChange(
                        "primaryButton",
                        "link",
                        event.target.value
                      )
                    }
                    disabled={saving}
                    placeholder="/services"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="border rounded p-3">
              <h6 className="fw-bold mb-3">Secondary Button</h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="secondaryButtonText" className="form-label">
                    Button Text
                  </label>

                  <input
                    id="secondaryButtonText"
                    type="text"
                    className="form-control"
                    value={form.secondaryButton?.text || ""}
                    onChange={(event) =>
                      handleButtonChange(
                        "secondaryButton",
                        "text",
                        event.target.value
                      )
                    }
                    disabled={saving}
                    placeholder="See How It Works"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="secondaryButtonLink" className="form-label">
                    Button Link
                  </label>

                  <input
                    id="secondaryButtonLink"
                    type="text"
                    className="form-control"
                    value={form.secondaryButton?.link || ""}
                    onChange={(event) =>
                      handleButtonChange(
                        "secondaryButton",
                        "link",
                        event.target.value
                      )
                    }
                    disabled={saving}
                    placeholder="#hiring-process"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="fw-bold mb-1">Hero Image</h6>

                  <small className="text-muted">
                    JPG, PNG or WEBP — Maximum 2MB
                  </small>
                </div>

                <FaImage className="text-muted" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={saving}
              />
              {hasImage ? (
                <div className="mb-3">
                  <div
                    className="border rounded overflow-hidden bg-light"
                    style={{
                      minHeight: "220px",
                    }}
                  >
                    <img
                      src={imagePreview || getImageUrl(form.image)}
                      alt="Professional Hero"
                      className="img-fluid w-100"
                      style={{
                        maxHeight: "400px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="border rounded d-flex flex-column align-items-center justify-content-center text-muted bg-light mb-3"
                  style={{
                    minHeight: "220px",
                  }}
                >
                  <FaImage size={40} className="mb-2" />

                  <span>No hero image selected</span>
                </div>
              )}

              {imageError && (
                <div className="alert alert-danger py-2">{imageError}</div>
              )}

              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleUploadClick}
                  disabled={saving}
                >
                  <FaUpload className="me-2" />

                  {form.imageFile ? "Change Image" : "Upload Image"}
                </button>

                {hasImage && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleRemoveImage}
                    disabled={saving}
                  >
                    <FaTrash className="me-2" />
                    Remove Image
                  </button>
                )}
              </div>

              {isFile(form.imageFile) && (
                <div className="mt-3 text-success small d-flex align-items-center gap-2">
                  <FaCheckCircle />

                  <span>
                    New image selected: <strong>{form.imageFile.name}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="col-12">
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">Section Status</h6>

                  <small className="text-muted">
                    Control whether the Professional Hero section is active.
                  </small>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="heroActiveStatus"
                    checked={Boolean(form.isActive)}
                    onChange={(event) =>
                      handleIsActiveChange(event.target.checked)
                    }
                    disabled={saving}
                  />

                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="heroActiveStatus"
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer bg-white border-top py-3">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHeroEdit;
