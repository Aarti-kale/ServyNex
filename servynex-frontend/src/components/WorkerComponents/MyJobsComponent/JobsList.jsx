import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightningChargeFill,
  Droplet,
  Snow,
  Fan,
  LightbulbFill,
  PersonFill,
  GeoAltFill,
  TelephoneFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const ITEMS_PER_PAGE = 5;

const statusStyles = {
  Assigned: {
    bg: "#fdf1de",
    color: "#b5730a",
  },

  Accepted: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },

  "In Progress": {
    bg: "#e0edfb",
    color: "#185fa5",
  },

  Completed: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },

  Cancelled: {
    bg: "#fdecec",
    color: "#dc3545",
  },
};

const getJobIcon = (serviceName = "") => {
  const name = String(serviceName).toLowerCase();

  if (
    name.includes("electric") ||
    name.includes("repair") ||
    name.includes("wiring")
  ) {
    return {
      icon: <LightningChargeFill size={20} color="#0e8a5f" />,
      iconBg: "#efe8fc",
    };
  }

  if (name.includes("water") || name.includes("plumb")) {
    return {
      icon: <Droplet size={20} color="#185fa5" />,
      iconBg: "#e0edfb",
    };
  }

  if (name.includes("ac") || name.includes("air")) {
    return {
      icon: <Snow size={20} color="#d18a1c" />,
      iconBg: "#fbedd6",
    };
  }

  if (name.includes("fan")) {
    return {
      icon: <Fan size={20} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    };
  }

  return {
    icon: <LightbulbFill size={20} color="#0e8a5f" />,
    iconBg: "#e6f4ee",
  };
};

const getDisplayStatus = (status = "") => {
  switch (String(status).toLowerCase()) {
    case "pending":
    case "assigned":
      return "Assigned";

    case "accepted":
      return "Accepted";

    case "in-progress":
    case "inprogress":
      return "In Progress";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    default:
      return "Assigned";
  }
};

const formatAddress = (address) => {
  if (!address) {
    return "Location not available";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address === "object") {
    const parts = [
      address.address,
      address.street,
      address.area,
      address.locality,
      address.city,
      address.state,
      address.pincode,
      address.zipCode,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(", ");
    }
  }

  return "Location not available";
};

const formatPrice = (amount) => {
  if (amount === undefined || amount === null || amount === "") {
    return "₹0";
  }

  if (typeof amount === "number") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  const amountText = String(amount);

  return amountText.startsWith("₹") ? amountText : `₹${amountText}`;
};

const formatJob = (job) => {
  const dateValue = job?.date || job?.info?.preferredTime || job?.bookedOn;

  const date = dateValue ? new Date(dateValue) : null;

  const validDate = date && !Number.isNaN(date.getTime());

  const day = validDate ? date.getDate() : "--";

  const month = validDate
    ? date
        .toLocaleString("en-US", {
          month: "short",
        })
        .toUpperCase()
    : "---";

  const time = validDate
    ? date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const serviceName = job?.title || job?.info?.serviceType || "Service";

  const customerName = job?.customer?.name || "Customer";

  const location = formatAddress(job?.customer?.address);

  const jobIcon = getJobIcon(serviceName);

  const status = getDisplayStatus(job?.status);

  const price = formatPrice(job?.info?.estimatedAmount);

  return {
    ...job,

    rawJob: job,

    id: job?.id || job?._id,

    day,
    month,
    time,

    title: serviceName,

    customer: customerName,

    phone: job?.customer?.phone || job?.user?.phone || "",

    location,

    tag: serviceName,

    price,

    status,

    rawStatus: job?.status,

    problem: job?.info?.problem || "-",

    paymentMethod: job?.info?.paymentMethod || "-",

    icon: jobIcon.icon,
    iconBg: jobIcon.iconBg,
  };
};

const JobsList = ({
  jobs = [],
  hasJobs,
  loading = false,
  error = "",
  onSelectJob,
  onAccept,
  onReject,
  onStart,
  onComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const jobsData = useMemo(() => {
    if (!Array.isArray(jobs)) {
      return [];
    }

    return jobs.map(formatJob);
  }, [jobs]);

  const totalPages = Math.max(1, Math.ceil(jobsData.length / ITEMS_PER_PAGE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [jobsData.length]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return jobsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [jobsData, safeCurrentPage]);

  const handleSelectJob = (job) => {
    if (typeof onSelectJob === "function") {
      onSelectJob(job?.rawJob || job);
    }
  };

  const handleCall = (phone) => {
    if (!phone) {
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  const renderActions = (job) => {
    if (job.status === "Assigned") {
      return (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm text-white rounded-3 fw-medium px-3"
            style={{
              backgroundColor: "#0e8a5f",
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (typeof onAccept === "function") {
                onAccept(job.rawJob || job);
              }
            }}
          >
            Accept
          </button>

          <button
            type="button"
            className="btn btn-sm rounded-3 fw-medium px-3"
            style={{
              border: "1.5px solid #dc3545",
              color: "#dc3545",
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (typeof onReject === "function") {
                onReject(job.rawJob || job);
              }
            }}
          >
            Reject
          </button>
        </div>
      );
    }

    if (job.status === "Accepted") {
      return (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm rounded-3 fw-medium px-3 d-flex align-items-center gap-1"
            style={{
              border: "1.5px solid #d9dee3",
              color: "#0f1724",
            }}
            onClick={(event) => {
              event.stopPropagation();

              handleCall(job.phone);
            }}
          >
            <TelephoneFill size={12} />
            Call
          </button>

          <button
            type="button"
            className="btn btn-sm text-white rounded-3 fw-medium px-3"
            style={{
              backgroundColor: "#0e8a5f",
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (typeof onStart === "function") {
                onStart(job.rawJob || job);
              }
            }}
          >
            Start Job
          </button>
        </div>
      );
    }

    if (job.status === "In Progress") {
      return (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm text-white rounded-3 fw-medium px-3"
            style={{
              backgroundColor: "#0e8a5f",
            }}
            onClick={(event) => {
              event.stopPropagation();

              if (typeof onComplete === "function") {
                onComplete(job.rawJob || job);
              }
            }}
          >
            Complete Job
          </button>

          <button
            type="button"
            className="btn btn-sm rounded-3 d-flex align-items-center justify-content-center p-0"
            style={{
              border: "1.5px solid #d9dee3",
              width: "32px",
              height: "32px",
            }}
            onClick={(event) => {
              event.stopPropagation();

              handleCall(job.phone);
            }}
            aria-label="Call customer"
          >
            <TelephoneFill size={12} color="#0e8a5f" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="btn btn-sm rounded-3 fw-medium px-3"
        style={{
          border: "1.5px solid #0e8a5f",
          color: "#0e8a5f",
        }}
        onClick={(event) => {
          event.stopPropagation();

          handleSelectJob(job);
        }}
      >
        View Details
      </button>
    );
  };

  if (loading) {
    return (
      <section className="pb-4">
        <div className="container">
          <div
            className="rounded-4 bg-white p-4"
            style={{
              border: "1px solid #eef0f2",
            }}
          >
            Loading jobs...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-4">
        <div className="container">
          <div className="alert alert-danger rounded-4">{error}</div>
        </div>
      </section>
    );
  }

  if (jobsData.length === 0) {
    const originalJobsExist =
      typeof hasJobs === "boolean"
        ? hasJobs
        : Array.isArray(jobs) && jobs.length > 0;

    return (
      <section className="pb-4">
        <div className="container">
          <div
            className="rounded-4 bg-white p-4"
            style={{
              border: "1px solid #eef0f2",
            }}
          >
            {originalJobsExist
              ? "No matching jobs found."
              : "No jobs assigned yet."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-4">
      <div className="container">
        <div
          className="rounded-4 bg-white overflow-hidden"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          {paginatedJobs.map((job, i) => {
            const st = statusStyles[job.status] || {};

            return (
              <div key={job.id}>
                <div
                  onClick={() => handleSelectJob(job)}
                  className="d-flex flex-wrap align-items-center gap-3 p-3"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="text-center flex-shrink-0"
                    style={{
                      minWidth: "56px",
                    }}
                  >
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1.2rem",
                      }}
                    >
                      {job.day}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      {job.month}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.68rem",
                      }}
                    >
                      {job.time}
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: job.iconBg,
                    }}
                  >
                    {job.icon}
                  </div>

                  <div
                    className="flex-grow-1"
                    style={{
                      minWidth: "200px",
                    }}
                  >
                    <h6
                      className="fw-bold mb-1"
                      style={{
                        color: "#0f1724",
                      }}
                    >
                      {job.title}
                    </h6>

                    <div
                      className="d-flex flex-wrap gap-3 text-secondary mb-1"
                      style={{
                        fontSize: "0.82rem",
                      }}
                    >
                      <span className="d-flex align-items-center gap-1">
                        <PersonFill size={11} />
                        {job.customer}
                      </span>

                      <span className="d-flex align-items-center gap-1">
                        <GeoAltFill size={11} />
                        {job.location}
                      </span>
                    </div>

                    <span
                      className="badge rounded-pill fw-medium"
                      style={{
                        backgroundColor: "#e6f4ee",
                        color: "#0e8a5f",
                        fontSize: "0.7rem",
                      }}
                    >
                      {job.tag}
                    </span>
                  </div>

                  <div
                    className="fw-bold flex-shrink-0"
                    style={{
                      color: "#0f1724",
                      fontSize: "1rem",
                      minWidth: "80px",
                    }}
                  >
                    {job.price}
                  </div>

                  <span
                    className="badge rounded-pill fw-medium flex-shrink-0"
                    style={{
                      backgroundColor: st.bg,
                      color: st.color,
                      fontSize: "0.75rem",
                      padding: "6px 12px",
                    }}
                  >
                    {job.status}
                  </span>

                  <div
                    className="flex-shrink-0"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {renderActions(job)}
                  </div>
                </div>

                {i !== paginatedJobs.length - 1 && <hr className="m-0" />}
              </div>
            );
          })}
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
          <span
            className="text-secondary"
            style={{
              fontSize: "0.85rem",
            }}
          >
            Showing{" "}
            {jobsData.length === 0
              ? 0
              : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(safeCurrentPage * ITEMS_PER_PAGE, jobsData.length)} of{" "}
            {jobsData.length} jobs
          </span>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="btn d-flex align-items-center justify-content-center rounded-3"
              style={{
                border: "1px solid #d9dee3",
                width: "34px",
                height: "34px",
                opacity: safeCurrentPage === 1 ? 0.5 : 1,
              }}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className="btn rounded-3 fw-medium"
                style={{
                  width: "34px",
                  height: "34px",
                  backgroundColor:
                    safeCurrentPage === page ? "#0e8a5f" : "#ffffff",
                  color: safeCurrentPage === page ? "#ffffff" : "#0f1724",
                  border:
                    safeCurrentPage === page ? "none" : "1px solid #d9dee3",
                  fontSize: "0.85rem",
                }}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className="btn d-flex align-items-center justify-content-center rounded-3"
              style={{
                border: "1px solid #d9dee3",
                width: "34px",
                height: "34px",
                opacity: safeCurrentPage === totalPages ? 0.5 : 1,
              }}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsList;
