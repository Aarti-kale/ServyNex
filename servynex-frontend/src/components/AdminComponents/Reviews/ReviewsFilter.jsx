import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Search,
  CalendarEventFill,
  ArrowClockwise,
} from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const ReviewsFilter = ({
  onSearch,
  onRatingChange,
  onStatusChange,
  onCategoryChange,
  onWorkerChange,
  onClear,
}) => {
  const [query, setQuery] = useState("");

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 flex-grow-1"
            style={{ border: "1px solid #d9dee3", minWidth: "220px" }}
          >
            <Search size={15} className="text-secondary flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch && onSearch(e.target.value);
              }}
              placeholder="Search by customer, worker, booking ID..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{ fontSize: "0.9rem" }}
            />
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <select
              onChange={(e) => onRatingChange && onRatingChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">Rating</option>
              <option>5 Star</option>
              <option>4 Star</option>
              <option>3 Star</option>
              <option>2 Star</option>
              <option>1 Star</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <select
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Reported</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <select
              onChange={(e) =>
                onCategoryChange && onCategoryChange(e.target.value)
              }
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">Category</option>
              <option>Electrician</option>
              <option>Plumbing</option>
              <option>Cleaning</option>
              <option>Painting</option>
              <option>Carpentry</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <select
              onChange={(e) => onWorkerChange && onWorkerChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">Worker</option>
              <option>Rahul Kumar</option>
              <option>Amit Singh</option>
              <option>Suresh Yadav</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <CalendarEventFill size={14} color="#0e8a5f" />
            <span style={{ fontSize: "0.85rem", color: "#0f1724" }}>
              01 May 2025 - 31 May 2025
            </span>
          </div>

          <button
            onClick={onClear}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
          >
            <ArrowClockwise size={14} /> Clear
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsFilter;
