import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { XLg, Download } from "react-bootstrap-icons";

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
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
    hour12: true,
  });
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const getInitial = (name) => {
  if (!name) {
    return "?";
  }

  return String(name).trim().charAt(0).toUpperCase();
};

const buildTimeline = (payment) => {
  const booking = payment?.booking;

  const events = [];

  if (booking?.createdAt) {
    events.push({
      label: "Booking Created",
      time: formatDateTime(booking.createdAt),
    });
  }

  if (payment?.createdAt) {
    events.push({
      label: "Payment Created",
      time: formatDateTime(payment.createdAt),
    });
  }

  if (payment?.paymentDate) {
    events.push({
      label: payment.status === "paid" ? "Payment Successful" : "Payment Date",
      time: formatDateTime(payment.paymentDate),
    });
  }

  if (booking?.worker && booking?.workerAssignedAt) {
    events.push({
      label: "Worker Assigned",
      time: formatDateTime(booking.workerAssignedAt),
    });
  }

  if (booking?.completedAt) {
    events.push({
      label: "Service Completed",
      time: formatDateTime(booking.completedAt),
    });
  }

  return events;
};

const getStatusColor = (status) => {
  if (status === "paid") {
    return "#0e8a5f";
  }

  if (status === "pending") {
    return "#d97706";
  }

  if (status === "failed") {
    return "#dc2626";
  }

  if (status === "refunded") {
    return "#7c3aed";
  }

  return "#6b7280";
};

const PaymentDetailPanel = ({
  payment,
  refunds = [],
  loading = false,
  onClose,
  onDownloadInvoice,
}) => {
  if (!payment) {
    return null;
  }

  const customer = payment.customer || {};
  const worker = payment.worker || {};
  const service = payment.service || {};
  const booking = payment.booking || {};

  const customerName = typeof customer === "string" ? customer : customer.name;

  const workerName = typeof worker === "string" ? worker : worker.name;

  const serviceName = typeof service === "string" ? service : service.name;

  const bookingId = booking.bookingId || booking._id || payment.bookingId;

  const paymentStatus = payment.status || "";

  const timeline = buildTimeline(payment);

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
          Payment Details
        </h6>

        <button
          type="button"
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
          aria-label="Close payment details"
        >
          <XLg size={16} />
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-center text-secondary">
          Loading payment details...
        </div>
      ) : (
        <>
          <div className="p-3">
            <h6
              className="fw-bold mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Customer Information
            </h6>

            <div className="d-flex align-items-start gap-2 mb-3">
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
                {getInitial(customerName)}
              </div>

              <div>
                <p
                  className="fw-semibold mb-0"
                  style={{
                    color: "#0f1724",
                    fontSize: "0.86rem",
                  }}
                >
                  {displayValue(customerName)}
                </p>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.78rem" }}
                >
                  {displayValue(customer.phone)}
                </p>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.78rem" }}
                >
                  {displayValue(customer.email)}
                </p>
              </div>
            </div>

            <hr />

            <h6
              className="fw-bold mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Booking Information
            </h6>

            {[
              ["Booking ID", bookingId],
              ["Service", serviceName],
              ["Worker", workerName],
              [
                "Booking Date",
                booking.date
                  ? `${booking.date}${booking.time ? `, ${booking.time}` : ""}`
                  : "Not Available",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="d-flex justify-content-between py-1 gap-3"
                style={{ fontSize: "0.82rem" }}
              >
                <span className="text-secondary">{label}</span>

                <span
                  className="fw-medium text-end"
                  style={{ color: "#0f1724" }}
                >
                  {displayValue(value)}
                </span>
              </div>
            ))}

            <hr />

            <h6
              className="fw-bold mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Payment Breakdown
            </h6>

            {[
              ["Service Amount", payment.serviceAmount ?? payment.amount],
              ["GST", payment.gst],
              [
                "Discount",
                payment.discount !== undefined
                  ? formatCurrency(payment.discount)
                  : "Not Available",
              ],
              [
                "Coupon Discount",
                payment.couponDiscount !== undefined
                  ? formatCurrency(payment.couponDiscount)
                  : "Not Available",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="d-flex justify-content-between py-1"
                style={{ fontSize: "0.82rem" }}
              >
                <span className="text-secondary">{label}</span>

                <span className="fw-medium" style={{ color: "#0f1724" }}>
                  {typeof value === "number"
                    ? formatCurrency(value)
                    : displayValue(value)}
                </span>
              </div>
            ))}

            <div
              className="d-flex justify-content-between py-2 mt-1"
              style={{
                borderTop: "1px solid #eef0f2",
              }}
            >
              <span className="fw-bold" style={{ color: "#0f1724" }}>
                Total Amount
              </span>

              <span className="fw-bold" style={{ color: "#0e8a5f" }}>
                {formatCurrency(payment.totalAmount)}
              </span>
            </div>

            <hr />

            <h6
              className="fw-bold mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Transaction Details
            </h6>

            {[
              ["Payment ID", payment.paymentId],
              ["Transaction ID", payment.transactionId],
              ["Payment Method", payment.paymentMethod],
              ["UPI ID", payment.upiId],
              ["Payment Status", paymentStatus],
              ["Payment Date", formatDateTime(payment.paymentDate)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="d-flex justify-content-between py-1 gap-2"
                style={{ fontSize: "0.82rem" }}
              >
                <span className="text-secondary flex-shrink-0">{label}</span>

                <span
                  className="fw-medium text-end"
                  style={{
                    color:
                      label === "Payment Status"
                        ? getStatusColor(paymentStatus)
                        : "#0f1724",
                    fontWeight: label === "Payment Status" ? 600 : undefined,
                  }}
                >
                  {displayValue(value)}
                </span>
              </div>
            ))}

            <hr />

            <h6
              className="fw-bold mb-3"
              style={{
                color: "#0e8a5f",
                fontSize: "0.9rem",
              }}
            >
              Payment Timeline
            </h6>

            {timeline.length > 0 ? (
              timeline.map((event, index) => (
                <div
                  key={`${event.label}-${index}`}
                  className="d-flex align-items-start gap-2 pb-2"
                >
                  <span
                    className="rounded-circle flex-shrink-0 mt-1"
                    style={{
                      width: "9px",
                      height: "9px",
                      backgroundColor: "#0e8a5f",
                      display: "inline-block",
                    }}
                  />

                  <div>
                    <p
                      className="fw-medium mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.84rem",
                      }}
                    >
                      {event.label}
                    </p>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.74rem" }}
                    >
                      {event.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>
                Payment timeline not available
              </p>
            )}

            {refunds.length > 0 && (
              <>
                <hr />

                <h6
                  className="fw-bold mb-2"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "0.9rem",
                  }}
                >
                  Refund Information
                </h6>

                {refunds.map((refund) => (
                  <div
                    key={refund._id}
                    className="d-flex justify-content-between py-1"
                    style={{ fontSize: "0.82rem" }}
                  >
                    <span className="text-secondary">{refund.status}</span>

                    <span className="fw-medium" style={{ color: "#0f1724" }}>
                      {formatCurrency(refund.amount)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="p-3 border-top d-flex gap-2 mt-auto">
            <button
              type="button"
              onClick={() => onDownloadInvoice?.(payment)}
              disabled={!onDownloadInvoice}
              className="btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-3 fw-medium py-2"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
                opacity: onDownloadInvoice ? 1 : 0.6,
              }}
            >
              <Download size={14} />
              Download Invoice
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn flex-fill text-white rounded-3 fw-semibold py-2"
              style={{
                backgroundColor: "#0e8a5f",
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentDetailPanel;
