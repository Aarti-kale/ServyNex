import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ListUl,
  DisplayFill,
  InfoCircleFill,
  UiChecksGrid,
  GeoAltFill,
  Share,
  MegaphoneFill,
  ChevronRight,
} from "react-bootstrap-icons";

const sections = [
  {
    key: "hero",
    name: "Hero Section",
    desc: "Top banner and introduction",
    icon: <DisplayFill size={18} />,
  },
  {
    key: "contactCards",
    name: "Contact Information",
    desc: "Address, phone, email & hours",
    icon: <InfoCircleFill size={18} />,
  },
  {
    key: "contactForm",
    name: "Contact Form",
    desc: "Form fields and settings",
    icon: <UiChecksGrid size={18} />,
  },
  {
    key: "officeLocation",
    name: "Office Location",
    desc: "Office location and map settings",
    icon: <GeoAltFill size={18} />,
  },
  {
    key: "helpSection",
    name: "Help Section",
    desc: "Help and support information",
    icon: <Share size={18} />,
  },
  {
    key: "supportCta",
    name: "Support CTA",
    desc: "Bottom support call-to-action",
    icon: <MegaphoneFill size={18} />,
  },
];

const ContactSectionList = ({
  activeSection,
  onSelectSection,
  contactData,
}) => {
  const getSectionStatus = (sectionKey) => {
    const sectionData = contactData?.[sectionKey];

    if (sectionData && typeof sectionData.isActive === "boolean") {
      return sectionData.isActive ? "Active" : "Inactive";
    }

    return "Active";
  };

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

        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f1724",
          }}
        >
          Page Sections
        </h6>
      </div>

      <p
        className="text-secondary mb-3"
        style={{
          fontSize: "0.82rem",
        }}
      >
        Edit and update content for each section
      </p>

      <div className="d-flex flex-column gap-2">
        {sections.map((section) => {
          const isSelected = activeSection === section.key;

          const status = getSectionStatus(section.key);

          const isSectionActive = status === "Active";

          return (
            <button
              key={section.key}
              type="button"
              onClick={() => handleSectionSelect(section.key)}
              aria-current={isSelected ? "page" : undefined}
              className="btn w-100 d-flex align-items-center justify-content-between gap-2 p-3 rounded-3 text-start"
              style={{
                backgroundColor: isSelected ? "#eef7f3" : "#ffffff",
                border: isSelected
                  ? "1.5px solid #0e8a5f"
                  : "1px solid #eef0f2",
              }}
            >
              <span className="d-flex align-items-center gap-3">
                <span
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#e6f4ee",
                    color: "#0e8a5f",
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
                    backgroundColor: isSectionActive ? "#e6f4ee" : "#f1f3f5",
                    color: isSectionActive ? "#0e8a5f" : "#6c757d",
                    fontSize: "0.72rem",
                  }}
                >
                  {status}
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

export default ContactSectionList;
