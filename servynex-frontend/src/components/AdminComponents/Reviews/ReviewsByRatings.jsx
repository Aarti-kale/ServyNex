import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const radius = 60;
const strokeWidth = 22;
const circumference = 2 * Math.PI * radius;

const ratingColors = {
  5: "#0e8a5f",
  4: "#185fa5",
  3: "#d18a1c",
  2: "#dc3545",
  1: "#a9542c",
};

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const normalizeSegments = (data) => {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      const rating = toNumber(item?.rating ?? item?._id ?? item?.stars);

      const count = toNumber(item?.count ?? item?.total ?? item?.reviews);

      if (rating < 1 || rating > 5) {
        return null;
      }

      return {
        rating,
        label: `${rating} Star`,
        count,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.rating - a.rating);
};

const addPercentages = (segments) => {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return segments.map((segment) => ({
    ...segment,
    percent: total > 0 ? Math.round((segment.count / total) * 100) : 0,
  }));
};

const ReviewsByRatings = ({ data = [], loading = false }) => {
  const segments = addPercentages(normalizeSegments(data));

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h6 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Reviews by Rating
      </h6>

      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "160px", fontSize: "0.8rem" }}
        >
          Loading rating data...
        </div>
      ) : segments.length === 0 ? (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{ height: "160px", fontSize: "0.8rem" }}
        >
          No rating data available
        </div>
      ) : (
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="flex-shrink-0"
          >
            <g transform="rotate(-90 80 80)">
              {(() => {
                let cumulative = 0;

                return segments.map((segment, index) => {
                  const dash = (segment.percent / 100) * circumference;

                  const offset = -((cumulative / 100) * circumference);

                  cumulative += segment.percent;

                  return (
                    <circle
                      key={`${segment.rating}-${index}`}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke={ratingColors[segment.rating] || "#6b7280"}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={offset}
                    />
                  );
                });
              })()}
            </g>
          </svg>

          <div className="d-flex flex-column gap-2 flex-grow-1">
            {segments.map((segment) => (
              <div
                key={segment.rating}
                className="d-flex align-items-center justify-content-between gap-2"
              >
                <span className="d-flex align-items-center gap-2">
                  <span
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: "9px",
                      height: "9px",
                      backgroundColor:
                        ratingColors[segment.rating] || "#6b7280",
                      display: "inline-block",
                    }}
                  />

                  <span
                    style={{
                      fontSize: "0.84rem",
                      color: "#0f1724",
                    }}
                  >
                    {segment.label}
                  </span>
                </span>

                <span
                  className="text-secondary"
                  style={{ fontSize: "0.78rem" }}
                >
                  ({segment.count.toLocaleString("en-IN")})
                </span>

                <span
                  className="fw-medium"
                  style={{
                    fontSize: "0.8rem",
                    color: "#0f1724",
                  }}
                >
                  {segment.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsByRatings;
