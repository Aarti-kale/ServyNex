import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PersonFill, TelephoneFill, EnvelopeFill } from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const ContactHero = ({ data = {} }) => {
  const {
    badge = "CONTACT US",
    title = "We're Here To Help You",
    description = "",
    primaryButtonText = "Call Now",
    primaryButtonLink = "#",
    secondaryButtonText = "Send Message",
    secondaryButtonLink = "#contact-form",
    image = "",
  } = data;

  const titleParts = title.split(" ");
  const imageSrc =
    typeof image === "string" && image.startsWith("blob:")
      ? image
      : getMediaUrl(image);

  return (
    <section className="py-5" style={{ backgroundColor: "#eef7f3" }}>
      <div className="container py-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
              style={{
                backgroundColor: "#ffffff",
                color: "#0e8a5f",
                fontSize: "0.75rem",
              }}
            >
              <PersonFill size={12} />
              {badge}
            </span>

            <h1
              className="fw-bold mb-3"
              style={{
                color: "#0f1724",
                fontSize: "2.75rem",
                lineHeight: 1.15,
              }}
            >
              {titleParts.slice(0, -2).join(" ")}
              <br />

              <span style={{ color: "#0e8a5f" }}>
                {titleParts.slice(-2).join(" ")}
              </span>
            </h1>

            <p className="text-secondary mb-4" style={{ maxWidth: "440px" }}>
              {description}
            </p>

            <div className="d-flex flex-wrap gap-3">
              <a
                href={primaryButtonLink}
                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                style={{ backgroundColor: "#0e8a5f" }}
              >
                <TelephoneFill size={14} />
                {primaryButtonText}
              </a>

              <a
                href={secondaryButtonLink}
                className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                }}
              >
                <EnvelopeFill size={14} />
                {secondaryButtonText}
              </a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="rounded-4 overflow-hidden">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={badge}
                  className="w-100"
                  style={{
                    objectFit: "cover",
                    minHeight: "300px",
                  }}
                />
              ) : (
                <div
                  className="w-100 d-flex align-items-center justify-content-center"
                  style={{
                    minHeight: "300px",
                    backgroundColor: "#dfeee8",
                  }}
                >
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
