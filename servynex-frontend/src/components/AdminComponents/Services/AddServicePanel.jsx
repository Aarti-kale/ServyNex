import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { XLg, CloudUploadFill, Trash3 } from "react-bootstrap-icons";

const emptyForm = {
  serviceName: "",
  category: "",
  shortDescription: "",
  longDescription: "",
  basePrice: "",
  duration: "",
  status: "Active",
  isPopular: false,
  isFeatured: false,
  isRelated: false,
  image: null,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const getCategoryId = (category) => {
  if (!category) return "";

  if (typeof category === "string") {
    return category;
  }

  return category._id || "";
};

const normalizeService = (service) => ({
  serviceName: service?.name || "",
  category: getCategoryId(service?.category),

  shortDescription: service?.shortDescription || "",

  longDescription: service?.description || "",

  basePrice:
    service?.price !== undefined && service?.price !== null
      ? String(service.price)
      : "",

  duration:
    service?.duration !== undefined && service?.duration !== null
      ? String(service.duration)
      : "",

  status: service?.isActive === false ? "Inactive" : "Active",

  isPopular: service?.isPopular === true,

  isFeatured: service?.isFeatured === true,

  isRelated: service?.isRelated === true,

  image: null,
});

const getImageUrl = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";

  const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, "");

  const normalizedPath = image.startsWith("/") ? image : `/${image}`;

  return `${backendOrigin}${normalizedPath}`;
};

const AddServicePanel = ({
  service,
  categories = [],
  onClose,
  onSave,
  loading = false,
}) => {
  const [form, setForm] = useState(emptyForm);

  const [imagePreview, setImagePreview] = useState("");

  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);

  const isEditMode = Boolean(service);

  useEffect(() => {
    if (service) {
      setForm(normalizeService(service));

      setImagePreview(getImageUrl(service.image));

      setImageError("");
    } else {
      setForm({ ...emptyForm });

      setImagePreview("");

      setImageError("");
    }
  }, [service]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: checked,
    }));
  };

  const handleUploadAreaClick = () => {
    if (loading) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageError("Only JPG, PNG and WEBP images are allowed.");

      e.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 2MB.");

      e.target.value = "";

      return;
    }

    setImagePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return URL.createObjectURL(file);
    });

    setForm((previousForm) => ({
      ...previousForm,
      image: file,
    }));
  };

  const handleRemoveImage = () => {
    if (loading) return;

    setImagePreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return "";
    });

    setForm((previousForm) => ({
      ...previousForm,
      image: null,
    }));

    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    const serviceName = form.serviceName.trim();

    const shortDescription = form.shortDescription.trim();

    const longDescription = form.longDescription.trim();

    if (!serviceName) {
      window.alert("Service name is required.");
      return;
    }

    if (!form.category) {
      window.alert("Category is required.");
      return;
    }

    if (!shortDescription) {
      window.alert("Short description is required.");
      return;
    }

    const price = Number(form.basePrice);

    if (!Number.isFinite(price) || price < 0) {
      window.alert("Please enter a valid price.");
      return;
    }

    const duration = Number(form.duration);

    if (!Number.isInteger(duration) || duration <= 0) {
      window.alert("Please enter a valid duration.");
      return;
    }

    if (form.image instanceof File) {
      if (!ALLOWED_IMAGE_TYPES.has(form.image.type)) {
        window.alert("Only JPG, PNG and WEBP images are allowed.");

        return;
      }

      if (form.image.size > MAX_IMAGE_SIZE) {
        window.alert("Image size must be less than 2MB.");

        return;
      }
    }

    const payload = {
      name: serviceName,

      category: form.category,

      shortDescription,

      description: longDescription,

      price,

      duration,

      isActive: form.status === "Active",

      isPopular: form.isPopular,

      isFeatured: form.isFeatured,

      isRelated: form.isRelated,
      image: form.image,
    };

    console.log("ADD SERVICE - FORM:", form);
    console.log("ADD SERVICE - isRelated:", form.isRelated);
    console.log("ADD SERVICE - PAYLOAD:", payload);
    onSave?.(payload);
  };

  const hasImage = Boolean(imagePreview);

  return (
    <div
      className="bg-white d-flex flex-column flex-shrink-0 h-100"
      style={{
        width: "400px",
        borderLeft: "1px solid #eef0f2",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          {isEditMode ? "Edit Service" : "Add Service"}
        </h5>

        <button
          type="button"
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
          disabled={loading}
          aria-label="Close"
        >
          <XLg size={18} />
        </button>
      </div>

      <form
        id="serviceForm"
        onSubmit={handleSubmit}
        className="p-3 flex-grow-1"
      >
        <h6
          className="fw-bold mb-3"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Basic Information
        </h6>

        <div className="mb-3">
          <label
            htmlFor="serviceName"
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Service Name <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <input
            id="serviceName"
            name="serviceName"
            type="text"
            value={form.serviceName}
            onChange={handleChange}
            placeholder="Enter service name"
            className="form-control py-2"
            required
            disabled={loading}
            autoComplete="off"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="serviceCategory"
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Category <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <select
            id="serviceCategory"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-select py-2"
            required
            disabled={loading}
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label
            htmlFor="shortDescription"
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Short Description <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <textarea
            id="shortDescription"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Enter short description"
            maxLength={100}
            rows={2}
            className="form-control"
            required
            disabled={loading}
          />

          <p
            className="text-secondary text-end mb-0 mt-1"
            style={{ fontSize: "0.72rem" }}
          >
            {form.shortDescription.length}/100
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="longDescription"
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Long Description
          </label>

          <textarea
            id="longDescription"
            name="longDescription"
            value={form.longDescription}
            onChange={handleChange}
            placeholder="Enter detailed description"
            maxLength={500}
            rows={4}
            className="form-control"
            disabled={loading}
          />

          <p
            className="text-secondary text-end mb-0 mt-1"
            style={{ fontSize: "0.72rem" }}
          >
            {form.longDescription.length}/500
          </p>
        </div>

        <h6
          className="fw-bold mb-3"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Pricing &amp; Duration
        </h6>

        <div className="row g-3 mb-4">
          <div className="col-6">
            <label
              htmlFor="basePrice"
              className="form-label fw-medium mb-1"
              style={{
                color: "#0f1724",
                fontSize: "0.86rem",
              }}
            >
              Base Price (₹) <span style={{ color: "#dc3545" }}>*</span>
            </label>

            <input
              id="basePrice"
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              placeholder="Enter price"
              className="form-control py-2"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <div className="col-6">
            <label
              htmlFor="duration"
              className="form-label fw-medium mb-1"
              style={{
                color: "#0f1724",
                fontSize: "0.86rem",
              }}
            >
              Duration (Minutes) <span style={{ color: "#dc3545" }}>*</span>
            </label>

            <input
              id="duration"
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Enter duration"
              className="form-control py-2"
              min="1"
              step="1"
              required
              disabled={loading}
            />
          </div>
        </div>

        <h6
          className="fw-bold mb-3"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Service Image
        </h6>

        {hasImage && (
          <div
            className="position-relative mb-3 overflow-hidden rounded-3"
            style={{
              height: "170px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#f8fafb",
            }}
          >
            <img
              src={imagePreview}
              alt="Service preview"
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                display: "block",
              }}
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={loading}
              className="btn btn-light position-absolute d-flex align-items-center justify-content-center shadow-sm"
              style={{
                top: "10px",
                right: "10px",
                width: "34px",
                height: "34px",
                padding: 0,
                borderRadius: "50%",
              }}
              aria-label="Remove service image"
            >
              <Trash3 size={15} color="#dc3545" />
            </button>
          </div>
        )}

        <div
          role="button"
          tabIndex={loading ? -1 : 0}
          onClick={handleUploadAreaClick}
          onKeyDown={(e) => {
            if (!loading && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleUploadAreaClick();
            }
          }}
          className="d-flex flex-column align-items-center justify-content-center rounded-3 py-4 mb-2"
          style={{
            border: "2px dashed #d9dee3",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#f8fafb",
            opacity: loading ? 0.65 : 1,
          }}
        >
          <CloudUploadFill size={26} color="#0e8a5f" className="mb-2" />

          <span
            className="fw-semibold text-center"
            style={{
              color: "#0e8a5f",
              fontSize: "0.88rem",
              maxWidth: "90%",
              wordBreak: "break-word",
            }}
          >
            {form.image instanceof File
              ? form.image.name
              : hasImage
              ? "Replace Service Image"
              : "Upload Service Image"}
          </span>

          <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
            JPG, PNG or WEBP (Max. 2MB)
          </span>

          <input
            ref={fileInputRef}
            id="serviceImageUpload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="d-none"
            disabled={loading}
          />
        </div>

        {imageError && (
          <div
            className="text-danger mb-4"
            style={{
              fontSize: "0.75rem",
            }}
          >
            {imageError}
          </div>
        )}

        {!imageError && <div className="mb-4" />}

        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Status
        </h6>

        <div className="d-flex gap-4 mb-4">
          <div className="form-check d-flex align-items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={form.status === "Active"}
              onChange={handleChange}
              className="form-check-input mt-0"
              style={{ accentColor: "#0e8a5f" }}
              id="statusActive"
              disabled={loading}
            />

            <label
              htmlFor="statusActive"
              className="form-check-label"
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
              }}
            >
              Active
            </label>
          </div>

          <div className="form-check d-flex align-items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={form.status === "Inactive"}
              onChange={handleChange}
              className="form-check-input mt-0"
              style={{ accentColor: "#0e8a5f" }}
              id="statusInactive"
              disabled={loading}
            />

            <label
              htmlFor="statusInactive"
              className="form-check-label"
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
              }}
            >
              Inactive
            </label>
          </div>
        </div>

        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Visibility
        </h6>

        <div className="mb-2">
          <div className="form-check d-flex align-items-start gap-2 mb-3">
            <input
              type="checkbox"
              name="isPopular"
              checked={form.isPopular}
              onChange={handleCheckboxChange}
              className="form-check-input mt-1"
              style={{
                accentColor: "#0e8a5f",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              id="isPopular"
              disabled={loading}
            />

            <label
              htmlFor="isPopular"
              className="form-check-label"
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span className="fw-medium d-block">Popular Service</span>

              <span className="text-secondary" style={{ fontSize: "0.74rem" }}>
                Show this service as a popular service.
              </span>
            </label>
          </div>

          <div className="form-check d-flex align-items-start gap-2 mb-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleCheckboxChange}
              className="form-check-input mt-1"
              style={{
                accentColor: "#0e8a5f",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              id="isFeatured"
              disabled={loading}
            />

            <label
              htmlFor="isFeatured"
              className="form-check-label"
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span className="fw-medium d-block">Featured Service</span>

              <span className="text-secondary" style={{ fontSize: "0.74rem" }}>
                Show this service in featured sections.
              </span>
            </label>
          </div>

          <div className="form-check d-flex align-items-start gap-2 mb-2">
            <input
              type="checkbox"
              name="isRelated"
              checked={form.isRelated}
              onChange={handleCheckboxChange}
              className="form-check-input mt-1"
              style={{
                accentColor: "#0e8a5f",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              id="isRelated"
              disabled={loading}
            />

            <label
              htmlFor="isRelated"
              className="form-check-label"
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span className="fw-medium d-block">Related Service</span>

              <span
                className="text-secondary"
                style={{
                  fontSize: "0.74rem",
                }}
              >
                Show this service in related services.
              </span>
            </label>
          </div>
        </div>
      </form>

      <div className="p-3 border-top d-flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="btn flex-fill rounded-3 fw-semibold py-2"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
          }}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          form="serviceForm"
          className="btn flex-fill text-white rounded-3 fw-semibold py-2"
          style={{ backgroundColor: "#0e8a5f" }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Service"}
        </button>
      </div>
    </div>
  );
};

export default AddServicePanel;
