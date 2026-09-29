import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GeoAltFill } from "react-bootstrap-icons";
const OfficeLocation = ({ data = {} }) => {
  const {
    title = "Our Office Location",
    description = "",
    officeName = "ServyNex Office",
    address = "",
    country = "",
    pincode = "",
    directionsText = "Directions",
    directionsLink = "",
    mapEmbedUrl = "",
  } = data;

  const fullAddress = [address, country, pincode].filter(Boolean).join(" – ");

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {title}
        </h2>

        <p className="text-secondary mb-4">{description}</p>

        <div
          className="rounded-4 overflow-hidden position-relative"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          {mapEmbedUrl ? (
            <iframe
              title={officeName}
              src={mapEmbedUrl}
              width="100%"
              height="320"
              style={{
                border: 0,
                display: "block",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                height: "320px",
                backgroundColor: "#eef7f3",
              }}
            >
              <div className="text-secondary">
                Map location is not available.
              </div>
            </div>
          )}

          <div
            className="position-absolute bg-white rounded-3 shadow p-3 text-start"
            style={{
              top: "20px",
              left: "20px",
              maxWidth: "220px",
            }}
          >
            <h6
              className="fw-semibold mb-2 d-flex align-items-center gap-2"
              style={{
                color: "#0f1724",
              }}
            >
              <GeoAltFill size={16} color="#0e8a5f" />

              {officeName}
            </h6>

            <p
              className="text-secondary mb-2"
              style={{
                fontSize: "0.8rem",
              }}
            >
              {address}
              <br />
              {country}
              {pincode ? ` – ${pincode}` : ""}
            </p>

            {directionsLink && (
              <a
                href={directionsLink}
                target="_blank"
                rel="noreferrer"
                className="fw-medium text-decoration-none"
                style={{
                  color: "#0e8a5f",
                  fontSize: "0.8rem",
                }}
              >
                {directionsText}
              </a>
            )}
          </div>
        </div>

        {fullAddress && (
          <div className="mt-3 text-secondary" style={{ fontSize: "0.85rem" }}>
            {fullAddress}
          </div>
        )}
      </div>
    </section>
  );
};

export default OfficeLocation;
