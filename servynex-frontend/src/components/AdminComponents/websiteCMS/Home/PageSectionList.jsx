import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ListUl,
  DisplayFill,
  GearFill,
  ShieldFillCheck,
  MegaphoneFill,
  QuestionCircleFill,
  ChevronRight,
} from "react-bootstrap-icons";

const sections = [
  {
    key: "hero",
    name: "Hero Section",
    desc: "Main banner and call to action",
    status: "Active",
    icon: <DisplayFill size={18} color="#0e8a5f" />,
  },
  {
    key: "howItWorks",
    name: "How It Works",
    desc: "Process steps explanation",
    status: "Active",
    icon: <GearFill size={18} color="#0e8a5f" />,
  },
  {
    key: "whyChoose",
    name: "Why Choose Us",
    desc: "Features and benefits",
    status: "Active",
    icon: <ShieldFillCheck size={18} color="#0e8a5f" />,
  },
  {
    key: "cta",
    name: "Call To Action",
    desc: "Bottom CTA section",
    status: "Active",
    icon: <MegaphoneFill size={18} color="#0e8a5f" />,
  },
  {
    key: "faqs",
    name: "FAQs",
    desc: "Frequently asked questions",
    status: "Active",
    icon: <QuestionCircleFill size={18} color="#0e8a5f" />,
  },
];

const PageSectionsList = ({ activeSection, onSelectSection }) => {
  const handleSectionSelect = (sectionKey) => {
    if (typeof onSelectSection === "function") {
      onSelectSection(sectionKey);
    }
  };

  return (
    <div
      className="rounded-4 bg-white p-4"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-1">
        <ListUl size={18} color="#0e8a5f" />

        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Page Sections
        </h6>
      </div>

      <p className="text-secondary mb-3" style={{ fontSize: "0.82rem" }}>
        Edit and update content for each section
      </p>

      <div className="d-flex flex-column gap-2">
        {sections.map((section) => {
          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => handleSectionSelect(section.key)}
              className="btn w-100 d-flex align-items-center justify-content-between gap-2 p-3 rounded-3 text-start"
              style={{
                backgroundColor: isActive ? "#eef7f3" : "#ffffff",
                border: isActive ? "1.5px solid #0e8a5f" : "1px solid #eef0f2",
                transition: "all 0.2s ease",
              }}
            >
              <span className="d-flex align-items-center gap-3">
                <span
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {section.icon}
                </span>

                <span>
                  <span
                    className="d-block fw-semibold"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {section.name}
                  </span>

                  <span
                    className="d-block text-secondary"
                    style={{
                      fontSize: "0.76rem",
                    }}
                  >
                    {section.desc}
                  </span>
                </span>
              </span>

              <span className="d-flex align-items-center gap-2 flex-shrink-0">
                <span
                  className="badge rounded-pill fw-medium"
                  style={{
                    backgroundColor: "#e6f4ee",
                    color: "#0e8a5f",
                    fontSize: "0.72rem",
                  }}
                >
                  {section.status}
                </span>

                <ChevronRight size={14} className="text-secondary" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageSectionsList;
