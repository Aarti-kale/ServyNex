import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  CheckSquareFill,
  ShieldFillCheck,
  ClockFill,
  CurrencyRupee,
  CheckCircleFill,
} from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl.jsx";

const iconMap = {
  shield: ShieldFillCheck,
  clock: ClockFill,
  price: CurrencyRupee,
  check: CheckCircleFill,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || CheckSquareFill;

  return <IconComponent size={14} color="#0e8a5f" />;
};

const OurCommitment = ({ data }) => {
  const points = Array.isArray(data?.points)
    ? data.points.filter((point) => point?.isActive !== false)
    : [];

  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 overflow-hidden"
          style={{
            backgroundColor: "#fbfdfd",
            border: "1px solid #eef0f2",
          }}
        >
          <div className="row g-0 align-items-center">
            <div className="col-lg-7 p-4 p-lg-5">
              <h2
                className="fw-bold mb-3"
                style={{
                  color: "#0f1724",
                  fontSize: "1.6rem",
                }}
              >
                {data?.title || ""}
              </h2>

              <p
                className="text-secondary mb-4"
                style={{
                  maxWidth: "480px",
                }}
              >
                {data?.description || ""}
              </p>

              <div className="d-flex flex-wrap gap-4">
                {points.map((point) => (
                  <div
                    className="d-flex align-items-center gap-2"
                    key={point._id || point.title}
                    style={{
                      maxWidth: "200px",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#e6f4ee",
                      }}
                    >
                      {getIcon(point.icon)}
                    </div>

                    <span
                      className="fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      {point.title || ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5 text-center p-4 p-lg-0">
              {data?.image && (
                <img
                  src={getMediaUrl(data.image)}
                  alt={data?.title || "Commitment"}
                  className="img-fluid"
                  style={{
                    maxHeight: "300px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCommitment;
