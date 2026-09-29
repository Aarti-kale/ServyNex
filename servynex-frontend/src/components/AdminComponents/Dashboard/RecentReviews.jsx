import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { StarFill } from "react-bootstrap-icons";

const formatDate = (date) => {
  if (!date) {
    return "Field not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Field not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitial = (name) => {
  if (!name) {
    return "?";
  }

  return name.trim().charAt(0).toUpperCase();
};

const getWorkerName = (review) => {
  const workerName = review?.worker?.name;
  const serviceName = review?.service?.name;

  if (!workerName && !serviceName) {
    return "Field not available";
  }

  if (!workerName) {
    return serviceName;
  }

  if (!serviceName) {
    return workerName;
  }

  return `${workerName} (${serviceName})`;
};

const getRating = (rating) => {
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating)) {
    return 0;
  }

  return Math.min(Math.max(numericRating, 0), 5);
};

const RecentReviews = ({ data = [], count = 0 }) => {
  const reviews = Array.isArray(data) ? data : [];

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
          Recent Reviews
        </h6>

        <a
          href="#all-reviews"
          className="fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.82rem",
          }}
        >
          View All
        </a>
      </div>

      {reviews.length === 0 ? (
        <p className="text-secondary text-center py-4 mb-0">
          No recent reviews
        </p>
      ) : (
        reviews.map((review, index) => {
          const customerName = review?.user?.name || "Field not available";

          const workerName = getWorkerName(review);

          const rating = getRating(review?.rating);

          const reviewText = review?.review || "Field not available";

          const reviewDate = formatDate(review?.date || review?.createdAt);

          return (
            <div key={review?._id || `review-${index}`}>
              <div className="d-flex align-items-start gap-2 py-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#e6f4ee",
                    color: "#0e8a5f",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {getInitial(review?.user?.name)}
                </div>

                <div
                  className="flex-grow-1"
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p
                        className="fw-semibold mb-0"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.85rem",
                        }}
                      >
                        {customerName}
                      </p>

                      <p
                        className="text-secondary mb-1"
                        style={{
                          fontSize: "0.74rem",
                        }}
                      >
                        {workerName}
                      </p>
                    </div>

                    <span
                      className="text-secondary flex-shrink-0"
                      style={{
                        fontSize: "0.72rem",
                      }}
                    >
                      {reviewDate}
                    </span>
                  </div>

                  <div className="d-flex gap-1 mb-1">
                    {Array.from({
                      length: 5,
                    }).map((_, starIndex) => (
                      <StarFill
                        key={starIndex}
                        size={11}
                        color={starIndex < rating ? "#f5b301" : "#e5e7eb"}
                      />
                    ))}
                  </div>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    {reviewText}
                  </p>
                </div>
              </div>

              {index !== reviews.length - 1 && <hr className="m-0" />}
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecentReviews;
