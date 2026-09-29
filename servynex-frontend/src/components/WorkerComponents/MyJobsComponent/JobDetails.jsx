import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  XLg,
  LightningChargeFill,
  TelephoneFill,
  GeoAltFill,
  Send,
  ChatDotsFill,
} from "react-bootstrap-icons";

const statusStyles = {
  Assigned: {
    backgroundColor: "#fdf1de",
    color: "#b5730a",
  },
  Accepted: {
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
  },
  "In Progress": {
    backgroundColor: "#cfe2ff",
    color: "#084298",
  },
  Completed: {
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
  },
  Cancelled: {
    backgroundColor: "#f8d7da",
    color: "#842029",
  },
};

const getDisplayStatus = (status = "") => {
  const normalizedStatus = String(status)
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (normalizedStatus === "assigned") return "Assigned";
  if (normalizedStatus === "accepted") return "Accepted";
  if (normalizedStatus === "inprogress") return "In Progress";
  if (normalizedStatus === "completed") return "Completed";
  if (normalizedStatus === "cancelled") return "Cancelled";

  return status || "Assigned";
};

const getJobIcon = (serviceName = "") => {
  const service = serviceName.toLowerCase();

  if (service.includes("electric")) {
    return <LightningChargeFill size={20} color="#0e8a5f" />;
  }

  return <LightningChargeFill size={20} color="#0e8a5f" />;
};

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "Not available";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
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

const formatAddress = (address) => {
  if (!address) {
    return "Address not available";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address === "object") {
    return (
      address.fullAddress ||
      address.address ||
      address.street ||
      address.city ||
      "Address not available"
    );
  }

  return "Address not available";
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "₹0";
  }

  if (typeof price === "number") {
    return `₹${price.toLocaleString("en-IN")}`;
  }

  const priceText = String(price).trim();

  if (priceText.startsWith("₹")) {
    return priceText;
  }

  return `₹${priceText}`;
};

const buildTimeline = (job, status) => {
  const timeline = [];

  const bookedOn = job?.bookedOn;
  const preferredTime = job?.info?.preferredTime || job?.date;

  if (bookedOn) {
    timeline.push({
      label: "Job Booked",
      time: formatDateTime(bookedOn),
      done: true,
    });
  }

  if (
    status === "Accepted" ||
    status === "In Progress" ||
    status === "Completed"
  ) {
    timeline.push({
      label: "Worker Accepted",
      time: "Accepted",
      done: true,
    });
  }

  if (status === "In Progress" || status === "Completed") {
    timeline.push({
      label: "Work Started",
      time: status === "Completed" ? "Completed" : "In progress",
      done: true,
    });
  }

  if (status === "Completed") {
    timeline.push({
      label: "Job Completed",
      time: "Completed",
      done: true,
    });
  }

  if (preferredTime) {
    timeline.push({
      label: "Preferred Service Time",
      time: formatDateTime(preferredTime),
      done: false,
    });
  }

  return timeline;
};

const JobDetails = ({ job, onClose, onAccept, onReject }) => {
  const jobData = useMemo(() => {
    if (!job) {
      return null;
    }

    const serviceName =
      job?.title ||
      job?.info?.serviceType ||
      job?.service?.name ||
      job?.serviceType ||
      "Service";

    const customerName = job?.customer?.name || job?.user?.name || "Customer";

    const customerInitial =
      job?.customer?.initial || customerName.charAt(0).toUpperCase();

    const customerPhone =
      job?.customer?.phone || job?.user?.phone || job?.phone || "";

    const customerAddress = formatAddress(
      job?.customer?.address ||
        job?.customer?.location ||
        job?.user?.address ||
        job?.address
    );

    const displayStatus = getDisplayStatus(job?.status);

    const problem = job?.info?.problem || job?.problem || "-";

    const preferredTime = job?.info?.preferredTime || job?.date;

    const paymentMethod = job?.info?.paymentMethod || job?.paymentMethod || "-";

    const estimatedAmount = formatPrice(
      job?.info?.estimatedAmount ??
        job?.estimatedAmount ??
        job?.price ??
        job?.amount
    );

    const notes = job?.info?.notes || job?.notes || "";

    return {
      id: job?.id || job?._id || "-",
      title: serviceName,
      status: displayStatus,
      bookedOn: job?.bookedOn || job?.date,
      icon: getJobIcon(serviceName),

      customer: {
        name: customerName,
        initial: customerInitial,
        phone: customerPhone,
        address: customerAddress,
      },

      info: {
        serviceType: serviceName,
        problem,
        preferredTime,
        paymentMethod,
        estimatedAmount,
        notes,
      },

      timeline: buildTimeline(job, displayStatus),
    };
  }, [job]);

  if (!jobData) {
    return null;
  }

  const currentStatusStyle =
    statusStyles[jobData.status] || statusStyles.Assigned;

  const handleNavigate = () => {
    if (
      !jobData.customer.address ||
      jobData.customer.address === "Address not available"
    ) {
      return;
    }

    const encodedAddress = encodeURIComponent(jobData.customer.address);

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCall = () => {
    if (!jobData.customer.phone) {
      return;
    }

    window.location.href = `tel:${jobData.customer.phone}`;
  };

  return (
    <div
      className="rounded-4 bg-white h-100 d-flex flex-column"
      style={{
        border: "1px solid #eef0f2",
        maxWidth: "420px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Job Details
        </h6>

        <button
          type="button"
          onClick={onClose}
          className="btn p-0"
          style={{ color: "#6b7280" }}
          aria-label="Close job details"
        >
          <XLg size={16} />
        </button>
      </div>

      <div
        className="p-3"
        style={{
          overflowY: "auto",
        }}
      >
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#efe8fc",
              }}
            >
              {jobData.icon}
            </div>

            <div>
              <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                {jobData.title}
              </h6>

              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.75rem" }}
              >
                Job ID: #{jobData.id}
              </p>
            </div>
          </div>

          <span
            className="badge rounded-pill fw-medium"
            style={{
              backgroundColor: currentStatusStyle.backgroundColor,
              color: currentStatusStyle.color,
              fontSize: "0.72rem",
            }}
          >
            {jobData.status}
          </span>
        </div>

        <p className="text-secondary mb-3" style={{ fontSize: "0.78rem" }}>
          Booked on: {formatDateTime(jobData.bookedOn)}
        </p>

        <hr />

        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.92rem",
          }}
        >
          Customer Information
        </h6>

        <div className="d-flex align-items-start gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#e6f4ee",
              color: "#0e8a5f",
              fontWeight: 700,
            }}
          >
            {jobData.customer.initial}
          </div>

          <div className="flex-grow-1">
            <p
              className="fw-semibold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "0.88rem",
              }}
            >
              {jobData.customer.name}
            </p>

            <p
              className="d-flex align-items-center gap-1 text-secondary mb-1"
              style={{ fontSize: "0.8rem" }}
            >
              <TelephoneFill size={11} />

              {jobData.customer.phone || "Phone not available"}
            </p>

            <p
              className="d-flex align-items-start gap-1 text-secondary mb-0"
              style={{ fontSize: "0.8rem" }}
            >
              <GeoAltFill size={11} className="mt-1 flex-shrink-0" />

              {jobData.customer.address}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 mb-3">
          <button
            type="button"
            className="btn btn-sm flex-fill text-white rounded-3 d-flex align-items-center justify-content-center gap-1"
            style={{
              backgroundColor: "#0e8a5f",
              fontSize: "0.8rem",
            }}
            onClick={handleCall}
            disabled={!jobData.customer.phone}
          >
            <TelephoneFill size={12} />
            Call
          </button>

          <button
            type="button"
            className="btn btn-sm flex-fill rounded-3 d-flex align-items-center justify-content-center gap-1"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.8rem",
            }}
            onClick={handleNavigate}
            disabled={
              !jobData.customer.address ||
              jobData.customer.address === "Address not available"
            }
          >
            <Send size={12} />
            Navigate
          </button>
        </div>

        <hr />

        <h6
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "0.92rem",
          }}
        >
          Job Information
        </h6>

        <div className="mb-3">
          {[
            ["Service Type", jobData.info.serviceType],
            ["Problem", jobData.info.problem],
            ["Preferred Time", formatDateTime(jobData.info.preferredTime)],
            ["Payment Method", jobData.info.paymentMethod],
            ["Estimated Amount", jobData.info.estimatedAmount],
            ["Notes from Customer", jobData.info.notes || "No notes provided."],
          ].map(([label, value], index) => (
            <div
              key={`${label}-${index}`}
              className="d-flex justify-content-between gap-3 mb-2"
            >
              <span
                className="text-secondary flex-shrink-0"
                style={{ fontSize: "0.8rem" }}
              >
                {label}
              </span>

              <span
                className="fw-medium text-end"
                style={{
                  color: "#0f1724",
                  fontSize: "0.8rem",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <hr />

        <h6
          className="fw-bold mb-3"
          style={{
            color: "#0f1724",
            fontSize: "0.92rem",
          }}
        >
          Job Timeline
        </h6>

        <div className="mb-2">
          {jobData.timeline.length > 0 ? (
            jobData.timeline.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="d-flex align-items-start gap-2 pb-3"
              >
                <span
                  className="rounded-circle flex-shrink-0"
                  style={{
                    width: "10px",
                    height: "10px",
                    border: item.done
                      ? "3px solid #0e8a5f"
                      : "2px solid #d9dee3",
                    marginTop: "3px",
                  }}
                />

                <div>
                  <p
                    className="mb-0 fw-medium"
                    style={{
                      color: item.done ? "#0f1724" : "#9ca3af",
                      fontSize: "0.82rem",
                    }}
                  >
                    {item.label}
                  </p>

                  {item.time && (
                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {item.time}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>
              No timeline information available.
            </p>
          )}
        </div>
      </div>

      <div className="p-3 border-top">
        <div className="d-flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => {
              if (typeof onAccept === "function") {
                onAccept(job);
              }
            }}
            className="btn flex-fill text-white rounded-3 fw-semibold py-2"
            style={{
              backgroundColor: "#0e8a5f",
            }}
            disabled={jobData.status !== "Assigned"}
          >
            Accept Job
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof onReject === "function") {
                onReject(job);
              }
            }}
            className="btn flex-fill rounded-3 fw-semibold py-2"
            style={{
              border: "1.5px solid #dc3545",
              color: "#dc3545",
            }}
            disabled={jobData.status !== "Assigned"}
          >
            Reject Job
          </button>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={handleCall}
            className="btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-3 fw-medium py-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.85rem",
            }}
            disabled={!jobData.customer.phone}
          >
            <TelephoneFill size={13} />
            Call Customer
          </button>

          <button
            type="button"
            className="btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-3 fw-medium py-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
              fontSize: "0.85rem",
            }}
            disabled
            title="Messaging backend is not available yet"
          >
            <ChatDotsFill size={13} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
