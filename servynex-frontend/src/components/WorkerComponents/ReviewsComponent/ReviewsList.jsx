import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PatchCheckFill,
  StarFill,
  CalendarEventFill,
  ChatDotsFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const formatDate = (date) => {
  if (!date) {
    return "Field not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Field not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const ReviewStars = ({ rating }) => {
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="d-flex gap-1 mb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarFill
          key={index}
          size={14}
          color={index < normalizedRating ? "#f5b301" : "#e5e7eb"}
        />
      ))}
    </div>
  );
};

const ReviewsList = ({
  reviews = [],
  loading = false,
  replying = false,
  pagination = {},
  onReply,
  onPageChange,
}) => {
  const [replyingReviewId, setReplyingReviewId] = useState(null);

  const [replyText, setReplyText] = useState("");

  const [replyError, setReplyError] = useState("");

  const handleOpenReply = (review) => {
    setReplyingReviewId(review?._id);
    setReplyText(review?.reply?.text || "");
    setReplyError("");
  };

  const handleCancelReply = () => {
    setReplyingReviewId(null);
    setReplyText("");
    setReplyError("");
  };

  const handleSubmitReply = async (review) => {
    if (!replyText.trim()) {
      setReplyError("Reply text is required.");
      return;
    }

    try {
      setReplyError("");

      await onReply?.(review, replyText.trim());

      handleCancelReply();
    } catch (error) {
      setReplyError(error?.message || "Unable to send reply.");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > (pagination.totalPages || 1)) {
      return;
    }

    onPageChange?.(page);
  };

  const getPageNumbers = () => {
    const totalPages = Number(pagination.totalPages) || 0;

    const currentPage = Number(pagination.currentPage) || 1;

    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
  };

  return (
    <section className="pb-3">
      <div className="container">
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <div
              className="spinner-border"
              style={{
                color: "#0e8a5f",
              }}
              role="status"
            />
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div
            className="rounded-4 p-5 bg-white text-center"
            style={{
              border: "1px solid #eef0f2",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#e6f4ee",
              }}
            >
              <ChatDotsFill size={22} color="#0e8a5f" />
            </div>

            <h5
              className="fw-bold mb-2"
              style={{
                color: "#0f1724",
              }}
            >
              No reviews found
            </h5>

            <p className="text-secondary mb-0">
              There are no reviews matching the selected filter.
            </p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => {
              const customerName =
                review?.customer?.name || "Field not available";

              const profileImage = review?.customer?.profileImage || "";

              const serviceName =
                review?.service?.name || "Field not available";

              const rating = Number(review?.rating || 0);

              const isVerified = review?.verified === true;

              const reviewId = review?._id;

              const isReplying = replyingReviewId === reviewId;

              return (
                <div
                  key={reviewId}
                  className="rounded-4 p-4 bg-white"
                  style={{
                    border: "1px solid #eef0f2",
                  }}
                >
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div
                      className="d-flex align-items-start gap-3 flex-grow-1"
                      style={{
                        minWidth: "260px",
                      }}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={customerName}
                          className="rounded-circle flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#e6f4ee",
                            color: "#0e8a5f",
                            fontWeight: 700,
                            fontSize: "1.2rem",
                          }}
                        >
                          {getInitials(customerName)}
                        </div>
                      )}

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6
                            className="fw-bold mb-0"
                            style={{
                              color: "#0f1724",
                            }}
                          >
                            {customerName}
                          </h6>

                          {isVerified && (
                            <PatchCheckFill size={15} color="#0e8a5f" />
                          )}
                        </div>

                        <p
                          className="fw-medium mb-2"
                          style={{
                            color: "#0e8a5f",
                            fontSize: "0.85rem",
                          }}
                        >
                          {serviceName}
                        </p>

                        <ReviewStars rating={rating} />

                        <p
                          className="text-secondary mb-0"
                          style={{
                            fontSize: "0.9rem",
                            maxWidth: "600px",
                          }}
                        >
                          {review?.comment || "Field not available"}
                        </p>

                        {review?.reply?.text && (
                          <div
                            className="mt-3 p-3 rounded-3"
                            style={{
                              backgroundColor: "#f4faf7",
                              borderLeft: "3px solid #0e8a5f",
                            }}
                          >
                            <p
                              className="fw-semibold mb-1"
                              style={{
                                color: "#0e8a5f",
                                fontSize: "0.82rem",
                              }}
                            >
                              Your Reply
                            </p>

                            <p
                              className="mb-0 text-secondary"
                              style={{
                                fontSize: "0.85rem",
                              }}
                            >
                              {review.reply.text}
                            </p>
                          </div>
                        )}

                        {isReplying && (
                          <div className="mt-3">
                            <textarea
                              value={replyText}
                              onChange={(event) =>
                                setReplyText(event.target.value)
                              }
                              className="form-control"
                              rows={3}
                              maxLength={1000}
                              placeholder="Write your reply..."
                              disabled={replying}
                            />

                            {replyError && (
                              <small className="text-danger d-block mt-1">
                                {replyError}
                              </small>
                            )}

                            <div className="d-flex gap-2 mt-2">
                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => handleSubmitReply(review)}
                                disabled={replying}
                                style={{
                                  backgroundColor: "#0e8a5f",
                                  color: "#ffffff",
                                }}
                              >
                                {replying ? "Sending..." : "Send Reply"}
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={handleCancelReply}
                                disabled={replying}
                                style={{
                                  border: "1px solid #d9dee3",
                                  color: "#0f1724",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="d-flex flex-column align-items-end gap-2 flex-shrink-0"
                      style={{
                        minWidth: "120px",
                      }}
                    >
                      <span
                        className="d-flex align-items-center gap-2 text-secondary"
                        style={{
                          fontSize: "0.85rem",
                        }}
                      >
                        <CalendarEventFill size={13} />

                        {formatDate(review?.date)}
                      </span>

                      {isVerified && (
                        <span
                          className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill fw-medium"
                          style={{
                            backgroundColor: "#e6f4ee",
                            color: "#0e8a5f",
                            fontSize: "0.75rem",
                          }}
                        >
                          <PatchCheckFill size={12} />
                          VERIFIED
                        </span>
                      )}

                      {!isReplying && (
                        <button
                          type="button"
                          onClick={() => handleOpenReply(review)}
                          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                          style={{
                            border: "1.5px solid #0e8a5f",
                            color: "#0e8a5f",
                            fontSize: "0.85rem",
                          }}
                        >
                          <ChatDotsFill size={14} />

                          {review?.reply?.text ? "Edit Reply" : "Reply"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-4">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="btn d-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: pagination.hasPreviousPage ? "#0f1724" : "#adb5bd",
                fontSize: "0.85rem",
              }}
            >
              <ChevronLeft size={13} />
              Previous
            </button>

            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="text-secondary px-1"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className="btn rounded-3 fw-medium"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor:
                      pagination.currentPage === page ? "#0e8a5f" : "#ffffff",
                    color:
                      pagination.currentPage === page ? "#ffffff" : "#0f1724",
                    border:
                      pagination.currentPage === page
                        ? "none"
                        : "1px solid #d9dee3",
                    fontSize: "0.85rem",
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="btn d-flex align-items-center gap-1 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: pagination.hasNextPage ? "#0f1724" : "#adb5bd",
                fontSize: "0.85rem",
              }}
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsList;
