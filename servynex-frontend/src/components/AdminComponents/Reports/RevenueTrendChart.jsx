import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CHART = {
  width: 540,
  height: 180,
  left: 30,
  right: 510,
  top: 20,
  bottom: 155,
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Data Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatAxisValue = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Data Not Available";
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }

  return `₹${amount}`;
};

const buildChartPoints = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const values = data.map((item) => Number(item?.revenue) || 0);

  const maxRevenue = Math.max(...values, 0);

  const chartRange = CHART.bottom - CHART.top;

  const step =
    data.length > 1 ? (CHART.right - CHART.left) / (data.length - 1) : 0;

  return data.map((item, index) => {
    const revenue = Number(item?.revenue) || 0;

    const y =
      maxRevenue > 0
        ? CHART.bottom - (revenue / maxRevenue) * chartRange
        : CHART.bottom;

    return {
      label: item?.month || "Data Not Available",
      revenue,
      x:
        data.length === 1
          ? (CHART.left + CHART.right) / 2
          : CHART.left + index * step,
      y,
    };
  });
};

const buildYLabels = (data) => {
  const values = Array.isArray(data)
    ? data.map((item) => Number(item?.revenue) || 0)
    : [];

  const maxRevenue = Math.max(...values, 0);

  if (maxRevenue === 0) {
    return ["₹0", "₹0", "₹0", "₹0", "₹0", "₹0"];
  }

  return Array.from({ length: 6 }, (_, index) => {
    const value = maxRevenue - (maxRevenue / 5) * index;
    return formatAxisValue(value);
  });
};

const RevenueTrendChart = ({
  data = [],
  loading = false,
  period = "This Year",
  onPeriodChange,
}) => {
  const chartPoints = useMemo(() => buildChartPoints(data), [data]);

  const yLabels = useMemo(() => buildYLabels(data), [data]);

  const linePoints = useMemo(
    () => chartPoints.map((point) => `${point.x},${point.y}`).join(" "),
    [chartPoints]
  );

  const hasData = chartPoints.length > 0;

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f1724",
          }}
        >
          Revenue Trend
        </h6>

        <select
          value={period}
          onChange={(event) => onPeriodChange?.(event.target.value)}
          className="form-select form-select-sm w-auto"
          style={{
            fontSize: "0.8rem",
          }}
        >
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            height: "220px",
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
            height: "220px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="d-flex">
            <div
              className="d-flex flex-column justify-content-between text-secondary pe-2"
              style={{
                fontSize: "0.7rem",
                height: `${CHART.height}px`,
              }}
            >
              {yLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            <div className="flex-grow-1">
              <svg
                viewBox="0 0 540 180"
                width="100%"
                height="180"
                role="img"
                aria-label="Revenue trend chart"
              >
                <defs>
                  <linearGradient
                    id="revenueTrendFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0e8a5f" stopOpacity="0.25" />

                    <stop offset="100%" stopColor="#0e8a5f" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {chartPoints.length > 1 && (
                  <polygon
                    points={`${CHART.left},${CHART.bottom} ${linePoints} ${CHART.right},${CHART.bottom}`}
                    fill="url(#revenueTrendFill)"
                  />
                )}

                {chartPoints.length > 1 && (
                  <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#0e8a5f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {chartPoints.map((point, index) => (
                  <circle
                    key={`${point.label}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#0e8a5f"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  >
                    <title>
                      {point.label}: {formatCurrency(point.revenue)}
                    </title>
                  </circle>
                ))}
              </svg>

              <div
                className="d-flex justify-content-between text-secondary"
                style={{
                  fontSize: "0.72rem",
                }}
              >
                {chartPoints.map((point, index) => (
                  <span
                    key={`${point.label}-label-${index}`}
                    className="text-center"
                    style={{
                      flex: 1,
                    }}
                  >
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueTrendChart;
