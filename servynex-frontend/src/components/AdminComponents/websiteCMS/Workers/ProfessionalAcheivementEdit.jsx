import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  InfoCircle,
  PlusLg,
  Save,
  StarFill,
  Trash3,
} from "react-bootstrap-icons";

const createEmptyStatistic = () => {
  return {
    icon: "professionals",
    value: "",
    label: "",
  };
};

const normalizeAchievementsData = (data) => {
  return {
    title: data?.title || "",
    description: data?.description || "",
    statistics: Array.isArray(data?.statistics)
      ? data.statistics.map((statistic) => ({
          icon: statistic?.icon || "professionals",
          value: statistic?.value || "",
          label: statistic?.label || "",
        }))
      : [],
  };
};

function ProfessionalAchievementEdit({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) {
  const [form, setForm] = useState(() => normalizeAchievementsData(data));

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(normalizeAchievementsData(data));
    setValidationError("");
  }, [data]);

  const updateForm = (updatedForm) => {
    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleFieldChange = (fieldName, value) => {
    updateForm({
      ...form,
      [fieldName]: value,
    });
  };

  const handleStatisticChange = (statisticIndex, fieldName, value) => {
    const updatedStatistics = form.statistics.map((statistic, index) => {
      if (index !== statisticIndex) {
        return statistic;
      }

      return {
        ...statistic,
        [fieldName]: value,
      };
    });

    updateForm({
      ...form,
      statistics: updatedStatistics,
    });
  };

  const handleAddStatistic = () => {
    if (saving) {
      return;
    }

    updateForm({
      ...form,
      statistics: [...form.statistics, createEmptyStatistic()],
    });
  };

  const handleRemoveStatistic = (statisticIndex) => {
    if (saving) {
      return;
    }

    updateForm({
      ...form,
      statistics: form.statistics.filter(
        (_, index) => index !== statisticIndex
      ),
    });
  };

  const handleMoveStatistic = (statisticIndex, direction) => {
    if (saving) {
      return;
    }

    const targetIndex =
      direction === "up" ? statisticIndex - 1 : statisticIndex + 1;

    if (targetIndex < 0 || targetIndex >= form.statistics.length) {
      return;
    }

    const updatedStatistics = [...form.statistics];

    [updatedStatistics[statisticIndex], updatedStatistics[targetIndex]] = [
      updatedStatistics[targetIndex],
      updatedStatistics[statisticIndex],
    ];

    updateForm({
      ...form,
      statistics: updatedStatistics,
    });
  };

  const handleSave = () => {
    const cleanedStatistics = form.statistics
      .map((statistic) => ({
        icon: statistic.icon || "professionals",
        value: statistic.value.trim(),
        label: statistic.label.trim(),
      }))
      .filter((statistic) => statistic.value && statistic.label);

    if (!form.title.trim()) {
      setValidationError("Section title is required.");
      return;
    }

    if (!form.description.trim()) {
      setValidationError("Section description is required.");
      return;
    }

    if (!cleanedStatistics.length) {
      setValidationError("Add at least one complete statistic.");
      return;
    }

    setValidationError("");

    onSave?.({
      title: form.title.trim(),
      description: form.description.trim(),
      statistics: cleanedStatistics,
    });
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
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold text-dark mb-0">
                Professional Achievements Section
              </h5>

              <span className="badge rounded-pill text-bg-success">Active</span>
            </div>

            <p className="text-secondary small mb-0 mt-1">
              Update the statistics section content and settings
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
            htmlFor="professionalAchievementsTitle"
            className="form-label fw-semibold small"
          >
            Section Title
          </label>

          <div className="position-relative">
            <input
              id="professionalAchievementsTitle"
              type="text"
              className="form-control pe-5"
              value={form.title}
              maxLength={100}
              disabled={saving}
              onChange={(event) =>
                handleFieldChange("title", event.target.value)
              }
            />

            <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary small">
              {form.title.length}/100
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="professionalAchievementsDescription"
            className="form-label fw-semibold small"
          >
            Section Description
          </label>

          <textarea
            id="professionalAchievementsDescription"
            className="form-control"
            rows="4"
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

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold text-dark mb-0">Statistics</h6>

          <span className="badge text-bg-success">
            {form.statistics.length} Items
          </span>
        </div>

        <div className="d-flex flex-column gap-3">
          {form.statistics.map((statistic, index) => (
            <div
              className="border rounded-3 p-3 bg-white"
              key={`${statistic.label}-${index}`}
            >
              <div className="d-flex align-items-start gap-3">
                <div className="d-flex flex-column gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0"
                    disabled={saving || index === 0}
                    onClick={() => handleMoveStatistic(index, "up")}
                    aria-label={`Move statistic ${index + 1} up`}
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0"
                    disabled={saving || index === form.statistics.length - 1}
                    onClick={() => handleMoveStatistic(index, "down")}
                    aria-label={`Move statistic ${index + 1} down`}
                  >
                    ↓
                  </button>
                </div>

                <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center p-3">
                  <StarFill size={20} />
                </div>

                <div className="flex-grow-1">
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label
                        htmlFor={`achievementIcon-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Icon
                      </label>

                      <select
                        id={`achievementIcon-${index}`}
                        className="form-select"
                        value={statistic.icon}
                        disabled={saving}
                        onChange={(event) =>
                          handleStatisticChange(
                            index,
                            "icon",
                            event.target.value
                          )
                        }
                      >
                        <option value="professionals">Professionals</option>

                        <option value="jobs">Jobs Completed</option>

                        <option value="rating">Average Rating</option>

                        <option value="satisfaction">
                          Customer Satisfaction
                        </option>

                        <option value="experience">Years of Experience</option>

                        <option value="services">Services Completed</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label
                        htmlFor={`achievementValue-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Value
                      </label>

                      <input
                        id={`achievementValue-${index}`}
                        type="text"
                        className="form-control"
                        placeholder="50+"
                        value={statistic.value}
                        maxLength={30}
                        disabled={saving}
                        onChange={(event) =>
                          handleStatisticChange(
                            index,
                            "value",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label
                        htmlFor={`achievementLabel-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Label
                      </label>

                      <input
                        id={`achievementLabel-${index}`}
                        type="text"
                        className="form-control"
                        placeholder="Verified Professionals"
                        value={statistic.label}
                        maxLength={100}
                        disabled={saving}
                        onChange={(event) =>
                          handleStatisticChange(
                            index,
                            "label",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  disabled={saving}
                  onClick={() => handleRemoveStatistic(index)}
                  aria-label={`Remove statistic ${index + 1}`}
                >
                  <Trash3 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-outline-success w-100 mt-3 d-inline-flex align-items-center justify-content-center gap-2"
          disabled={saving}
          onClick={handleAddStatistic}
        >
          <PlusLg size={15} />
          Add New Statistic
        </button>

        <div
          className="alert alert-success-subtle text-success-emphasis small d-flex align-items-start gap-2 mt-3 mb-0"
          role="note"
        >
          <InfoCircle size={17} className="mt-1" />

          <span>
            You can add, remove, or reorder statistics. They will appear in this
            same order on the Professionals page.
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

export default ProfessionalAchievementEdit;
