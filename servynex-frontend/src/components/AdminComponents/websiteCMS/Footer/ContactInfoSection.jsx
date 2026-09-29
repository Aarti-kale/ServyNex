import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Contact } from "lucide-react";

function ContactInfoSection({ contact, onChange }) {
  const safeContact = contact ?? {};

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
          <Contact size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              color: "#0f1724",
            }}
          >
            Contact Information
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Update your contact details.
          </p>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        <div>
          <label
            htmlFor="footer-contact-title"
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Title
          </label>

          <input
            id="footer-contact-title"
            type="text"
            value={safeContact.title ?? ""}
            onChange={(event) => onChange?.("title", event.target.value)}
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
            htmlFor="footer-contact-phone"
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Phone
          </label>

          <input
            id="footer-contact-phone"
            type="tel"
            value={safeContact.phone ?? ""}
            onChange={(event) => onChange?.("phone", event.target.value)}
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
            htmlFor="footer-contact-email"
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Email
          </label>

          <input
            id="footer-contact-email"
            type="email"
            value={safeContact.email ?? ""}
            onChange={(event) => onChange?.("email", event.target.value)}
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
            htmlFor="footer-contact-address"
            className="form-label fw-medium mb-1"
            style={{
              fontSize: "0.75rem",
              color: "#374151",
            }}
          >
            Address
          </label>

          <input
            id="footer-contact-address"
            type="text"
            value={safeContact.address ?? ""}
            onChange={(event) => onChange?.("address", event.target.value)}
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

export default ContactInfoSection;
