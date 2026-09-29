import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { ChevronRight, EyeFill, SaveFill } from "react-bootstrap-icons";

const ServiceHeader = ({ onPreview, onSaveAll, saving = false }) => {
  return (
    <section
      className="py-4"
      style={{
        background:
          "linear-gradient(90deg, #ffffff 0%, #f8fffc 45%, #effbf6 100%)",
        borderBottom: "1px solid #edf2ef",
      }}
    >
      <div className="container-fluid px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 d-flex align-items-center"
          style={{
            fontSize: "0.86rem",
          }}
        >
          <span
            style={{
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Website CMS
          </span>

          <ChevronRight
            size={13}
            className="mx-2"
            style={{
              color: "#94a3b8",
            }}
            aria-hidden="true"
          />

          <span
            className="fw-semibold"
            style={{
              color: "#0e8a5f",
            }}
          >
            Services Page
          </span>
        </nav>

        <div
          className="d-flex flex-wrap justify-content-between align-items-center"
          style={{
            gap: "20px",
          }}
        >
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f172a",
                fontSize: "1.9rem",
                lineHeight: "1.25",
                letterSpacing: "-0.02em",
              }}
            >
              Services Page Management
            </h1>

            <p
              className="mb-0"
              style={{
                color: "#64748b",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Manage the complete Services page hero content
            </p>
          </div>

          <div
            className="d-flex flex-wrap align-items-center"
            style={{
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onSaveAll}
              disabled={saving}
              className="btn text-white d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold"
              style={{
                minHeight: "40px",
                minWidth: "145px",
                padding: "0 18px",
                backgroundColor: "#0e8a5f",
                border: "1px solid #0e8a5f",
                boxShadow: "0 4px 10px rgba(14, 138, 95, 0.18)",
                transition: "all 0.2s ease",
              }}
              aria-busy={saving}
              aria-label={
                saving
                  ? "Saving Services page changes"
                  : "Save Services page changes"
              }
            >
              <SaveFill size={15} aria-hidden="true" />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeader;
