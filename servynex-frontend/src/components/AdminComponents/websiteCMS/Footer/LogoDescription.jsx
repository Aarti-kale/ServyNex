import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { FileText, Upload, X } from "lucide-react";

import getMediaUrl from "../../../../utils/getMediaUrl";

function LogoDescriptionSection({
  logo,
  description,
  onLogoChange,
  onLogoRemove,
  onDescriptionChange,
}) {
  const safeLogo = typeof logo === "string" ? logo : "";

  const safeDescription = typeof description === "string" ? description : "";

  const hasLogo = safeLogo.trim() !== "";

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onLogoChange?.(file);
    }

    event.target.value = "";
  };

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
          <FileText size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              color: "#0f1724",
            }}
          >
            Logo &amp; Description
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Upload your logo and update the footer description.
          </p>
        </div>
      </div>

      {hasLogo ? (
        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3">
          <div
            className="position-relative d-flex align-items-center justify-content-center border rounded-3 bg-light px-3 flex-grow-1"
            style={{
              height: "64px",
              minWidth: 0,
            }}
          >
            <img
              src={getMediaUrl(safeLogo)}
              alt="Footer Logo"
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
              className="btn btn-dark d-flex align-items-center justify-content-center rounded-circle position-absolute p-0"
              style={{
                width: "20px",
                height: "20px",
                top: "-8px",
                right: "-8px",
              }}
            >
              <X size={12} />
            </button>
          </div>

          <label
            className="btn d-flex align-items-center justify-content-center gap-2 flex-shrink-0"
            style={{
              height: "40px",
              border: "1px solid #d9dee3",
              color: "#374151",
              backgroundColor: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Upload size={15} />
            Change Logo
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
          className="d-flex align-items-center justify-content-center gap-2 border border-2 border-dashed rounded-3 w-100"
          style={{
            height: "64px",
            color: "#6b7280",
            backgroundColor: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Upload size={16} />
          Upload Logo
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="d-none"
            onChange={handleFileSelect}
          />
        </label>
      )}

      <div className="mt-4">
        <label
          htmlFor="footer-description"
          className="form-label fw-medium mb-1"
          style={{
            fontSize: "0.75rem",
            color: "#374151",
          }}
        >
          Description
        </label>

        <textarea
          id="footer-description"
          value={safeDescription}
          onChange={(event) => onDescriptionChange?.(event.target.value)}
          rows={3}
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
          {safeDescription.length}
        </div>
      </div>
    </section>
  );
}

export default LogoDescriptionSection;
