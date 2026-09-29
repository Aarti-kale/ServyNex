import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  Bullseye,
  EyeFill,
  HeartFill,
  StarFill,
  ShieldFill,
  CheckCircleFill,
  ArrowClockwise,
  FloppyFill,
  ChevronDown,
} from "react-bootstrap-icons";

const ICON_OPTIONS = {
  target: Bullseye,
  eye: EyeFill,
  heart: HeartFill,
  star: StarFill,
  shield: ShieldFill,
  check: CheckCircleFill,
};

const DEFAULT_DATA = {
  title: "Mission & Vision",

  mission: {
    title: "Our Mission",
    description:
      "To deliver reliable, safe and high-quality home services through verified professionals and technology.",
    icon: "target",
  },

  vision: {
    title: "Our Vision",
    description:
      "To become India's most trusted and preferred platform for all home service needs.",
    icon: "eye",
  },
};

const normalizeData = (data) => ({
  title: data?.title || DEFAULT_DATA.title,

  mission: {
    title: data?.mission?.title || DEFAULT_DATA.mission.title,

    description: data?.mission?.description || DEFAULT_DATA.mission.description,

    icon: data?.mission?.icon || DEFAULT_DATA.mission.icon,
  },

  vision: {
    title: data?.vision?.title || DEFAULT_DATA.vision.title,

    description: data?.vision?.description || DEFAULT_DATA.vision.description,

    icon: data?.vision?.icon || DEFAULT_DATA.vision.icon,
  },
});

const renderIcon = (iconName, size = 28) => {
  const IconComponent = ICON_OPTIONS[iconName] || Bullseye;

  return <IconComponent size={size} strokeWidth={2} />;
};

const AboutMissionVisionEdit = ({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [activeTab, setActiveTab] = useState("mission");

  const [form, setForm] = useState(() => normalizeData(data));

  useEffect(() => {
    setForm(normalizeData(data));
  }, [data]);

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

  const updateMission = (updates) => {
    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,

        mission: {
          ...previousForm.mission,
          ...updates,
        },
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const updateVision = (updates) => {
    setForm((previousForm) => {
      const updatedForm = {
        ...previousForm,

        vision: {
          ...previousForm.vision,
          ...updates,
        },
      };

      onChange?.(updatedForm);

      return updatedForm;
    });
  };

  const handleSave = () => {
    const normalizedData = normalizeData(form);

    onSave?.(normalizedData);
  };
  const currentData = activeTab === "mission" ? form.mission : form.vision;

  const currentIcon =
    currentData?.icon || (activeTab === "mission" ? "target" : "eye");

  return (
    <div
      className="rounded-4 bg-white overflow-hidden"
      style={{
        border: "1px solid #e5ece8",
        boxShadow: "0 4px 18px rgba(20, 60, 40, 0.05)",
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid #e5ece8",
        }}
      >
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5
                className="mb-0 fw-semibold"
                style={{
                  color: "#14213d",
                }}
              >
                Mission & Vision Section
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

            <p
              className="mb-0 mt-1 small"
              style={{
                color: "#718096",
              }}
            >
              Update the mission and vision content for this section
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm d-flex align-items-center gap-2"
            style={{
              border: "1px solid #dce6e0",
              color: "#26364a",
              background: "#ffffff",
              borderRadius: "8px",
              minHeight: "38px",
            }}
          >
            Collapse
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label
            htmlFor="missionVisionSectionTitle"
            className="form-label fw-semibold small mb-2"
            style={{
              color: "#26364a",
            }}
          >
            Section Title
          </label>

          <input
            id="missionVisionSectionTitle"
            type="text"
            className="form-control"
            value={form.title}
            maxLength={150}
            disabled={saving}
            onChange={(event) =>
              updateForm({
                title: event.target.value,
              })
            }
            placeholder="Enter section title"
            style={{
              minHeight: "46px",
              borderColor: "#dce7df",
              borderRadius: "10px",
              boxShadow: "none",
            }}
          />

          <div className="text-end mt-1">
            <small className="text-secondary">{form.title.length}/150</small>
          </div>
        </div>

        <div
          className="d-flex gap-2 mb-4"
          style={{
            borderBottom: "1px solid #e5ece8",
            paddingBottom: "12px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("mission")}
            disabled={saving}
            className="btn px-4"
            style={{
              background: activeTab === "mission" ? "#168653" : "#ffffff",
              color: activeTab === "mission" ? "#ffffff" : "#536274",
              border:
                activeTab === "mission"
                  ? "1px solid #168653"
                  : "1px solid #dce6e0",
              borderRadius: "8px",
              minHeight: "40px",
              fontWeight: 500,
            }}
          >
            Mission
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vision")}
            disabled={saving}
            className="btn px-4"
            style={{
              background: activeTab === "vision" ? "#168653" : "#ffffff",
              color: activeTab === "vision" ? "#ffffff" : "#536274",
              border:
                activeTab === "vision"
                  ? "1px solid #168653"
                  : "1px solid #dce6e0",
              borderRadius: "8px",
              minHeight: "40px",
              fontWeight: 500,
            }}
          >
            Vision
          </button>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <label
              htmlFor="missionVisionItemTitle"
              className="form-label fw-semibold small mb-2"
              style={{
                color: "#26364a",
              }}
            >
              Title
              <span
                className="ms-1"
                style={{
                  color: "#dc3545",
                }}
              >
                *
              </span>
            </label>

            <input
              id="missionVisionItemTitle"
              type="text"
              className="form-control"
              value={currentData.title}
              maxLength={100}
              disabled={saving}
              onChange={(event) => {
                if (activeTab === "mission") {
                  updateMission({
                    title: event.target.value,
                  });
                } else {
                  updateVision({
                    title: event.target.value,
                  });
                }
              }}
              placeholder={
                activeTab === "mission" ? "Our Mission" : "Our Vision"
              }
              style={{
                minHeight: "46px",
                borderColor: "#dce7df",
                borderRadius: "10px",
                boxShadow: "none",
              }}
            />

            <div className="text-end mt-1">
              <small className="text-secondary">
                {currentData.title.length}/100
              </small>
            </div>
          </div>

          <div className="col-12">
            <label
              htmlFor="missionVisionDescription"
              className="form-label fw-semibold small mb-2"
              style={{
                color: "#26364a",
              }}
            >
              Description
              <span
                className="ms-1"
                style={{
                  color: "#dc3545",
                }}
              >
                *
              </span>
            </label>

            <textarea
              id="missionVisionDescription"
              className="form-control"
              rows={8}
              value={currentData.description}
              maxLength={1000}
              disabled={saving}
              onChange={(event) => {
                if (activeTab === "mission") {
                  updateMission({
                    description: event.target.value,
                  });
                } else {
                  updateVision({
                    description: event.target.value,
                  });
                }
              }}
              placeholder={
                activeTab === "mission"
                  ? "Enter your mission description..."
                  : "Enter your vision description..."
              }
              style={{
                borderColor: "#dce7df",
                borderRadius: "10px",
                resize: "vertical",
                boxShadow: "none",
              }}
            />

            <div className="text-end mt-1">
              <small className="text-secondary">
                {currentData.description.length}
                /1000
              </small>
            </div>
          </div>

          <div className="col-12">
            <label
              className="form-label fw-semibold small mb-2"
              style={{
                color: "#26364a",
              }}
            >
              Icon
            </label>

            <div className="row g-3 align-items-center">
              {/* Icon preview */}
              <div className="col-auto">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "76px",
                    height: "76px",
                    background: "#e8f7ef",
                    color: "#168653",
                    border: "1px solid #d5ebdf",
                  }}
                >
                  {renderIcon(currentIcon, 32)}
                </div>
              </div>

              <div className="col">
                <select
                  className="form-select"
                  value={currentIcon}
                  disabled={saving}
                  onChange={(event) => {
                    const icon = event.target.value;

                    if (activeTab === "mission") {
                      updateMission({
                        icon,
                      });
                    } else {
                      updateVision({
                        icon,
                      });
                    }
                  }}
                  style={{
                    minHeight: "46px",
                    borderColor: "#dce7df",
                    borderRadius: "10px",
                    boxShadow: "none",
                  }}
                >
                  <option value="target">Target</option>

                  <option value="eye">Eye</option>

                  <option value="heart">Heart</option>

                  <option value="star">Star</option>

                  <option value="shield">Shield</option>

                  <option value="check">Check</option>
                </select>

                <small
                  className="d-block mt-2"
                  style={{
                    color: "#718096",
                  }}
                >
                  Choose a suitable icon for this section.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-3 d-flex justify-content-end gap-2"
        style={{
          borderTop: "1px solid #e5ece8",
          background: "#ffffff",
        }}
      >
        <button
          type="button"
          className="btn px-4 d-flex align-items-center justify-content-center"
          onClick={onReset}
          disabled={saving}
          style={{
            minHeight: "42px",
            minWidth: "125px",
            background: "#ffffff",
            color: "#26364a",
            border: "1px solid #d7e1db",
            borderRadius: "9px",
            fontWeight: 500,
          }}
        >
          <ArrowClockwise size={15} className="me-2" />
          Reset
        </button>

        <button
          type="button"
          className="btn px-4 d-flex align-items-center justify-content-center"
          onClick={handleSave}
          disabled={saving}
          style={{
            minHeight: "42px",
            minWidth: "145px",
            background: "#168653",
            color: "#ffffff",
            border: "1px solid #168653",
            borderRadius: "9px",
            fontWeight: 500,
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
              <FloppyFill size={15} className="me-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AboutMissionVisionEdit;
