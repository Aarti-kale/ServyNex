import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Funnel } from "react-bootstrap-icons";

const BookingFilters = ({
  filters = {},
  services = [],
  onFiltersChange,
  onFilter,
  onReset,
  loading = false,
}) => {
  const {
    search = "",
    status = "all",
    service = "all",
    payment = "all",
    startDate = "",
    endDate = "",
  } = filters;

  const updateFilter = (key, value) => {
    onFiltersChange?.({
      [key]: value,
    });
  };

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {/* Search */}
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 flex-grow-1"
            style={{
              border: "1px solid #d9dee3",
              minWidth: "260px",
            }}
          >
            <Search size={15} className="text-secondary flex-shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search booking ID or customer..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{
                fontSize: "0.9rem",
              }}
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <select
              value={status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
                minWidth: "130px",
              }}
              disabled={loading}
            >
              <option value="all">Status : All</option>
              <option value="pending">Pending</option>

              {/* Backend status is "accepted"; UI shows Assigned */}
              <option value="accepted">Assigned</option>

              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Service */}
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <select
              value={service}
              onChange={(event) => updateFilter("service", event.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
                minWidth: "150px",
              }}
              disabled={loading}
            >
              <option value="all">Service : All</option>

              {services.map((item) => {
                const serviceId = item?._id || item?.id;

                if (!serviceId) {
                  return null;
                }

                return (
                  <option key={serviceId} value={serviceId}>
                    {item?.name || "Not Available"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Payment */}
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <select
              value={payment}
              onChange={(event) => updateFilter("payment", event.target.value)}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
                minWidth: "145px",
              }}
              disabled={loading}
            >
              <option value="all">Payment : All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Start Date */}
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                updateFilter("startDate", event.target.value)
              }
              className="form-control border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
                minWidth: "145px",
              }}
              disabled={loading}
            />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={onFilter}
            disabled={loading}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
          >
            <Funnel size={14} />

            {loading ? "Loading..." : "Filter"}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="btn btn-link text-decoration-none px-2"
            style={{
              color: "#0e8a5f",
              fontSize: "0.85rem",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookingFilters;
