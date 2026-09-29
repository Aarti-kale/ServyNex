import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { StarFill, PatchCheckFill, ArrowRight } from "react-bootstrap-icons";

const getImageUrl = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const serverUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
};

const FeaturedProfessionals = ({ data }) => {
  const professionals = Array.isArray(data)
    ? data
    : Array.isArray(data?.workers)
    ? data.workers
    : Array.isArray(data?.featuredWorkers)
    ? data.featuredWorkers
    : [];

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#fbfdfd",
      }}
    >
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
              Some of our top rated professionals
            </p>
          </div>

          <a
            href="/workers"
            className="d-flex align-items-center gap-1 fw-medium text-decoration-none mt-2"
            style={{
              color: "#0e8a5f",
            }}
          >
            View All Professionals
            <ArrowRight size={14} />
          </a>
        </div>

        {professionals.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary mb-0">
              No featured professionals available.
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {professionals.map((professional, index) => {
              const imageUrl = getImageUrl(professional.profileImage);

              return (
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
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={professional.name || "Professional"}
                          className="w-100"
                          style={{
                            height: "150px",
                            objectFit: "cover",
                          }}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className="w-100 bg-light d-flex align-items-center justify-content-center"
                          style={{
                            height: "150px",
                          }}
                        >
                          <span
                            className="text-secondary"
                            style={{
                              fontSize: "0.75rem",
                            }}
                          >
                            No Image
                          </span>
                        </div>
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
                        {professional.name || "Professional"}
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
                        <StarFill
                          size={12}
                          style={{
                            color: "#f5b301",
                          }}
                        />

                        <span
                          className="fw-medium"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          {Number(professional.rating ?? 0).toFixed(1)}
                        </span>

                        <span className="text-secondary">
                          ({professional.totalReviews ?? 0})
                        </span>
                      </div>

                      <p
                        className="text-secondary mb-0"
                        style={{
                          fontSize: "0.72rem",
                        }}
                      >
                        {professional.experience ?? 0} Years Exp.
                        <span className="mx-1">·</span>
                        {professional.completedJobs ?? 0} Jobs
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProfessionals;
