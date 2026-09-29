import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  GeoAltFill,
  HouseFill,
  BriefcaseFill,
  ThreeDotsVertical,
  PlusCircleFill,
  ArrowRight,
} from "react-bootstrap-icons";

const getAddressIcon = (label) => {
  const normalizedLabel = label?.toLowerCase();

  if (normalizedLabel === "office" || normalizedLabel === "work") {
    return <BriefcaseFill size={16} color="#0f1724" />;
  }

  return <HouseFill size={16} color="#0e8a5f" />;
};

const getAddressLines = (address) => {
  const lines = [];

  if (address?.address) {
    lines.push(address.address);
  }

  const locationLine = [address?.city, address?.pincode]
    .filter(Boolean)
    .join(" - ");

  if (locationLine) {
    lines.push(
      address?.state ? `${locationLine}, ${address.state}` : locationLine
    );
  }

  return lines;
};

const Addresses = ({ addresses = [] }) => {
  return (
    <section className="py-2">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <GeoAltFill size={20} color="#0e8a5f" />

              <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                Saved Addresses
              </h5>
            </div>

            <a
              href="#manage-addresses"
              className="d-flex align-items-center gap-1 fw-medium text-decoration-none"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Manage Addresses <ArrowRight size={14} />
            </a>
          </div>

          <div className="row g-3">
            {addresses.map((addr) => {
              const addressLines = getAddressLines(addr);

              return (
                <div className="col-md-4" key={addr._id}>
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        {getAddressIcon(addr.label)}

                        <h6
                          className="fw-semibold mb-0"
                          style={{ color: "#0f1724" }}
                        >
                          {addr.label || "Address"}
                        </h6>

                        {addr.isDefault && (
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: "#e6f4ee",
                              color: "#0e8a5f",
                              fontSize: "0.68rem",
                            }}
                          >
                            Default
                          </span>
                        )}
                      </div>

                      <ThreeDotsVertical
                        size={16}
                        className="text-secondary"
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    <p
                      className="text-secondary mb-2"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {addressLines.map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>

                    {addr.phone && (
                      <p
                        className="text-secondary mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {addr.phone}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="col-md-4">
              <button
                type="button"
                className="btn w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-2 rounded-3"
                style={{
                  backgroundColor: "#f3faf6",
                  border: "1px dashed #0e8a5f",
                  minHeight: "140px",
                }}
              >
                <PlusCircleFill size={28} color="#0e8a5f" />

                <span className="fw-semibold" style={{ color: "#0e8a5f" }}>
                  Add New Address
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Addresses;
