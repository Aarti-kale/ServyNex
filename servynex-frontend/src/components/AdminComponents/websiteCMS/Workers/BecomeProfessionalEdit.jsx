import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ArrowRight,
  CheckCircleFill,
  Save,
  Image as ImageIcon,
  XCircle,
} from "react-bootstrap-icons";

const normalizeBecomeProfessionalData = (data) => {
  return {
    title: data?.title || "Want to become a ServyNex Professional?",

    description:
      data?.description ||
      "Join our growing network of trusted professionals and grow your business with us.",

    buttonText: data?.buttonText || "Register as a Professional",

    registrationRoute: data?.registrationRoute || "/register?role=worker",

    image: data?.image || "",

    imageFile: data?.imageFile || null,
  };
};

const isValidRoute = (value) => {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
};

const getMediaUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${backendUrl}${cleanPath}`;
};

function BecomeProfessionalEdit({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) {
  const [form, setForm] = useState(() => normalizeBecomeProfessionalData(data));

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(normalizeBecomeProfessionalData(data));

    setValidationError("");
  }, [data]);

  const handleFieldChange = (fieldName, value) => {
    const updatedForm = {
      ...form,
      [fieldName]: value,
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!allowedTypes.has(file.type)) {
      setValidationError("Image must be JPG, PNG or WEBP.");

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setValidationError("Image must be less than or equal to 5 MB.");

      event.target.value = "";
      return;
    }

    setValidationError("");

    const updatedForm = {
      ...form,
      image: "",
      imageFile: file,
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleRemoveImage = () => {
    const updatedForm = {
      ...form,
      image: "",
      imageFile: null,
    };

    setForm(updatedForm);
    onChange?.(updatedForm);

    const input = document.getElementById("becomeProfessionalImage");

    if (input) {
      input.value = "";
    }
  };

  const getImagePreview = () => {
    if (form.imageFile instanceof File) {
      return URL.createObjectURL(form.imageFile);
    }

    if (form.image) {
      return getMediaUrl(form.image);
    }

    return "";
  };

  const imagePreview = getImagePreview();

  const handleSave = () => {
    const cleanedForm = {
      title: form.title.trim(),

      description: form.description.trim(),

      buttonText: form.buttonText.trim(),

      registrationRoute: form.registrationRoute.trim(),

      image: form.image || "",

      imageFile: form.imageFile || null,
    };

    if (!cleanedForm.title) {
      setValidationError("CTA title is required.");
      return;
    }

    if (!cleanedForm.description) {
      setValidationError("CTA description is required.");
      return;
    }

    if (!cleanedForm.buttonText) {
      setValidationError("Button text is required.");
      return;
    }

    if (!cleanedForm.registrationRoute) {
      setValidationError("Button link is required.");
      return;
    }

    if (!isValidRoute(cleanedForm.registrationRoute)) {
      setValidationError(
        "Use an internal path starting with / or a valid http/https URL."
      );
      return;
    }

    setValidationError("");

    onSave?.(cleanedForm);
  };

  const handleReset = () => {
    if (saving) {
      return;
    }

    setValidationError("");

    onReset?.();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-header bg-white border-bottom px-4 py-3">
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold text-dark mb-0">
                Become a Professional CTA
              </h5>

              <span className="badge rounded-pill text-bg-success">Active</span>
            </div>

            <p className="text-secondary small mb-0 mt-1">
              Manage the call-to-action content for new professionals.
            </p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        {validationError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {validationError}
          </div>
        )}

        <div className="mb-3">
          <label
            htmlFor="becomeProfessionalTitle"
            className="form-label fw-semibold small"
          >
            CTA Title
          </label>

          <div className="position-relative">
            <input
              id="becomeProfessionalTitle"
              type="text"
              className="form-control pe-5"
              value={form.title}
              maxLength={120}
              disabled={saving}
              onChange={(event) =>
                handleFieldChange("title", event.target.value)
              }
            />

            <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary small">
              {form.title.length}/120
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label
            htmlFor="becomeProfessionalDescription"
            className="form-label fw-semibold small"
          >
            CTA Description
          </label>

          <textarea
            id="becomeProfessionalDescription"
            className="form-control"
            rows="5"
            value={form.description}
            maxLength={300}
            disabled={saving}
            onChange={(event) =>
              handleFieldChange("description", event.target.value)
            }
          />

          <p className="text-secondary text-end small mb-0 mt-1">
            {form.description.length}/300
          </p>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <label
              htmlFor="becomeProfessionalButtonText"
              className="form-label fw-semibold small"
            >
              Button Text
            </label>

            <div className="position-relative">
              <input
                id="becomeProfessionalButtonText"
                type="text"
                className="form-control pe-5"
                value={form.buttonText}
                maxLength={60}
                disabled={saving}
                onChange={(event) =>
                  handleFieldChange("buttonText", event.target.value)
                }
              />

              <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary small">
                {form.buttonText.length}/60
              </span>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label
              htmlFor="becomeProfessionalButtonLink"
              className="form-label fw-semibold small"
            >
              Button Link
            </label>

            <input
              id="becomeProfessionalButtonLink"
              type="text"
              className="form-control"
              placeholder="/register?role=worker"
              value={form.registrationRoute}
              disabled={saving}
              onChange={(event) =>
                handleFieldChange("registrationRoute", event.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="becomeProfessionalImage"
            className="form-label fw-semibold small"
          >
            CTA Image
          </label>

          <div className="row g-3 align-items-start">
            <div className="col-12 col-md-5">
              <div
                className="border rounded-4 bg-light d-flex align-items-center justify-content-center overflow-hidden"
                style={{
                  minHeight: "240px",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Become Professional CTA preview"
                    className="img-fluid w-100 h-100"
                    style={{
                      maxHeight: "280px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="text-center text-secondary p-4">
                    <ImageIcon size={42} className="mb-2" />

                    <div className="small">No image selected</div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="border rounded-4 p-3">
                <label
                  htmlFor="becomeProfessionalImage"
                  className="form-label fw-semibold small"
                >
                  Upload Image
                </label>

                <input
                  id="becomeProfessionalImage"
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={saving}
                  onChange={handleImageChange}
                />

                <div className="form-text">JPG, PNG or WEBP • Maximum 5 MB</div>

                {form.imageFile instanceof File && (
                  <div className="mt-3">
                    <div className="small fw-semibold text-success">
                      New image selected
                    </div>

                    <div className="small text-secondary text-break">
                      {form.imageFile.name}
                    </div>
                  </div>
                )}

                {form.image && !form.imageFile && (
                  <div className="mt-3">
                    <div className="small fw-semibold text-success">
                      Current uploaded image
                    </div>

                    <div className="small text-secondary text-break">
                      {form.image}
                    </div>
                  </div>
                )}

                {(form.image || form.imageFile) && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-3 d-inline-flex align-items-center gap-2"
                    disabled={saving}
                    onClick={handleRemoveImage}
                  >
                    <XCircle size={15} />
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-success-subtle border border-success-subtle rounded-3 p-4 mt-4"
          aria-label="CTA preview"
        >
          <span className="badge text-bg-success mb-3">Live Preview</span>

          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <h4 className="fw-bold text-dark mb-2">
                {form.title || "Your CTA title will appear here"}
              </h4>

              <p className="text-secondary mb-3">
                {form.description || "Your CTA description will appear here"}
              </p>

              <span className="btn btn-success d-inline-flex align-items-center gap-2">
                {form.buttonText || "Button Text"}

                <ArrowRight size={17} />
              </span>
            </div>

            <div className="col-12 col-lg-5 text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="CTA preview"
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: "220px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="text-secondary small py-4">
                  CTA image preview
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="alert alert-success-subtle text-success-emphasis small d-flex align-items-start gap-2 mt-4 mb-0"
          role="note"
        >
          <CheckCircleFill size={17} className="mt-1" />

          <span>
            Upload an image here. The selected file will be uploaded when you
            click Save Changes, and the permanent uploaded image path will be
            stored in the CMS.
          </span>
        </div>
      </div>

      <div className="card-footer bg-white border-top px-4 py-3">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            disabled={saving}
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn btn-success px-4 d-inline-flex align-items-center gap-2"
            disabled={saving}
            onClick={handleSave}
          >
            <Save size={16} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BecomeProfessionalEdit;
