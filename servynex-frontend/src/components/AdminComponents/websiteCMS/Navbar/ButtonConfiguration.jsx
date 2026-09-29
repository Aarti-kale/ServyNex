import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ButtonConfiguration({
  icon: Icon,
  title,
  description,
  enabled = false,
  onToggle,
  text,
  onTextChange,
  link,
  onLinkChange,
}) {
  const safeText = text ?? "";
  const safeLink = link ?? "";
  const safeEnabled = Boolean(enabled);

  const fieldPrefix =
    String(title ?? "navbar-button")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "") || "navbar-button";

  return (
    <section
      className="border rounded-3 bg-white p-4"
      style={{
        borderColor: "#e5e7eb",
      }}
    >
      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-start gap-3 min-w-0">
          <span
            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ecfdf5",
              color: "#0e8a5f",
            }}
          >
            {Icon ? <Icon size={18} /> : null}
          </span>

          <div className="min-w-0">
            <h3
              className="fw-semibold mb-1"
              style={{
                fontSize: "0.9rem",
                color: "#0f1724",
              }}
            >
              {title}
            </h3>

            <p
              className="text-secondary mb-0"
              style={{
                fontSize: "0.75rem",
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={safeEnabled}
          aria-label={`${safeEnabled ? "Disable" : "Enable"} ${title}`}
          onClick={() => onToggle?.()}
          className="border-0 p-0 position-relative rounded-pill flex-shrink-0"
          style={{
            width: "44px",
            height: "24px",
            backgroundColor: safeEnabled ? "#10b981" : "#d1d5db",
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
              left: safeEnabled ? "22px" : "2px",
              transition: "left 0.2s ease",
            }}
          />
        </button>
      </div>

      <div
        style={{
          opacity: safeEnabled ? 1 : 0.5,
          pointerEvents: safeEnabled ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="mb-3">
          <label
            htmlFor={`${fieldPrefix}-text`}
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Text
          </label>

          <input
            id={`${fieldPrefix}-text`}
            type="text"
            value={safeText}
            onChange={(event) => onTextChange?.(event.target.value)}
            disabled={!safeEnabled}
            className="form-control"
            style={{
              height: "38px",
              fontSize: "0.8rem",
              color: "#111827",
              borderColor: "#d1d5db",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          />
        </div>

        <div>
          <label
            htmlFor={`${fieldPrefix}-link`}
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Link
          </label>

          <input
            id={`${fieldPrefix}-link`}
            type="text"
            value={safeLink}
            onChange={(event) => onLinkChange?.(event.target.value)}
            disabled={!safeEnabled}
            className="form-control"
            style={{
              height: "38px",
              fontSize: "0.8rem",
              color: "#111827",
              borderColor: "#d1d5db",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default ButtonConfiguration;
