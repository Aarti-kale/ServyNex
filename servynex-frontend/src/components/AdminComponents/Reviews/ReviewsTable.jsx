import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  StarFill,
  EyeFill,
  ChatDotsFill,
  ThreeDotsVertical,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const getValue = (value, fallback = "Not Available") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};

const getName = (value) => {
  if (!value) return "Not Available";

  if (typeof value === "object") {
    return getValue(value.name);
  }

  return value;
};

const getInitial = (value) => {
  const name = getName(value);

  if (name === "Not Available") {
    return "?";
  }

  return name.charAt(0).toUpperCase();
};

const formatDate = (value) => {
  if (!value) {
    return {
      date: "Not Available",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Not Available",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const getCategoryStyle = (category) => {
  const styles = {
    Electrician: {
      bg: "#e0edfb",
      color: "#185fa5",
    },
    Cleaning: {
      bg: "#e6f4ee",
      color: "#0e8a5f",
    },
    Plumbing: {
      bg: "#e0edfb",
      color: "#185fa5",
    },
    Painting: {
      bg: "#fdecec",
      color: "#dc3545",
    },
    Carpentry: {
      bg: "#fbedd6",
      color: "#b5730a",
    },
  };

  return (
    styles[category] || {
      bg: "#f1f3f5",
      color: "#495057",
    }
  );
};

const getStatusStyle = (status) => {
  const styles = {
    Approved: {
      bg: "#e6f4ee",
      color: "#0e8a5f",
    },
    Pending: {
      bg: "#fdf1de",
      color: "#b5730a",
    },
    Reported: {
      bg: "#fdecec",
      color: "#dc3545",
    },
    Hidden: {
      bg: "#f1f3f5",
      color: "#6b7280",
    },
  };

  return (
    styles[status] || {
      bg: "#f1f3f5",
      color: "#6b7280",
    }
  );
};

const normalizeReview = (review) => {
  const customer = review?.customer || review?.user;
  const worker = review?.worker;
  const service = review?.service;
  const booking = review?.booking;

  const category =
    typeof review?.category === "object"
      ? review.category?.name
      : review?.category || service?.category?.name;

  const images = Array.isArray(review?.images)
    ? review.images.length
    : Number(review?.images) || 0;

  const rating = Number(review?.rating);

  const createdAt = review?.createdAt || review?.date || review?.bookingDate;

  const formattedDate = formatDate(createdAt);

  return {
    id: review?._id || review?.id,
    customer: getName(customer),
    customerPhone: customer?.phone,
    customerInitial: getInitial(customer),

    worker: getName(worker),
    workerPhone: worker?.phone,
    workerInitial: getInitial(worker),

    bookingId:
      typeof booking === "object"
        ? booking?._id || booking?.bookingId
        : booking || review?.bookingId,

    category: getValue(category),
    rating: Number.isFinite(rating) ? rating : 0,

    review: getValue(review?.comment || review?.review),

    images,

    date: formattedDate.date,
    time: formattedDate.time,

    status: getValue(review?.status),
  };
};

const ReviewsTable = ({
  reviews = [],
  loading = false,
  pagination = {},
  onSelectReview,
  onReplyReview,
  onReviewMenu,
  onPageChange,
  onPageLimitChange,
}) => {
  const currentPage = Number(pagination?.currentPage) || 1;
  const perPage = Number(pagination?.perPage) || 10;
  const totalReviews = Number(pagination?.totalReviews) || 0;
  const totalPages = Number(pagination?.totalPages) || 0;

  const hasNextPage = pagination?.hasNextPage ?? currentPage < totalPages;

  const hasPreviousPage = pagination?.hasPreviousPage ?? currentPage > 1;

  const normalizedReviews = reviews.map(normalizeReview);

  const showingFrom = totalReviews === 0 ? 0 : (currentPage - 1) * perPage + 1;

  const showingTo =
    totalReviews === 0 ? 0 : Math.min(currentPage * perPage, totalReviews);

  const handlePageChange = (page) => {
    if (
      !onPageChange ||
      page < 1 ||
      (totalPages > 0 && page > totalPages) ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  const getPageNumbers = () => {
    if (totalPages <= 0) return [];

    const pages = [];

    if (totalPages <= 3) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 2) {
      pages.push("...");
    }

    if (currentPage > 1 && currentPage < totalPages) {
      pages.push(currentPage);
    }

    if (currentPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <section className="pb-4">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr
                  style={{
                    borderTop: "1px solid #eef0f2",
                    borderBottom: "1px solid #eef0f2",
                  }}
                >
                  <th
                    className="ps-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    #
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Customer
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Worker
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Booking ID
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Category
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Rating
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Review
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Images
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Date
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Status
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.74rem" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center py-5 text-secondary"
                    >
                      Loading reviews...
                    </td>
                  </tr>
                ) : normalizedReviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center py-5 text-secondary"
                    >
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  normalizedReviews.map((review, index) => {
                    const categoryStyle = getCategoryStyle(review.category);

                    const statusStyle = getStatusStyle(review.status);

                    const rowNumber = (currentPage - 1) * perPage + index + 1;

                    return (
                      <tr
                        key={review.id || index}
                        style={{
                          borderBottom:
                            index !== normalizedReviews.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td
                          className="ps-3 py-2 text-secondary"
                          style={{ fontSize: "0.84rem" }}
                        >
                          {rowNumber}
                        </td>

                        <td className="py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                backgroundColor: "#e6f4ee",
                                color: "#0e8a5f",
                                fontWeight: 700,
                                fontSize: "0.74rem",
                              }}
                            >
                              {review.customerInitial}
                            </div>

                            <div>
                              <p
                                className="fw-medium mb-0"
                                style={{
                                  color: "#0f1724",
                                  fontSize: "0.84rem",
                                }}
                              >
                                {review.customer}
                              </p>

                              <p
                                className="text-secondary mb-0"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {getValue(review.customerPhone)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                backgroundColor: "#e0edfb",
                                color: "#185fa5",
                                fontWeight: 700,
                                fontSize: "0.74rem",
                              }}
                            >
                              {review.workerInitial}
                            </div>

                            <div>
                              <p
                                className="fw-medium mb-0"
                                style={{
                                  color: "#0f1724",
                                  fontSize: "0.84rem",
                                }}
                              >
                                {review.worker}
                              </p>

                              <p
                                className="text-secondary mb-0"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {getValue(review.workerPhone)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0e8a5f",
                            fontSize: "0.84rem",
                          }}
                        >
                          {getValue(review.bookingId)}
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: categoryStyle.bg,
                              color: categoryStyle.color,
                              fontSize: "0.72rem",
                            }}
                          >
                            {review.category}
                          </span>
                        </td>

                        <td className="py-2">
                          <div className="d-flex gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <StarFill
                                key={starIndex}
                                size={12}
                                color={
                                  starIndex < review.rating
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
                            {review.rating.toFixed(1)}
                          </span>
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.82rem",
                            maxWidth: "180px",
                          }}
                        >
                          {review.review}
                        </td>

                        <td className="py-2">
                          {review.images > 0 ? (
                            <div className="d-flex align-items-center gap-1">
                              <div
                                className="rounded-2"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  backgroundColor: "#e6f4ee",
                                }}
                              />

                              {review.images > 1 && (
                                <span
                                  className="text-secondary"
                                  style={{ fontSize: "0.76rem" }}
                                >
                                  +{review.images - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span
                              className="text-secondary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              0
                            </span>
                          )}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.78rem" }}
                        >
                          {review.date}

                          {review.time && (
                            <>
                              <br />
                              {review.time}
                            </>
                          )}
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                              fontSize: "0.72rem",
                            }}
                          >
                            {review.status}
                          </span>
                        </td>

                        <td className="pe-3 py-2">
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => onSelectReview?.(review)}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#6b7280",
                              }}
                              title="View review"
                            >
                              <EyeFill size={14} />
                            </button>

                            <button
                              onClick={() => onReplyReview?.(review)}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#0e8a5f",
                              }}
                              title="Reply to review"
                            >
                              <ChatDotsFill size={13} />
                            </button>

                            <button
                              onClick={() => onReviewMenu?.(review)}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#6b7280",
                              }}
                              title="Review actions"
                            >
                              <ThreeDotsVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Showing {showingFrom} to {showingTo} of{" "}
              {totalReviews.toLocaleString("en-IN")} reviews
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ChevronLeft size={13} />
              </button>

              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span key={`dots-${index}`} className="text-secondary">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className="btn rounded-3 fw-medium"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === page ? "#0e8a5f" : "#ffffff",
                      color: currentPage === page ? "#ffffff" : "#0f1724",
                      border:
                        currentPage === page ? "none" : "1px solid #d9dee3",
                      fontSize: "0.82rem",
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ChevronRight size={13} />
              </button>

              <select
                value={perPage}
                onChange={(event) =>
                  onPageLimitChange?.(Number(event.target.value))
                }
                className="form-select form-select-sm"
                style={{
                  width: "auto",
                  fontSize: "0.82rem",
                }}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsTable;
