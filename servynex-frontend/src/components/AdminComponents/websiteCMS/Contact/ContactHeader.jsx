import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import { ChevronRight, EyeFill, SaveFill } from "react-bootstrap-icons";

const ContactHeader = ({ onPreview, onSaveAll, saving = false }) => {
  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <nav
          className="mb-2"
          aria-label="CMS breadcrumb"
          style={{ fontSize: "0.86rem" }}
        >
          <span className="text-secondary">Website CMS</span>

          <ChevronRight size={11} className="text-secondary mx-1" />

          <span className="fw-medium" style={{ color: "#0e8a5f" }}>
            Contact Page
          </span>
        </nav>

        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              Contact Page Management
            </h1>

            <p className="text-secondary mb-0">
              Manage and update the content of your contact page
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={onPreview}
              disabled={saving}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
              }}
            >
              <EyeFill size={15} />
              Preview Page
            </button>

            <button
              type="button"
              onClick={onSaveAll}
              disabled={saving}
              className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                backgroundColor: "#0e8a5f",
              }}
            >
              <SaveFill size={15} />

              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeader;
