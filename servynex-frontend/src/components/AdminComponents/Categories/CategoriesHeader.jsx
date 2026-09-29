import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  Grid3x3GapFill,
  CheckCircleFill,
  FolderFill,
  LightningChargeFill,
} from "react-bootstrap-icons";

const statConfig = [
  {
    label: "Total Categories",
    icon: <Grid3x3GapFill size={22} color="#ffffff" />,
    iconBg: "#0e8a5f",
    valueKey: "totalCategories",
  },
  {
    label: "Active Categories",
    icon: <CheckCircleFill size={22} color="#ffffff" />,
    iconBg: "#0e8a5f",
    valueKey: "activeCategories",
  },
  {
    label: "Total Services",
    icon: <FolderFill size={22} color="#ffffff" />,
    iconBg: "#7c5ad1",
    valueKey: "totalServices",
  },
];

const getDisplayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const getStats = (stats) => {
  return statConfig.map((item) => ({
    ...item,
    value: getDisplayValue(stats?.[item.valueKey]),
    note: "Field Not Available",
  }));
};

const CategoriesHeader = ({
  stats = null,
  onAddCategory,
}) => {
  const dynamicStats = getStats(stats);

  const popularCategory =
    stats?.mostPopularCategory?.name || "Not Available";

  const popularServices =
    stats?.mostPopularCategory?.servicesCount;

  const popularServicesLabel =
    popularServices === undefined ||
    popularServices === null
      ? "Not Available"
      : `${popularServices} Services`;

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <h1
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.9rem",
          }}
        >
          Categories
        </h1>

        <nav
          className="mb-4"
          style={{ fontSize: "0.86rem" }}
        >
          <span
            className="fw-medium"
            style={{ color: "#0e8a5f" }}
          >
            Dashboard
          </span>{" "}

          <ChevronRight
            size={11}
            className="text-secondary mx-1"
          />

          <span className="text-secondary">
            Categories
          </span>
        </nav>

        <div className="row g-3">
          {dynamicStats.map((stat, index) => (
            <div
              className="col-6 col-lg-3"
              key={stat.valueKey}
            >
              <div
                className="rounded-4 p-3 h-100 bg-white d-flex align-items-start gap-3"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: stat.iconBg,
                  }}
                >
                  {stat.icon}
                </div>

                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {stat.label}
                  </p>

                  <h3
                    className="fw-bold mb-1"
                    style={{ color: "#0f1724" }}
                  >
                    {stat.value}
                  </h3>

                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: "#0e8a5f",
                      fontSize: "0.76rem",
                    }}
                  >
                    {stat.note}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Most Popular card */}
          <div className="col-6 col-lg-3">
            <div
              className="rounded-4 p-3 h-100 bg-white d-flex align-items-start gap-3"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{
                  width: "52px",
                  height: "52px",
                  backgroundColor: "#d18a1c",
                }}
              >
                <LightningChargeFill
                  size={22}
                  color="#ffffff"
                />
              </div>

              <div>
                <p
                  className="text-secondary mb-1"
                  style={{ fontSize: "0.82rem" }}
                >
                  Most Popular
                </p>

                <h3
                  className="fw-bold mb-1"
                  style={{ color: "#0f1724" }}
                >
                  {popularCategory}
                </h3>

                <p
                  className="fw-medium mb-0"
                  style={{
                    color: "#6b7280",
                    fontSize: "0.76rem",
                  }}
                >
                  {popularServicesLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesHeader;