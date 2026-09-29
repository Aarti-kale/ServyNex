import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  StarFill,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "react-bootstrap-icons";

const TestimonialsSection = ({ data }) => {
  const testimonials = Array.isArray(data) ? data : [];

  const getCustomerName = (review) => {
    return review?.name || review?.user?.name || "";
  };

  const getCustomerCity = (review) => {
    return review?.city || review?.user?.location || "";
  };

  const getReviewText = (review) => {
    return review?.text || review?.comment || review?.review || "";
  };

  const getCustomerAvatar = (review) => {
    return (
      review?.avatar || review?.profileImage || review?.user?.profileImage || ""
    );
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <div className="text-center text-md-start mx-auto mx-md-0">
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.6rem",
              }}
            >
              What Our Customers Say
            </h2>

            <p className="text-secondary mb-0">
              Real experiences from our happy customers
            </p>
          </div>

          <a
            href="/reviews"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All Reviews <ArrowRight size={14} />
          </a>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn rounded-circle d-none d-md-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid #d1d5db",
            }}
          >
            <ChevronLeft />
          </button>

          <div className="row g-3 flex-fill">
            {testimonials.map((testimonial, index) => {
              const rating = Math.min(
                5,
                Math.max(0, Number(testimonial?.rating) || 0)
              );

              const name = getCustomerName(testimonial);
              const city = getCustomerCity(testimonial);
              const text = getReviewText(testimonial);
              const avatar = getCustomerAvatar(testimonial);

              return (
                <div
                  className="col-md-4"
                  key={testimonial?._id || `${name || "review"}-${index}`}
                >
                  <div
                    className="rounded-4 p-4 h-100 bg-white"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div
                      className="fs-3 fw-bold mb-2"
                      style={{
                        color: "#0e8a5f",
                        lineHeight: 1,
                      }}
                    >
                      "
                    </div>

                    <div className="d-flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <StarFill
                          key={starIndex}
                          size={14}
                          color={starIndex < rating ? "#f5b301" : "#e5e7eb"}
                        />
                      ))}
                    </div>

                    <p
                      className="text-secondary mb-4"
                      style={{
                        fontSize: "0.9rem",
                      }}
                    >
                      {text}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name || "Customer"}
                          className="rounded-circle"
                          style={{
                            width: "38px",
                            height: "38px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center bg-light"
                          style={{
                            width: "38px",
                            height: "38px",
                          }}
                        >
                          {name?.charAt(0)?.toUpperCase() || ""}
                        </div>
                      )}

                      <div>
                        <div
                          className="fw-semibold"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.85rem",
                          }}
                        >
                          {name}
                        </div>

                        <div
                          className="text-secondary"
                          style={{
                            fontSize: "0.75rem",
                          }}
                        >
                          {city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn rounded-circle d-none d-md-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid #d1d5db",
            }}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
