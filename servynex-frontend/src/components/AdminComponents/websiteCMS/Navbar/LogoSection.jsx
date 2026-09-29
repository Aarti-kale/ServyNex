import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image, Upload, X } from "lucide-react";

function LogoSection({
  logo,
  logoLink,
  onLogoChange,
  onLogoRemove,
  onLogoLinkChange,
}) {
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onLogoChange?.(file);
    }

    event.target.value = "";
  };

  const hasLogo = typeof logo === "string" && logo.trim() !== "";

  return (
    <section
      className="border rounded-3 bg-white p-4 h-100"
      style={{
        borderColor: "#e5e7eb",
      }}
    >
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
          <Image size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.2",
              color: "#0f1724",
            }}
          >
            Logo
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.72rem",
              lineHeight: "1.4",
            }}
          >
            Upload your website logo and set the logo link
          </p>
        </div>
      </div>

      <label
        className="form-label fw-medium mb-2"
        style={{
          fontSize: "0.75rem",
          color: "#374151",
        }}
      >
        Logo Image
      </label>

      {hasLogo ? (
        <div className="d-flex align-items-center gap-3">
          <div
            className="position-relative d-flex align-items-center justify-content-center flex-grow-1 border rounded-3 bg-light px-3"
            style={{
              height: "64px",
              minWidth: 0,
              borderColor: "#e5e7eb",
            }}
          >
            <img
              src={logo}
              alt="Website Logo"
              className="img-fluid"
              style={{
                maxHeight: "40px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />

            <button
              type="button"
              onClick={() => onLogoRemove?.()}
              aria-label="Remove logo"
              className="btn d-flex align-items-center justify-content-center position-absolute rounded-circle p-0"
              style={{
                width: "20px",
                height: "20px",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#1f2937",
                color: "#ffffff",
                border: "none",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "#111827";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "#1f2937";
              }}
            >
              <X size={12} />
            </button>
          </div>

          <label
            className="btn d-flex align-items-center justify-content-center gap-2 flex-shrink-0 rounded-3 fw-medium"
            style={{
              height: "40px",
              minWidth: "120px",
              padding: "0 14px",
              border: "1px solid #d9dee3",
              backgroundColor: "#ffffff",
              color: "#374151",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            <Upload size={15} />
            <span>Change Logo</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="d-none"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      ) : (
        <label
          className="d-flex align-items-center justify-content-center gap-2 w-100 border rounded-3"
          style={{
            height: "64px",
            borderStyle: "dashed",
            borderColor: "#d1d5db",
            backgroundColor: "#ffffff",
            color: "#6b7280",
            fontSize: "0.78rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = "#ffffff";
          }}
        >
          <Upload size={16} />
          <span>Upload Logo</span>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="d-none"
            onChange={handleFileSelect}
          />
        </label>
      )}

      <p
        className="text-secondary mb-0 mt-1"
        style={{
          fontSize: "0.68rem",
        }}
      >
        Recommended size: 200x60px (PNG, JPG)
      </p>

      <div className="mt-4">
        <label
          htmlFor="navbar-logo-link"
          className="form-label fw-medium mb-2"
          style={{
            fontSize: "0.75rem",
            color: "#374151",
          }}
        >
          Logo Link
        </label>

        <input
          id="navbar-logo-link"
          type="text"
          value={logoLink ?? ""}
          onChange={(event) => onLogoLinkChange?.(event.target.value)}
          placeholder="/"
          className="form-control"
          style={{
            height: "38px",
            fontSize: "0.78rem",
            color: "#111827",
            borderColor: "#d1d5db",
            borderRadius: "8px",
            boxShadow: "none",
          }}
        />
      </div>
    </section>
  );
}

export default LogoSection;
