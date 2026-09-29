import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BookFill,
  CloudUploadFill,
  ImageFill,
  Trash3Fill,
  ArrowClockwise,
  CheckCircleFill,
} from "react-bootstrap-icons";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, "");

  const normalizedPath = image.startsWith("/") ? image : `/${image}`;

  return `${backendOrigin}${normalizedPath}`;
};

const normalizeStory = (data) => ({
  title: data?.title || "Our Story",

  paragraphs: [data?.paragraphs?.[0] || "", data?.paragraphs?.[1] || ""],

  image: typeof data?.image === "string" ? data.image : null,
});

const AboutStoryEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [form, setForm] = useState(() => normalizeStory(data));

  const [imagePreview, setImagePreview] = useState(() =>
    getImageUrl(data?.image)
  );

  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const normalized = normalizeStory(data);

    setForm((previousForm) => {
      if (previousForm.image instanceof File) {
        return {
          ...normalized,
          image: previousForm.image,
        };
      }

      return normalized;
    });

    if (typeof data?.image === "string" && data.image.trim()) {
      setImagePreview(getImageUrl(data.image));
    }

    setImageError("");
  }, [data]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const updateForm = (updates) => {
    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        ...updates,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const handleParagraphChange = (index, value) => {
    setForm((previousForm) => {
      const paragraphs = [...previousForm.paragraphs];

      paragraphs[index] = value;

      const updatedForm = {
        ...previousForm,
        paragraphs,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const handleUploadAreaClick = () => {
    if (saving) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

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

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return previewUrl;
    });

    setForm((previousForm) => ({
      ...previousForm,
      image: file,
    }));
  };

  const handleRemoveImage = () => {
    if (saving) {
      return;
    }

    setImagePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return "";
    });

    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        image: null,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });

    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    const title = form.title.trim();

    const paragraph1 = form.paragraphs?.[0]?.trim() || "";

    const paragraph2 = form.paragraphs?.[1]?.trim() || "";

    if (!title) {
      setImageError("");
      return;
    }

    if (!paragraph1 || !paragraph2) {
      setImageError("");
      return;
    }

    if (form.image && typeof form.image !== "string") {
      if (!ALLOWED_IMAGE_TYPES.has(form.image.type)) {
        setImageError("Only JPG, PNG and WEBP images are allowed.");

        return;
      }

      if (form.image.size > MAX_IMAGE_SIZE) {
        setImageError("Image size must be less than 2MB.");

        return;
      }
    }

    setImageError("");

    onSave?.({
      ...form,
      title,
      paragraphs: [paragraph1, paragraph2],
    });
  };

  return (
    <div
      className="rounded-4 bg-white overflow-hidden"
      style={{
        border: "1px solid #e8eee9",
        boxShadow: "0 4px 18px rgba(20, 60, 40, 0.05)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid #e8eee9",
        }}
      >
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "42px",
                height: "42px",
                background: "#e8f7ef",
                color: "#168653",
              }}
            >
              <BookFill size={20} />
            </div>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 fw-semibold" style={{ color: "#14213d" }}>
                  Our Story Section
                </h5>

                <span
                  className="px-2 py-1 rounded-pill small fw-medium"
                  style={{
                    background: "#e8f7ef",
                    color: "#168653",
                  }}
                >
                  <CheckCircleFill size={11} className="me-1" />
                  Active
                </span>
              </div>

              <p className="mb-0 mt-1 small" style={{ color: "#718096" }}>
                Update the story content and image for this section
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="row g-4">
          <div className="col-12">
            <div
              className="rounded-4 p-4"
              style={{
                border: "1px solid #e8eee9",
                background: "#fbfdfc",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-4">
                <div
                  style={{
                    width: "4px",
                    height: "22px",
                    borderRadius: "10px",
                    background: "#168653",
                  }}
                />

                <h6 className="mb-0 fw-semibold" style={{ color: "#14213d" }}>
                  Story Content
                </h6>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="aboutStoryTitle"
                  className="form-label fw-semibold small"
                  style={{ color: "#26364a" }}
                >
                  Section Title
                </label>

                <input
                  id="aboutStoryTitle"
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(event) =>
                    updateForm({
                      title: event.target.value,
                    })
                  }
                  maxLength={150}
                  disabled={saving}
                  placeholder="Enter section title"
                  style={{
                    minHeight: "46px",
                    borderColor: "#dce7df",
                    borderRadius: "10px",
                  }}
                />

                <div className="text-end mt-1">
                  <small className="text-secondary">
                    {form.title.length}/150
                  </small>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="aboutStoryParagraph1"
                  className="form-label fw-semibold small"
                  style={{ color: "#26364a" }}
                >
                  Paragraph 1
                </label>

                <textarea
                  id="aboutStoryParagraph1"
                  className="form-control"
                  rows={6}
                  value={form.paragraphs?.[0] || ""}
                  onChange={(event) =>
                    handleParagraphChange(0, event.target.value)
                  }
                  maxLength={1000}
                  disabled={saving}
                  placeholder="Enter the first story paragraph..."
                  style={{
                    borderColor: "#dce7df",
                    borderRadius: "10px",
                    resize: "vertical",
                  }}
                />

                <div className="text-end mt-1">
                  <small className="text-secondary">
                    {(form.paragraphs?.[0] || "").length}
                    /1000
                  </small>
                </div>
              </div>

              <div className="mb-0">
                <label
                  htmlFor="aboutStoryParagraph2"
                  className="form-label fw-semibold small"
                  style={{ color: "#26364a" }}
                >
                  Paragraph 2
                </label>

                <textarea
                  id="aboutStoryParagraph2"
                  className="form-control"
                  rows={6}
                  value={form.paragraphs?.[1] || ""}
                  onChange={(event) =>
                    handleParagraphChange(1, event.target.value)
                  }
                  maxLength={1000}
                  disabled={saving}
                  placeholder="Enter the second story paragraph..."
                  style={{
                    borderColor: "#dce7df",
                    borderRadius: "10px",
                    resize: "vertical",
                  }}
                />

                <div className="text-end mt-1">
                  <small className="text-secondary">
                    {(form.paragraphs?.[1] || "").length}
                    /1000
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div
              className="rounded-4 p-4"
              style={{
                border: "1px solid #e8eee9",
                background: "#fbfdfc",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  style={{
                    width: "4px",
                    height: "22px",
                    borderRadius: "10px",
                    background: "#168653",
                  }}
                />

                <div>
                  <h6 className="mb-0 fw-semibold" style={{ color: "#14213d" }}>
                    Story Image
                  </h6>

                  <small className="text-secondary">
                    Recommended size: 1920×1080px
                  </small>
                </div>
              </div>

              {!imagePreview ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleUploadAreaClick}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleUploadAreaClick();
                    }
                  }}
                  className="d-flex flex-column align-items-center justify-content-center text-center"
                  style={{
                    minHeight: "190px",
                    border: "2px dashed #cfe0d5",
                    borderRadius: "12px",
                    background: "#ffffff",
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: "#e8f7ef",
                      color: "#168653",
                    }}
                  >
                    <CloudUploadFill size={24} />
                  </div>

                  <div className="fw-semibold" style={{ color: "#26364a" }}>
                    Upload Story Image
                  </div>

                  <small className="text-secondary mt-1">
                    JPG, PNG or WEBP • Maximum 2MB
                  </small>

                  <button
                    type="button"
                    className="btn btn-sm mt-3"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUploadAreaClick();
                    }}
                    disabled={saving}
                    style={{
                      background: "#168653",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 18px",
                    }}
                  >
                    <ImageFill size={14} className="me-2" />
                    Choose Image
                  </button>
                </div>
              ) : (
                <div
                  className="position-relative overflow-hidden"
                  style={{
                    border: "1px solid #dce7df",
                    borderRadius: "12px",
                    background: "#ffffff",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Our Story"
                    className="w-100"
                    style={{
                      height: "280px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.65))",
                    }}
                  >
                    <span className="text-white small fw-medium">
                      Story Image
                    </span>

                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={handleRemoveImage}
                      disabled={saving}
                      style={{
                        background: "#ffffff",
                        color: "#dc3545",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    >
                      <Trash3Fill size={14} className="me-1" />
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                id="aboutStoryImageUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="d-none"
                disabled={saving}
              />

              {imageError && (
                <div
                  className="mt-3 px-3 py-2 rounded-3 small"
                  style={{
                    background: "#fff1f1",
                    color: "#c0392b",
                    border: "1px solid #ffd6d6",
                  }}
                >
                  {imageError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-3 d-flex justify-content-end gap-2"
        style={{
          borderTop: "1px solid #e8eee9",
          background: "#ffffff",
        }}
      >
        <button
          type="button"
          className="btn px-4"
          onClick={onReset}
          disabled={saving}
          style={{
            border: "1px solid #d8e2dc",
            background: "#ffffff",
            color: "#26364a",
            borderRadius: "9px",
            minHeight: "42px",
          }}
        >
          <ArrowClockwise size={15} className="me-2" />
          Reset
        </button>

        <button
          type="button"
          className="btn px-4"
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "#168653",
            color: "#ffffff",
            border: "none",
            borderRadius: "9px",
            minHeight: "42px",
            minWidth: "145px",
          }}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            <>
              <CheckCircleFill size={15} className="me-2" />
              Save Section
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AboutStoryEdit;
