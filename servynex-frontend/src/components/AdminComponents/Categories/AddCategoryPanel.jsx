import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  XLg,
  ChevronDown,
  CloudUploadFill,
  LightningChargeFill,
  Droplet,
  Snow,
  Brush,
  PaletteFill,
  Hammer,
  HourglassSplit,
  BugFill,
  GearFill,
  HouseFill,
  Cpu,
} from "react-bootstrap-icons";

const primaryIcons = [
  { key: "electrician", icon: <LightningChargeFill size={20} /> },
  { key: "plumber", icon: <Droplet size={20} /> },
  { key: "ac", icon: <Snow size={20} /> },
  { key: "cleaning", icon: <Brush size={20} /> },
  { key: "painting", icon: <PaletteFill size={20} /> },
  { key: "carpentry", icon: <Hammer size={20} /> },
  { key: "appliance", icon: <HourglassSplit size={20} /> },
  { key: "pest", icon: <BugFill size={20} /> },
];

const moreIcons = [
  { key: "gear", icon: <GearFill size={20} /> },
  { key: "house", icon: <HouseFill size={20} /> },
  { key: "cpu", icon: <Cpu size={20} /> },
];

const emptyForm = {
  name: "",
  icon: "electrician",
  shortDescription: "",
  image: null,
  status: "Active",
};

const getStatus = (category) => {
  if (category?.isActive === undefined) {
    return "Active";
  }

  return category.isActive ? "Active" : "Inactive";
};

const getCategoryIcon = (category) => {
  const icon = String(category?.icon || "").toLowerCase().trim();

  const availableIcons = [
    ...primaryIcons,
    ...moreIcons,
  ];

  const exists = availableIcons.some(
    (item) => item.key === icon
  );

  return exists ? icon : "electrician";
};

const AddCategoryPanel = ({
  category,
  onClose,
  onSave,
  saving = false,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [showMoreIcons, setShowMoreIcons] = useState(false);

  const isEditMode = Boolean(category);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        icon: getCategoryIcon(category),
        shortDescription:
          category.shortDescription || "",
        image: null,
        status: getStatus(category),
      });
    } else {
      setForm(emptyForm);
    }

    setShowMoreIcons(false);
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      window.alert("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      window.alert("Image size must be less than 2MB.");
      e.target.value = "";
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    const trimmedName = form.name.trim();
    const trimmedDescription =
      form.shortDescription.trim();

    if (!trimmedName) {
      window.alert("Category name is required.");
      return;
    }

    if (!trimmedDescription) {
      window.alert("Short description is required.");
      return;
    }

    const payload = {
      name: trimmedName,
      icon: form.icon,
      shortDescription: trimmedDescription,
      isActive: form.status === "Active",
    };

    onSave?.(payload, form.image);

  };

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
        <h5
          className="fw-bold mb-0"
          style={{ color: "#0f1724" }}
        >
          {isEditMode ? "Edit Category" : "Add Category"}
        </h5>

        <button
          type="button"
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
          disabled={saving}
        >
          <XLg size={18} />
        </button>
      </div>

      <form
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
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Category Name{" "}
            <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter category name"
            className="form-control py-2"
            required
            disabled={saving}
          />
        </div>

        <div className="mb-3">
          <label
            className="form-label fw-medium mb-2"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Category Icon{" "}
            <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <div className="row g-2 mb-2">
            {primaryIcons.map((item) => (
              <div
                className="col-3"
                key={item.key}
              >
                <button
                  type="button"
                  onClick={() =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      icon: item.key,
                    }))
                  }
                  className="btn w-100 d-flex align-items-center justify-content-center rounded-3 py-2"
                  style={{
                    border:
                      form.icon === item.key
                        ? "2px solid #0e8a5f"
                        : "1px solid #e2e8e5",
                    color:
                      form.icon === item.key
                        ? "#0e8a5f"
                        : "#6b7280",
                    backgroundColor:
                      form.icon === item.key
                        ? "#eef7f3"
                        : "#ffffff",
                  }}
                  disabled={saving}
                >
                  {item.icon}
                </button>
              </div>
            ))}
          </div>

          {showMoreIcons && (
            <div className="row g-2 mb-2">
              {moreIcons.map((item) => (
                <div
                  className="col-3"
                  key={item.key}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setForm((previousForm) => ({
                        ...previousForm,
                        icon: item.key,
                      }))
                    }
                    className="btn w-100 d-flex align-items-center justify-content-center rounded-3 py-2"
                    style={{
                      border:
                        form.icon === item.key
                          ? "2px solid #0e8a5f"
                          : "1px solid #e2e8e5",
                      color:
                        form.icon === item.key
                          ? "#0e8a5f"
                          : "#6b7280",
                      backgroundColor:
                        form.icon === item.key
                          ? "#eef7f3"
                          : "#ffffff",
                    }}
                    disabled={saving}
                  >
                    {item.icon}
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setShowMoreIcons((previous) => !previous)
            }
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
            disabled={saving}
          >
            More Icons

            <ChevronDown
              size={13}
              style={{
                transform: showMoreIcons
                  ? "rotate(180deg)"
                  : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-medium mb-1"
            style={{
              color: "#0f1724",
              fontSize: "0.86rem",
            }}
          >
            Short Description{" "}
            <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Enter short description"
            maxLength={100}
            rows={3}
            className="form-control"
            required
            disabled={saving}
          />

          <p
            className="text-secondary text-end mb-0 mt-1"
            style={{ fontSize: "0.72rem" }}
          >
            {form.shortDescription.length}/100
          </p>
        </div>

        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Upload Category Image
        </h6>

        <label
          htmlFor="categoryImageUpload"
          className="d-flex flex-column align-items-center justify-content-center rounded-3 py-4 mb-4"
          style={{
            border: "1px solid #e2e8e5",
            cursor: saving ? "not-allowed" : "pointer",
            backgroundColor: "#f8fafb",
          }}
        >
          <CloudUploadFill
            size={26}
            color="#6b7280"
            className="mb-2"
          />

          <span
            className="fw-semibold"
            style={{
              color: "#0f1724",
              fontSize: "0.88rem",
            }}
          >
            {form.image
              ? form.image.name
              : "Click to upload image"}
          </span>

          <span
            className="text-secondary"
            style={{ fontSize: "0.75rem" }}
          >
            JPG, PNG or WEBP (Max. 2MB)
          </span>

          <input
            id="categoryImageUpload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="d-none"
            disabled={saving}
          />
        </label>

        {/* Status */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0e8a5f",
            fontSize: "0.92rem",
          }}
        >
          Status
        </h6>

        <div className="d-flex gap-4">
          <div className="form-check d-flex align-items-center gap-2">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={form.status === "Active"}
              onChange={handleChange}
              className="form-check-input mt-0"
              style={{ accentColor: "#0e8a5f" }}
              id="catStatusActive"
              disabled={saving}
            />

            <label
              htmlFor="catStatusActive"
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
              id="catStatusInactive"
              disabled={saving}
            />

            <label
              htmlFor="catStatusInactive"
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
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn flex-fill text-white rounded-3 fw-semibold py-2"
          style={{ backgroundColor: "#0e8a5f" }}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Category"}
        </button>
      </div>
    </div>
  );
};

export default AddCategoryPanel;