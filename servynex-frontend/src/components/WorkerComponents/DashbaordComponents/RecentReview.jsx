import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { StarFill } from "react-bootstrap-icons";

const formatReview = (review) => ({
  id: review?._id || review?.id,
  name:
    review?.user?.name || review?.customer?.name || review?.name || "Customer",
  rating: Number(review?.rating) || 0,
  text: review?.comment || review?.text || "-",
  time: review?.time || review?.createdAt || "Recently",
  avatar:
    review?.user?.avatar || review?.customer?.avatar || review?.avatar || "",
});

const RecentReview = ({ reviews = [] }) => {
  const formattedReviews = reviews.map(formatReview);

  return (
    <div
      className="rounded-4 p-3 bg-white h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6
          className="fw-bold mb-0"
          style={{ color: "#0f1724", fontSize: "1rem" }}
        >
          Recent Reviews
        </h6>

        <a
          href="#all-reviews"
          className="fw-medium text-decoration-none"
          style={{ color: "#0e8a5f", fontSize: "0.8rem" }}
        >
          View All
        </a>
      </div>

      <div className="d-flex flex-column gap-2">
        {formattedReviews.map((r, i) => (
          <div key={r.id || i}>
            <div className="d-flex align-items-start gap-2">
              {r.avatar ? (
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="rounded-circle flex-shrink-0"
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#e6f4ee",
                    color: "#0e8a5f",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  {r.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <h6
                  className="fw-semibold mb-0"
                  style={{ color: "#0f1724", fontSize: "0.82rem" }}
                >
                  {r.name}
                </h6>

                <div className="d-flex gap-1 my-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarFill
                      key={idx}
                      size={11}
                      color={idx < r.rating ? "#f5b301" : "#e5e7eb"}
                    />
                  ))}
                </div>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.74rem" }}
                >
                  {r.text}
                </p>

                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.68rem" }}
                >
                  {r.time}
                </p>
              </div>
            </div>

            {i !== formattedReviews.length - 1 && <hr className="mt-2 mb-0" />}
          </div>
        ))}

        {formattedReviews.length === 0 && (
          <p className="text-secondary mb-0" style={{ fontSize: "0.74rem" }}>
            No recent reviews.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentReview;
