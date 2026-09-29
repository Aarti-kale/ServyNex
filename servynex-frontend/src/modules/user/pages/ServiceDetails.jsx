import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  LightningChargeFill,
  StarFill,
  ArrowRight,
  ShieldFillCheck,
  ClockFill,
  ReceiptCutoff,
  TelephoneFill,
  ChevronRight,
  CheckCircleFill,
} from "react-bootstrap-icons";

import { useNavigate, useParams } from "react-router-dom";

import API from "../../../api/api.js";
import getMediaUrl from "../../../utils/getMediaUrl.jsx";

const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";

const fetchServiceById = async (serviceId) => {
  const response = await API.get(`/services/${serviceId}`);

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Unable to load service");
  }

  return response.data.data;
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
      if (!id) {
        if (isMounted) {
          setError("Service ID is missing.");
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const serviceData = await fetchServiceById(id);

        if (isMounted) {
          setService(serviceData);
        }
      } catch (err) {
        console.error("SERVICE DETAILS ERROR:", err);

        if (isMounted) {
          setService(null);

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load service details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBook = (selectedPackage = null) => {
    if (!service?._id) return;

    const params = new URLSearchParams();

    params.set("serviceId", service._id);

    if (selectedPackage) {
      params.set("packageId", selectedPackage._id || selectedPackage.name);

      params.set("packageName", selectedPackage.name || "");

      params.set("packagePrice", String(selectedPackage.price ?? 0));
    }

    navigate(`/booking?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-secondary">
        Loading service details...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold mb-2">Service not found</h4>

        <p className="text-secondary mb-4">
          {error || "This service is no longer available."}
        </p>

        <button
          type="button"
          className="btn text-white px-4"
          style={{
            backgroundColor: "#0e8a5f",
          }}
          onClick={() => navigate("/services")}
        >
          Back to Services
        </button>
      </div>
    );
  }

  const categoryName = service.category?.name || "Home Services";

  const averageRating =
    service.averageRating !== undefined && service.averageRating !== null
      ? Number(service.averageRating).toFixed(1)
      : "—";

  const totalReviews = Number(service.totalReviews || 0);

  const highlights =
    Array.isArray(service.highlights) && service.highlights.length > 0
      ? service.highlights
      : ["Verified Professionals", "Same Day Service", "Transparent Pricing"];

  const included = Array.isArray(service.includedServices)
    ? service.includedServices
    : [];

  const packages = Array.isArray(service.packages) ? service.packages : [];

  const serviceImage = getMediaUrl(service.image) || FALLBACK_SERVICE_IMAGE;

  return (
    <div>
      <div className="container pt-3">
        <nav style={{ fontSize: "0.85rem" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="fw-medium border-0 bg-transparent p-0"
            style={{ color: "#0e8a5f" }}
          >
            Home
          </button>

          <ChevronRight size={10} className="text-secondary mx-1" />

          <button
            type="button"
            onClick={() => navigate("/services")}
            className="fw-medium border-0 bg-transparent p-0"
            style={{ color: "#0e8a5f" }}
          >
            Services
          </button>

          <ChevronRight size={10} className="text-secondary mx-1" />

          <span className="text-secondary">{service.name}</span>
        </nav>
      </div>

      <section className="py-4">
        <div className="container">
          <div
            className="rounded-4 overflow-hidden"
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
                  <LightningChargeFill size={12} />

                  {categoryName.toUpperCase()}
                </span>

                <h1
                  className="fw-bold mb-3"
                  style={{
                    color: "#0f1724",
                    fontSize: "2.4rem",
                    lineHeight: 1.2,
                  }}
                >
                  {service.name}
                </h1>

                <p
                  className="text-secondary mb-4"
                  style={{
                    maxWidth: "440px",
                  }}
                >
                  {service.description ||
                    service.shortDescription ||
                    "Professional home service."}
                </p>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <StarFill size={16} color="#f5b301" />

                    <span className="fw-semibold">{averageRating}</span>

                    <span
                      className="text-secondary"
                      style={{
                        fontSize: "0.85rem",
                      }}
                    >
                      ({totalReviews} Reviews)
                    </span>
                  </div>

                  <div
                    className="rounded-3 px-3 py-2"
                    style={{
                      backgroundColor: "#e6ede9",
                    }}
                  >
                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      Starting at
                    </div>

                    <div
                      className="fw-bold"
                      style={{
                        color: "#0e8a5f",
                        fontSize: "1.3rem",
                      }}
                    >
                      ₹{service.price ?? 0}
                    </div>
                  </div>

                  {service.duration && (
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{
                        fontSize: "0.85rem",
                      }}
                    >
                      <ClockFill size={15} color="#0e8a5f" />
                      {service.duration} mins
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleBook()}
                  className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium mb-4"
                  style={{
                    backgroundColor: "#0e8a5f",
                    width: "fit-content",
                  }}
                >
                  Book Now
                  <ArrowRight size={18} />
                </button>

                <div className="d-flex flex-wrap gap-4">
                  {highlights.map((text, index) => (
                    <div
                      key={`${text}-${index}`}
                      className="d-flex align-items-center gap-2"
                    >
                      {index === 0 ? (
                        <ShieldFillCheck size={18} color="#0e8a5f" />
                      ) : index === 1 ? (
                        <ClockFill size={18} color="#0e8a5f" />
                      ) : (
                        <ReceiptCutoff size={18} color="#0e8a5f" />
                      )}

                      <span
                        className="fw-medium"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.85rem",
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-6 position-relative">
                <img
                  src={serviceImage}
                  alt={service.name || "Service"}
                  className="w-100 h-100"
                  style={{
                    objectFit: "cover",
                    minHeight: "380px",
                  }}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {included.length > 0 && (
        <section className="py-4">
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span
                style={{
                  width: "4px",
                  height: "22px",
                  backgroundColor: "#0e8a5f",
                }}
              />

              <h2
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                  fontSize: "1.5rem",
                }}
              >
                What's Included
              </h2>
            </div>

            <div className="row g-3">
              {included.map((item, index) => (
                <div
                  className="col-6 col-md-4 col-lg-3"
                  key={`${item}-${index}`}
                >
                  <div
                    className="rounded-3 p-3 h-100 text-center bg-white"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div className="d-flex justify-content-center mb-3">
                      <CheckCircleFill size={26} color="#0e8a5f" />
                    </div>

                    <p
                      className="fw-medium mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {packages.length > 0 && (
        <section className="py-5">
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span
                style={{
                  width: "4px",
                  height: "22px",
                  backgroundColor: "#0e8a5f",
                }}
              />

              <h2
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                  fontSize: "1.5rem",
                }}
              >
                Pricing Packages
              </h2>
            </div>

            <div className="row g-4">
              {packages.map((plan, index) => (
                <div
                  className="col-md-4"
                  key={plan._id || `${plan.name || "package"}-${index}`}
                >
                  <div
                    className="rounded-4 p-4 h-100 d-flex flex-column position-relative bg-white"
                    style={{
                      border: plan.isPopular
                        ? "2px solid #0e8a5f"
                        : "1px solid #eef0f2",
                      paddingTop: plan.isPopular ? "3rem" : "1.5rem",
                    }}
                  >
                    {plan.isPopular && (
                      <span
                        className="position-absolute text-white text-center fw-semibold py-1"
                        style={{
                          top: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "#0e8a5f",
                          fontSize: "0.7rem",
                          letterSpacing: "0.05em",
                          borderTopLeftRadius: "1rem",
                          borderTopRightRadius: "1rem",
                        }}
                      >
                        MOST POPULAR
                      </span>
                    )}

                    <h5
                      className="fw-bold mb-2"
                      style={{
                        color: "#0e8a5f",
                      }}
                    >
                      {plan.name}
                    </h5>

                    <p
                      className="text-secondary mb-3"
                      style={{
                        fontSize: "0.85rem",
                        minHeight: "42px",
                      }}
                    >
                      {plan.description || ""}
                    </p>

                    <h3
                      className="fw-bold mb-3"
                      style={{
                        color: "#0f1724",
                      }}
                    >
                      ₹{plan.price ?? 0}
                    </h3>

                    <ul className="list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
                      {(Array.isArray(plan.features) ? plan.features : []).map(
                        (feature, featureIndex) => (
                          <li
                            key={`${feature}-${featureIndex}`}
                            className="d-flex align-items-center gap-2"
                          >
                            <CheckCircleFill size={14} color="#0e8a5f" />

                            <span
                              style={{
                                fontSize: "0.88rem",
                                color: "#0f1724",
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        )
                      )}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleBook(plan)}
                      className="btn w-100 rounded-3 fw-medium py-2"
                      style={{
                        backgroundColor: plan.isPopular
                          ? "#0e8a5f"
                          : "transparent",
                        color: plan.isPopular ? "#ffffff" : "#0e8a5f",
                        border: plan.isPopular ? "none" : "1.5px solid #0e8a5f",
                      }}
                    >
                      Book {plan.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-5">
        <div className="container">
          <div
            className="rounded-4 p-4 p-md-5 d-flex flex-wrap align-items-center justify-content-between gap-4"
            style={{
              backgroundColor: "#0f3d2e",
            }}
          >
            <div>
              <h3
                className="fw-bold text-white mb-2"
                style={{
                  fontSize: "1.4rem",
                }}
              >
                Need {service.name}?
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "#c8e6d8",
                  fontSize: "0.9rem",
                }}
              >
                Select your package and continue to booking.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  handleBook(
                    packages.find((item) => item.isPopular) || packages[0]
                  )
                }
                className="btn bg-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                style={{
                  color: "#0e8a5f",
                }}
              >
                Continue to Booking
                <ArrowRight size={18} />
              </button>

              <div className="d-flex align-items-center gap-2 mt-3">
                <TelephoneFill size={14} color="#ffffff" />

                <span
                  className="text-white fw-medium"
                  style={{
                    fontSize: "0.9rem",
                  }}
                >
                  Contact Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;
