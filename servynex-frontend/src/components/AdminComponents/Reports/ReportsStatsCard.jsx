import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CalendarEventFill,
  PersonFill,
  PersonBadgeFill,
  StarFill,
  XCircleFill,
} from "react-bootstrap-icons";

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

const formatPercentage = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const percentage = Number(value);

  if (!Number.isFinite(percentage)) {
    return "Data Not Available";
  }

  return `${percentage}%`;
};

const buildStats = (overview = {}) => [
  {
    label: "Total Bookings",
    value: formatValue(overview.totalBookings),
    note: "Data Not Available",
    icon: <CalendarEventFill size={20} color="#ffffff" />,
    iconBg: "#0e8a5f",
  },
  {
    label: "Total Revenue",
    value: formatCurrency(overview.totalRevenue),
    note: "Data Not Available",
    icon: (
      <span
        className="fw-bold"
        style={{
          color: "#fff",
          fontSize: "18px",
        }}
      >
        ₹
      </span>
    ),
    iconBg: "#0e8a5f",
  },
  {
    label: "Total Customers",
    value: formatValue(overview.totalCustomers),
    note: "Data Not Available",
    icon: <PersonFill size={20} color="#ffffff" />,
    iconBg: "#185fa5",
  },
  {
    label: "Active Workers",
    value: formatValue(overview.activeWorkers),
    note: "Data Not Available",
    icon: <PersonBadgeFill size={20} color="#ffffff" />,
    iconBg: "#d18a1c",
  },
  {
    label: "Average Rating",
    value: formatRating(overview.averageRating),
    note: "Data Not Available",
    icon: <StarFill size={20} color="#ffffff" />,
    iconBg: "#7c5ad1",
  },
  {
    label: "Cancellation Rate",
    value: formatPercentage(overview.cancellationRate),
    note: "Data Not Available",
    icon: <XCircleFill size={20} color="#ffffff" />,
    iconBg: "#dc3545",
  },
];

const ReportsStatsCards = ({ overview = {}, loading = false }) => {
  const stats = buildStats(overview);

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div className="row g-3">
          {stats.map((stat) => (
            <div className="col-6 col-lg-2" key={stat.label}>
              <div
                className="rounded-4 p-3 h-100 bg-white d-flex align-items-start gap-2"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: stat.iconBg,
                  }}
                >
                  {stat.icon}
                </div>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <p
                    className="text-secondary mb-1 text-truncate"
                    style={{
                      fontSize: "0.76rem",
                    }}
                  >
                    {stat.label}
                  </p>

                  <h5
                    className="fw-bold mb-1"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    {loading ? "Loading..." : stat.value}
                  </h5>

                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: "#6c757d",
                      fontSize: "0.7rem",
                    }}
                  >
                    {loading ? "Loading..." : stat.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReportsStatsCards;
