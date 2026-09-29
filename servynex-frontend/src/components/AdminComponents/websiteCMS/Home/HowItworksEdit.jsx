import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  GearFill,
  Search,
  CalendarEventFill,
  PersonFill,
  CheckCircleFill,
  ArrowUp,
  ArrowDown,
  TrashFill,
  PlusLg,
} from "react-bootstrap-icons";

const iconMap = {
  search: <Search size={20} color="#0e8a5f" />,
  calendar: <CalendarEventFill size={20} color="#0e8a5f" />,
  person: <PersonFill size={20} color="#0e8a5f" />,
  check: <CheckCircleFill size={20} color="#0e8a5f" />,
};

const initialSteps = [
  {
    icon: "search",
    title: "Search Service",
    description:
      "Browse through our wide range of services and choose what you need.",
  },
  {
    icon: "calendar",
    title: "Book & Schedule",
    description:
      "Select your preferred date and time slot, and confirm your booking.",
  },
  {
    icon: "person",
    title: "Get Professional",
    description:
      "Our verified professionals will arrive at your location and get the job done.",
  },
  {
    icon: "check",
    title: "Enjoy Your Service",
    description: "Relax and enjoy a hassle-free service experience.",
  },
];

const HowItworksEditor = ({ onChange }) => {
  const [sectionTitle, setSectionTitle] = useState("How ServyNex Works");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "Simple steps to get your service done"
  );
  const [steps, setSteps] = useState(initialSteps);

  const emitChange = (title, subtitle, stepsList) => {
    onChange && onChange({ title, subtitle, steps: stepsList });
  };

  const handleTitleChange = (e) => {
    setSectionTitle(e.target.value);
    emitChange(e.target.value, sectionSubtitle, steps);
  };

  const handleSubtitleChange = (e) => {
    setSectionSubtitle(e.target.value);
    emitChange(sectionTitle, e.target.value, steps);
  };

  const handleStepFieldChange = (index, field, value) => {
    const updated = steps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSteps(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const updated = [...steps];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSteps(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleDelete = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  const handleAddStep = () => {
    const updated = [
      ...steps,
      { icon: "check", title: "New Step", description: "Step description" },
    ];
    setSteps(updated);
    emitChange(sectionTitle, sectionSubtitle, updated);
  };

  return (
    <div
      className="rounded-4 bg-white p-4"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex align-items-center gap-2 mb-1">
        <GearFill size={18} color="#0e8a5f" />
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          How It Works Section
        </h6>
      </div>
      <p className="text-secondary mb-4" style={{ fontSize: "0.82rem" }}>
        Manage the title, subtitle and steps for the How It Works section.
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
          maxLength={100}
          rows={2}
          className="form-control"
        />
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{ fontSize: "0.72rem" }}
        >
          {sectionSubtitle.length}/100
        </p>
      </div>

      <h6
        className="fw-bold mb-1"
        style={{ color: "#0f1724", fontSize: "0.92rem" }}
      >
        Steps
      </h6>
      <p className="text-secondary mb-3" style={{ fontSize: "0.8rem" }}>
        Add, edit or remove steps. Each step includes an icon, title and
        description.
      </p>

      <div className="d-flex flex-column gap-3 mb-3">
        {steps.map((step, i) => (
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
                  {iconMap[step.icon]}
                </span>
              </div>

              <div className="flex-grow-1">
                <div className="mb-2">
                  <label
                    className="form-label mb-1"
                    style={{ color: "#0f1724", fontSize: "0.84rem" }}
                  >
                    Title <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    value={step.title}
                    onChange={(e) =>
                      handleStepFieldChange(i, "title", e.target.value)
                    }
                    className="form-control py-2"
                  />
                </div>
                <div>
                  <label
                    className="form-label mb-1"
                    style={{ color: "#0f1724", fontSize: "0.84rem" }}
                  >
                    Description <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      handleStepFieldChange(i, "description", e.target.value)
                    }
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
                  disabled={i === steps.length - 1}
                  className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #d9dee3",
                    opacity: i === steps.length - 1 ? 0.4 : 1,
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
        onClick={handleAddStep}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium"
        style={{ border: "1.5px dashed #0e8a5f", color: "#0e8a5f" }}
      >
        <PlusLg size={14} /> Add New Step
      </button>
    </div>
  );
};

export default HowItworksEditor;
