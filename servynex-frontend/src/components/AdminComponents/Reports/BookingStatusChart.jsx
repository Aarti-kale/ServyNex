import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const radius = 70;
const strokeWidth = 26;
const circumference = 2 * Math.PI * radius;

const STATUS_COLORS = {
  completed: "#0e8a5f",
  pending: "#185fa5",
  cancelled: "#d18a1c",
  "in progress": "#7c5ad1",
};

const formatStatusLabel = (status) => {
  if (status === undefined || status === null || status === "") {
    return "Field Not Available";
  }

  return String(status)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusColor = (status, index) => {
  const normalizedStatus = String(status || "")
    .toLowerCase()
    .trim();

  if (STATUS_COLORS[normalizedStatus]) {
    return STATUS_COLORS[normalizedStatus];
  }

  const fallbackColors = [
    "#0e8a5f",
    "#185fa5",
    "#d18a1c",
    "#7c5ad1",
    "#64748b",
  ];

  return fallbackColors[index % fallbackColors.length];
};

const getBookingCount = (item) => {
  if (!item || item.count === undefined) {
    return null;
  }

  if (item.count === null || item.count === "") {
    return null;
  }

  const count = Number(item.count);

  return Number.isFinite(count) ? count : null;
};

const getPercentage = (item) => {
  if (!item || item.percentage === undefined) {
    return null;
  }

  if (item.percentage === null || item.percentage === "") {
    return null;
  }

  const percentage = Number(item.percentage);

  return Number.isFinite(percentage) ? percentage : null;
};

const BookingStatusChart = ({ data = [], total = 0, loading = false }) => {
  const statuses = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const calculatedTotal = useMemo(() => {
    if (total !== undefined && total !== null && total !== "") {
      const numericTotal = Number(total);

      if (Number.isFinite(numericTotal)) {
        return numericTotal;
      }
    }

    return statuses.reduce((sum, item) => {
      const count = getBookingCount(item);

      return sum + (count ?? 0);
    }, 0);
  }, [total, statuses]);

  const hasData = statuses.length > 0;

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Booking Status
      </h6>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "300px",
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && !hasData && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "300px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && hasData && (
        <div className="d-flex flex-column align-items-center">
          <div className="position-relative mb-3">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              role="img"
              aria-label="Booking status chart"
            >
              <g transform="rotate(-90 100 100)">
                {(() => {
                  let cumulativePercent = 0;

                  return statuses.map((item, index) => {
                    const percentage = getPercentage(item);

                    if (percentage === null) {
                      return null;
                    }

                    const dash = (percentage / 100) * circumference;

                    const offset = -((cumulativePercent / 100) * circumference);

                    cumulativePercent += percentage;

                    return (
                      <circle
                        key={item._id || item.status || `status-${index}`}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={getStatusColor(item.status, index)}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={offset}
                      />
                    );
                  });
                })()}
              </g>
            </svg>

            <div
              className="position-absolute top-50 start-50 translate-middle text-center"
              style={{
                minWidth: "70px",
              }}
            >
              <p
                className="text-secondary mb-0"
                style={{
                  fontSize: "0.78rem",
                }}
              >
                Total
              </p>

              <h3
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                }}
              >
                {calculatedTotal}
              </h3>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 w-100">
            {statuses.map((item, index) => {
              const label = formatStatusLabel(item?.status);
              const percentage = getPercentage(item);

              return (
                <div
                  key={item?._id || item?.status || `legend-${index}`}
                  className="d-flex align-items-center gap-2"
                >
                  <span
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: getStatusColor(item?.status, index),
                      display: "inline-block",
                    }}
                  />

                  <span
                    className="flex-grow-1"
                    style={{
                      fontSize: "0.85rem",
                      color: "#0f1724",
                    }}
                  >
                    {label}
                  </span>

                  <span
                    className="text-secondary"
                    style={{
                      fontSize: "0.78rem",
                    }}
                  >
                    {percentage === null
                      ? "Field Not Available"
                      : `${percentage}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStatusChart;
