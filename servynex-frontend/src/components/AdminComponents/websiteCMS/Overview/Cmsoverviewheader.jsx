import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArrowClockwise,
  FileEarmarkTextFill,
  PencilFill,
  ImageFill,
  GearFill,
} from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const stats = [
  {
    label: "Total Sections",
    value: "8",
    note: "Active Sections",
    icon: <FileEarmarkTextFill size={22} color="#0e8a5f" />,
  },
  {
    label: "Total Pages",
    value: "25",
    note: "Published Pages",
    icon: <PencilFill size={22} color="#0e8a5f" />,
  },
  {
    label: "Total Banners",
    value: "12",
    note: "Active Banners",
    icon: <ImageFill size={22} color="#0e8a5f" />,
  },
  {
    label: "Last Updated",
    value: "Today",
    note: "2 min ago",
    icon: <GearFill size={22} color="#0e8a5f" />,
  },
];

const CMSOverviewHeader = ({ onRefresh }) => {
  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{ color: "#0f1724", fontSize: "1.9rem" }}
            >
              Website CMS Overview
            </h1>
            <p className="text-secondary mb-0">
              Manage and monitor all website content from one place.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{ backgroundColor: "#0e8a5f" }}
          >
            <ArrowClockwise size={15} /> Refresh Overview
          </button>
        </div>

        <div className="row g-3">
          {stats.map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div
                className="rounded-4 p-3 h-100 bg-white d-flex align-items-start gap-3"
                style={{ border: "1px solid #eef0f2" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {s.label}
                  </p>
                  <h3 className="fw-bold mb-2" style={{ color: "#0f1724" }}>
                    {s.value}
                  </h3>
                  <span
                    className="d-flex align-items-center gap-2 fw-medium"
                    style={{ color: "#0e8a5f", fontSize: "0.76rem" }}
                  >
                    <span
                      className="rounded-circle"
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#0e8a5f",
                        display: "inline-block",
                      }}
                    />
                    {s.note}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CMSOverviewHeader;
