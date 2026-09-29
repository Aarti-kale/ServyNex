import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  LightningChargeFill,
  Droplet,
  Snow,
  Brush,
  GearFill,
  Hammer,
  PaletteFill,
  BugFill,
  Tools,
  ArrowRight,
} from "react-bootstrap-icons";

import { Link } from "react-router-dom";
import getMediaUrl from "../../../utils/getMediaUrl";

const iconMap = {
  electrician: LightningChargeFill,
  electrical: LightningChargeFill,

  plumber: Droplet,
  plumbing: Droplet,

  "ac repair": Snow,
  ac: Snow,

  cleaning: Brush,

  "appliance repair": GearFill,
  appliance: GearFill,

  carpenter: Hammer,
  carpentry: Hammer,

  painter: PaletteFill,
  painting: PaletteFill,

  "pest control": BugFill,
  pest: BugFill,
};

const getServiceIcon = (serviceName) => {
  const key = serviceName?.trim().toLowerCase() || "";

  const IconComponent = iconMap[key] || Tools;

  return <IconComponent size={22} color="#0e8a5f" />;
};

const ServiceVisual = ({ service }) => {
  const [imageError, setImageError] = useState(false);

  const serviceName = service?.name || "";
  const imageUrl = getMediaUrl(service?.image);

  if (!imageUrl || imageError) {
    return getServiceIcon(serviceName);
  }

  return (
    <img
      src={imageUrl}
      alt={serviceName || "Service"}
      width="72"
      height="72"
      loading="lazy"
      onError={() => setImageError(true)}
      style={{
        width: "72px",
        height: "72px",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};

const ServiceSection = ({ data }) => {
  const services = Array.isArray(data) ? data : [];

  return (
    <section className="py-5">
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
              Our Popular Services
            </h2>

            <p className="text-secondary mb-0">
              Professional solutions for your home and living
            </p>
          </div>

          <Link
            to="/services"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All Services
            <ArrowRight size={14} />
          </Link>
        </div>

        {services.length === 0 && (
          <div className="text-center py-4 text-secondary">
            No popular services available right now.
          </div>
        )}

        {services.length > 0 && (
          <div className="row g-3">
            {services.map((service, index) => {
              const serviceName = service?.name || "";

              const serviceDescription =
                service?.shortDescription ||
                service?.description ||
                "Professional home service.";

              return (
                <div
                  className="col-12 col-md-6 col-lg-3"
                  key={service?._id || `${serviceName}-${index}`}
                >
                  <div
                    className="rounded-3 p-3 h-100 d-flex align-items-start gap-3 bg-white"
                    style={{
                      border: "1px solid #d9ecdf",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 overflow-hidden"
                      style={{
                        width: "72px",
                        height: "72px",
                        minWidth: "72px",
                        minHeight: "72px",
                        backgroundColor: "#e6f4ee",
                        border: "1px solid #d9ecdf",
                      }}
                    >
                      <ServiceVisual service={service} />
                    </div>

                    <div
                      className="flex-grow-1"
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <h6
                        className="fw-semibold mb-1"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.95rem",
                        }}
                      >
                        {serviceName || "Unnamed Service"}
                      </h6>

                      <p
                        className="text-secondary mb-0"
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: "1.5",
                        }}
                      >
                        {serviceDescription}
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

export default ServiceSection;
