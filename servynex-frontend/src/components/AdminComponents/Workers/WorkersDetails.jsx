import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronLeft,
  XLg,
  TelephoneFill,
  EnvelopeFill,
  GeoAltFill,
  CalendarEventFill,
  PencilFill,
  StarFill,
  ThreeDotsVertical,
  LightningChargeFill,
  Snow,
  Droplet,
  SlashCircleFill,
  TrashFill,
} from "react-bootstrap-icons";

const tabs = ["Overview", "Bookings", "Reviews", "Activity"];

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const formatDate = (value) => {
  if (!value) {
    return "Not Available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getServiceIcon = (serviceName) => {
  const service = String(serviceName || "").toLowerCase();

  if (service.includes("ac")) {
    return {
      icon: <Snow size={16} color="#185fa5" />,
      iconBg: "#e0edfb",
    };
  }

  if (service.includes("plumb")) {
    return {
      icon: <Droplet size={16} color="#dc3545" />,
      iconBg: "#fdecec",
    };
  }

  return {
    icon: <LightningChargeFill size={16} color="#0e8a5f" />,
    iconBg: "#e6f4ee",
  };
};

const WorkerDetails = ({
  worker,
  reviews = [],
  activity = [],
  loading = false,
  onClose,
  onBlock,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");

  if (loading) {
    return (
      <div
        className="bg-white h-100 d-flex flex-column"
        style={{
          width: "380px",
          borderLeft: "1px solid #eef0f2",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <button className="btn p-0" style={{ color: "#6b7280" }}>
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={onClose}
            className="btn p-0"
            style={{ color: "#6b7280" }}
          >
            <XLg size={16} />
          </button>
        </div>

        <div className="p-3 text-center text-secondary">
          Loading worker details...
        </div>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  const statistics = worker.statistics || worker.stats || {};

  const recentBookings = Array.isArray(worker.recentBookings)
    ? worker.recentBookings
    : [];

  const workerName = getValue(worker.name);
  const workerInitial =
    workerName !== "Not Available"
      ? String(workerName).charAt(0).toUpperCase()
      : "W";

  return (
    <div
      className="bg-white h-100 d-flex flex-column"
      style={{
        width: "380px",
        borderLeft: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <button className="btn p-0" style={{ color: "#6b7280" }}>
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
        >
          <XLg size={16} />
        </button>
      </div>

      <div className="p-3" style={{ overflowY: "auto" }}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#e6f4ee",
              color: "#0e8a5f",
              fontWeight: 700,
              fontSize: "1.4rem",
            }}
          >
            {workerInitial}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                {workerName}
              </h5>

              <span
                className="badge rounded-pill fw-medium"
                style={{
                  backgroundColor: worker.isBlocked ? "#fdecec" : "#e6f4ee",
                  color: worker.isBlocked ? "#dc3545" : "#0e8a5f",
                  fontSize: "0.68rem",
                }}
              >
                {worker.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <TelephoneFill size={12} />
              {getValue(worker.phone)}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <EnvelopeFill size={12} />
              {getValue(worker.email)}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <GeoAltFill size={12} />
              {getValue(worker.address || worker.location)}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-0"
              style={{ fontSize: "0.82rem" }}
            >
              <CalendarEventFill size={12} />
              Joined on {formatDate(worker.createdAt)}
            </p>
          </div>
        </div>

        <div className="d-flex gap-3 mb-3 border-bottom">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn px-1 pb-2 rounded-0 fw-medium"
              style={{
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #0e8a5f"
                    : "2px solid transparent",
                color: activeTab === tab ? "#0e8a5f" : "#6b7280",
                fontSize: "0.86rem",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                  fontSize: "0.92rem",
                }}
              >
                Worker Information
              </h6>

              <button
                className="btn btn-sm d-flex align-items-center gap-1 rounded-2 px-2 py-1"
                style={{
                  border: "1px solid #d9dee3",
                  fontSize: "0.75rem",
                }}
              >
                <PencilFill size={11} /> Edit
              </button>
            </div>

            <div className="mb-3">
              {[
                ["Full Name", worker.name],
                ["Phone Number", worker.phone],
                ["Email Address", worker.email],
                ["Address", worker.address],
                ["Location", worker.location],
                ["Experience", worker.experience],
                ["Availability", worker.availability],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between py-2"
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    className="text-secondary"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {label}
                  </span>

                  <span
                    className="fw-medium text-end"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.82rem",
                    }}
                  >
                    {getValue(value)}
                  </span>
                </div>
              ))}
            </div>

            <h6
              className="fw-bold mb-2"
              style={{
                color: "#0f1724",
                fontSize: "0.92rem",
              }}
            >
              Statistics
            </h6>

            <div className="row g-2 mb-3">
              {[
                {
                  label: "Total Bookings",
                  value: statistics.totalBookings,
                },
                {
                  label: "Pending",
                  value: statistics.pendingBookings,
                },
                {
                  label: "Accepted",
                  value: statistics.acceptedBookings,
                },
                {
                  label: "Completed",
                  value: statistics.completedBookings,
                },
                {
                  label: "Cancelled",
                  value: statistics.cancelledBookings,
                },
              ].map((s, i) => (
                <div className="col-4" key={i}>
                  <div
                    className="rounded-3 p-2 text-center"
                    style={{
                      backgroundColor: "#f8fafb",
                    }}
                  >
                    <h6
                      className="fw-bold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.95rem",
                      }}
                    >
                      {getValue(s.value)}
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.68rem" }}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}

              <div className="col-4">
                <div
                  className="rounded-3 p-2 text-center"
                  style={{
                    backgroundColor: "#f8fafb",
                  }}
                >
                  <h6
                    className="fw-bold mb-0 d-flex align-items-center justify-content-center gap-1"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.95rem",
                    }}
                  >
                    {getValue(statistics.averageRating)}

                    <StarFill size={12} color="#f5b301" />
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.68rem" }}
                  >
                    Average Rating
                  </p>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                  fontSize: "0.92rem",
                }}
              >
                Recent Bookings
              </h6>

              <a
                href="#all-bookings"
                className="fw-medium text-decoration-none"
                style={{
                  color: "#0e8a5f",
                  fontSize: "0.78rem",
                }}
              >
                View All
              </a>
            </div>

            {recentBookings.length === 0 ? (
              <p
                className="text-secondary text-center py-3 mb-0"
                style={{ fontSize: "0.82rem" }}
              >
                No recent bookings available.
              </p>
            ) : (
              recentBookings.map((booking, i) => {
                const serviceName = booking.service?.name || booking.service;

                const serviceIcon = getServiceIcon(serviceName);

                return (
                  <div
                    key={booking._id || i}
                    className="d-flex align-items-center gap-2 py-2"
                    style={{
                      borderBottom:
                        i !== recentBookings.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: serviceIcon.iconBg,
                      }}
                    >
                      {serviceIcon.icon}
                    </div>

                    <div className="flex-grow-1">
                      <p
                        className="fw-medium mb-0"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.84rem",
                        }}
                      >
                        {getValue(serviceName)}
                      </p>

                      <p
                        className="mb-0"
                        style={{
                          color:
                            booking.status === "cancelled"
                              ? "#dc3545"
                              : "#0e8a5f",
                          fontSize: "0.74rem",
                        }}
                      >
                        {getValue(booking.status)}
                      </p>
                    </div>

                    <div className="text-end flex-shrink-0">
                      <p
                        className="fw-bold mb-0"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.84rem",
                        }}
                      >
                        {getValue(booking.amount)}
                      </p>

                      <p
                        className="text-secondary mb-0"
                        style={{ fontSize: "0.72rem" }}
                      >
                        {formatDate(booking.date || booking.createdAt)}
                      </p>
                    </div>

                    <ThreeDotsVertical
                      size={14}
                      className="text-secondary flex-shrink-0"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === "Bookings" && (
          <p className="text-secondary text-center py-5">
            {recentBookings.length
              ? `${recentBookings.length} recent bookings available.`
              : "No bookings available."}
          </p>
        )}

        {activeTab === "Reviews" && (
          <p className="text-secondary text-center py-5">
            {reviews.length
              ? `${reviews.length} reviews available.`
              : "No reviews available."}
          </p>
        )}

        {activeTab === "Activity" && (
          <p className="text-secondary text-center py-5">
            {activity.length
              ? `${activity.length} activities available.`
              : "No activity available."}
          </p>
        )}
      </div>

      <div className="p-3 border-top d-flex gap-2">
        <button
          onClick={onBlock}
          className="btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold py-2"
          style={{
            border: "1.5px solid #dc3545",
            color: "#dc3545",
            fontSize: "0.85rem",
          }}
        >
          <SlashCircleFill size={14} />
          Block Worker
        </button>

        <button
          onClick={onDelete}
          className="btn flex-fill text-white d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold py-2"
          style={{
            backgroundColor: "#dc3545",
            fontSize: "0.85rem",
          }}
        >
          <TrashFill size={14} />
          Delete Worker
        </button>
      </div>
    </div>
  );
};

export default WorkerDetails;
