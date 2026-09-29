import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ShieldFill,
  AwardFill,
  PersonFill,
  CheckCircleFill,
  Plus,
  Trash3Fill,
  SaveFill,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";

const ICON_MAP = {
  shield: ShieldFill,
  badge: AwardFill,
  user: PersonFill,
  scale: CheckCircleFill,
};

const getIconComponent = (iconName) => {
  return ICON_MAP[String(iconName || "").toLowerCase()] || CheckCircleFill;
};

const normalizeData = (data) => ({
  title: data?.title || "Our Core Values",
  values: Array.isArray(data?.values)
    ? data.values.map((item) => ({
        title: item?.title || "",
        description: item?.description || "",
        icon: item?.icon || "shield",
      }))
    : [],
});

const AboutCoreValuesEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [form, setForm] = useState(() => normalizeData(data));

  useEffect(() => {
    setForm(normalizeData(data));
  }, [data]);

  const handleFieldChange = (field, value) => {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleValueChange = (index, field, value) => {
    const updatedValues = form.values.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    const updatedForm = {
      ...form,
      values: updatedValues,
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleAddValue = () => {
    const updatedForm = {
      ...form,
      values: [
        ...form.values,
        {
          title: "",
          description: "",
          icon: "shield",
        },
      ],
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleRemoveValue = (index) => {
    const updatedForm = {
      ...form,
      values: form.values.filter((_, itemIndex) => itemIndex !== index),
    };

    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return;
    }

    const validValues = form.values.filter(
      (item) => item.title.trim() && item.description.trim() && item.icon
    );

    if (!validValues.length) {
      return;
    }

    onSave?.({
      ...form,
      title: form.title.trim(),
      values: validValues.map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        icon: item.icon,
      })),
    });
  };

  const renderIcon = (iconName, size = 20) => {
    const IconComponent = getIconComponent(iconName);

    return <IconComponent size={size} />;
  };

  return (
    <div
      className="bg-white rounded-4"
      style={{
        border: "1px solid #e8eaf0",
        overflow: "hidden",
      }}
    >
      <div
        className="px-4 py-3 d-flex justify-content-between align-items-center"
        style={{
          borderBottom: "1px solid #e8eaf0",
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-semibold" style={{ color: "#172554" }}>
              Core Values Section
            </h5>

            <span
              className="px-2 py-1 rounded-pill"
              style={{
                background: "#e6f7ef",
                color: "#16845b",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Active
            </span>
          </div>

          <p
            className="mb-0 mt-1"
            style={{
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Update the core values section and values for this section
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Content Tab */}
        <div className="mb-4">
          <button
            type="button"
            className="border-0 rounded-2 px-4 py-2 text-white fw-semibold"
            style={{
              background: "#16845b",
            }}
          >
            Content
          </button>
        </div>

        <div className="mb-4">
          <label
            className="form-label fw-semibold"
            style={{ color: "#172554" }}
          >
            Section Title <span style={{ color: "#dc2626" }}>*</span>
          </label>

          <input
            type="text"
            className="form-control"
            value={form.title}
            maxLength={100}
            disabled={saving}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            style={{
              borderColor: "#dce3ea",
              boxShadow: "none",
            }}
          />

          <div className="text-end mt-1">
            <small style={{ color: "#64748b" }}>{form.title.length}/100</small>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <label
                className="form-label fw-semibold mb-0"
                style={{ color: "#172554" }}
              >
                Values <span style={{ color: "#dc2626" }}>*</span>
              </label>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Add and manage your core values
              </div>
            </div>
          </div>

          {form.values.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              className="p-3 mb-3 rounded-3"
              style={{
                border: "1px solid #e2e8f0",
                background: "#ffffff",
              }}
            >
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    style={{
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    Icon
                  </label>

                  <select
                    className="form-select"
                    value={item.icon}
                    disabled={saving}
                    onChange={(e) =>
                      handleValueChange(index, "icon", e.target.value)
                    }
                    style={{
                      borderColor: "#dce3ea",
                      boxShadow: "none",
                    }}
                  >
                    <option value="shield">Shield</option>
                    <option value="badge">Badge</option>
                    <option value="scale">Scale</option>
                    <option value="user">User</option>
                  </select>

                  <div
                    className="mt-2 d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#edf9f4",
                      color: "#16845b",
                    }}
                  >
                    {renderIcon(item.icon)}
                  </div>
                </div>

                {/* Title */}
                <div className="col-md-3">
                  <label
                    className="form-label fw-semibold"
                    style={{
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    Title <span style={{ color: "#dc2626" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={item.title}
                    maxLength={50}
                    disabled={saving}
                    onChange={(e) =>
                      handleValueChange(index, "title", e.target.value)
                    }
                    style={{
                      borderColor: "#dce3ea",
                      boxShadow: "none",
                    }}
                  />

                  <div className="text-end mt-1">
                    <small style={{ color: "#64748b" }}>
                      {item.title.length}/50
                    </small>
                  </div>
                </div>

                <div className="col-md-5">
                  <label
                    className="form-label fw-semibold"
                    style={{
                      fontSize: "13px",
                      color: "#334155",
                    }}
                  >
                    Description <span style={{ color: "#dc2626" }}>*</span>
                  </label>

                  <textarea
                    className="form-control"
                    rows={3}
                    value={item.description}
                    maxLength={500}
                    disabled={saving}
                    onChange={(e) =>
                      handleValueChange(index, "description", e.target.value)
                    }
                    style={{
                      borderColor: "#dce3ea",
                      boxShadow: "none",
                      resize: "vertical",
                    }}
                  />

                  <div className="text-end mt-1">
                    <small style={{ color: "#64748b" }}>
                      {item.description.length}/500
                    </small>
                  </div>
                </div>

                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn"
                    title="Remove value"
                    disabled={saving}
                    onClick={() => handleRemoveValue(index)}
                    style={{
                      width: "38px",
                      height: "38px",
                      background: "#fff1f2",
                      color: "#dc2626",
                      border: "1px solid #fecdd3",
                    }}
                  >
                    <Trash3Fill size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={saving}
            onClick={handleAddValue}
            className="w-100 btn d-flex justify-content-center align-items-center gap-2"
            style={{
              border: "1px dashed #16845b",
              color: "#16845b",
              background: "#f4fbf7",
            }}
          >
            <Plus size={18} />
            Add Value
          </button>
        </div>
      </div>

      <div
        className="px-4 py-3 d-flex justify-content-end gap-2"
        style={{
          borderTop: "1px solid #e8eaf0",
          background: "#fafdfb",
        }}
      >
        <button
          type="button"
          disabled={saving}
          onClick={onReset}
          className="btn px-4"
          style={{
            border: "1px solid #d7dee7",
            background: "#ffffff",
            color: "#334155",
          }}
        >
          <ArrowCounterclockwise size={16} className="me-2" />
          Reset
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="btn px-4 text-white"
          style={{
            background: "#16845b",
            borderColor: "#16845b",
          }}
        >
          <SaveFill size={16} className="me-2" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AboutCoreValuesEdit;
