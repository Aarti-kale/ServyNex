import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  HouseFill,
  ArrowRight,
  PlayCircleFill,
  PeopleFill,
  BriefcaseFill,
  StarFill,
  EmojiSmileFill,
} from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const statisticIconMap = {
  verifiedProfessionals: PeopleFill,
  completedJobs: BriefcaseFill,
  averageRating: StarFill,
  customerSatisfaction: EmojiSmileFill,
};

const statisticLabelMap = {
  verifiedProfessionals: "Verified Experts",
  completedJobs: "Services Completed",
  averageRating: "Average Rating",
  customerSatisfaction: "Happy Customers",
};

const getStatisticIcon = (key) => {
  const IconComponent = statisticIconMap[key];

  if (!IconComponent) {
    return null;
  }

  const iconColor = key === "averageRating" ? "#f5b301" : "#6b7280";

  return <IconComponent size={16} color={iconColor} />;
};

const formatStatisticValue = (key, value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (key === "averageRating") {
    return Number(value).toFixed(1);
  }

  if (key === "customerSatisfaction") {
    return `${value}%`;
  }

  return value.toLocaleString();
};

const HeroSection = ({ data, statistics }) => {
  const stats = statistics
    ? Object.entries(statistics).map(([key, value]) => ({
        key,
        value: formatStatisticValue(key, value),
        label: statisticLabelMap[key] || key,
      }))
    : [];

  const imageSrc = getMediaUrl(data?.image);

  return (
    <section className="py-5" style={{ backgroundColor: "#eef7f3" }}>
      <div className="container py-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
              style={{
                backgroundColor: "#ffffff",
                color: "#0e8a5f",
                fontSize: "0.75rem",
              }}
            >
              <HouseFill size={12} />
              {data?.badge || ""}
            </span>

            <h1
              className="fw-bold mb-3"
              style={{
                color: "#0f1724",
                fontSize: "2.6rem",
                lineHeight: 1.2,
              }}
            >
              {data?.title || ""}
            </h1>

            <p
              className="text-secondary mb-4"
              style={{
                maxWidth: "460px",
              }}
            >
              {data?.description || ""}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
              <a
                href={data?.primaryButtonLink || "#"}
                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor: "#0e8a5f",
                }}
              >
                {data?.primaryButtonText || ""}
                <ArrowRight />
              </a>

              <a
                href={data?.secondaryButtonLink || "#"}
                className="d-flex align-items-center gap-2 fw-medium text-decoration-none"
                style={{
                  color: "#0f1724",
                }}
              >
                <PlayCircleFill size={26} color="#0e8a5f" />
                {data?.secondaryButtonText || ""}
              </a>
            </div>

            <div className="d-flex flex-wrap gap-4">
              {stats.map((stat) => (
                <div className="d-flex align-items-center gap-2" key={stat.key}>
                  {getStatisticIcon(stat.key)}

                  <div>
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1rem",
                      }}
                    >
                      {stat.value}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            {imageSrc ? (
              <div className="rounded-4 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={data?.title || "ServyNex professionals team"}
                  className="w-100"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
