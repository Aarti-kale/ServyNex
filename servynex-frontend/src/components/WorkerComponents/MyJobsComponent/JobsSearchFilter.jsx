import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Search,
  CalendarEventFill,
  ChevronDown,
  GeoAltFill,
  SortDown,
  ArrowClockwise,
} from "react-bootstrap-icons";

const getLocationText = (address) => {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address === "object") {
    return [
      address.address,
      address.street,
      address.area,
      address.locality,
      address.city,
      address.state,
      address.pincode,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "";
};

const getServiceName = (job) => {
  return job?.title || job?.info?.serviceType || "";
};

const JobsSearchFilter = ({ jobs = [], onSearch, onFilterChange, onReset }) => {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  const serviceOptions = useMemo(() => {
    return [...new Set(jobs.map(getServiceName).filter(Boolean))];
  }, [jobs]);

  const locationOptions = useMemo(() => {
    return [
      ...new Set(
        jobs
          .map((job) => getLocationText(job?.customer?.address))
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const notifyFilterChange = (updatedFilters = {}) => {
    if (typeof onFilterChange !== "function") {
      return;
    }

    onFilterChange({
      query,
      dateFilter,
      serviceType,
      location,
      sortBy,
      ...updatedFilters,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setQuery(value);

    if (typeof onSearch === "function") {
      onSearch(value);
    }

    notifyFilterChange({
      query: value,
    });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;

    setDateFilter(value);

    notifyFilterChange({
      dateFilter: value,
    });
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;

    setServiceType(value);

    notifyFilterChange({
      serviceType: value,
    });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;

    setLocation(value);

    notifyFilterChange({
      location: value,
    });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    setSortBy(value);

    notifyFilterChange({
      sortBy: value,
    });
  };

  const handleReset = () => {
    setQuery("");
    setDateFilter("");
    setServiceType("");
    setLocation("");
    setSortBy("");

    if (typeof onReset === "function") {
      onReset();
    }

    if (typeof onFilterChange === "function") {
      onFilterChange({
        query: "",
        dateFilter: "",
        serviceType: "",
        location: "",
        sortBy: "",
      });
    }
  };

  useEffect(() => {
    if (!Array.isArray(jobs)) {
      return;
    }

    const currentServiceExists =
      !serviceType ||
      jobs.some(
        (job) =>
          getServiceName(job).trim().toLowerCase() ===
          serviceType.trim().toLowerCase()
      );

    if (!currentServiceExists) {
      setServiceType("");
    }

    const currentLocationExists =
      !location ||
      jobs.some(
        (job) =>
          getLocationText(job?.customer?.address).trim().toLowerCase() ===
          location.trim().toLowerCase()
      );

    if (!currentLocationExists) {
      setLocation("");
    }
  }, [jobs, serviceType, location]);

  return (
    <section className="pb-3">
      <div className="container">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 flex-grow-1"
            style={{
              border: "1px solid #d9dee3",
              minWidth: "220px",
            }}
          >
            <Search size={16} className="text-secondary flex-shrink-0" />

            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search by job, customer, location..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <CalendarEventFill size={14} className="text-secondary" />

            <select
              value={dateFilter}
              onChange={handleDateChange}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
              }}
            >
              <option value="">Date</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <select
              value={serviceType}
              onChange={handleServiceChange}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
              }}
            >
              <option value="">Service Type</option>

              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <GeoAltFill size={14} className="text-secondary" />

            <select
              value={location}
              onChange={handleLocationChange}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
              }}
            >
              <option value="">Location</option>

              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <SortDown size={14} className="text-secondary" />

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="form-select border-0 shadow-none px-1 py-0"
              style={{
                fontSize: "0.85rem",
              }}
            >
              <option value="">Sort By</option>

              <option>Newest First</option>

              <option>Oldest First</option>

              <option>Price: High to Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
          >
            <ArrowClockwise size={14} />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobsSearchFilter;
