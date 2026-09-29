import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Search,
  CalendarEventFill,
  PersonFill,
  ClipboardCheckFill,
  StarFill,
  ArrowRight,
} from "react-bootstrap-icons";

const iconMap = {
  search: Search,
  calendar: CalendarEventFill,
  person: PersonFill,
  check: ClipboardCheckFill,
  star: StarFill,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={22} color="#0e8a5f" />;
};

const HowItWorks = ({ data }) => {
  const steps = Array.isArray(data?.steps) ? data.steps : [];

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-5">
          <div className="text-center text-md-start mx-auto mx-md-0">
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.6rem",
              }}
            >
              {data?.title || ""}
            </h2>

            <p className="text-secondary mb-0">{data?.subtitle || ""}</p>
          </div>

          <a
            href="/how-it-works"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="row position-relative">
          <div
            className="d-none d-md-block position-absolute"
            style={{
              top: "34px",
              left: "10%",
              right: "10%",
              borderTop: "2px dashed #cfe8dc",
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => (
            <div
              className="col-6 col-md"
              key={step._id || `${step.stepNumber}-${index}`}
              style={{ zIndex: 1 }}
            >
              <div className="d-flex flex-column align-items-center text-center mb-4 mb-md-0">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3 bg-white"
                  style={{
                    width: "68px",
                    height: "68px",
                    border: "1px solid #eef0f2",
                  }}
                >
                  {getIcon(step.icon)}
                </div>

                <span
                  className="fw-semibold mb-1"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "0.85rem",
                  }}
                >
                  {step.stepNumber ?? index + 1}
                </span>

                <h6 className="fw-semibold mb-1" style={{ color: "#0f1724" }}>
                  {step.title || ""}
                </h6>

                <p
                  className="text-secondary mb-0"
                  style={{
                    fontSize: "0.78rem",
                    maxWidth: "140px",
                  }}
                >
                  {step.description || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
