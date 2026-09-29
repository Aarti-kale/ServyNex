import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CreditCardFill,
  ClockFill,
  HourglassSplit,
} from "react-bootstrap-icons";

const PaymentSummary = ({ salarySummary = {} }) => {
  const formatSalary = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const total = Number(salarySummary?.total || 0);

  const getPercent = (value) => {
    if (!total) return 0;

    return Math.round((Number(value || 0) / total) * 100);
  };

  const summary = [
    {
      label: "Paid",
      value: Number(salarySummary?.paid || 0),
      percent: getPercent(salarySummary?.paid),
      color: "#0e8a5f",
      bg: "#eef7f3",
      icon: <CreditCardFill size={18} color="#0e8a5f" />,
    },
    {
      label: "Pending",
      value: Number(salarySummary?.pending || 0),
      percent: getPercent(salarySummary?.pending),
      color: "#d18a1c",
      bg: "#fdf1de",
      icon: <ClockFill size={18} color="#d18a1c" />,
    },
    {
      label: "Processing",
      value: Number(salarySummary?.processing || 0),
      percent: getPercent(salarySummary?.processing),
      color: "#185fa5",
      bg: "#e0edfb",
      icon: <HourglassSplit size={18} color="#185fa5" />,
    },
  ];

  return (
    <div
      className="rounded-4 p-4 bg-white h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h5 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Payment Summary
      </h5>

      <div className="row g-2 mb-3">
        {summary.map((s, i) => (
          <div className="col-4" key={i}>
            <div
              className="rounded-3 p-3 h-100"
              style={{ backgroundColor: s.bg }}
            >
              <div className="mb-2">{s.icon}</div>

              <p className="text-secondary mb-1" style={{ fontSize: "0.8rem" }}>
                {s.label}
              </p>

              <h5
                className="fw-bold mb-1"
                style={{
                  color: s.color,
                  fontSize: "1.15rem",
                }}
              >
                {formatSalary(s.value)}
              </h5>

              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.72rem" }}
              >
                {s.percent}% of total
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="d-flex rounded-pill overflow-hidden mb-3"
        style={{ height: "8px" }}
      >
        {summary.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${s.percent}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold" style={{ color: "#0f1724" }}>
          Total Salarys
        </span>

        <span
          className="fw-bold"
          style={{
            color: "#0f1724",
            fontSize: "1.1rem",
          }}
        >
          {formatSalary(total)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
