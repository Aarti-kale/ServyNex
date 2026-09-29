import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ShieldFillCheck,
  ClockFill,
  TagFill,
  HeadsetVr,
  ArrowUp,
  ArrowDown,
  TrashFill,
  PlusLg,
} from "react-bootstrap-icons";

const iconMap = {
  shield: <ShieldFillCheck size={20} color="#0e8a5f" />,
  clock: <ClockFill size={20} color="#0e8a5f" />,
  tag: <TagFill size={20} color="#0e8a5f" />,
  headset: <HeadsetVr size={20} color="#0e8a5f" />,
};

const initialFeatures = [
  {
    icon: "shield",
    title: "Trusted & Verified Professionals",
    description:
      "All our professionals are background checked and verified for your safety and peace of mind.",
  },
  {
    icon: "clock",
    title: "On-Time Service",
    description:
      "We value your time and ensure our professionals arrive as scheduled.",
  },
  {
    icon: "tag",
    title: "Transparent Pricing",
    description:
      "No hidden charges. Get clear and upfront pricing before you book.",
  },
  {
    icon: "headset",
    title: "24/7 Customer Support",
    description:
      "Our support team is always here to help you, whenever you need us.",
  },
];

const TITLE_LIMIT = 50;
const DESC_LIMIT = 200;

const WhyChooseEdit = ({ onChange, onReset, onSave }) => {
  const [sectionTitle, setSectionTitle] = useState("Why Choose ServyNex");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "We are committed to providing the best experience"
  );
  const [features, setFeatures] = useState(initialFeatures);

  const emitChange = (title, subtitle, featuresList) => {
    onChange && onChange({ title, subtitle, features: featuresList });
  };

  const handleTitleChange = (e) => {
    setSectionTitle(e.target.value);
    emitChange(e.target.value, sectionSubtitle, features);
  };

  const handleSubtitleChange = (e) => {
    setSectionSubtitle(e.target.value);
    emitChange(sectionTitle, e.target.value, features);
  };

  const handleFeatureFieldChange = (index, field, value) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setFeatures(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= features.length) return;
    const updated = [...features];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFeatures(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleDelete = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleAddFeature = () => {
    const updated = [
      ...features,
      {
        icon: "shield",
        title: "New Feature",
        description: "Feature description",
      },
    ];
    setFeatures(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  return (
    <div
      className="rounded-4 bg-white p-4"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex align-items-center gap-2 mb-1">
        <ShieldFillCheck size={18} color="#0e8a5f" />
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Why Choose Us Section
        </h6>
      </div>
      <p className="text-secondary mb-4" style={{ fontSize: "0.82rem" }}>
        Manage the title, subtitle and features for the Why Choose Us section.
      </p>

      <div className="mb-3">
        <label
          className="form-label fw-medium mb-1"
          style={{ color: "#0f1724", fontSize: "0.88rem" }}
        >
          Section Title <span style={{ color: "#dc3545" }}>*</span>
        </label>
        <input
          value={sectionTitle}
          onChange={handleTitleChange}
          maxLength={100}
          className="form-control py-2"
        />
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{ fontSize: "0.72rem" }}
        >
          {sectionTitle.length}/100
        </p>
      </div>

      <div className="mb-4">
        <label
          className="form-label fw-medium mb-1"
          style={{ color: "#0f1724", fontSize: "0.88rem" }}
        >
          Section Subtitle <span style={{ color: "#dc3545" }}>*</span>
        </label>
        <textarea
          value={sectionSubtitle}
          onChange={handleSubtitleChange}
          maxLength={200}
          rows={2}
          className="form-control"
        />
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{ fontSize: "0.72rem" }}
        >
          {sectionSubtitle.length}/200
        </p>
      </div>

      <h6
        className="fw-bold mb-1"
        style={{ color: "#0f1724", fontSize: "0.92rem" }}
      >
        Features
      </h6>
      <p className="text-secondary mb-3" style={{ fontSize: "0.8rem" }}>
        Add, edit or remove features. Each feature includes an icon, title and
        description.
      </p>

      <div className="d-flex flex-column gap-3 mb-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="rounded-3 p-3"
            style={{ border: "1px solid #eef0f2" }}
          >
            <div className="d-flex align-items-start gap-3">
              <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                  style={{
                    width: "26px",
                    height: "26px",
                    backgroundColor: "#0e8a5f",
                    fontSize: "0.78rem",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {iconMap[feature.icon]}
                </span>
              </div>

              <div className="flex-grow-1">
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      className="form-label mb-0"
                      style={{ color: "#0f1724", fontSize: "0.84rem" }}
                    >
                      Title <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <span
                      className="text-secondary"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {feature.title.length}/{TITLE_LIMIT}
                    </span>
                  </div>
                  <input
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureFieldChange(i, "title", e.target.value)
                    }
                    maxLength={TITLE_LIMIT}
                    className="form-control py-2"
                  />
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      className="form-label mb-0"
                      style={{ color: "#0f1724", fontSize: "0.84rem" }}
                    >
                      Description <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <span
                      className="text-secondary"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {feature.description.length}/{DESC_LIMIT}
                    </span>
                  </div>
                  <textarea
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureFieldChange(i, "description", e.target.value)
                    }
                    maxLength={DESC_LIMIT}
                    rows={2}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-2 flex-shrink-0">
                <button
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0}
                  className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #d9dee3",
                    opacity: i === 0 ? 0.4 : 1,
                  }}
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  onClick={() => handleMove(i, 1)}
                  disabled={i === features.length - 1}
                  className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #d9dee3",
                    opacity: i === features.length - 1 ? 0.4 : 1,
                  }}
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #fdecec",
                    color: "#dc3545",
                  }}
                >
                  <TrashFill size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddFeature}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium mb-4"
        style={{ border: "1.5px dashed #0e8a5f", color: "#0e8a5f" }}
      >
        <PlusLg size={14} /> Add New Feature
      </button>

      <div className="d-flex justify-content-end gap-2">
        <button
          onClick={onReset}
          className="btn px-4 py-2 rounded-3 fw-medium"
          style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
        >
          Reset
        </button>
        <button
          onClick={() =>
            onSave &&
            onSave({ title: sectionTitle, subtitle: sectionSubtitle, features })
          }
          className="btn text-white px-4 py-2 rounded-3 fw-semibold"
          style={{ backgroundColor: "#0e8a5f" }}
        >
          Save Section
        </button>
      </div>
    </div>
  );
};

export default WhyChooseEdit;
