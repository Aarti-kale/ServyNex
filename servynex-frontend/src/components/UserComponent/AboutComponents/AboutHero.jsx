import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PersonFill,
  ShieldFillCheck,
  PeopleFill,
  PersonCheckFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const ICON_MAP = {
  person: PersonFill,
  users: PeopleFill,
  shield: ShieldFillCheck,
  "person-check": PersonCheckFill,
  check: CheckCircleFill,
};

const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || PersonFill;
};

const AboutHero = ({ data = {} }) => {
  const {
    badge = "ABOUT US",
    mainTitle = "About",
    highlightedTitle = "ServyNex",
    description = "",
    highlights = [],
    image = "",
  } = data;

  const imageSrc = getMediaUrl(image);

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
              {mainTitle}

              {highlightedTitle && (
                <>
                  <br />

                  <span
                    style={{
                      color: "#0e8a5f",
                    }}
                  >
                    {highlightedTitle}
                  </span>
                </>
              )}
            </h1>

            <p
              className="text-secondary mb-4"
              style={{
                maxWidth: "440px",
              }}
            >
              {description}
            </p>

            <div className="d-flex flex-wrap gap-4">
              {highlights.map((highlight, index) => {
                const Icon = getIconComponent(highlight?.icon);

                return (
                  <div
                    className="d-flex align-items-start gap-2"
                    style={{
                      maxWidth: "220px",
                    }}
                    key={highlight?._id || `${highlight?.title}-${index}`}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-white flex-shrink-0"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <Icon size={16} color="#0e8a5f" />
                    </div>

                    <div>
                      <h6
                        className="fw-semibold mb-1"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.9rem",
                        }}
                      >
                        {highlight?.title}
                      </h6>

                      <p
                        className="text-secondary mb-0"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        {highlight?.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="rounded-4 overflow-hidden">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={`${mainTitle} ${highlightedTitle}`.trim() || badge}
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

export default AboutHero;
