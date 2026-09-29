import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  StarFill,
  GripVertical,
  TrashFill,
  PlusLg,
  InfoCircleFill,
  PersonFill,
  CheckCircleFill,
  AwardFill,
} from "react-bootstrap-icons";
const iconOptions = [
  {
    value: "identity_verified",
    label: "identity verified",
    render: <PersonFill size={20} color="#0e8a5f" />,
  },
  {
    value: "background_checked",
    label: "background checked",
    render: <CheckCircleFill size={20} color="#0e8a5f" />,
  },
  {
    value: "skill_certified",
    label: "skill certified",
    render: <AwardFill size={20} color="#0e8a5f" />,
  },
  {
    value: "customer_rated",
    label: "customer rated",
    render: <StarFill size={20} color="#0e8a5f" />,
  },
];

const getIconRender = (value) =>
  iconOptions.find((o) => o.value === value)?.render || (
    <StarFill size={20} color="#0e8a5f" />
  );

const initialStandards = [
  {
    icon: "identity_verified",
    title: "Identity Verified",
    description: "We verify government-issued ID and personal details.",
  },
  {
    icon: "background_checked",
    title: "Background Check",
    description: "We check criminal records and work history.",
  },
  {
    icon: "skill_certified",
    title: "Skill Certified",
    description: "We validate skills and experience.",
  },
  {
    icon: "customer_rated",
    title: "Customer Rated",
    description: "We collect genuine customer feedback and ratings.",
  },
];

const TITLE_LIMIT = 100;
const DESC_LIMIT = 300;

const ProfessionalStandardsEdit = ({ onChange, onReset, onSave }) => {
  const [sectionTitle, setSectionTitle] = useState(
    "Our Professional Standards"
  );
  const [sectionDescription, setSectionDescription] = useState(
    "Quality, safety and trust is our priority"
  );
  const [standards, setStandards] = useState(initialStandards);

  const emitChange = (title, description, standardsList) => {
    onChange && onChange({ title, description, standards: standardsList });
  };

  const handleTitleChange = (e) => {
    setSectionTitle(e.target.value);
    emitChange(e.target.value, sectionDescription, standards);
  };

  const handleDescriptionChange = (e) => {
    setSectionDescription(e.target.value);
    emitChange(sectionTitle, e.target.value, standards);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = standards.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setStandards(updated);
    emitChange(sectionTitle, sectionDescription, updated);
  };

  const handleDelete = (index) => {
    const updated = standards.filter((_, i) => i !== index);
    setStandards(updated);
    emitChange(sectionTitle, sectionDescription, updated);
  };

  const handleAddStandard = () => {
    const updated = [
      ...standards,
      {
        icon: "star",
        title: "New Standard",
        description: "Standard description",
      },
    ];
    setStandards(updated);
    emitChange(sectionTitle, sectionDescription, updated);
  };

  return (
    <div
      className="rounded-4 bg-white p-4"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex align-items-center gap-2 mb-1">
        <StarFill size={18} color="#0e8a5f" />
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Professional Standards Section
        </h5>
        <span
          className="badge rounded-pill fw-medium"
          style={{
            backgroundColor: "#e6f4ee",
            color: "#0e8a5f",
            fontSize: "0.72rem",
          }}
        >
          Active
        </span>
      </div>
      <p className="text-secondary mb-4" style={{ fontSize: "0.85rem" }}>
        Update the professional standards content and settings
      </p>

      <div className="mb-3">
        <label
          className="form-label fw-medium mb-1"
          style={{ color: "#0f1724", fontSize: "0.88rem" }}
        >
          Section Title
        </label>
        <input
          value={sectionTitle}
          onChange={handleTitleChange}
          maxLength={TITLE_LIMIT}
          className="form-control py-2"
        />
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{ fontSize: "0.72rem" }}
        >
          {sectionTitle.length}/{TITLE_LIMIT}
        </p>
      </div>

      <div className="mb-4">
        <label
          className="form-label fw-medium mb-1"
          style={{ color: "#0f1724", fontSize: "0.88rem" }}
        >
          Section Description
        </label>
        <textarea
          value={sectionDescription}
          onChange={handleDescriptionChange}
          maxLength={DESC_LIMIT}
          rows={3}
          className="form-control"
        />
        <p
          className="text-secondary text-end mb-0 mt-1"
          style={{ fontSize: "0.72rem" }}
        >
          {sectionDescription.length}/{DESC_LIMIT}
        </p>
      </div>

      <h6
        className="fw-bold mb-3"
        style={{ color: "#0f1724", fontSize: "0.92rem" }}
      >
        Standards
      </h6>

      <div className="d-flex flex-column gap-2 mb-3">
        {standards.map((s, i) => (
          <div
            key={i}
            className="d-flex align-items-start gap-2 rounded-3 p-3"
            style={{ border: "1px solid #eef0f2" }}
          >
            <GripVertical
              size={16}
              className="text-secondary flex-shrink-0 mt-2"
              style={{ cursor: "grab" }}
            />

            <div
              className="flex-shrink-0 text-center"
              style={{ width: "90px" }}
            >
              <label
                className="form-label mb-1 text-secondary d-block"
                style={{ fontSize: "0.76rem" }}
              >
                Icon
              </label>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-2"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#e6f4ee",
                }}
              >
                {getIconRender(s.icon)}
              </div>
              <select
                value={s.icon}
                onChange={(e) => handleFieldChange(i, "icon", e.target.value)}
                className="form-select form-select-sm"
                style={{ fontSize: "0.72rem" }}
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-grow-1" style={{ minWidth: "160px" }}>
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.76rem" }}
              >
                Title
              </label>
              <input
                value={s.title}
                onChange={(e) => handleFieldChange(i, "title", e.target.value)}
                className="form-control py-2"
              />
            </div>

            <div className="flex-grow-1" style={{ minWidth: "220px" }}>
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.76rem" }}
              >
                Description
              </label>
              <input
                value={s.description}
                onChange={(e) =>
                  handleFieldChange(i, "description", e.target.value)
                }
                className="form-control py-2"
              />
            </div>

            <button
              onClick={() => handleDelete(i)}
              className="btn d-flex align-items-center justify-content-center p-0 rounded-2 flex-shrink-0 mt-4"
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#fdecec",
                color: "#dc3545",
              }}
            >
              <TrashFill size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddStandard}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium mb-3"
        style={{ border: "1.5px dashed #0e8a5f", color: "#0e8a5f" }}
      >
        <PlusLg size={14} /> Add New Standard
      </button>

      <div
        className="rounded-3 p-3 d-flex align-items-start gap-2 mb-4"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <InfoCircleFill
          size={15}
          color="#0e8a5f"
          className="flex-shrink-0 mt-1"
        />
        <p className="mb-0" style={{ fontSize: "0.82rem", color: "#0f1724" }}>
          You can add, remove or reorder standards. These will be shown in the
          specified order on the professionals page.
        </p>
      </div>

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
            onSave({
              title: sectionTitle,
              description: sectionDescription,
              standards,
            })
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

export default ProfessionalStandardsEdit;
