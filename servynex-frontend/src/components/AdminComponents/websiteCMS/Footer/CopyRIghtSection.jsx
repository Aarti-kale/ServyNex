import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Copyright as CopyrightIcon } from "lucide-react";

function CopyRightSection({ copyright, onChange }) {
  const safeCopyright = copyright ?? "";

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
          <CopyrightIcon size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              color: "#0f1724",
            }}
          >
            Copyright
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Update copyright text.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="footer-copyright"
          className="form-label fw-medium mb-1"
          style={{
            fontSize: "0.75rem",
            color: "#374151",
          }}
        >
          Copyright Text
        </label>

        <textarea
          id="footer-copyright"
          value={safeCopyright}
          onChange={(event) => onChange?.(event.target.value)}
          rows={2}
          className="form-control"
          style={{
            resize: "none",
            fontSize: "0.8rem",
            color: "#111827",
            borderColor: "#d1d5db",
            borderRadius: "8px",
            boxShadow: "none",
          }}
        />

        <div
          className="text-end text-secondary mt-1"
          style={{
            fontSize: "0.7rem",
          }}
        >
          {safeCopyright.length}
        </div>
      </div>
    </section>
  );
}

export default CopyRightSection;
