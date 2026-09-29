import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  LightningChargeFill,
  Fan,
  LightbulbFill,
  Cpu,
  Grid3x3GapFill,
  StarFill,
  ArrowRight,
  Tools,
} from "react-bootstrap-icons";

import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600";

const iconMap = {
  electrician: LightningChargeFill,
  "electrical repair": LightningChargeFill,
  "fan installation": Fan,
  "light installation": LightbulbFill,
  "switch board repair": Cpu,
  "mcb repair": Grid3x3GapFill,
};

const getServiceIcon = (service) => {
  const key = service?.name?.toLowerCase()?.trim() || "";

  return iconMap[key] || Tools;
};

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

const RelatedServices = ({ services = [] }) => {
  const navigate = useNavigate();

  const relatedServices = Array.isArray(services) ? services.slice(0, 5) : [];

  const openServiceDetails = (serviceId) => {
    if (!serviceId) {
      return;
    }

    navigate(`/servicesid/${serviceId}`);
  };

  const handleViewAll = () => {
    document.getElementById("all-services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="py-5">
      <div
        className="container"
        style={{
          maxWidth: "1280px",
        }}
      >
        <div
          className="rounded-4 p-4 p-lg-5"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <h2
                className="fw-bold mb-1"
                style={{
                  color: "#0f1724",
                  fontSize: "1.5rem",
                }}
              >
                Related Services
              </h2>

              <p className="text-secondary mb-0">
                People also book these services
              </p>
            </div>

            <button
              type="button"
              onClick={handleViewAll}
              className="d-flex align-items-center gap-1 fw-medium text-decoration-none border-0 bg-transparent p-0"
              style={{
                color: "#0e8a5f",
              }}
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {relatedServices.length === 0 && (
            <div className="text-center py-4 text-secondary">
              No services available right now.
            </div>
          )}

          {relatedServices.length > 0 && (
            <div className="row g-3">
              {relatedServices.map((service) => {
                const Icon = getServiceIcon(service);

                const imageUrl = getMediaUrl(service?.image);

                return (
                  <div className="col-6 col-md-4 col-lg" key={service?._id}>
                    <div
                      className="rounded-4 overflow-hidden h-100"
                      style={{
                        border: "1px solid #eef0f2",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div className="position-relative">
                        <img
                          src={imageUrl || FALLBACK_IMAGE}
                          alt={service?.name || "Related Service"}
                          className="w-100"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          style={{
                            height: "150px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        <div
                          className="position-absolute d-flex align-items-center justify-content-center rounded-3 bg-white shadow-sm"
                          style={{
                            width: "38px",
                            height: "38px",
                            bottom: "-19px",
                            left: "14px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center rounded-2"
                            style={{
                              width: "38px",
                              height: "38px",
                              backgroundColor: "#e6f4ee",
                            }}
                          >
                            <Icon size={18} color="#0e8a5f" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 pt-4">
                        <h6
                          className="fw-semibold mb-2"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          {service?.name || "Service"}
                        </h6>

                        <div
                          className="d-flex align-items-center gap-1 mb-2"
                          style={{
                            fontSize: "0.85rem",
                          }}
                        >
                          <StarFill size={13} color="#f5b301" />

                          <span
                            className="fw-medium"
                            style={{
                              color: "#0f1724",
                            }}
                          >
                            {service?.averageRating
                              ? Number(service.averageRating).toFixed(1)
                              : "0.0"}{" "}
                            ({service?.totalReviews || 0})
                          </span>
                        </div>

                        <p
                          className="fw-medium mb-3"
                          style={{
                            color: "#0e8a5f",
                            fontSize: "0.85rem",
                          }}
                        >
                          Starting from ₹{service?.price ?? 0}
                        </p>

                        <button
                          type="button"
                          onClick={() => openServiceDetails(service?._id)}
                          disabled={!service?._id}
                          className="btn w-100 rounded-3 fw-medium"
                          style={{
                            backgroundColor: "#e6f4ee",
                            color: "#0e8a5f",
                            border: "none",
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;
