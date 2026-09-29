import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  PlusLg,
  Grid3x3GapFill,
  CheckCircleFill,
  XCircleFill,
  FolderFill,
} from "react-bootstrap-icons";

const getStats = (stats) => [
  {
    label: "Total Services",
    value: stats?.totalServices ?? "Field Not Available",
    note: "Field Not Available",
    noteColor: "#6b7280",
    icon: <Grid3x3GapFill size={22} color="#ffffff" />,
    iconBg: "#0e8a5f",
  },
  {
    label: "Active Services",
    value: stats?.activeServices ?? "Field Not Available",
    note: "Field Not Available",
    noteColor: "#6b7280",
    icon: <CheckCircleFill size={22} color="#ffffff" />,
    iconBg: "#0e8a5f",
  },
  {
    label: "Inactive Services",
    value: stats?.inactiveServices ?? "Field Not Available",
    note: "Field Not Available",
    noteColor: "#6b7280",
    icon: <XCircleFill size={22} color="#ffffff" />,
    iconBg: "#d18a1c",
  },
  {
    label: "Categories",
    value: stats?.totalCategories ?? "Field Not Available",
    note: "Total Categories",
    noteColor: "#6b7280",
    icon: <FolderFill size={22} color="#ffffff" />,
    iconBg: "#7c5ad1",
  },
];

const ServicesHeader = ({ stats, onAddService }) => {
  const statistics = getStats(stats);

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              Services
            </h1>

            <nav style={{ fontSize: "0.86rem" }}>
              <span className="fw-medium" style={{ color: "#0e8a5f" }}>
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Services</span>
            </nav>
          </div>

          <button
            onClick={onAddService}
            className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              backgroundColor: "#0e8a5f",
            }}
          >
            <PlusLg size={15} />
            Add Service
          </button>
        </div>

        <div className="row g-3">
          {statistics.map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
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
                    backgroundColor: s.iconBg,
                  }}
                >
                  {s.icon}
                </div>

                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{
                      fontSize: "0.82rem",
                    }}
                  >
                    {s.label}
                  </p>

                  <h3
                    className="fw-bold mb-1"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    {s.value}
                  </h3>

                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: s.noteColor,
                      fontSize: "0.76rem",
                    }}
                  >
                    {s.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHeader;
