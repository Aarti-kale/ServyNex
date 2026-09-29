import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BarChartFill,
  ChevronRight,
  DisplayFill,
  GiftFill,
  ListUl,
  PlusLg,
  ShieldFillCheck,
  StarFill,
} from "react-bootstrap-icons";

const sections = [
  {
    key: "hero",
    name: "Hero Section",
    desc: "Main banner and call to action",
    icon: DisplayFill,
  },
  {
    key: "verification",
    name: "Verification Process",
    desc: "Steps to verify professionals",
    icon: ShieldFillCheck,
  },
  {
    key: "standards",
    name: "Professional Standards",
    desc: "Quality, safety and trust",
    icon: StarFill,
  },
  {
    key: "achievements",
    name: "Professional Achievements",
    desc: "Key statistics and numbers",
    icon: BarChartFill,
  },
  {
    key: "becomeProfessional",
    name: "Become Professional CTA",
    desc: "Professional registration call to action",
    icon: GiftFill,
  },
];

function ProfessionalSectionList({
  activeSection,
  onSelectSection,
  onAddSection,
}) {
  return (
    <div className="rounded-4 bg-white p-4 border shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-1">
        <ListUl size={18} className="text-success" />

        <h6 className="fw-bold mb-0 text-dark">Page Sections</h6>
      </div>

      <p className="text-secondary small mb-3">
        Edit and update content for each section.
      </p>

      <div className="d-flex flex-column gap-2 mb-3">
        {sections.map((section) => {
          const isActive = activeSection === section.key;

          const Icon = section.icon;

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => onSelectSection?.(section.key)}
              className={`btn w-100 d-flex align-items-center justify-content-between gap-2 p-3 rounded-3 text-start border ${
                isActive
                  ? "bg-success-subtle border-success"
                  : "bg-white border-light"
              }`}
            >
              <span className="d-flex align-items-center gap-3">
                <span className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-success-subtle text-success p-2">
                  <Icon size={18} />
                </span>

                <span>
                  <span
                    className={`d-block fw-semibold small ${
                      isActive ? "text-success" : "text-dark"
                    }`}
                  >
                    {section.name}
                  </span>

                  <span className="d-block text-secondary small">
                    {section.desc}
                  </span>
                </span>
              </span>

              <span className="d-flex align-items-center gap-2 flex-shrink-0">
                <span className="badge rounded-pill text-bg-success fw-medium">
                  Active
                </span>

                <ChevronRight size={15} className="text-secondary" />
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onAddSection?.()}
        className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium"
      >
        <PlusLg size={14} />
        Add New Section
      </button>
    </div>
  );
}

export default ProfessionalSectionList;
