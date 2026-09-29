import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  XLg,
  TelephoneFill,
  PersonFill,
  StarFill,
  ReceiptCutoff,
  PersonPlusFill,
  ArrowRepeat,
  CheckCircleFill,
} from "react-bootstrap-icons";

const getDisplayValue = (value) => {
  if (value === undefined) {
    return "Field Not Available";
  }

  if (value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const getInitials = (name) => {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (value) => {
  if (!value) {
    return "Not Available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not Available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  if (status === undefined) {
    return "Field Not Available";
  }

  if (!status) {
    return "Not Available";
  }

  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return {
        backgroundColor: "#fdf1de",
        color: "#b5730a",
      };

    case "accepted":
      return {
        backgroundColor: "#e0edfb",
        color: "#185fa5",
      };

    case "in-progress":
    case "in_progress":
      return {
        backgroundColor: "#e0edfb",
        color: "#185fa5",
      };

    case "completed":
      return {
        backgroundColor: "#e6f4ee",
        color: "#0e8a5f",
      };

    case "cancelled":
      return {
        backgroundColor: "#fdecec",
        color: "#dc3545",
      };

    default:
      return {
        backgroundColor: "#f1f3f5",
        color: "#6c757d",
      };
  }
};

const InfoRow = ({ label, value }) => {
  return (
    <div
      className="d-flex justify-content-between py-1 gap-3"
      style={{ fontSize: "0.82rem" }}
    >
      <span className="text-secondary flex-shrink-0">{label}</span>

      <span className="fw-medium text-end" style={{ color: "#0f1724" }}>
        {value}
      </span>
    </div>
  );
};

const BookingDetails = ({
  booking,
  loading = false,
  actionLoading = false,
  onClose,
  onAssignWorker,
  onReassignWorker,
  onCancelBooking,
  onCompleteBooking,
  onViewCustomer,
  onViewWorker,
  onCallCustomer,
  onCallWorker,
  onInvoice,
}) => {
  if (!booking && !loading) {
    return null;
  }

  const customer = useMemo(() => {
    if (!booking) {
      return null;
    }

    return booking.user || booking.customer || null;
  }, [booking]);

  const worker = useMemo(() => {
    if (!booking) {
      return null;
    }

    return booking.worker || null;
  }, [booking]);

  const service = useMemo(() => {
    if (!booking) {
      return null;
    }

    return booking.service || null;
  }, [booking]);

  const category = useMemo(() => {
    if (!booking) {
      return null;
    }

    return booking.category || service?.category || null;
  }, [booking, service]);

  const payment = useMemo(() => {
    if (!booking) {
      return null;
    }

    return booking.payment || null;
  }, [booking]);

  const status = booking?.status;

  const statusStyle = getStatusStyle(status);

  const timeline = useMemo(() => {
    if (!booking) {
      return [];
    }

    const events = [];

    if (booking.createdAt) {
      events.push({
        label: "Booking Created",
        time: booking.createdAt,
      });
    }

    if (booking.assignedAt) {
      events.push({
        label: "Worker Assigned",
        time: booking.assignedAt,
      });
    }

    if (booking.acceptedAt) {
      events.push({
        label: "Worker Accepted",
        time: booking.acceptedAt,
      });
    }

    if (booking.startedAt) {
      events.push({
        label: "Worker Started",
        time: booking.startedAt,
      });
    }

    if (booking.completedAt) {
      events.push({
        label: "Service Completed",
        time: booking.completedAt,
      });
    }

    if (payment?.paymentDate) {
      events.push({
        label: "Payment Completed",
        time: payment.paymentDate,
      });
    }

    return events;
  }, [booking, payment]);

  const handleAction = (callback) => {
    if (typeof callback === "function") {
      callback(booking);
    }
  };

  if (loading) {
    return (
      <div
        className="bg-white d-flex flex-column flex-shrink-0 h-100"
        style={{
          width: "370px",
          borderLeft: "1px solid #eef0f2",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
            Booking Details
          </h6>

          <button
            type="button"
            onClick={onClose}
            className="btn p-0"
            style={{ color: "#6b7280" }}
          >
            <XLg size={16} />
          </button>
        </div>

        <div className="p-4 text-center text-secondary">
          Loading booking details...
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white d-flex flex-column flex-shrink-0 h-100"
      style={{
        width: "370px",
        borderLeft: "1px solid #eef0f2",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Booking Details
        </h6>

        <button
          type="button"
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
        >
          <XLg size={16} />
        </button>
      </div>

      <div className="p-3">
        {/* Booking ID + status */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div>
            <p className="text-secondary mb-0" style={{ fontSize: "0.76rem" }}>
              Booking ID
            </p>

            <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              {getDisplayValue(booking?.bookingId || booking?._id)}
            </h6>
          </div>

          <span
            className="badge rounded-pill fw-medium"
            style={{
              backgroundColor: statusStyle.backgroundColor,
              color: statusStyle.color,
              fontSize: "0.72rem",
            }}
          >
            {formatStatus(status)}
          </span>
        </div>

        <p className="text-secondary mb-3" style={{ fontSize: "0.78rem" }}>
          Booked on: {formatDateTime(booking?.createdAt || booking?.date)}
        </p>

        <hr />

        {/* Booking Information */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Booking Information
        </h6>

        <InfoRow
          label="Scheduled Date & Time"
          value={booking?.date ? formatDateTime(booking.date) : "Not Available"}
        />

        <InfoRow
          label="Service Duration"
          value={getDisplayValue(booking?.duration || booking?.serviceDuration)}
        />

        <InfoRow
          label="Current Status"
          value={
            <span
              style={{
                color: statusStyle.color,
                fontWeight: 600,
              }}
            >
              {formatStatus(status)}
            </span>
          }
        />

        <hr />

        {/* Customer Details */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Customer Details
        </h6>

        <div className="d-flex align-items-start gap-2 mb-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              backgroundColor: "#e6f4ee",
              color: "#0e8a5f",
              fontWeight: 700,
            }}
          >
            {getInitials(customer?.name)}
          </div>

          <div>
            <p
              className="fw-semibold mb-0"
              style={{
                color: "#0f1724",
                fontSize: "0.86rem",
              }}
            >
              {getDisplayValue(customer?.name)}
            </p>

            <p className="text-secondary mb-0" style={{ fontSize: "0.78rem" }}>
              {getDisplayValue(customer?.phone)}
            </p>

            <p className="text-secondary mb-0" style={{ fontSize: "0.78rem" }}>
              {getDisplayValue(customer?.email)}
            </p>

            <p className="text-secondary mb-0" style={{ fontSize: "0.78rem" }}>
              {getDisplayValue(
                booking?.address || customer?.address || customer?.location
              )}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => handleAction(onCallCustomer)}
            disabled={!customer?.phone || actionLoading}
            className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
            style={{
              border: "1px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            <TelephoneFill size={12} />
            Call
          </button>

          <button
            type="button"
            onClick={() => handleAction(onViewCustomer)}
            disabled={actionLoading}
            className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
            style={{
              border: "1px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            <PersonFill size={12} />
            View Customer
          </button>
        </div>

        <hr />

        {/* Worker Details */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Worker Details
        </h6>

        {worker ? (
          <>
            <div className="d-flex align-items-start gap-2 mb-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#e0edfb",
                  color: "#185fa5",
                  fontWeight: 700,
                }}
              >
                {getInitials(worker?.name)}
              </div>

              <div>
                <p
                  className="fw-semibold mb-0"
                  style={{
                    color: "#0f1724",
                    fontSize: "0.86rem",
                  }}
                >
                  {getDisplayValue(worker?.name)}
                </p>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.78rem" }}
                >
                  {getDisplayValue(
                    worker?.role ||
                      worker?.profession ||
                      worker?.skills?.join(", ")
                  )}
                </p>
              </div>

              <span
                className="ms-auto d-flex align-items-center gap-1 fw-semibold"
                style={{
                  fontSize: "0.85rem",
                  color: "#0f1724",
                }}
              >
                {worker?.rating !== undefined && worker?.rating !== null
                  ? worker.rating
                  : "Field Not Available"}

                {worker?.rating !== undefined && worker?.rating !== null && (
                  <StarFill size={13} color="#f5b301" />
                )}
              </span>
            </div>

            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleAction(onCallWorker)}
                disabled={!worker?.phone || actionLoading}
                className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
                style={{
                  border: "1px solid #0e8a5f",
                  color: "#0e8a5f",
                  fontSize: "0.78rem",
                }}
              >
                <TelephoneFill size={12} />
                Call
              </button>

              <button
                type="button"
                onClick={() => handleAction(onViewWorker)}
                disabled={actionLoading}
                className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
                style={{
                  border: "1px solid #0e8a5f",
                  color: "#0e8a5f",
                  fontSize: "0.78rem",
                }}
              >
                <PersonFill size={12} />
                View Worker
              </button>
            </div>
          </>
        ) : (
          <div className="mb-3">
            <p className="text-secondary mb-2" style={{ fontSize: "0.85rem" }}>
              No worker assigned yet.
            </p>

            <button
              type="button"
              onClick={() => handleAction(onAssignWorker)}
              disabled={actionLoading}
              className="btn btn-sm d-flex align-items-center gap-1 rounded-3"
              style={{
                border: "1px solid #0e8a5f",
                color: "#0e8a5f",
                fontSize: "0.78rem",
              }}
            >
              <PersonPlusFill size={12} />
              Assign Worker
            </button>
          </div>
        )}

        <hr />

        {/* Service Details */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Service Details
        </h6>

        <InfoRow label="Service" value={getDisplayValue(service?.name)} />

        <InfoRow
          label="Category"
          value={getDisplayValue(
            typeof category === "object" ? category?.name : category
          )}
        />

        <InfoRow
          label="Problem Description"
          value={getDisplayValue(
            booking?.problem ||
              booking?.problemDescription ||
              booking?.description
          )}
        />

        <InfoRow
          label="Customer Notes"
          value={getDisplayValue(booking?.notes || booking?.customerNotes)}
        />

        <InfoRow
          label="Estimated Duration"
          value={getDisplayValue(booking?.duration || booking?.serviceDuration)}
        />

        <hr />

        {/* Payment Details */}
        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Payment Details
        </h6>

        <div className="row" style={{ fontSize: "0.82rem" }}>
          <div className="col-6">
            <InfoRow
              label="Service Amount"
              value={getDisplayValue(payment?.serviceAmount || payment?.amount)}
            />

            <InfoRow
              label="Discount"
              value={getDisplayValue(payment?.discount)}
            />

            <InfoRow label="Tax" value={getDisplayValue(payment?.gst)} />

            <InfoRow
              label="Total Amount"
              value={
                payment?.totalAmount !== undefined &&
                payment?.totalAmount !== null ? (
                  <span
                    className="fw-bold"
                    style={{
                      color: "#0e8a5f",
                    }}
                  >
                    ₹{Number(payment.totalAmount).toLocaleString("en-IN")}
                  </span>
                ) : (
                  "Field Not Available"
                )
              }
            />
          </div>

          <div className="col-6">
            <InfoRow
              label="Payment Method"
              value={getDisplayValue(payment?.paymentMethod)}
            />

            <InfoRow
              label="Payment Status"
              value={getDisplayValue(payment?.status)}
            />

            <InfoRow
              label="Paid On"
              value={
                payment?.paymentDate
                  ? formatDateTime(payment.paymentDate)
                  : "Not Available"
              }
            />

            <InfoRow
              label="Transaction ID"
              value={getDisplayValue(payment?.transactionId)}
            />
          </div>
        </div>

        <hr />

        {/* Booking Timeline */}
        <h6
          className="fw-bold mb-3"
          style={{
            color: "#0f1724",
            fontSize: "0.9rem",
          }}
        >
          Booking Timeline
        </h6>

        {timeline.length > 0 ? (
          timeline.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="d-flex align-items-start gap-2 pb-2"
            >
              <CheckCircleFill
                size={15}
                color="#0e8a5f"
                className="flex-shrink-0 mt-1"
              />

              <div>
                <p
                  className="fw-medium mb-0"
                  style={{
                    color: "#0f1724",
                    fontSize: "0.84rem",
                  }}
                >
                  {item.label}
                </p>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.74rem" }}
                >
                  {formatDateTime(item.time)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-secondary mb-0" style={{ fontSize: "0.82rem" }}>
            Timeline data not available.
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-top">
        <div className="d-flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleAction(onInvoice)}
            disabled={actionLoading || typeof onInvoice !== "function"}
            className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
            style={{
              border: "1px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            <ReceiptCutoff size={12} />
            Invoice
          </button>

          <button
            type="button"
            onClick={() => handleAction(onAssignWorker)}
            disabled={actionLoading || typeof onAssignWorker !== "function"}
            className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
            style={{
              border: "1px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            <PersonPlusFill size={12} />
            Assign
          </button>

          <button
            type="button"
            onClick={() => handleAction(onReassignWorker)}
            disabled={
              actionLoading || !worker || typeof onReassignWorker !== "function"
            }
            className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 rounded-3"
            style={{
              border: "1px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            <ArrowRepeat size={12} />
            Reassign
          </button>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={() => handleAction(onCancelBooking)}
            disabled={
              actionLoading ||
              status === "cancelled" ||
              typeof onCancelBooking !== "function"
            }
            className="btn flex-fill rounded-3 fw-semibold py-2"
            style={{
              border: "1.5px solid #dc3545",
              color: "#dc3545",
              fontSize: "0.85rem",
            }}
          >
            Cancel Booking
          </button>

          <button
            type="button"
            onClick={() => handleAction(onCompleteBooking)}
            disabled={
              actionLoading ||
              status === "completed" ||
              status === "cancelled" ||
              typeof onCompleteBooking !== "function"
            }
            className="btn flex-fill text-white rounded-3 fw-semibold py-2"
            style={{
              backgroundColor: "#0e8a5f",
              fontSize: "0.85rem",
            }}
          >
            {actionLoading ? "Processing..." : "Mark Completed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
