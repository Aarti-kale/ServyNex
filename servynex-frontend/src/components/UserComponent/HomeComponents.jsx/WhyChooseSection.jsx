import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PersonFill,
  ReceiptCutoff,
  ClockFill,
  AwardFill,
  HeadsetVr,
  ArrowRight,
} from "react-bootstrap-icons";

const iconMap = {
  person: PersonFill,
  pricing: ReceiptCutoff,
  receipt: ReceiptCutoff,
  calendar: ClockFill,
  clock: ClockFill,
  award: AwardFill,
  quality: AwardFill,
  support: HeadsetVr,
  headset: HeadsetVr,
};

const getFeatureIcon = (iconName) => {
  const IconComponent = iconMap[iconName?.trim().toLowerCase()];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={20} color="#0e8a5f" />;
};

const WhyChooseSection = ({ data }) => {
  const features = Array.isArray(data?.features) ? data.features : [];

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <div>
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
            href="/about"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="row g-3">
          {features.map((feature, index) => (
            <div
              className="col-6 col-md-4 col-lg"
              key={feature?._id || `${feature?.title}-${index}`}
            >
              <div
                className="rounded-3 p-3 h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {getFeatureIcon(feature?.icon)}
                </div>

                <h6
                  className="fw-semibold mb-1"
                  style={{
                    color: "#0f1724",
                    fontSize: "0.9rem",
                  }}
                >
                  {feature?.title || ""}
                </h6>

                <p
                  className="text-secondary mb-0"
                  style={{
                    fontSize: "0.78rem",
                  }}
                >
                  {feature?.description || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
