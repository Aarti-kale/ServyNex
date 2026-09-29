import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const radius = 65;
const strokeWidth = 24;
const circumference = 2 * Math.PI * radius;

const segmentColors = [
  "#0e8a5f",
  "#185fa5",
  "#7c5ad1",
  "#17a2a2",
  "#d18a1c",
  "#e05a5a",
];

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "Not Available";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatMethodName = (method) => {
  if (!method) {
    return "Not Available";
  }

  const methodMap = {
    upi: "UPI",
    card: "Card",
    netbanking: "Net Banking",
    "net banking": "Net Banking",
    cash: "Cash",
    wallet: "Wallet",
  };

  const normalized = String(method).trim().toLowerCase();

  return (
    methodMap[normalized] ||
    String(method)
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

const PaymentMethods = ({ data = [], total = 0, loading = false }) => {
  const segments = Array.isArray(data) ? data : [];

  let cumulative = 0;

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Payment Methods Breakdown
      </h6>

      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "180px" }}
        >
          <span className="text-secondary">Loading payment methods...</span>
        </div>
      ) : segments.length === 0 ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "180px" }}
        >
          <span className="text-secondary">
            No payment method data available
          </span>
        </div>
      ) : (
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <div className="position-relative flex-shrink-0">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <g transform="rotate(-90 90 90)">
                {segments.map((segment, index) => {
                  const percent = Math.max(Number(segment.percentage) || 0, 0);

                  const dash = (percent / 100) * circumference;

                  const offset = -(cumulative / 100) * circumference;

                  cumulative += percent;

                  return (
                    <circle
                      key={`${segment.method}-${index}`}
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke={segmentColors[index % segmentColors.length]}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={offset}
                    />
                  );
                })}
              </g>
            </svg>

            <div className="position-absolute top-50 start-50 translate-middle text-center">
              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.72rem" }}
              >
                Total
              </p>

              <h6
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                  fontSize: "0.95rem",
                }}
              >
                {formatCurrency(total)}
              </h6>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 flex-grow-1">
            {segments.map((segment, index) => {
              const percent = Number(segment.percentage) || 0;

              return (
                <div
                  key={`${segment.method}-${index}`}
                  className="d-flex align-items-center justify-content-between gap-2"
                >
                  <span className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle flex-shrink-0"
                      style={{
                        width: "9px",
                        height: "9px",
                        backgroundColor:
                          segmentColors[index % segmentColors.length],
                        display: "inline-block",
                      }}
                    />

                    <span
                      style={{
                        fontSize: "0.84rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatMethodName(segment.method)}
                    </span>
                  </span>

                  <span
                    className="text-secondary"
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    {percent}%
                  </span>

                  <span
                    className="fw-medium"
                    style={{
                      fontSize: "0.82rem",
                      color: "#0f1724",
                    }}
                  >
                    {formatCurrency(segment.amount)}
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

export default PaymentMethods;
