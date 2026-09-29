import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const formatRevenue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Field not available";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Field not available";
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
};

const RevenueOverview = ({ data = null }) => {
  const [period, setPeriod] = useState("This Month");
  const [hoverIndex, setHoverIndex] = useState(null);

  const currentRevenue = data?.currentMonth?.revenue;

  const previousRevenue = data?.previousMonth?.revenue;

  const hasDailyRevenueData = false;

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f1724",
          }}
        >
          Revenue Overview
        </h6>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="form-select form-select-sm w-auto"
          style={{
            fontSize: "0.8rem",
          }}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="position-relative">
        {hasDailyRevenueData ? (
          <svg viewBox="0 0 470 180" width="100%" height="180"></svg>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center text-secondary"
            style={{
              height: "180px",
              fontSize: "0.82rem",
            }}
          >
            Revenue graph data not available
          </div>
        )}
      </div>

      <div
        className="d-flex justify-content-between text-secondary"
        style={{
          fontSize: "0.7rem",
        }}
      >
        <span>This Month</span>
        <span>Previous Month</span>
      </div>

      <div className="d-flex justify-content-between mt-3 pt-3 border-top">
        <div>
          <p
            className="text-secondary mb-1"
            style={{
              fontSize: "0.7rem",
            }}
          >
            Current Month
          </p>

          <p
            className="fw-bold mb-0"
            style={{
              color: "#0e8a5f",
              fontSize: "0.9rem",
            }}
          >
            {formatRevenue(currentRevenue)}
          </p>
        </div>

        <div className="text-end">
          <p
            className="text-secondary mb-1"
            style={{
              fontSize: "0.7rem",
            }}
          >
            Previous Month
          </p>

          <p
            className="fw-bold mb-0"
            style={{
              color: "#0f1724",
              fontSize: "0.9rem",
            }}
          >
            {formatRevenue(previousRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
