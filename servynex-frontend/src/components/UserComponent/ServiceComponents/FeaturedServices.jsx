import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  StarFill,
  LightningChargeFill,
  ShieldFillCheck,
  GearFill,
  ArrowRight,
  PeopleFill,
  PatchCheckFill,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    icon: <LightningChargeFill size={18} color="#0e8a5f" />,
    text: "Same Day Service",
  },
  {
    icon: <ShieldFillCheck size={18} color="#0e8a5f" />,
    text: "Verified Experts",
  },
  {
    icon: <GearFill size={18} color="#0e8a5f" />,
    text: "90 Days Warranty",
  },
];

const getMediaUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";

  const backendOrigin = apiUrl.replace(/\/api\/v1\/?$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${backendOrigin}${cleanPath}`;
};

const FeaturedService = ({
  service,
  happyCustomers = "5K+",
  certifiedProfessionals = "Certified",
  averageRating,
}) => {
  const navigate = useNavigate();

  if (!service) {
    return null;
  }

  const handleBook = () => {
    if (!service._id) {
      return;
    }

    navigate(`/servicesid/${service._id}`);
  };
  const rating = service.rating ?? averageRating ?? "4.9";

  const imageUrl = getMediaUrl(service.image);

  return (
    <section className="py-5">
      <div
        className="container"
        style={{
          maxWidth: "1280px",
        }}
      >
        <div
          className="rounded-4 overflow-hidden position-relative"
          style={{
            backgroundColor: "#eef7f3",
          }}
        >
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0e8a5f",
                  fontSize: "0.75rem",
                  width: "fit-content",
                }}
              >
                <StarFill size={12} />
                FEATURED SERVICE
              </span>

              <h1
                className="fw-bold mb-3"
                style={{
                  color: "#0f1724",
                  fontSize: "3rem",
                }}
              >
                {service.name}
              </h1>

              <p
                className="mb-4"
                style={{
                  fontSize: "1.1rem",
                  color: "#0f1724",
                }}
              >
                Starting from{" "}
                <span
                  className="fw-bold"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "1.5rem",
                  }}
                >
                  ₹{service.price ?? 0}
                </span>
              </p>

              <div className="d-flex flex-wrap gap-4 mb-4">
                {highlights.map((highlight, index) => (
                  <div
                    key={`${highlight.text}-${index}`}
                    className="d-flex align-items-center gap-2"
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-white flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      {highlight.icon}
                    </div>

                    <span
                      className="fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.9rem",
                      }}
                    >
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  onClick={handleBook}
                  className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                  style={{
                    backgroundColor: "#0e8a5f",
                  }}
                >
                  Book {service.name}
                  <ArrowRight size={18} />
                </button>

                <a
                  href="#all-services"
                  className="d-flex align-items-center gap-1 fw-medium text-decoration-none"
                  style={{
                    color: "#0e8a5f",
                  }}
                >
                  Explore All Services
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="col-lg-6 position-relative">
              <img
                src={
                  imageUrl ||
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
                }
                alt={service.name || "Featured Service"}
                className="w-100 h-100"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";
                }}
                style={{
                  objectFit: "cover",
                  minHeight: "380px",
                  display: "block",
                }}
              />
              <div
                className="position-absolute bg-white rounded-3 shadow d-flex flex-wrap"
                style={{
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                }}
              >
                <div
                  className="d-flex align-items-center gap-2 px-4 py-3 flex-fill justify-content-center"
                  style={{
                    borderRight: "1px solid #eef0f2",
                  }}
                >
                  <StarFill size={18} color="#f5b301" />

                  <div>
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1rem",
                      }}
                    >
                      {rating}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      Average Rating
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-2 px-4 py-3 flex-fill justify-content-center"
                  style={{
                    borderRight: "1px solid #eef0f2",
                  }}
                >
                  <PeopleFill size={18} color="#0e8a5f" />

                  <div>
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1rem",
                      }}
                    >
                      {happyCustomers}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      Happy Customers
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 px-4 py-3 flex-fill justify-content-center">
                  <PatchCheckFill size={18} color="#0e8a5f" />

                  <div>
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1rem",
                      }}
                    >
                      {certifiedProfessionals}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      Professionals
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedService;
