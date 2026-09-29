import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RevenueOverview = ({ data = [], loading = false, onPeriodChange }) => {
  const [period, setPeriod] = useState("This Year");

  const chartData = useMemo(() => {
    const source = Array.isArray(data)
      ? data
      : Array.isArray(data?.revenue)
      ? data.revenue
      : Array.isArray(data?.summary)
      ? data.summary
      : [];

    return source
      .map((item) => ({
        label:
          item.label || item.month || item.formattedMonth || item.period || "",
        value: Number(item.revenue ?? item.totalRevenue ?? item.amount ?? 0),
      }))
      .filter((item) => item.label);
  }, [data]);

  const chartPoints = useMemo(() => {
    if (chartData.length === 0) {
      return [];
    }

    const maxRevenue = Math.max(...chartData.map((item) => item.value), 0);

    const safeMaxRevenue = maxRevenue > 0 ? maxRevenue : 1000;

    const chartWidth = 420;
    const chartHeight = 145;
    const startX = 20;

    const step = chartData.length > 1 ? chartWidth / (chartData.length - 1) : 0;

    return chartData.map((item, index) => {
      const x = chartData.length === 1 ? 230 : startX + index * step;

      const y = chartHeight - (item.value / safeMaxRevenue) * chartHeight + 15;

      return {
        ...item,
        x,
        y: Math.max(10, Math.min(160, y)),
      };
    });
  }, [chartData]);

  const yLabels = useMemo(() => {
    if (chartData.length === 0) {
      return [];
    }

    const maxRevenue = Math.max(...chartData.map((item) => item.value), 0);

    const safeMax = maxRevenue > 0 ? maxRevenue : 1000;

    return Array.from({ length: 5 }, (_, index) => {
      const value = safeMax - (safeMax / 4) * index;

      return formatCompactCurrency(value);
    });
  }, [chartData]);

  const linePoints = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  function formatCompactCurrency(value) {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${Math.round(value / 1000)}K`;
    }

    return `₹${Math.round(value)}`;
  }

  const handlePeriodChange = (event) => {
    const nextPeriod = event.target.value;

    setPeriod(nextPeriod);
    onPeriodChange?.(nextPeriod);
  };

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Revenue Overview
        </h6>

        <select
          value={period}
          onChange={handlePeriodChange}
          className="form-select form-select-sm w-auto"
          style={{ fontSize: "0.8rem" }}
        >
          <option value="This Month">This Month</option>

          <option value="This Year">This Year</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-1 mb-1">
        <span
          className="rounded-circle"
          style={{
            width: "7px",
            height: "7px",
            backgroundColor: "#0e8a5f",
            display: "inline-block",
          }}
        />

        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
          Revenue (₹)
        </span>
      </div>

      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "190px" }}
        >
          Loading revenue...
        </div>
      ) : chartPoints.length === 0 ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "190px" }}
        >
          No revenue data available
        </div>
      ) : (
        <>
          <div className="d-flex">
            <div
              className="d-flex flex-column justify-content-between text-secondary pe-2"
              style={{
                fontSize: "0.7rem",
                height: "170px",
              }}
            >
              {yLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            <svg
              viewBox="0 0 460 170"
              width="100%"
              height="170"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="paymentRevenueFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0e8a5f" stopOpacity="0.25" />

                  <stop offset="100%" stopColor="#0e8a5f" stopOpacity="0" />
                </linearGradient>
              </defs>

              <polygon
                points={`20,170 ${linePoints} 440,170`}
                fill="url(#paymentRevenueFill)"
              />

              <polyline
                points={linePoints}
                fill="none"
                stroke="#0e8a5f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartPoints.map((point, index) => (
                <circle
                  key={`${point.label}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#0e8a5f"
                  stroke="#fff"
                  strokeWidth="1.5"
                >
                  <title>
                    {point.label}: ₹{point.value.toLocaleString("en-IN")}
                  </title>
                </circle>
              ))}
            </svg>
          </div>

          <div
            className="d-flex justify-content-between text-secondary ps-4"
            style={{ fontSize: "0.72rem" }}
          >
            {chartPoints.map((point, index) => (
              <span key={`${point.label}-label-${index}`}>{point.label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueOverview;
