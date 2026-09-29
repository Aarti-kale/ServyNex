import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChevronDown, ArrowRight } from "react-bootstrap-icons";

const FAQSection = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = Array.isArray(data)
    ? [...data]
        .filter((faq) => faq?.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const toggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
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
              Frequently Asked Questions
            </h2>

            <p className="text-secondary mb-0">
              Find quick answers to common questions
            </p>
          </div>

          <button
            type="button"
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium mt-2"
            style={{
              border: "1.5px solid #0e8a5f",
              color: "#0e8a5f",
            }}
          >
            View All FAQs <ArrowRight size={14} />
          </button>
        </div>

        <div className="row g-3">
          {faqs.map((faq, index) => (
            <div
              className="col-md-6"
              key={faq._id || `${faq.question}-${index}`}
            >
              <div
                className="rounded-3 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <button
                  type="button"
                  className="btn w-100 d-flex justify-content-between align-items-center px-3 py-3 text-start"
                  style={{
                    color: "#0f1724",
                    fontWeight: 500,
                  }}
                  onClick={() => toggle(index)}
                >
                  <span style={{ fontSize: "0.9rem" }}>
                    {faq.question || ""}
                  </span>

                  <ChevronDown
                    size={16}
                    style={{
                      transform:
                        openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      color: "#0e8a5f",
                    }}
                  />
                </button>

                {openIndex === index && (
                  <div
                    className="px-3 pb-3 text-secondary"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {faq.answer || ""}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
