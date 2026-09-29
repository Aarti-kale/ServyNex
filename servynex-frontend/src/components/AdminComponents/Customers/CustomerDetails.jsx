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

const recentBookings = [
  {
    service: "Electrician",
    status: "Completed",
    amount: "₹1,200",
    date: "25 May 2025",
    icon: <LightningChargeFill size={16} color="#0e8a5f" />,
    iconBg: "#e6f4ee",
    statusColor: "#0e8a5f",
  },
  {
    service: "AC Repair",
    status: "Completed",
    amount: "₹2,450",
    date: "22 May 2025",
    icon: <Snow size={16} color="#185fa5" />,
    iconBg: "#e0edfb",
    statusColor: "#0e8a5f",
  },
  {
    service: "Plumbing",
    status: "Cancelled",
    amount: "₹0",
    date: "19 May 2025",
    icon: <Droplet size={16} color="#dc3545" />,
    iconBg: "#fdecec",
    statusColor: "#dc3545",
  },
];

const getValue = (value) => {
  if (value === undefined) {
    return "Field Not Available";
  }

  if (value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not Available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CustomerDetails = ({
  customer,
  onClose,
  onBlock,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!customer) {
    return null;
  }

  const customerName = getValue(customer.name);
  const customerPhone = getValue(customer.phone);
  const customerEmail = getValue(customer.email);
  const customerAddress = getValue(customer.address);

  const status = customer.isBlocked ? "Blocked" : "Active";

  return (
    <div
      className="bg-white h-100 d-flex flex-column"
      style={{
        width: "380px",
        borderLeft: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <button
          type="button"
          className="btn p-0"
          style={{ color: "#6b7280" }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
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
            {customerName !== "Not Available"
              ? customerName.charAt(0).toUpperCase()
              : "?"}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5
                className="fw-bold mb-0"
                style={{ color: "#0f1724" }}
              >
                {customerName}
              </h5>

              <span
                className="badge rounded-pill fw-medium"
                style={{
                  backgroundColor:
                    status === "Active"
                      ? "#e6f4ee"
                      : "#fdecec",
                  color:
                    status === "Active"
                      ? "#0e8a5f"
                      : "#dc3545",
                  fontSize: "0.68rem",
                }}
              >
                {status}
              </span>
            </div>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <TelephoneFill size={12} />
              {customerPhone}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <EnvelopeFill size={12} />
              {customerEmail}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-1"
              style={{ fontSize: "0.82rem" }}
            >
              <GeoAltFill size={12} />
              {customerAddress}
            </p>

            <p
              className="d-flex align-items-center gap-2 text-secondary mb-0"
              style={{ fontSize: "0.82rem" }}
            >
              <CalendarEventFill size={12} />
              Joined on {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>

        <div className="d-flex gap-3 mb-3 border-bottom">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="btn px-1 pb-2 rounded-0 fw-medium"
              style={{
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #0e8a5f"
                    : "2px solid transparent",
                color:
                  activeTab === tab
                    ? "#0e8a5f"
                    : "#6b7280",
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
                Customer Information
              </h6>

              <button
                type="button"
                className="btn btn-sm d-flex align-items-center gap-1 rounded-2 px-2 py-1"
                style={{
                  border: "1px solid #d9dee3",
                  fontSize: "0.75rem",
                }}
              >
                <PencilFill size={11} />
                Edit
              </button>
            </div>

            <div className="mb-3">
              {[
                ["Full Name", customer.name],
                ["Phone Number", customer.phone],
                ["Email Address", customer.email],
                ["Address", customer.address],
                ["City", customer.city],
                ["State", customer.state],
                ["Pincode", customer.pincode],
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
                ["Total Bookings", customer.totalBookings],
                ["Completed", customer.completed],
                ["Cancelled", customer.cancelled],
                ["Total Spent", customer.totalSpent],
                ["Average Spent", customer.avgSpent],
              ].map(([label, value], i) => (
                <div className="col-4" key={i}>
                  <div
                    className="rounded-3 p-2 text-center"
                    style={{ backgroundColor: "#f8fafb" }}
                  >
                    <h6
                      className="fw-bold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.95rem",
                      }}
                    >
                      {getValue(value)}
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.68rem" }}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              ))}

              <div className="col-4">
                <div
                  className="rounded-3 p-2 text-center"
                  style={{ backgroundColor: "#f8fafb" }}
                >
                  <h6
                    className="fw-bold mb-0 d-flex align-items-center justify-content-center gap-1"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.95rem",
                    }}
                  >
                    {getValue(customer.avgRating)}
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

            {recentBookings.map((booking, i) => (
              <div
                key={i}
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
                    backgroundColor: booking.iconBg,
                  }}
                >
                  {booking.icon}
                </div>

                <div className="flex-grow-1">
                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.84rem",
                    }}
                  >
                    {booking.service}
                  </p>

                  <p
                    className="mb-0"
                    style={{
                      color: booking.statusColor,
                      fontSize: "0.74rem",
                    }}
                  >
                    {booking.status}
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
                    {booking.amount}
                  </p>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {booking.date}
                  </p>
                </div>

                <ThreeDotsVertical
                  size={14}
                  className="text-secondary flex-shrink-0"
                  style={{ cursor: "pointer" }}
                />
              </div>
            ))}
          </>
        )}

        {activeTab !== "Overview" && (
          <p className="text-secondary text-center py-5">
            {activeTab} content goes here.
          </p>
        )}
      </div>

      <div className="p-3 border-top d-flex gap-2">
        <button
          type="button"
          onClick={onBlock}
          className="btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold py-2"
          style={{
            border: "1.5px solid #dc3545",
            color: "#dc3545",
            fontSize: "0.85rem",
          }}
        >
          <SlashCircleFill size={14} />
          Block Customer
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="btn flex-fill text-white d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold py-2"
          style={{
            backgroundColor: "#dc3545",
            fontSize: "0.85rem",
          }}
        >
          <TrashFill size={14} />
          Delete Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerDetails;