import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Funnel } from "react-bootstrap-icons"; 

const CustomersFilter = ({ onSearch, onStatusChange, onCityChange, onSortChange, onFilter }) => {
  const [query, setQuery] = useState("");

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 flex-grow-1"
            style={{ border: "1px solid #d9dee3", minWidth: "240px" }}
          >
            <Search size={15} className="text-secondary flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch && onSearch(e.target.value);
              }}
              placeholder="Search customer by name, phone or email..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{ fontSize: "0.9rem" }}
            />
          </div>

          <div className="d-flex align-items-center gap-2 rounded-3 px-3 py-2" style={{ border: "1px solid #d9dee3" }}>
            <select
              onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">Status: All</option>
              <option value="active">Status: Active</option>
              <option value="blocked">Status: Blocked</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2 rounded-3 px-3 py-2" style={{ border: "1px solid #d9dee3" }}>
            <select
              onChange={(e) => onCityChange && onCityChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="all">City: All</option>
              <option>Pune</option>
              <option>Indore</option>
              <option>Mumbai</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2 rounded-3 px-3 py-2" style={{ border: "1px solid #d9dee3" }}>
            <select
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="latest">Sort By: Latest</option>
              <option value="oldest">Sort By: Oldest</option>
              <option value="highspend">Sort By: Highest Spend</option>
            </select>
          </div>

          <button
            onClick={onFilter}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{ border: "1px solid #d9dee3", color: "#0f1724", fontSize: "0.85rem" }}
          >
            <Funnel size={14} /> Filter
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomersFilter;