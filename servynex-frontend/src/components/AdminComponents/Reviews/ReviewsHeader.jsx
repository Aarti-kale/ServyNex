import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  Download,
  Funnel,
  StarFill,
  ClockFill,
  FlagFill,
  EyeSlashFill,
} from "react-bootstrap-icons";

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Not Available";
  }

  return number.toLocaleString("en-IN");
};

const formatRating = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Not Available";
  }

  return `${number.toFixed(1)} / 5`;
};

const calculateFiveStarPercentage = (totalReviews, fiveStarReviews) => {
  const total = Number(totalReviews);
  const fiveStar = Number(fiveStarReviews);

  if (!Number.isFinite(total) || !Number.isFinite(fiveStar) || total <= 0) {
    return 0;
  }

  return Math.min(Math.round((fiveStar / total) * 100), 100);
};

const getStatNote = (stat) => {
  if (stat.note !== undefined && stat.note !== null && stat.note !== "") {
    return stat.note;
  }

  return "Field Not Available";
};

const ReviewsHeader = ({ stats = {}, onExport, onFilters }) => {
  const totalReviews = stats?.totalReviews ?? null;
  const averageRating = stats?.averageRating ?? null;
  const fiveStarReviews = stats?.fiveStarReviews ?? null;
  const pendingReviews = stats?.pendingReviews ?? null;
  const reportedReviews = stats?.reportedReviews ?? null;
  const hiddenReviews = stats?.hiddenReviews ?? null;

  const fiveStarPercentage = calculateFiveStarPercentage(
    totalReviews,
    fiveStarReviews
  );

  const reviewStats = [
    {
      label: "Total Reviews",
      value: formatNumber(totalReviews),
      note: stats?.totalReviewsGrowth
        ? `${stats.totalReviewsGrowth} from last month`
        : "Field Not Available",
      noteColor: "#0e8a5f",
      icon: <StarFill size={20} color="#ffffff" />,
      iconBg: "#0e8a5f",
    },
    {
      label: "Average Rating",
      value: formatRating(averageRating),
      note: stats?.averageRatingGrowth
        ? `${stats.averageRatingGrowth} from last month`
        : "Field Not Available",
      noteColor: "#0e8a5f",
      icon: <StarFill size={20} color="#ffffff" />,
      iconBg: "#0e8a5f",
      stars:
        averageRating !== null && averageRating !== undefined
          ? Number(averageRating)
          : null,
    },
    {
      label: "5 Star Reviews",
      value: formatNumber(fiveStarReviews),
      note:
        totalReviews !== null && fiveStarReviews !== null
          ? `${fiveStarPercentage}% of total reviews`
          : "Field Not Available",
      noteColor: "#6b7280",
      icon: <StarFill size={20} color="#ffffff" />,
      iconBg: "#d18a1c",
      progress: fiveStarPercentage,
    },
    {
      label: "Pending Reviews",
      value: formatNumber(pendingReviews),
      note: "Awaiting approval",
      noteColor: "#d18a1c",
      icon: <ClockFill size={20} color="#ffffff" />,
      iconBg: "#d18a1c",
    },
    {
      label: "Reported Reviews",
      value: formatNumber(reportedReviews),
      note: "Needs attention",
      noteColor: "#dc3545",
      icon: <FlagFill size={20} color="#ffffff" />,
      iconBg: "#dc3545",
    },
    {
      label: "Hidden Reviews",
      value: formatNumber(hiddenReviews),
      note: "Not visible publicly",
      noteColor: "#6b7280",
      icon: <EyeSlashFill size={20} color="#ffffff" />,
      iconBg: "#6b7280",
    },
  ];

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{ color: "#0f1724", fontSize: "1.9rem" }}
            >
              Reviews
            </h1>

            <nav style={{ fontSize: "0.86rem" }}>
              <span className="fw-medium" style={{ color: "#0e8a5f" }}>
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Reviews</span>
            </nav>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={onExport}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
              }}
            >
              <Download size={15} />
              Export Reviews
            </button>

            <button
              onClick={onFilters}
              className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{ backgroundColor: "#0e8a5f" }}
            >
              <Funnel size={15} />
              Filters
            </button>
          </div>
        </div>

        <div className="row g-3">
          {reviewStats.map((stat, index) => (
            <div className="col-6 col-lg-2" key={index}>
              <div
                className="rounded-4 p-3 h-100 bg-white"
                style={{ border: "1px solid #eef0f2" }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: stat.iconBg,
                    }}
                  >
                    {stat.icon}
                  </div>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.76rem" }}
                  >
                    {stat.label}
                  </p>
                </div>

                <h4 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                  {stat.value}
                </h4>

                {stat.stars !== null && stat.stars !== undefined && (
                  <div className="d-flex gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarFill
                        key={index}
                        size={11}
                        color={
                          index < Math.round(stat.stars) ? "#f5b301" : "#e5e7eb"
                        }
                      />
                    ))}
                  </div>
                )}

                {stat.progress !== undefined && (
                  <div
                    className="rounded-pill mb-1"
                    style={{
                      height: "5px",
                      backgroundColor: "#eef0f2",
                    }}
                  >
                    <div
                      className="rounded-pill"
                      style={{
                        width: `${stat.progress}%`,
                        height: "100%",
                        backgroundColor: "#0e8a5f",
                      }}
                    />
                  </div>
                )}

                <p
                  className="fw-medium mb-0"
                  style={{
                    color: stat.noteColor,
                    fontSize: "0.72rem",
                  }}
                >
                  {getStatNote(stat)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsHeader;
