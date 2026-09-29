import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ClipboardCheckFill,
  CalendarEventFill,
  ClockFill,
  GeoAltFill,
  ArrowRight,
} from "react-bootstrap-icons";

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getBookingStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";

    case "accepted":
      return "Upcoming";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "rejected":
      return "Rejected";

    default:
      return status || "Unknown";
  }
};

const getTabCounts = (counts = {}) => [
  {
    key: "upcoming",
    label: "Upcoming",
    count: counts.upcoming || 0,
  },
  {
    key: "completed",
    label: "Completed",
    count: counts.completed || 0,
  },
  {
    key: "cancelled",
    label: "Cancelled",
    count: counts.cancelled || 0,
  },
];

const MyBookings = ({ bookings = [], counts = {} }) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const tabs = getTabCounts(counts);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "upcoming") {
      return ["pending", "accepted"].includes(booking.status);
    }

    if (activeTab === "completed") {
      return booking.status === "completed";
    }

    if (activeTab === "cancelled") {
      return ["cancelled", "rejected"].includes(booking.status);
    }

    return false;
  });

  return (
    <section className="py-2">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <ClipboardCheckFill size={20} color="#0e8a5f" />

              <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                My Bookings
              </h5>
            </div>

            <a
              href="#all-bookings"
              className="d-flex align-items-center gap-1 fw-medium text-decoration-none"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              View all bookings <ArrowRight size={14} />
            </a>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="btn rounded-3 px-3 py-2 fw-medium"
                style={{
                  backgroundColor:
                    activeTab === tab.key ? "#0e8a5f" : "#ffffff",

                  color: activeTab === tab.key ? "#ffffff" : "#0f1724",

                  border: activeTab === tab.key ? "none" : "1px solid #d9dee3",

                  fontSize: "0.9rem",
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <p className="text-secondary text-center py-4 mb-0">
              No {activeTab} bookings.
            </p>
          ) : (
            <div className="d-flex flex-column">
              {filteredBookings.map((booking, index) => (
                <div key={booking._id || index}>
                  <div className="d-flex flex-wrap align-items-center gap-3 py-3">
                    <img
                      src={
                        booking.service?.image ||
                        "https://via.placeholder.com/120x120?text=Service"
                      }
                      alt={booking.service?.name || "Service"}
                      className="rounded-3 flex-shrink-0"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-2" style={{ color: "#0f1724" }}>
                        {booking.service?.name || "Service"}
                      </h6>

                      <div
                        className="d-flex flex-wrap gap-3 text-secondary mb-2"
                        style={{ fontSize: "0.82rem" }}
                      >
                        <span className="d-flex align-items-center gap-1">
                          <CalendarEventFill size={12} />
                          {formatDate(booking.date)}
                        </span>

                        <span className="d-flex align-items-center gap-1">
                          <ClockFill size={12} />
                          {formatTime(booking.date)}
                        </span>
                      </div>

                      <div
                        className="d-flex align-items-center gap-1 text-secondary mb-2"
                        style={{ fontSize: "0.82rem" }}
                      >
                        <GeoAltFill size={12} />

                        {booking.address || "-"}
                      </div>

                      <span
                        className="badge rounded-pill fw-medium"
                        style={{
                          backgroundColor: "#e6f4ee",
                          color: "#0e8a5f",
                          fontSize: "0.75rem",
                          padding: "5px 12px",
                        }}
                      >
                        {getBookingStatus(booking.status)}
                      </span>
                    </div>

                    <div className="text-end flex-shrink-0">
                      <h6 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
                        {booking.service?.price !== null &&
                        booking.service?.price !== undefined
                          ? `₹${booking.service.price}`
                          : "-"}
                      </h6>

                      <button
                        type="button"
                        className="btn rounded-3 px-3 py-2 fw-medium"
                        style={{
                          border: "1.5px solid #0e8a5f",
                          color: "#0e8a5f",
                          fontSize: "0.85rem",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {index !== filteredBookings.length - 1 && (
                    <hr className="m-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBookings;
