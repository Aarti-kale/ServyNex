import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FlagFill,
  PeopleFill,
  BuildingFill,
  AwardFill,
  RocketTakeoffFill,
  Trash3,
  Plus,
  ArrowDownUp,
  Save,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";

const COLORS = {
  primary: "#0e8a5f",
  primaryDark: "#08734e",
  primaryLight: "#e8f7f0",
  border: "#dceee6",
  text: "#172033",
  muted: "#667085",
  danger: "#dc3545",
  dangerLight: "#fff1f2",
  white: "#ffffff",
  background: "#f8fbfa",
};

const ICON_OPTIONS = [
  {
    value: "flag",
    label: "Flag",
    Icon: FlagFill,
  },
  {
    value: "users",
    label: "Users",
    Icon: PeopleFill,
  },
  {
    value: "building",
    label: "Building",
    Icon: BuildingFill,
  },
  {
    value: "badge",
    label: "Badge",
    Icon: AwardFill,
  },
  {
    value: "rocket",
    label: "Rocket",
    Icon: RocketTakeoffFill,
  },
];

const DEFAULT_MILESTONE = {
  year: new Date().getFullYear(),
  title: "",
  icon: "flag",
};

const normalizeJourney = (data) => ({
  title: data?.title || "Our Journey",
  milestones: Array.isArray(data?.milestones)
    ? data.milestones.map((milestone, index) => ({
        _id: milestone?._id,
        year:
          milestone?.year !== undefined && milestone?.year !== null
            ? String(milestone.year)
            : "",
        title: milestone?.title || "",
        icon: milestone?.icon || "flag",
      }))
    : [],
});

const AboutJourneyEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [form, setForm] = useState(() => normalizeJourney(data));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(normalizeJourney(data));
    setErrors({});
  }, [data]);

  const updateField = (field, value) => {
    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        [field]: value,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  };

  const updateMilestone = (index, field, value) => {
    setForm((previousForm) => {
      const milestones = previousForm.milestones.map(
        (milestone, milestoneIndex) =>
          milestoneIndex === index
            ? {
                ...milestone,
                [field]: value,
              }
            : milestone
      );

      const updatedForm = {
        ...previousForm,
        milestones,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [`milestone_${index}_${field}`]: "",
    }));
  };

  const handleAddMilestone = () => {
    if (saving) return;

    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        milestones: [
          ...previousForm.milestones,
          {
            ...DEFAULT_MILESTONE,
            year: new Date().getFullYear(),
          },
        ],
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const handleRemoveMilestone = (index) => {
    if (saving) return;

    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,
        milestones: previousForm.milestones.filter(
          (_, milestoneIndex) => milestoneIndex !== index
        ),
      };

      onChange?.(updatedForm);

      return updatedForm;
    });

    setErrors({});
  };

  const moveMilestone = (index, direction) => {
    if (saving) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= form.milestones.length) {
      return;
    }

    setForm((previousForm) => {
      const milestones = [...previousForm.milestones];

      [milestones[index], milestones[targetIndex]] = [
        milestones[targetIndex],
        milestones[index],
      ];

      const updatedForm = {
        ...previousForm,
        milestones,
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    const title = form.title.trim();

    if (!title) {
      validationErrors.title = "Section title is required.";
    } else if (title.length > 100) {
      validationErrors.title = "Section title cannot exceed 100 characters.";
    }

    if (!Array.isArray(form.milestones)) {
      validationErrors.milestones = "At least one milestone is required.";
    } else if (form.milestones.length === 0) {
      validationErrors.milestones = "Add at least one milestone.";
    }

    form.milestones.forEach((milestone, index) => {
      const year = String(milestone.year || "").trim();
      const milestoneTitle = String(milestone.title || "").trim();
      const icon = String(milestone.icon || "").trim();

      if (!year) {
        validationErrors[`milestone_${index}_year`] = "Year is required.";
      } else if (!/^\d{4}$/.test(year)) {
        validationErrors[`milestone_${index}_year`] =
          "Enter a valid 4-digit year.";
      }

      if (!milestoneTitle) {
        validationErrors[`milestone_${index}_title`] =
          "Milestone title is required.";
      } else if (milestoneTitle.length > 100) {
        validationErrors[`milestone_${index}_title`] =
          "Maximum 100 characters.";
      }

      if (!icon) {
        validationErrors[`milestone_${index}_icon`] = "Select an icon.";
      }
    });

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (saving) return;

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      milestones: form.milestones.map((milestone) => ({
        ...(milestone._id ? { _id: milestone._id } : {}),
        year: Number(milestone.year),
        title: milestone.title.trim(),
        icon: milestone.icon,
      })),
    };

    onSave?.(payload);
  };

  const handleReset = () => {
    if (saving) return;

    onReset?.();
  };

  const getIconComponent = (iconValue) => {
    return (
      ICON_OPTIONS.find((option) => option.value === iconValue)?.Icon ||
      FlagFill
    );
  };

  return (
    <div
      className="rounded-4 bg-white"
      style={{
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          borderBottom: `1px solid ${COLORS.border}`,
          background: COLORS.white,
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-1 fw-semibold" style={{ color: COLORS.text }}>
              Our Journey Section
            </h5>

            <span
              className="badge rounded-pill"
              style={{
                background: COLORS.primaryLight,
                color: COLORS.primary,
                fontWeight: 500,
                padding: "6px 10px",
              }}
            >
              Active
            </span>
          </div>

          <p className="mb-0 small" style={{ color: COLORS.muted }}>
            Update the journey section and milestones for this section
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-sm fw-semibold px-4"
            style={{
              background: COLORS.primary,
              color: COLORS.white,
              border: `1px solid ${COLORS.primary}`,
              borderRadius: "7px",
            }}
          >
            Content
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="journeySectionTitle"
            className="form-label fw-semibold small mb-2"
            style={{ color: COLORS.text }}
          >
            Section Title <span style={{ color: COLORS.danger }}>*</span>
          </label>

          <input
            id="journeySectionTitle"
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            maxLength={100}
            disabled={saving}
            className="form-control"
            placeholder="Our Journey"
            style={{
              borderColor: errors.title ? COLORS.danger : "#d9e2e7",
              boxShadow: "none",
              borderRadius: "7px",
              height: "44px",
            }}
          />

          <div className="d-flex justify-content-between mt-1">
            {errors.title ? (
              <small style={{ color: COLORS.danger }}>{errors.title}</small>
            ) : (
              <span />
            )}

            <small style={{ color: COLORS.muted }}>
              {form.title.length}/100
            </small>
          </div>
        </div>

        <div className="mb-2">
          <label
            className="form-label fw-semibold small mb-1"
            style={{ color: COLORS.text }}
          >
            Milestones <span style={{ color: COLORS.danger }}>*</span>
          </label>

          <p className="small mb-3" style={{ color: COLORS.muted }}>
            Add and manage the milestones displayed in your journey.
          </p>

          {errors.milestones && (
            <div className="small mb-3" style={{ color: COLORS.danger }}>
              {errors.milestones}
            </div>
          )}
        </div>

        <div className="d-flex flex-column gap-3">
          {form.milestones.map((milestone, index) => {
            const SelectedIcon = getIconComponent(milestone.icon);

            return (
              <div
                key={milestone._id || `milestone-${index}`}
                className="rounded-3 p-3"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  background: "#fbfefd",
                }}
              >
                <div className="row g-3 align-items-end">
                  <div className="col-auto">
                    <div
                      className="d-flex flex-column align-items-center gap-1"
                      style={{
                        width: "30px",
                        paddingBottom: "2px",
                      }}
                    >
                      <ArrowDownUp size={15} color={COLORS.muted} />

                      <span
                        className="small fw-semibold"
                        style={{ color: COLORS.primary }}
                      >
                        {index + 1}
                      </span>

                      <div className="d-flex gap-1 mt-1">
                        <button
                          type="button"
                          className="btn btn-sm p-0"
                          onClick={() => moveMilestone(index, "up")}
                          disabled={saving || index === 0}
                          style={{
                            width: "20px",
                            height: "20px",
                            border: `1px solid ${COLORS.border}`,
                            color: COLORS.primary,
                            background: COLORS.white,
                            fontSize: "11px",
                          }}
                          title="Move up"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm p-0"
                          onClick={() => moveMilestone(index, "down")}
                          disabled={
                            saving || index === form.milestones.length - 1
                          }
                          style={{
                            width: "20px",
                            height: "20px",
                            border: `1px solid ${COLORS.border}`,
                            color: COLORS.primary,
                            background: COLORS.white,
                            fontSize: "11px",
                          }}
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <label
                      className="form-label small fw-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Year <span style={{ color: COLORS.danger }}>*</span>
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={milestone.year}
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "");

                        updateMilestone(index, "year", value);
                      }}
                      disabled={saving}
                      className="form-control"
                      placeholder="2022"
                      style={{
                        borderColor: errors[`milestone_${index}_year`]
                          ? COLORS.danger
                          : "#d9e2e7",
                        boxShadow: "none",
                        borderRadius: "7px",
                        height: "42px",
                      }}
                    />

                    <div className="d-flex justify-content-between mt-1">
                      {errors[`milestone_${index}_year`] ? (
                        <small
                          style={{
                            color: COLORS.danger,
                          }}
                        >
                          {errors[`milestone_${index}_year`]}
                        </small>
                      ) : (
                        <span />
                      )}

                      <small
                        style={{
                          color: COLORS.muted,
                        }}
                      >
                        {milestone.year.length}/4
                      </small>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <label
                      className="form-label small fw-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Title <span style={{ color: COLORS.danger }}>*</span>
                    </label>

                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(event) =>
                        updateMilestone(index, "title", event.target.value)
                      }
                      maxLength={100}
                      disabled={saving}
                      className="form-control"
                      placeholder="ServyNex was founded"
                      style={{
                        borderColor: errors[`milestone_${index}_title`]
                          ? COLORS.danger
                          : "#d9e2e7",
                        boxShadow: "none",
                        borderRadius: "7px",
                        height: "42px",
                      }}
                    />

                    <div className="d-flex justify-content-between mt-1">
                      {errors[`milestone_${index}_title`] ? (
                        <small
                          style={{
                            color: COLORS.danger,
                          }}
                        >
                          {errors[`milestone_${index}_title`]}
                        </small>
                      ) : (
                        <span />
                      )}

                      <small
                        style={{
                          color: COLORS.muted,
                        }}
                      >
                        {milestone.title.length}/100
                      </small>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label
                      className="form-label small fw-semibold mb-2"
                      style={{ color: COLORS.text }}
                    >
                      Icon <span style={{ color: COLORS.danger }}>*</span>
                    </label>

                    <div className="position-relative">
                      <div
                        className="position-absolute d-flex align-items-center justify-content-center"
                        style={{
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: COLORS.primaryLight,
                          color: COLORS.primary,
                          pointerEvents: "none",
                          zIndex: 2,
                        }}
                      >
                        <SelectedIcon size={15} />
                      </div>

                      <select
                        value={milestone.icon}
                        onChange={(event) =>
                          updateMilestone(index, "icon", event.target.value)
                        }
                        disabled={saving}
                        className="form-select"
                        style={{
                          height: "42px",
                          paddingLeft: "48px",
                          borderColor: errors[`milestone_${index}_icon`]
                            ? COLORS.danger
                            : "#d9e2e7",
                          boxShadow: "none",
                          borderRadius: "7px",
                          color: COLORS.text,
                        }}
                      >
                        {ICON_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errors[`milestone_${index}_icon`] && (
                      <small
                        style={{
                          color: COLORS.danger,
                        }}
                      >
                        {errors[`milestone_${index}_icon`]}
                      </small>
                    )}
                  </div>

                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn d-flex align-items-center justify-content-center"
                      onClick={() => handleRemoveMilestone(index)}
                      disabled={saving || form.milestones.length <= 1}
                      title={
                        form.milestones.length <= 1
                          ? "At least one milestone is required"
                          : "Delete milestone"
                      }
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "7px",
                        border: `1px solid ${
                          form.milestones.length <= 1 ? "#e5e7eb" : "#fecdd3"
                        }`,
                        background:
                          form.milestones.length <= 1
                            ? "#f9fafb"
                            : COLORS.dangerLight,
                        color:
                          form.milestones.length <= 1
                            ? "#adb5bd"
                            : COLORS.danger,
                      }}
                    >
                      <Trash3 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAddMilestone}
          disabled={saving}
          className="btn w-100 mt-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
          style={{
            minHeight: "42px",
            color: COLORS.primary,
            background: COLORS.white,
            border: `1px dashed ${COLORS.primary}`,
            borderRadius: "7px",
          }}
        >
          <Plus size={17} />
          Add Milestone
        </button>
      </div>

      <div
        className="d-flex justify-content-end align-items-center gap-2 px-4 py-3"
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          background: "#fbfdfc",
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="btn d-flex align-items-center gap-2 px-4"
          style={{
            minHeight: "42px",
            border: "1px solid #d6e2dd",
            background: COLORS.white,
            color: COLORS.text,
            borderRadius: "7px",
            fontWeight: 500,
          }}
        >
          <ArrowCounterclockwise size={16} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn d-flex align-items-center gap-2 px-4"
          style={{
            minHeight: "42px",
            border: `1px solid ${COLORS.primary}`,
            background: COLORS.primary,
            color: COLORS.white,
            borderRadius: "7px",
            fontWeight: 600,
            minWidth: "145px",
          }}
        >
          <Save size={16} />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AboutJourneyEdit;
