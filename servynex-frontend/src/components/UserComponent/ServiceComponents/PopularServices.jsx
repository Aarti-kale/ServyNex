import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightningChargeFill,
  Droplet,
  Stars,
  Brush,
  Hammer,
  GearFill,
  StarFill,
  Tools,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import getMediaUrl from "../../../utils/getMediaUrl";

const iconMap = {
  electrician: LightningChargeFill,
  plumber: Droplet,
  cleaner: Stars,
  cleaning: Stars,
  painter: Brush,
  painting: Brush,
  carpenter: Hammer,
  carpentry: Hammer,
  "appliance repair": GearFill,
};

const palette = [
  {
    bg: "#e6f4ee",
    cardBg: "#f3faf6",
    iconColor: "#0e8a5f",
  },
  {
    bg: "#e0edfb",
    cardBg: "#eef5fc",
    iconColor: "#185fa5",
  },
  {
    bg: "#efe8fc",
    cardBg: "#f6f2fd",
    iconColor: "#7c5ad1",
  },
  {
    bg: "#fbedd6",
    cardBg: "#fdf6ea",
    iconColor: "#d18a1c",
  },
  {
    bg: "#f6e7dd",
    cardBg: "#faf1ea",
    iconColor: "#a9542c",
  },
];

const PopularServices = ({ services = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <div>
            <div
              className="fw-semibold text-uppercase mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              Popular Services
            </div>

            <h2
              className="fw-bold mb-2"
              style={{
                color: "#0f1724",
                fontSize: "1.75rem",
              }}
            >
              Most Popular Services
            </h2>

            <p className="text-secondary mb-0">
              Book the most in-demand home services from verified professionals
            </p>
          </div>
        </div>

        {services.length === 0 && (
          <div className="text-center py-4 text-secondary">
            No popular services available right now.
          </div>
        )}

        {services.length > 0 && (
          <div className="row g-3">
            {services.map((service, index) => {
              const colors = palette[index % palette.length];

              return (
                <ServiceCard
                  key={service?._id || `service-${index}`}
                  service={service}
                  index={index}
                  colors={colors}
                  onBook={() => {
                    if (!service?._id) return;

                    navigate(`/servicesid/${service._id}`);
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="d-flex justify-content-center gap-2 mt-4">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className="rounded-circle"
              style={{
                width: dot === 0 ? "18px" : "6px",
                height: "6px",
                backgroundColor: dot === 0 ? "#0e8a5f" : "#d1d5db",
                display: "inline-block",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index, colors, onBook }) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getMediaUrl(service?.image);

  const rating =
    service?.averageRating !== undefined &&
    service?.averageRating !== null &&
    service?.averageRating !== ""
      ? Number(service.averageRating).toFixed(1)
      : "0.0";

  const reviewCount = Number(service?.totalReviews || 0);

  const getServiceIcon = () => {
    const name = service?.name?.toLowerCase()?.trim() || "";

    const Icon = iconMap[name] || Tools;

    return <Icon size={22} color={colors.iconColor} />;
  };

  const renderServiceVisual = () => {
    if (!imageUrl || imageError) {
      return getServiceIcon();
    }

    return (
      <img
        src={imageUrl}
        alt={service?.name || "Service"}
        width="100%"
        height="100%"
        loading="lazy"
        onError={() => setImageError(true)}
        style={{
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  };

  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div
        className="rounded-3 p-3 h-100 d-flex flex-column"
        style={{
          backgroundColor: colors.cardBg,
          border: "1px solid #eef0f2",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-3 mb-3 overflow-hidden"
          style={{
            width: "140px",
            height: "80px",
            minWidth: "80px",
            minHeight: "80px",
            backgroundColor: colors.bg,
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          {renderServiceVisual()}
        </div>
        <h6
          className="fw-semibold mb-1"
          style={{
            color: "#0f1724",
          }}
        >
          {service?.name || "Unnamed Service"}
        </h6>

        <p
          className="text-secondary mb-2"
          style={{
            fontSize: "0.78rem",
            minHeight: "38px",
          }}
        >
          {service?.shortDescription ||
            service?.description ||
            "Professional home service."}
        </p>

        <div
          className="d-flex align-items-center gap-1 mb-3"
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
            {rating} ({reviewCount})
          </span>
        </div>

        <button
          type="button"
          onClick={onBook}
          disabled={!service?._id}
          className="btn btn-sm text-white rounded-2 mt-auto fw-medium"
          style={{
            backgroundColor: "#0e8a5f",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PopularServices;
