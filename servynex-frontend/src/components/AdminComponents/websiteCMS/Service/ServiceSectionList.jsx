import React from "react";

import { HouseDoorFill } from "react-bootstrap-icons";

const SECTIONS = [
  {
    key: "hero",
    label: "Hero",
    description: "Main Services page introduction",
    icon: HouseDoorFill,
  },
];

const ServiceSectionList = ({
  activeSection,
  onSectionChange,
  saving = false,
}) => {
  const handleSectionClick = (sectionKey) => {
    if (saving) {
      return;
    }

    onSectionChange?.(sectionKey);
  };

  return (
    <div
      className="bg-white rounded-4 p-3"
      style={{
        border: "1px solid #e8eee9",

        boxShadow: "0 4px 18px rgba(20, 60, 40, 0.05)",
      }}
    >
      <h6
        className="fw-semibold px-2 pt-2 mb-3"
        style={{
          color: "#172033",
        }}
      >
        Services Sections
      </h6>

      <div className="d-flex flex-column gap-2">
        {SECTIONS.map((section) => {
          const Icon = section.icon;

          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => handleSectionClick(section.key)}
              disabled={saving}
              className="w-100 text-start border-0 rounded-3 p-3"
              style={{
                background: isActive ? "#e8f7f0" : "#ffffff",

                color: isActive ? "#0e8a5f" : "#172033",

                border: isActive
                  ? "1px solid #bfe5d2"
                  : "1px solid transparent",

                transition: "all 0.2s ease",

                cursor: saving ? "not-allowed" : "pointer",

                opacity: saving ? 0.7 : 1,
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "38px",

                    height: "38px",

                    flexShrink: 0,

                    background: isActive ? "#d5f0e2" : "#f3f6f4",

                    color: isActive ? "#0e8a5f" : "#667085",
                  }}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-grow-1">
                  <div
                    className="fw-semibold"
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    {section.label}
                  </div>

                  <div
                    className="mt-1"
                    style={{
                      fontSize: "0.74rem",

                      color: isActive ? "#39745b" : "#8a94a6",
                    }}
                  >
                    {section.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSectionList;
