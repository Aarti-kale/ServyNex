import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CalendarEventFill, FileEarmarkTextFill } from "react-bootstrap-icons";

const SalarySummary = ({ salary = {} }) => {
  const formatSalary = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const breakdown = [
    {
      label: "This Week",
      value: formatSalary(salary?.week),
      icon: <CalendarEventFill size={14} color="#0e8a5f" />,
    },
    {
      label: "This Month",
      value: formatSalary(salary?.month),
      icon: <CalendarEventFill size={14} color="#0e8a5f" />,
    },
    {
      label: "Total Salarys",
      value: formatSalary(salary?.total),
      icon: <FileEarmarkTextFill size={14} color="#0e8a5f" />,
    },
  ];

  return (
    <div
      className="rounded-4 p-4 bg-white h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Salary Summary
        </h5>

        <a
          href="#Salarys-details"
          className="fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.85rem",
          }}
        >
          View Details
        </a>
      </div>

      <div
        className="rounded-3 p-3 mb-3 d-flex align-items-center justify-content-between"
        style={{ backgroundColor: "#f3faf6" }}
      >
        <div>
          <p className="text-secondary mb-1" style={{ fontSize: "0.8rem" }}>
            Today's Salarys
          </p>

          <h3 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
            {formatSalary(salary?.today)}
          </h3>
        </div>

        <svg width="90" height="40" viewBox="0 0 90 40" fill="none">
          <polyline
            points="0,30 15,25 30,28 45,15 60,20 75,8 90,12"
            fill="none"
            stroke="#0e8a5f"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="d-flex flex-column gap-3 mb-3">
        {breakdown.map((b, i) => (
          <div
            key={i}
            className="d-flex align-items-center justify-content-between"
          >
            <span
              className="d-flex align-items-center gap-2 text-secondary"
              style={{ fontSize: "0.85rem" }}
            >
              {b.icon}
              {b.label}
            </span>

            <span className="fw-semibold" style={{ color: "#0f1724" }}>
              {b.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="rounded-3 text-center py-2"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <span className="text-secondary" style={{ fontSize: "0.78rem" }}>
          Salarys will update every 24 hours
        </span>
      </div>
    </div>
  );
};

export default SalarySummary;
