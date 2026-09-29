import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PersonBadgeFill,
  CheckCircleFill,
  AwardFill,
  StarFill,
} from "react-bootstrap-icons";

const iconMap = {
  "identity verified": PersonBadgeFill,
  "background checked": CheckCircleFill,
  "skill certified": AwardFill,
  "customer rated": StarFill,
};

const ProfessionalStandards = ({ data = {} }) => {
  const standards = Array.isArray(data?.standards) ? data.standards : [];

  const title = data?.title || "Our Professional Standards";

  const subtitle =
    data?.subtitle || "Quality, safety and trust is our priority";

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {title}
        </h2>

        <p className="text-secondary mb-5">{subtitle}</p>

        <div className="row g-3">
          {standards.map((s) => {
            const Icon =
              iconMap[s.title?.trim().toLowerCase()] || CheckCircleFill;

            return (
              <div className="col-6 col-lg-3" key={s._id || s.title}>
                <div
                  className="rounded-3 p-4 h-100 text-start bg-white"
                  style={{
                    border: "1px solid #eef0f2",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    <Icon size={22} color="#0e8a5f" />
                  </div>

                  <h6 className="fw-semibold mb-2" style={{ color: "#0f1724" }}>
                    {s.title}
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalStandards;
