import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HouseFill,
  GearFill,
  PeopleFill,
  InfoCircleFill,
  TelephoneFill,
  ListUl,
  LayoutTextWindowReverse,
  ImageFill,
  ChevronRight,
} from "react-bootstrap-icons";

const sections = [
  {
    name: "Home",
    status: "Active",
    icon: <HouseFill size={16} color="#0e8a5f" />,
  },
  {
    name: "Services",
    status: "Active",
    icon: <GearFill size={16} color="#0e8a5f" />,
  },
  {
    name: "Professionals",
    status: "Active",
    icon: <PeopleFill size={16} color="#0e8a5f" />,
  },
  {
    name: "About Us",
    status: "Updated",
    icon: <InfoCircleFill size={16} color="#0e8a5f" />,
  },
  {
    name: "Contact Us",
    status: "Active",
    icon: <TelephoneFill size={16} color="#0e8a5f" />,
  },
  {
    name: "Navigation Menu",
    status: "Active",
    icon: <ListUl size={16} color="#0e8a5f" />,
  },
  {
    name: "Footer",
    status: "Updated",
    icon: <LayoutTextWindowReverse size={16} color="#0e8a5f" />,
  },
  {
    name: "Banners",
    status: "Active",
    icon: <ImageFill size={16} color="#0e8a5f" />,
  },
];

const statusStyles = {
  Active: { bg: "#e6f4ee", color: "#0e8a5f" },
  Updated: { bg: "#fdf1de", color: "#b5730a" },
};

const SectionStatusCard = ({ onSelectSection, onManageAll }) => {
  return (
    <div
      className="rounded-4 bg-white p-4 h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h6 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
        Section Status
      </h6>
      <p className="text-secondary mb-3" style={{ fontSize: "0.82rem" }}>
        Quick overview of all website sections
      </p>

      <div className="flex-grow-1">
        {sections.map((s, i) => {
          const st = statusStyles[s.status];
          return (
            <button
              key={i}
              onClick={() => onSelectSection && onSelectSection(s.name)}
              className="btn w-100 d-flex align-items-center justify-content-between gap-2 px-3 py-2 rounded-3 mb-2"
              style={{ backgroundColor: "#f8fafb", border: "none" }}
            >
              <span className="d-flex align-items-center gap-2">
                <span
                  className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {s.icon}
                </span>
                <span
                  className="fw-medium"
                  style={{ color: "#0f1724", fontSize: "0.9rem" }}
                >
                  {s.name}
                </span>
              </span>
              <span
                className="badge rounded-pill fw-medium"
                style={{
                  backgroundColor: st.bg,
                  color: st.color,
                  fontSize: "0.76rem",
                }}
              >
                {s.status}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onManageAll}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium mt-2"
        style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
      >
        Manage All Sections <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default SectionStatusCard;
