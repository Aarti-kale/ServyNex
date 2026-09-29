import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  QuestionCircleFill,
  PlusLg,
  ArrowUp,
  ArrowDown,
  TrashFill,
  GripVertical,
  SaveFill,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";

const QUESTION_LIMIT = 200;
const ANSWER_LIMIT = 1000;

const DEFAULT_FAQS = [
  {
    question: "How do I book a service?",
    answer:
      "You can book a service by browsing our services, selecting your preferred professional, and choosing a convenient date and time.",
  },
  {
    question: "Are your professionals verified?",
    answer:
      "Yes, all our professionals are background checked, verified for their skills and experience, and rated by real customers.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, digital wallets and net banking for your convenience.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes, you can cancel or reschedule your booking from your account dashboard. Please check our cancellation policy for specific terms and conditions.",
  },
  {
    question: "Do you offer any discounts or offers?",
    answer:
      "Yes, we regularly offer discounts and special deals. You can check our offers section or subscribe to our newsletter for the latest updates.",
  },
];

const FaqEdit = ({ data = [], onChange, onReset, onSave, saving = false }) => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);

  useEffect(() => {
    const incomingFaqs = Array.isArray(data) ? data : [];

    if (incomingFaqs.length > 0) {
      setFaqs(
        incomingFaqs.map((faq) => ({
          _id: faq?._id,
          question: faq?.question || "",
          answer: faq?.answer || "",
        }))
      );
    } else {
      setFaqs(DEFAULT_FAQS);
    }
  }, [data]);

  const emitChange = (updatedFaqs) => {
    if (typeof onChange === "function") {
      onChange(updatedFaqs);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFaqs = faqs.map((faq, faqIndex) =>
      faqIndex === index
        ? {
            ...faq,
            [field]: value,
          }
        : faq
    );

    setFaqs(updatedFaqs);
    emitChange(updatedFaqs);
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= faqs.length) {
      return;
    }

    const updatedFaqs = [...faqs];

    [updatedFaqs[index], updatedFaqs[newIndex]] = [
      updatedFaqs[newIndex],
      updatedFaqs[index],
    ];

    setFaqs(updatedFaqs);
    emitChange(updatedFaqs);
  };

  const handleDelete = (index) => {
    const updatedFaqs = faqs.filter((_, faqIndex) => faqIndex !== index);

    setFaqs(updatedFaqs);
    emitChange(updatedFaqs);
  };

  const handleAddFaq = () => {
    const newFaq = {
      question: "",
      answer: "",
    };

    const updatedFaqs = [newFaq, ...faqs];

    setFaqs(updatedFaqs);
    emitChange(updatedFaqs);
  };

  const handleReset = () => {
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    const resetFaqs = DEFAULT_FAQS.map((faq) => ({
      ...faq,
    }));

    setFaqs(resetFaqs);
    emitChange(resetFaqs);
  };

  const handleSave = () => {
    if (typeof onSave !== "function") {
      return;
    }

    const cleanedFaqs = faqs.map((faq) => ({
      ...(faq?._id ? { _id: faq._id } : {}),
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }));

    onSave(cleanedFaqs);
  };

  return (
    <div
      className="rounded-4 bg-white p-4"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <QuestionCircleFill size={18} color="#0e8a5f" />

            <h6
              className="fw-bold mb-0"
              style={{
                color: "#0f1724",
              }}
            >
              FAQs
            </h6>
          </div>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.82rem",
            }}
          >
            Add, edit or remove FAQs. Each FAQ is shown as an expandable
            question on your homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddFaq}
          disabled={saving}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
          style={{
            border: "1px solid #bde5d5",
            color: "#0e8a5f",
            backgroundColor: "#ffffff",
          }}
        >
          <PlusLg size={14} />
          Add FAQ
        </button>
      </div>

      <div className="d-flex flex-column gap-3">
        {faqs.length === 0 ? (
          <div
            className="text-center py-5 rounded-3"
            style={{
              border: "1px dashed #bde5d5",
              backgroundColor: "#f8fcfa",
            }}
          >
            <QuestionCircleFill size={28} color="#0e8a5f" />

            <p
              className="fw-medium mb-1 mt-2"
              style={{
                color: "#0f1724",
              }}
            >
              No FAQs added yet
            </p>

            <p
              className="text-secondary mb-3"
              style={{
                fontSize: "0.8rem",
              }}
            >
              Add your first frequently asked question.
            </p>

            <button
              type="button"
              onClick={handleAddFaq}
              disabled={saving}
              className="btn d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                backgroundColor: "#0e8a5f",
                color: "#ffffff",
                border: "none",
              }}
            >
              <PlusLg size={14} />
              Add FAQ
            </button>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq?._id || `faq-${index}`}
              className="rounded-3 p-3"
              style={{
                border: "1px solid #eef0f2",
                backgroundColor: "#ffffff",
              }}
            >
              <div className="row g-3 align-items-start">
                {/* Drag handle and FAQ number. */}
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-3 pt-2">
                    <GripVertical size={18} color="#8b96a5" />

                    <span
                      className="d-flex align-items-center justify-content-center rounded-circle fw-semibold"
                      style={{
                        width: "28px",
                        height: "28px",
                        backgroundColor: "#e6f4ee",
                        color: "#0e8a5f",
                        fontSize: "0.78rem",
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      className="form-label mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.84rem",
                      }}
                    >
                      Question{" "}
                      <span
                        style={{
                          color: "#dc3545",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <span
                      className="text-secondary"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      {faq.question.length}/{QUESTION_LIMIT}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      handleFieldChange(index, "question", e.target.value)
                    }
                    maxLength={QUESTION_LIMIT}
                    className="form-control py-2"
                    placeholder="Enter frequently asked question"
                  />
                </div>

                <div className="col-lg-5">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      className="form-label mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.84rem",
                      }}
                    >
                      Answer{" "}
                      <span
                        style={{
                          color: "#dc3545",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <span
                      className="text-secondary"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      {faq.answer.length}/{ANSWER_LIMIT}
                    </span>
                  </div>

                  <textarea
                    value={faq.answer}
                    onChange={(e) =>
                      handleFieldChange(index, "answer", e.target.value)
                    }
                    maxLength={ANSWER_LIMIT}
                    rows={3}
                    className="form-control"
                    placeholder="Enter the answer"
                  />
                </div>

                <div className="col-auto">
                  <div className="d-flex align-items-center gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || saving}
                      className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "1px solid #d9dee3",
                        color: "#24345c",
                        backgroundColor: "#ffffff",
                        opacity: index === 0 ? 0.45 : 1,
                      }}
                      aria-label="Move FAQ up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === faqs.length - 1 || saving}
                      className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "1px solid #d9dee3",
                        color: "#24345c",
                        backgroundColor: "#ffffff",
                        opacity: index === faqs.length - 1 ? 0.45 : 1,
                      }}
                      aria-label="Move FAQ down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      disabled={saving}
                      className="btn d-flex align-items-center justify-content-center p-0 rounded-2"
                      style={{
                        width: "34px",
                        height: "34px",
                        border: "1px solid #fdecec",
                        color: "#dc3545",
                        backgroundColor: "#fffafa",
                      }}
                      aria-label="Delete FAQ"
                    >
                      <TrashFill size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
            backgroundColor: "#ffffff",
          }}
        >
          <ArrowCounterclockwise size={14} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-semibold text-white"
          style={{
            backgroundColor: "#0e8a5f",
            border: "none",
          }}
        >
          <SaveFill size={14} />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default FaqEdit;
