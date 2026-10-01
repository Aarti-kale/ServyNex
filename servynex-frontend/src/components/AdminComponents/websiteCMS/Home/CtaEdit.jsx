import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  MegaphoneFill,
  ImageFill,
  Upload,
  Trash,
  ArrowClockwise,
  CheckCircleFill,
} from "react-bootstrap-icons";

import getMediaUrl from "../../../../utils/getMediaUrl";

const emptyForm = {
  title: "Need a Professional for Your Home?",
  description: "Book trusted professionals in just a few clicks.",
  buttonText: "Book a Service Now",
  buttonLink: "/services",
  image: "",
  imageFile: null,
};

const normalizeCtaData = (data) => {
  return {
    title: data?.title ?? emptyForm.title,
    description: data?.description ?? emptyForm.description,
    buttonText: data?.buttonText ?? emptyForm.buttonText,
    buttonLink: data?.buttonLink ?? emptyForm.buttonLink,
    image: typeof data?.image === "string" ? data.image : "",
    imageFile: null,
  };
};

const CtaEdit = ({
  data,
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [form, setForm] = useState(() =>
    normalizeCtaData(data)
  );

  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    const normalizedData = normalizeCtaData(data);

    const imageFile =
      typeof File !== "undefined" &&
      data?.imageFile instanceof File
        ? data.imageFile
        : null;

    const updatedForm = {
      ...normalizedData,
      imageFile,
    };

    setForm(updatedForm);
    setImageError("");

    if (imageFile) {
      setImagePreview("");
      return;
    }

    setImagePreview(
      getMediaUrl(normalizedData.image)
    );
  }, [data]);

  const handleChange = (field, value) => {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);
    emitChange(updatedForm);
  };

  const emitChange = (updatedForm) => {
    const payload = {
      title: updatedForm.title ?? "",
      description: updatedForm.description ?? "",
      buttonText: updatedForm.buttonText ?? "",
      buttonLink: updatedForm.buttonLink ?? "",
      image:
        typeof updatedForm.image === "string"
          ? updatedForm.image
          : "",
      imageFile:
        typeof File !== "undefined" &&
        updatedForm.imageFile instanceof File
          ? updatedForm.imageFile
          : null,
    };

    onChange?.(payload);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    if (!allowedTypes.has(file.type)) {
      setImageError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setImageError(
        "Image size must be less than 2MB."
      );

      event.target.value = "";
      return;
    }

    setImageError("");

    const updatedForm = {
      ...form,
      image: "",
      imageFile: file,
    };

    setForm(updatedForm);
    setImagePreview("");

    emitChange(updatedForm);

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

    emitChange(updatedForm);
  };

  const handleReset = () => {
    setImageError("");

    if (onReset) {
      onReset();
      return;
    }

    const resetForm = normalizeCtaData(emptyForm);

    setForm(resetForm);
    setImagePreview("");

    emitChange(resetForm);
  };

  const handleSubmit = () => {
    const title = form.title?.trim() || "";
    const description = form.description?.trim() || "";
    const buttonText = form.buttonText?.trim() || "";
    const buttonLink = form.buttonLink?.trim() || "";

    if (!title) {
      window.alert("CTA title is required.");
      return;
    }

    if (!description) {
      window.alert("CTA description is required.");
      return;
    }

    if (!buttonText) {
      window.alert("CTA button text is required.");
      return;
    }

    if (!buttonLink) {
      window.alert("CTA button link is required.");
      return;
    }

    const payload = {
      title,
      description,
      buttonText,
      buttonLink,
      image:
        typeof form.image === "string"
          ? form.image
          : "",
      imageFile:
        typeof File !== "undefined" &&
        form.imageFile instanceof File
          ? form.imageFile
          : null,
    };

    onSave?.(payload);
  };

  const hasExistingImage =
    Boolean(imagePreview) && !form.imageFile;

  const hasPendingImage =
    typeof File !== "undefined" &&
    form.imageFile instanceof File;

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-header bg-white border-bottom p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#e8f6f0",
                color: "#0e8a5f",
              }}
            >
              <MegaphoneFill size={20} />
            </div>

            <div>
              <h5
                className="mb-1 fw-bold"
                style={{ color: "#0f1724" }}
              >
                Call To Action
              </h5>

              <p
                className="mb-0 text-secondary"
                style={{ fontSize: "0.82rem" }}
              >
                Update homepage call to action section
              </p>
            </div>
          </div>

          <span
            className="badge rounded-pill px-3 py-2"
            style={{
              backgroundColor: "#e8f6f0",
              color: "#0e8a5f",
              fontWeight: 500,
            }}
          >
            Active
          </span>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className="btn btn-sm px-3 rounded-3"
            style={{
              backgroundColor: "#0e8a5f",
              color: "#ffffff",
            }}
          >
            Content
          </button>

          <button
            type="button"
            className="btn btn-sm btn-light px-3 rounded-3"
            disabled
          >
            Settings
          </button>

          <button
            type="button"
            className="btn btn-sm btn-light px-3 rounded-3"
            disabled
          >
            Background
          </button>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{ color: "#0f1724" }}
            >
              Title *
            </label>

            <small className="text-secondary">
              {form.title?.length || 0}/100
            </small>
          </div>

          <input
            type="text"
            className="form-control rounded-3"
            value={form.title || ""}
            maxLength={100}
            onChange={(event) =>
              handleChange("title", event.target.value)
            }
            placeholder="Enter CTA title"
            disabled={saving}
          />
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{ color: "#0f1724" }}
            >
              Description *
            </label>

            <small className="text-secondary">
              {form.description?.length || 0}/300
            </small>
          </div>

          <textarea
            className="form-control rounded-3"
            rows={4}
            value={form.description || ""}
            maxLength={300}
            onChange={(event) =>
              handleChange(
                "description",
                event.target.value
              )
            }
            placeholder="Enter CTA description"
            disabled={saving}
          />
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label
              className="form-label fw-semibold mb-0"
              style={{ color: "#0f1724" }}
            >
              Button Text *
            </label>

            <small className="text-secondary">
              {form.buttonText?.length || 0}/50
            </small>
          </div>

          <input
            type="text"
            className="form-control rounded-3"
            value={form.buttonText || ""}
            maxLength={50}
            onChange={(event) =>
              handleChange(
                "buttonText",
                event.target.value
              )
            }
            placeholder="Enter button text"
            disabled={saving}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold mb-2"
            style={{ color: "#0f1724" }}
          >
            Button Link *
          </label>

          <input
            type="text"
            className="form-control rounded-3"
            value={form.buttonLink || ""}
            onChange={(event) =>
              handleChange(
                "buttonLink",
                event.target.value
              )
            }
            placeholder="/services"
            disabled={saving}
          />
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold mb-2"
            style={{ color: "#0f1724" }}
          >
            CTA Image
          </label>

          {hasExistingImage && (
            <div className="mb-3">
              <div
                className="position-relative overflow-hidden rounded-4 border"
                style={{
                  backgroundColor: "#f8faf9",
                }}
              >
                <img
                  src={imagePreview}
                  alt="CTA"
                  className="w-100"
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                  style={{
                    width: "38px",
                    height: "38px",
                  }}
                  onClick={handleRemoveImage}
                  disabled={saving}
                  title="Remove image"
                >
                  <Trash
                    size={15}
                    color="#dc3545"
                  />
                </button>
              </div>

              <small className="text-secondary d-block mt-2">
                Current image
              </small>
            </div>
          )}

          {hasPendingImage && (
            <div
              className="rounded-4 border p-4 mb-3"
              style={{
                backgroundColor: "#f0faf6",
                borderColor: "#b9e5d2",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#dff4ea",
                  }}
                >
                  <CheckCircleFill
                    size={22}
                    color="#0e8a5f"
                  />
                </div>

                <div className="flex-grow-1">
                  <div
                    className="fw-semibold"
                    style={{ color: "#0f1724" }}
                  >
                    {form.imageFile.name}
                  </div>

                  <small className="text-secondary">
                    {(
                      form.imageFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </small>
                </div>

                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "#0e8a5f",
                  }}
                >
                  Upload pending
                </span>
              </div>
            </div>
          )}

          {!hasExistingImage && !hasPendingImage && (
            <label
              htmlFor="cta-image-upload"
              className="w-100 rounded-4 border d-flex flex-column align-items-center justify-content-center text-center"
              style={{
                minHeight: "180px",
                borderStyle: "dashed",
                borderColor: "#b9c9c2",
                backgroundColor: "#fafcfb",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "52px",
                  height: "52px",
                  backgroundColor: "#e8f6f0",
                }}
              >
                <ImageFill
                  size={22}
                  color="#0e8a5f"
                />
              </div>

              <div
                className="fw-semibold mb-1"
                style={{ color: "#0f1724" }}
              >
                Upload CTA Image
              </div>

              <small className="text-secondary">
                JPG, PNG or WEBP · Max 2MB
              </small>
            </label>
          )}

          <input
            id="cta-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="d-none"
            onChange={handleImageChange}
            disabled={saving}
          />

          {(hasExistingImage || hasPendingImage) && (
            <label
              htmlFor="cta-image-upload"
              className="btn btn-outline-success rounded-3 d-inline-flex align-items-center gap-2"
              style={{
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              <Upload size={15} />
              Change Image
            </label>
          )}

          {imageError && (
            <div
              className="alert alert-danger mt-3 mb-0 rounded-3"
              style={{ fontSize: "0.85rem" }}
            >
              {imageError}
            </div>
          )}

          <small
            className="text-secondary d-block mt-2"
            style={{ fontSize: "0.75rem" }}
          >
            Selected image will be uploaded when you
            save the CTA section.
          </small>
        </div>
      </div>

      <div className="card-footer bg-white border-top p-4">
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-3 d-flex align-items-center gap-2 px-4"
            onClick={handleReset}
            disabled={saving}
          >
            <ArrowClockwise size={15} />
            Reset
          </button>

          <button
            type="button"
            className="btn rounded-3 d-flex align-items-center gap-2 px-4 text-white"
            style={{
              backgroundColor: "#0e8a5f",
              opacity: saving ? 0.7 : 1,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              <>
                <CheckCircleFill size={15} />
                Save Section
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CtaEdit;