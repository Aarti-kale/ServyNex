import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, ArrowClockwise } from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const ServicesFilter = ({
  onSearch,
  onCategoryChange,
  onStatusChange,
  onReset,
}) => {
  const [query, setQuery] = useState("");

  const handleReset = () => {
    setQuery("");
    onReset && onReset();
  };

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
              placeholder="Search service by name..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{ fontSize: "0.9rem" }}
            />
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Category
            </span>
            <select
              onChange={(e) =>
                onCategoryChange && onCategoryChange(e.target.value)
              }
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">All Categories</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>AC Repair</option>
              <option>Cleaning</option>
              <option>Painting</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{ border: "1px solid #d9dee3" }}
          >
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Status
            </span>
            <select
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
          >
            <ArrowClockwise size={14} /> Reset
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesFilter;
