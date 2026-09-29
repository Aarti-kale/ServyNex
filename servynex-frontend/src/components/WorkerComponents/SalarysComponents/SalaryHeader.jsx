import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  WalletFill,
  GraphUpArrow,
  CalendarEventFill,
  CashStack,
  ChevronRight,
} from "react-bootstrap-icons";

const periodOptions = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  all: "This Year",
};

const SalarysHeader = ({ onPeriodChange, period = "month", salary = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const stats = [
    {
      label: "Today's Salarys",
      value: `₹${Number(salary?.today || 0).toLocaleString("en-IN")}`,
      icon: <WalletFill size={22} color="#0e8a5f" />,
    },
    {
      label: "This Week",
      value: `₹${Number(salary?.week || 0).toLocaleString("en-IN")}`,
      icon: <GraphUpArrow size={22} color="#0e8a5f" />,
    },
    {
      label: "This Month",
      value: `₹${Number(salary?.month || 0).toLocaleString("en-IN")}`,
      icon: <CalendarEventFill size={22} color="#0e8a5f" />,
    },
    {
      label: "Total Salarys",
      value: `₹${Number(salary?.total || 0).toLocaleString("en-IN")}`,
      icon: <CashStack size={22} color="#0e8a5f" />,
    },
  ];

  const handleChange = (e) => {
    const value = e.target.value;

    setSelectedPeriod(value);

    if (onPeriodChange) {
      onPeriodChange(value);
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{ color: "#0f1724", fontSize: "1.9rem" }}
            >
              Salarys
            </h1>

            <p className="text-secondary mb-0">
              Track your income &amp; payment history.
            </p>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <CalendarEventFill size={14} className="text-secondary" />

            <select
              value={selectedPeriod}
              onChange={handleChange}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.88rem" }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">This Year</option>
            </select>
          </div>
        </div>

        <div className="row g-3">
          {stats.map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div
                className="rounded-4 p-4 h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    {s.icon}
                  </div>

                  <ChevronRight size={16} className="text-secondary mt-2" />
                </div>

                <p
                  className="text-secondary mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  {s.label}
                </p>

                <h4 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                  {s.value}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SalarysHeader;
