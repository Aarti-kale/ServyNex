import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToggleRight } from "lucide-react";

function FooterStatusSection({ isActive = false, onToggle }) {
  const safeIsActive = Boolean(isActive);

  return (
    <section className="border rounded-3 bg-white p-4 h-100">
      <div className="d-flex align-items-start gap-3 mb-4">
        <span
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#ecfdf5",
            color: "#0e8a5f",
          }}
        >
          <ToggleRight size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              color: "#0f1724",
            }}
          >
            Footer Status
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Enable or disable footer.
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={safeIsActive}
          aria-label={safeIsActive ? "Disable footer" : "Enable footer"}
          onClick={() => onToggle?.()}
          className="border-0 p-0 position-relative rounded-pill"
          style={{
            width: "44px",
            height: "24px",
            flexShrink: 0,
            backgroundColor: safeIsActive ? "#10b981" : "#d1d5db",
            transition: "background-color 0.2s ease",
            cursor: "pointer",
          }}
        >
          <span
            className="position-absolute rounded-circle bg-white shadow-sm"
            style={{
              width: "20px",
              height: "20px",
              top: "2px",
              left: safeIsActive ? "22px" : "2px",
              transition: "left 0.2s ease",
            }}
          />
        </button>

        <span
          className="fw-medium"
          style={{
            fontSize: "0.875rem",
            color: safeIsActive ? "#374151" : "#6b7280",
          }}
        >
          Footer is{" "}
          <span
            style={{
              color: safeIsActive ? "#0e8a5f" : "#6b7280",
            }}
          >
            {safeIsActive ? "Active" : "Inactive"}
          </span>
        </span>
      </div>
    </section>
  );
}

export default FooterStatusSection;
