import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowRight, Tools } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import { getMediaUrl } from "../../../utils/getMediaUrl";
const AllServices = ({ services = [] }) => {
  const navigate = useNavigate();

  const openServiceDetails = (serviceId) => {
    if (!serviceId) return;

    navigate(`/servicesid/${serviceId}`);
  };

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div className="container">
        <div
          className="fw-semibold text-uppercase mb-2"
          style={{
            color: "#0e8a5f",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          All Services
        </div>

        <h2
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "1.75rem",
          }}
        >
          All Home Services
        </h2>

        <p className="text-secondary mb-4">
          Complete range of home services to make your life easier
        </p>

        {services.length === 0 && (
          <div className="text-center py-5 text-secondary">
            No services available right now.
          </div>
        )}

        {services.length > 0 && (
          <div className="row g-4">
            {services.map((service) => {
              const imageUrl = getMediaUrl(service.image);

              return (
                <div className="col-12 col-md-6 col-lg-4" key={service._id}>
                  <div
                    className="rounded-4 overflow-hidden h-100"
                    style={{
                      border: "1px solid #eef0f2",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="position-relative"
                      style={{
                        height: "180px",
                        backgroundColor: "#f5f7f8",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={service.name || "Service"}
                          className="w-100 h-100"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                          style={{
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center w-100 h-100">
                          <Tools size={40} color="#0e8a5f" />
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h6
                        className="fw-semibold mb-1"
                        style={{
                          color: "#0f1724",
                        }}
                      >
                        {service.name}
                      </h6>

                      <p
                        className="text-secondary mb-3"
                        style={{
                          fontSize: "0.85rem",
                          minHeight: "42px",
                        }}
                      >
                        {service.shortDescription || service.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <span
                          className="fw-medium"
                          style={{
                            color: "#0e8a5f",
                            fontSize: "0.85rem",
                          }}
                        >
                          Starting from ₹{service.price}
                        </span>

                        <button
                          type="button"
                          onClick={() => openServiceDetails(service._id)}
                          className="d-flex align-items-center gap-1 fw-medium text-decoration-none border-0 bg-transparent p-0"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.85rem",
                          }}
                        >
                          Book Now
                          <ArrowRight size={13} />
                        </button>
                      </div>
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

export default AllServices;
