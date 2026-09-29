import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const getRating = (value) => {
  const rating = Number(value);

  return Number.isFinite(rating) ? rating : null;
};

const formatLabel = (value) => {
  if (!value) return "Not Available";

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return String(value);
};

const normalizeData = (data) => {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      const rating = getRating(
        item?.averageRating ?? item?.avgRating ?? item?.rating ?? item?.average
      );

      const label = item?.label ?? item?.date ?? item?.period ?? item?._id;

      if (rating === null || !label) {
        return null;
      }

      return {
        label: formatLabel(label),
        rating,
      };
    })
    .filter(Boolean);
};

const createChartPoints = (data) => {
  if (data.length === 0) return [];

  const width = 300;
  const height = 130;

  const minRating = 3;
  const maxRating = 5;

  return data.map((item, index) => {
    const x =
      data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;

    const clampedRating = Math.min(maxRating, Math.max(minRating, item.rating));

    const y =
      height - ((clampedRating - minRating) / (maxRating - minRating)) * height;

    return {
      ...item,
      x,
      y,
    };
  });
};

const createYLabels = () => {
  return ["5.0", "4.5", "4.0", "3.5", "3.0"];
};

const AverageRatings = ({ data = [], loading = false }) => {
  const chartData = normalizeData(data);
  const dataPoints = createChartPoints(chartData);
  const yLabels = createYLabels();

  const linePoints = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h6 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Average Rating Over Time
      </h6>

      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "180px", fontSize: "0.8rem" }}
        >
          Loading rating data...
        </div>
      ) : dataPoints.length === 0 ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "180px", fontSize: "0.8rem" }}
        >
          No rating data available
        </div>
      ) : (
        <>
          <div className="d-flex">
            <div
              className="d-flex flex-column justify-content-between text-secondary pe-2"
              style={{
                fontSize: "0.7rem",
                height: "150px",
              }}
            >
              {yLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <svg
              viewBox="0 0 320 150"
              width="100%"
              height="150"
              preserveAspectRatio="none"
            >
              <polyline
                points={linePoints}
                fill="none"
                stroke="#0e8a5f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {dataPoints.map((point, index) => (
                <circle
                  key={`${point.label}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#fff"
                  stroke="#0e8a5f"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div
            className="d-flex justify-content-between text-secondary ps-4"
            style={{ fontSize: "0.72rem" }}
          >
            {dataPoints.map((point, index) => (
              <span key={`${point.label}-${index}`}>{point.label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AverageRatings;
