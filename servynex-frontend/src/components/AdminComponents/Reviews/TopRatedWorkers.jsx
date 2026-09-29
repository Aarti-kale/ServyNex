import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { StarFill } from "react-bootstrap-icons";

const getWorkerName = (worker) => {
  if (!worker) return "Not Available";

  if (typeof worker === "object") {
    return worker.name || "Not Available";
  }

  return worker;
};

const getInitial = (worker) => {
  const name = getWorkerName(worker);

  if (name === "Not Available") return "?";

  return name.charAt(0).toUpperCase();
};

const getRating = (value) => {
  const rating = Number(value);

  return Number.isFinite(rating) ? rating.toFixed(1) : "Not Available";
};

const getReviewCount = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const count = Number(value);

  return Number.isFinite(count)
    ? count.toLocaleString("en-IN")
    : "Not Available";
};

const getAvatarStyle = (index) => {
  const styles = [
    {
      bg: "#e6f4ee",
      color: "#0e8a5f",
    },
    {
      bg: "#e0edfb",
      color: "#185fa5",
    },
    {
      bg: "#efe8fc",
      color: "#7c5ad1",
    },
    {
      bg: "#fbedd6",
      color: "#d18a1c",
    },
  ];

  return styles[index % styles.length];
};

const TopRatedWorkers = ({ workers = [], loading = false, onViewAll }) => {
  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Top Rated Workers
        </h6>

        <button
          type="button"
          onClick={onViewAll}
          className="btn btn-link p-0 fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.8rem",
          }}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div
          className="text-center text-secondary py-4"
          style={{ fontSize: "0.8rem" }}
        >
          Loading workers...
        </div>
      ) : workers.length === 0 ? (
        <div
          className="text-center text-secondary py-4"
          style={{ fontSize: "0.8rem" }}
        >
          No worker rating data available
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {workers.map((item, index) => {
            const worker = item?.worker || item;

            const rating =
              item?.averageRating ?? item?.rating ?? item?.avgRating;

            const reviewCount =
              item?.totalReviews ?? item?.reviews ?? item?.reviewCount;

            const avatarStyle = getAvatarStyle(index);
            const numericRating = Number(rating);

            return (
              <div
                key={item?._id || worker?._id || index}
                className="d-flex align-items-center gap-2"
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: avatarStyle.bg,
                    color: avatarStyle.color,
                    fontWeight: 700,
                  }}
                >
                  {getInitial(worker)}
                </div>

                <div className="flex-grow-1">
                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.86rem",
                    }}
                  >
                    {getWorkerName(worker)}
                  </p>

                  <div className="d-flex align-items-center gap-1">
                    <span
                      className="fw-semibold"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.8rem",
                      }}
                    >
                      {getRating(rating)}
                    </span>

                    <div className="d-flex gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <StarFill
                          key={starIndex}
                          size={10}
                          color={
                            Number.isFinite(numericRating) &&
                            starIndex < Math.round(numericRating)
                              ? "#f5b301"
                              : "#e5e7eb"
                          }
                        />
                      ))}
                    </div>

                    <span
                      className="text-secondary"
                      style={{ fontSize: "0.76rem" }}
                    >
                      ({getReviewCount(reviewCount)} Reviews)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopRatedWorkers;
