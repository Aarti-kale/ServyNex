import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  CalendarEventFill,
  ChevronDown,
  Download,
} from "react-bootstrap-icons";

const formatDisplayDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Data Not Available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPeriodRange = (selectedPeriod) => {
  const now = new Date();

  let start;
  let end = new Date(now);

  switch (selectedPeriod) {
    case "This Week": {
      const day = now.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;

      start = new Date(now);
      start.setDate(now.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);

      break;
    }

    case "This Month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1);

      break;
    }

    case "This Quarter": {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;

      start = new Date(now.getFullYear(), quarterStartMonth, 1);

      break;
    }

    case "This Year": {
      start = new Date(now.getFullYear(), 0, 1);

      break;
    }

    default: {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  return {
    start,
    end,
  };
};

const formatApiDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const ReportsHeader = ({
  onExport,
  onPeriodChange,
  initialPeriod = "This Month",
}) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [exportOpen, setExportOpen] = useState(false);

  const notifyPeriodChange = (selectedPeriod) => {
    const { start, end } = getPeriodRange(selectedPeriod);

    if (typeof onPeriodChange === "function") {
      onPeriodChange({
        period: selectedPeriod,
        startDate: formatApiDate(start),
        endDate: formatApiDate(end),
      });
    }
  };

  useEffect(() => {
    notifyPeriodChange(initialPeriod);
  }, []);

  const handlePeriodChange = (event) => {
    const selectedPeriod = event.target.value;

    setPeriod(selectedPeriod);
    notifyPeriodChange(selectedPeriod);
  };

  const handleExport = (option) => {
    if (typeof onExport === "function") {
      onExport(option);
    }

    setExportOpen(false);
  };

  const { start, end } = getPeriodRange(period);

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              Reports
            </h1>

            <nav style={{ fontSize: "0.86rem" }}>
              <span
                className="fw-medium"
                style={{
                  color: "#0e8a5f",
                }}
              >
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Reports</span>
            </nav>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div
              className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
              style={{
                border: "1px solid #d9dee3",
              }}
            >
              <CalendarEventFill size={14} color="#0e8a5f" />

              <span
                style={{
                  fontSize: "0.86rem",
                  color: "#0f1724",
                }}
              >
                {formatDisplayDate(start)} - {formatDisplayDate(end)}
              </span>
            </div>

            <div
              className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
              style={{
                border: "1px solid #d9dee3",
              }}
            >
              <select
                value={period}
                onChange={handlePeriodChange}
                className="form-select border-0 shadow-none px-1 py-0"
                style={{
                  fontSize: "0.86rem",
                }}
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="position-relative">
              <button
                type="button"
                onClick={() => setExportOpen((previous) => !previous)}
                className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor: "#0e8a5f",
                }}
              >
                <Download size={14} />
                Export Report
                <ChevronDown size={12} />
              </button>

              {exportOpen && (
                <div
                  className="position-absolute bg-white rounded-3 shadow mt-1"
                  style={{
                    right: 0,
                    minWidth: "180px",
                    border: "1px solid #eef0f2",
                    zIndex: 10,
                  }}
                >
                  {["Export as PDF", "Export as Excel", "Print Report"].map(
                    (option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => handleExport(option)}
                        className="btn d-block w-100 text-start px-3 py-2"
                        style={{
                          fontSize: "0.85rem",
                          color: "#0f1724",
                        }}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportsHeader;
