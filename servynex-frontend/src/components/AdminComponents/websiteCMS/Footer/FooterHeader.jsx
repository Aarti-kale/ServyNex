import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronRight,
  ArrowCounterclockwise,
  SaveFill,
} from "react-bootstrap-icons";

const FooterHeader = ({ onReset, onSave, saving = false, isDirty = false }) => {
  const safeSaving = Boolean(saving);
  const safeDirty = Boolean(isDirty);

  const actionsDisabled = !safeDirty || safeSaving;

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-2"
          style={{
            fontSize: "0.86rem",
          }}
        >
          <span className="text-secondary">Website CMS</span>

          <ChevronRight
            size={11}
            className="text-secondary mx-1"
            aria-hidden="true"
          />

          <span
            className="fw-medium"
            style={{
              color: "#0e8a5f",
            }}
          >
            Footer
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
              Footer
            </h1>

            <p className="text-secondary mb-0">
              Update your website footer content, links, logo and contact
              information.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onReset?.()}
              disabled={actionsDisabled}
              className="btn d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
                backgroundColor: "#ffffff",
                minWidth: "100px",
                opacity: actionsDisabled ? 0.5 : 1,
                cursor: actionsDisabled ? "not-allowed" : "pointer",
              }}
              aria-label="Reset footer changes"
            >
              <ArrowCounterclockwise size={15} aria-hidden="true" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={actionsDisabled}
              className="btn text-white d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                backgroundColor: "#0e8a5f",
                minWidth: "145px",
                opacity: actionsDisabled ? 0.5 : 1,
                cursor: actionsDisabled ? "not-allowed" : "pointer",
              }}
              aria-busy={safeSaving}
              aria-label={
                safeSaving ? "Saving footer changes" : "Save footer changes"
              }
            >
              <SaveFill size={15} aria-hidden="true" />

              {safeSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterHeader;
