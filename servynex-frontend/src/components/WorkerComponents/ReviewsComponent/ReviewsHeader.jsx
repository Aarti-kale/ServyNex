import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Funnel,
  ChevronDown,
  StarFill,
  PeopleFill,
  HandThumbsUpFill,
  ClockFill,
} from "react-bootstrap-icons";

const FILTER_OPTIONS = [
  {
    label: "Newest First",
    value: "newest",
  },
  {
    label: "Oldest First",
    value: "oldest",
  },
  {
    label: "Highest Rated",
    value: "highest",
  },
  {
    label: "Lowest Rated",
    value: "lowest",
  },
];

const RatingStars = ({ rating }) => {
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="d-flex justify-content-center gap-1 mb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarFill
          key={index}
          size={16}
          color={index < Math.round(normalizedRating) ? "#f5b301" : "#e5e7eb"}
        />
      ))}
    </div>
  );
};

const getPercentage = (count, total) => {
  if (!total) {
    return 0;
  }

  return Math.round((Number(count) / Number(total)) * 100);
};

const ReviewsHeader = ({
  summary = {},
  ratingDistribution = {},
  loading = false,
  sort = "newest",
  onFilterChange,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const filterRef = useRef(null);

  const {
    overallRating = 0,
    totalReviews = 0,
    wouldRecommend = 0,
    averageResponseTimeHours = 0,
  } = summary;

  const fiveStarReviews = Number(ratingDistribution?.[5] || 0);

  const fiveStarPercentage = getPercentage(fiveStarReviews, totalReviews);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleFilterSelect = (value) => {
    onFilterChange?.(value);
    setFilterOpen(false);
  };

  const breakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = Number(ratingDistribution?.[rating] || 0);

    return {
      rating,
      label: `${rating} Star`,
      count,
      percent: getPercentage(count, totalReviews),
    };
  });

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              Reviews &amp; Ratings
            </h1>

            <p className="text-secondary mb-0">
              See what customers are saying about your work.
            </p>
          </div>

          <div className="position-relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((previous) => !previous)}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
              }}
            >
              <Funnel size={14} />
              Filter
              <ChevronDown size={13} />
            </button>

            {filterOpen && (
              <div
                className="position-absolute bg-white rounded-3 shadow mt-1"
                style={{
                  right: 0,
                  minWidth: "180px",
                  border: "1px solid #eef0f2",
                  zIndex: 20,
                  overflow: "hidden",
                }}
              >
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterSelect(option.value)}
                    className="btn d-block w-100 text-start px-3 py-2"
                    style={{
                      fontSize: "0.85rem",
                      color: "#0f1724",
                      backgroundColor:
                        sort === option.value ? "#f4faf7" : "#ffffff",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div
              className="rounded-4 p-4 h-100 bg-white text-center"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              <p
                className="text-secondary mb-2"
                style={{
                  fontSize: "0.88rem",
                }}
              >
                Overall Rating
              </p>

              {loading ? (
                <div className="py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    style={{
                      color: "#0e8a5f",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <h1
                      className="fw-bold mb-0"
                      style={{
                        color: "#0e8a5f",
                        fontSize: "2.6rem",
                      }}
                    >
                      {Number(overallRating).toFixed(1)}
                    </h1>

                    <StarFill size={30} color="#f5b301" />
                  </div>

                  <RatingStars rating={overallRating} />

                  <p
                    className="fw-medium mb-3"
                    style={{
                      color: "#0e8a5f",
                      fontSize: "0.88rem",
                    }}
                  >
                    {overallRating >= 4.5
                      ? "Great job! Keep it up."
                      : overallRating >= 3
                      ? "Good work! Keep improving."
                      : "Keep working on customer satisfaction."}
                  </p>
                </>
              )}

              <hr />

              <p
                className="text-secondary mb-1"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                Total Reviews
              </p>

              <h4
                className="fw-bold mb-0"
                style={{
                  color: "#0f1724",
                }}
              >
                {loading ? "—" : totalReviews}
              </h4>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="rounded-4 p-4 h-100 bg-white"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              {breakdown.map((item) => (
                <div
                  key={item.rating}
                  className="d-flex align-items-center gap-2 mb-3"
                >
                  <span
                    className="text-secondary flex-shrink-0"
                    style={{
                      width: "42px",
                      fontSize: "0.82rem",
                    }}
                  >
                    {item.label}
                  </span>

                  <div
                    className="flex-grow-1 rounded-pill"
                    style={{
                      height: "8px",
                      backgroundColor: "#eef0f2",
                    }}
                  >
                    <div
                      className="rounded-pill"
                      style={{
                        width: loading ? "0%" : `${item.percent}%`,
                        height: "100%",
                        backgroundColor:
                          item.rating >= 4
                            ? "#0e8a5f"
                            : item.rating === 3
                            ? "#f5b301"
                            : item.rating === 2
                            ? "#d18a1c"
                            : "#dc3545",
                      }}
                    />
                  </div>

                  <span
                    className="text-secondary flex-shrink-0"
                    style={{
                      width: "28px",
                      fontSize: "0.82rem",
                      textAlign: "right",
                    }}
                  >
                    {loading ? "—" : item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="rounded-4 p-4 h-100 bg-white d-flex flex-column gap-3"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              <StatItem
                icon={<PeopleFill size={18} color="#0e8a5f" />}
                label="Total Reviews"
                value={loading ? "—" : totalReviews}
              />

              <StatItem
                icon={<StarFill size={18} color="#0e8a5f" />}
                label="5 Star Reviews"
                value={
                  loading ? "—" : `${fiveStarReviews} (${fiveStarPercentage}%)`
                }
              />

              <StatItem
                icon={<HandThumbsUpFill size={18} color="#0e8a5f" />}
                label="Would Recommend"
                value={loading ? "—" : `${wouldRecommend}%`}
              />

              <StatItem
                icon={<ClockFill size={18} color="#0e8a5f" />}
                label="Avg. Response Time"
                value={
                  loading
                    ? "—"
                    : averageResponseTimeHours > 0
                    ? `${averageResponseTimeHours} hrs`
                    : "Field not available"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ icon, label, value }) => {
  return (
    <div className="d-flex align-items-center gap-3">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: "38px",
          height: "38px",
          backgroundColor: "#e6f4ee",
        }}
      >
        {icon}
      </div>

      <div>
        <p
          className="text-secondary mb-0"
          style={{
            fontSize: "0.78rem",
          }}
        >
          {label}
        </p>

        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f1724",
          }}
        >
          {value}
        </h6>
      </div>
    </div>
  );
};

export default ReviewsHeader;
