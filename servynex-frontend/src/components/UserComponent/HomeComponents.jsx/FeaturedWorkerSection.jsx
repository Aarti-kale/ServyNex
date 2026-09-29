import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { StarFill, PatchCheckFill, ArrowRight } from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const FeaturedWorkers = ({ data }) => {
  const professionals = Array.isArray(data) ? data : [];

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.6rem",
              }}
            >
              Featured Professionals
            </h2>

            <p className="text-secondary mb-0">
              Meet some of our top rated professionals
            </p>
          </div>

          <a
            href="/workers"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All Professionals
            <ArrowRight size={14} />
          </a>
        </div>

        <div className="row g-3">
          {professionals.map((professional, index) => (
            <div
              className="col-6 col-md-4 col-lg-2"
              key={
                professional._id ||
                `${professional.name || "professional"}-${index}`
              }
            >
              <div
                className="rounded-4 overflow-hidden h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="position-relative">
                  {professional.profileImage ? (
                    <img
                      src={getMediaUrl(professional.profileImage)}
                      alt={professional.name || "Professional"}
                      className="w-100"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="w-100 bg-light"
                      style={{
                        height: "150px",
                      }}
                    />
                  )}

                  {professional.isVerified && (
                    <span
                      className="position-absolute d-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium text-white"
                      style={{
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#0e8a5f",
                        fontSize: "0.65rem",
                      }}
                    >
                      <PatchCheckFill size={10} />
                      Verified
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h6
                    className="fw-semibold mb-0"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {professional.name || ""}
                  </h6>

                  <p
                    className="text-secondary mb-2"
                    style={{
                      fontSize: "0.78rem",
                    }}
                  >
                    {professional.profession ||
                      professional.skills?.[0] ||
                      "Professional"}
                  </p>

                  <div
                    className="d-flex align-items-center gap-1 mb-2"
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    <StarFill size={12} color="#f5b301" />

                    <span
                      className="fw-medium"
                      style={{
                        color: "#0f1724",
                      }}
                    >
                      {professional.rating ?? 0}
                      {professional.totalReviews != null &&
                        ` (${professional.totalReviews})`}
                    </span>
                  </div>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.72rem",
                    }}
                  >
                    {professional.experience ?? 0} Years Exp. &nbsp;·&nbsp;
                    {professional.completedJobs ?? 0} Jobs
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkers;
