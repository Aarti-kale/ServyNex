import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CHART_WIDTH = 460;
const CHART_HEIGHT = 180;
const GRAPH_TOP = 10;
const GRAPH_BOTTOM = 155;
const GRAPH_LEFT = 20;
const GRAPH_RIGHT = 440;

const getMonthLabel = (month) => {
  if (month === undefined || month === null || month === "") {
    return "Field Not Available";
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const index = Number(month) - 1;

  return monthNames[index] || "Field Not Available";
};

const getCustomerValue = (item) => {
  if (!item || item.customers === undefined) {
    return null;
  }

  if (item.customers === null || item.customers === "") {
    return null;
  }

  const value = Number(item.customers);

  return Number.isFinite(value) ? value : null;
};

const createChartPoints = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const validValues = data
    .map(getCustomerValue)
    .filter((value) => value !== null && value >= 0);

  if (validValues.length === 0) {
    return data.map((item) => ({
      ...item,
      label: getMonthLabel(item?.month),
      value: null,
      x: 0,
      y: GRAPH_BOTTOM,
    }));
  }

  const maxValue = Math.max(...validValues, 1);

  const horizontalStep =
    data.length > 1 ? (GRAPH_RIGHT - GRAPH_LEFT) / (data.length - 1) : 0;

  return data.map((item, index) => {
    const value = getCustomerValue(item);

    const x =
      data.length === 1
        ? (GRAPH_LEFT + GRAPH_RIGHT) / 2
        : GRAPH_LEFT + index * horizontalStep;

    const y =
      value === null
        ? GRAPH_BOTTOM
        : GRAPH_BOTTOM - (value / maxValue) * (GRAPH_BOTTOM - GRAPH_TOP);

    return {
      ...item,
      label: getMonthLabel(item?.month),
      value,
      x,
      y,
    };
  });
};

const createYLabels = (data) => {
  const values = data
    .map(getCustomerValue)
    .filter((value) => value !== null && value >= 0);

  if (values.length === 0) {
    return [
      "Field Not Available",
      "Field Not Available",
      "Field Not Available",
      "Field Not Available",
      "Field Not Available",
    ];
  }

  const maxValue = Math.max(...values, 1);
  const step = maxValue / 4;

  return [
    Math.ceil(maxValue),
    Math.ceil(step * 3),
    Math.ceil(step * 2),
    Math.ceil(step),
    "0",
  ];
};

const CustomerGrowth = ({
  data = [],
  loading = false,
  period = "This Year",
  onPeriodChange,
}) => {
  const chartPoints = useMemo(() => {
    return createChartPoints(data);
  }, [data]);

  const yLabels = useMemo(() => {
    return createYLabels(data);
  }, [data]);

  const linePoints = useMemo(() => {
    return chartPoints
      .filter(
        (point) =>
          point.value !== null &&
          Number.isFinite(point.x) &&
          Number.isFinite(point.y)
      )
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  }, [chartPoints]);

  const hasData = chartPoints.length > 0;

  const handlePeriodChange = (event) => {
    const selectedPeriod = event.target.value;

    if (typeof onPeriodChange === "function") {
      onPeriodChange(selectedPeriod);
    }
  };

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
          Customer Growth
        </h6>

        <select
          value={period}
          onChange={handlePeriodChange}
          className="form-select form-select-sm w-auto"
          style={{
            fontSize: "0.8rem",
          }}
          disabled={loading}
        >
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            height: `${CHART_HEIGHT}px`,
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
            height: `${CHART_HEIGHT}px`,
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
                height: `${CHART_HEIGHT}px`,
              }}
            >
              {yLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              width="100%"
              height={CHART_HEIGHT}
              role="img"
              aria-label="Customer growth chart"
            >
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0e8a5f" stopOpacity="0.25" />

                  <stop offset="100%" stopColor="#0e8a5f" stopOpacity="0" />
                </linearGradient>
              </defs>

              {linePoints && (
                <polygon
                  points={`${GRAPH_LEFT},${GRAPH_BOTTOM} ${linePoints} ${GRAPH_RIGHT},${GRAPH_BOTTOM}`}
                  fill="url(#growthFill)"
                />
              )}

              {linePoints && (
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#0e8a5f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {chartPoints.map((point, index) => {
                if (point.value === null) {
                  return null;
                }

                return (
                  <circle
                    key={point._id || `${point.year}-${point.month}` || index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#0e8a5f"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>

          <div
            className="d-flex justify-content-between text-secondary ps-4"
            style={{
              fontSize: "0.72rem",
              overflowX: "auto",
            }}
          >
            {chartPoints.map((point, index) => (
              <span
                key={point._id || `${point.year}-${point.month}-label` || index}
                className="text-center"
                style={{
                  flex: "1 0 auto",
                  minWidth: "35px",
                }}
              >
                {point.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerGrowth;
