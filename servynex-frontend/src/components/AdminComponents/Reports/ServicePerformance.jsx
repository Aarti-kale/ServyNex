import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightningChargeFill,
  Droplet,
  Brush,
  PaletteFill,
  Snow,
  Hammer,
  GearFill,
  StarFill,
} from "react-bootstrap-icons";

const SERVICE_ICONS = [
  {
    icon: LightningChargeFill,
    color: "#d18a1c",
    background: "#fbedd6",
  },
  {
    icon: Droplet,
    color: "#185fa5",
    background: "#e0edfb",
  },
  {
    icon: Brush,
    color: "#0e8a5f",
    background: "#e6f4ee",
  },
  {
    icon: PaletteFill,
    color: "#7c5ad1",
    background: "#efe8fc",
  },
  {
    icon: Snow,
    color: "#185fa5",
    background: "#e0edfb",
  },
  {
    icon: Hammer,
    color: "#a9542c",
    background: "#f6e7dd",
  },
  {
    icon: GearFill,
    color: "#185fa5",
    background: "#e0edfb",
  },
];

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Data Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  return value;
};

const formatRating = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return "Data Not Available";
  }

  return rating.toFixed(1);
};

const getServiceIcon = (index) => {
  return SERVICE_ICONS[index % SERVICE_ICONS.length] || SERVICE_ICONS[0];
};

const ServicePerformance = ({ data = [], loading = false }) => {
  const services = Array.isArray(data) ? data : [];

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6
        className="fw-bold mb-3"
        style={{
          color: "#0f1724",
        }}
      >
        Service Performance
      </h6>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && services.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #eef0f2",
                }}
              >
                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  #
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Service
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Bookings
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Revenue
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Avg Rating
                </th>
              </tr>
            </thead>

            <tbody>
              {services.map((service, index) => {
                const serviceIcon = getServiceIcon(index);

                const Icon = serviceIcon.icon;

                const rating = formatRating(service?.averageRating);

                return (
                  <tr
                    key={
                      service?.serviceId ||
                      service?._id ||
                      `${service?.serviceName || "service"}-${index}`
                    }
                    style={{
                      borderBottom:
                        index !== services.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <td
                      className="py-2 text-secondary"
                      style={{
                        fontSize: "0.84rem",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: serviceIcon.background,
                          }}
                        >
                          <Icon size={16} color={serviceIcon.color} />
                        </div>

                        <span
                          className="fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.86rem",
                          }}
                        >
                          {formatValue(service?.serviceName)}
                        </span>
                      </div>
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.86rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatValue(service?.bookings)}
                    </td>

                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.86rem",
                      }}
                    >
                      {formatCurrency(service?.revenue)}
                    </td>

                    <td className="py-2">
                      <span
                        className="d-flex align-items-center gap-1"
                        style={{
                          fontSize: "0.86rem",
                          color: "#0f1724",
                        }}
                      >
                        {rating !== "Data Not Available" && (
                          <StarFill size={12} color="#f5b301" />
                        )}

                        {rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServicePerformance;
