import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CalendarEventFill,
  LightningChargeFill,
  Fan,
  Snow,
  LightbulbFill,
  PersonFill,
  GeoAltFill,
} from "react-bootstrap-icons";

const formatTime = (date) => {
  if (!date) {
    return {
      time: "--",
      meridiem: "",
    };
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      time: "--",
      meridiem: "",
    };
  }

  return {
    time: parsedDate
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .split(" ")[0],
    meridiem: parsedDate
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .split(" ")[1],
  };
};

const getStatusConfig = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return {
        label: "Assigned",
        bg: "#fdf1de",
        color: "#b5730a",
      };

    case "accepted":
      return {
        label: "Accepted",
        bg: "#e6f4ee",
        color: "#0e8a5f",
      };

    case "completed":
      return {
        label: "Completed",
        bg: "#e6f4ee",
        color: "#0e8a5f",
      };

    default:
      return {
        label: status || "Unknown",
        bg: "#f1f3f5",
        color: "#6c757d",
      };
  }
};

const getServiceIcon = (serviceName) => {
  const name = String(serviceName || "").toLowerCase();

  if (name.includes("fan")) {
    return {
      icon: <Fan size={20} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    };
  }

  if (name.includes("ac") || name.includes("air condition")) {
    return {
      icon: <Snow size={20} color="#185fa5" />,
      iconBg: "#e0edfb",
    };
  }

  if (
    name.includes("light") ||
    name.includes("tube") ||
    name.includes("bulb")
  ) {
    return {
      icon: <LightbulbFill size={20} color="#d18a1c" />,
      iconBg: "#fbedd6",
    };
  }

  return {
    icon: <LightningChargeFill size={20} color="#0e8a5f" />,
    iconBg: "#efe8fc",
  };
};

const TodaysSchedule = ({
  jobs = [],
  loading = false,
  error = "",
  onRetry,
}) => {
  return (
    <div
      className="rounded-4 p-4 bg-white h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <CalendarEventFill size={18} color="#0f1724" />

        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Today's Schedule
        </h5>
      </div>

      <div className="flex-grow-1">
        {loading ? (
          <div className="text-secondary py-3">Loading today's schedule...</div>
        ) : error ? (
          <div className="py-3">
            <p className="text-danger mb-2">{error}</p>

            {onRetry && (
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-secondary py-3">
            No jobs scheduled for today.
          </div>
        ) : (
          jobs.map((job, index) => {
            const { time, meridiem } = formatTime(job.date);
            const status = getStatusConfig(job.status);
            const serviceName = job.service?.name || "Service";
            const serviceIcon = getServiceIcon(serviceName);

            return (
              <div key={job._id || index}>
                <div className="d-flex align-items-center gap-3 py-3">
                  <div
                    className="text-center flex-shrink-0"
                    style={{ minWidth: "50px" }}
                  >
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0e8a5f",
                        fontSize: "0.9rem",
                      }}
                    >
                      {time}
                    </div>

                    <div
                      className="text-secondary"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {meridiem}
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: serviceIcon.iconBg,
                    }}
                  >
                    {serviceIcon.icon}
                  </div>

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <h6
                      className="fw-semibold mb-1"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.92rem",
                      }}
                    >
                      {serviceName}
                    </h6>

                    <div
                      className="d-flex align-items-center gap-1 text-secondary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <PersonFill size={11} />
                      {job.user?.name || "Customer"}
                    </div>

                    <div
                      className="d-flex align-items-center gap-1 text-secondary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <GeoAltFill size={11} />
                      {job.address || "Address not available"}
                    </div>
                  </div>

                  <span
                    className="badge rounded-pill fw-medium flex-shrink-0"
                    style={{
                      backgroundColor: status.bg,
                      color: status.color,
                      fontSize: "0.75rem",
                      padding: "5px 12px",
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                {index !== jobs.length - 1 && <hr className="m-0" />}
              </div>
            );
          })
        )}
      </div>

      <a
        href="#all-jobs"
        className="fw-medium text-decoration-none text-center pt-3"
        style={{ color: "#0e8a5f" }}
      >
        View all today's jobs
      </a>
    </div>
  );
};

export default TodaysSchedule;
