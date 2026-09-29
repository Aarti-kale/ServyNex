import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Search,
  Funnel,
  ChevronExpand,
  LightningChargeFill,
  Fan,
  Snow,
  LightbulbFill,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const statusStyles = {
  paid: { dot: "#0e8a5f", color: "#0e8a5f" },
  processing: { dot: "#d18a1c", color: "#d18a1c" },
  pending: { dot: "#dc3545", color: "#dc3545" },
};

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return {
      date: "Date not available",
      time: "",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Date not available",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const getServiceIcon = (serviceName = "") => {
  const service = serviceName.toLowerCase();

  if (service.includes("fan")) {
    return {
      icon: <Fan size={18} color="#185fa5" />,
      iconBg: "#e0edfb",
    };
  }

  if (service.includes("ac")) {
    return {
      icon: <Snow size={18} color="#d18a1c" />,
      iconBg: "#fbedd6",
    };
  }

  if (service.includes("light") || service.includes("bulb")) {
    return {
      icon: <LightbulbFill size={18} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    };
  }

  if (service.includes("switch") || service.includes("board")) {
    return {
      icon: <Cpu size={18} color="#185fa5" />,
      iconBg: "#e0edfb",
    };
  }

  return {
    icon: <LightningChargeFill size={18} color="#0e8a5f" />,
    iconBg: "#efe8fc",
  };
};

const SalarysHistory = ({
  history = [],
  pagination = {},
  loading = false,
  error = "",
  search = "",
  onSearchChange,
  onPageChange,
  onLimitChange,
  onRetry,
  onViewDetails,
}) => {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && searchValue !== search) {
        onSearchChange(searchValue);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, search, onSearchChange]);

  const currentPage = Number(pagination?.currentPage || 1);
  const totalPages = Number(pagination?.totalPages || 1);
  const perPage = Number(pagination?.perPage || 5);
  const totalHistory = Number(pagination?.totalHistory || 0);

  const startRecord = totalHistory === 0 ? 0 : (currentPage - 1) * perPage + 1;

  const endRecord =
    totalHistory === 0 ? 0 : Math.min(currentPage * perPage, totalHistory);

  return (
    <section className="pb-4">
      <div className="container">
        <div
          className="rounded-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-4 pb-3">
            <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              Salarys History
            </h5>

            <div className="d-flex flex-wrap gap-2">
              <div
                className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                style={{
                  border: "1px solid #d9dee3",
                  minWidth: "240px",
                }}
              >
                <Search size={15} className="text-secondary flex-shrink-0" />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by service or customer"
                  className="form-control border-0 shadow-none px-0 py-1"
                  style={{ fontSize: "0.88rem" }}
                />
              </div>

              <button
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                style={{
                  border: "1px solid #d9dee3",
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                <Funnel size={14} /> Filter
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr
                  style={{
                    borderTop: "1px solid #eef0f2",
                    borderBottom: "1px solid #eef0f2",
                  }}
                >
                  <th
                    className="ps-4 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Date <ChevronExpand size={11} />
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Service
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Customer
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Amount
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Payment Status
                  </th>

                  <th
                    className="pe-4 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-secondary">
                      Loading salary history...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-danger mb-2">{error}</div>

                      <button
                        onClick={onRetry}
                        className="btn btn-sm rounded-3"
                        style={{
                          border: "1px solid #0e8a5f",
                          color: "#0e8a5f",
                        }}
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}

                {!loading && !error && history.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-secondary">
                      No salary records found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  history.map((e, i) => {
                    const dateTime = formatDateTime(
                      e.paymentDate || e.createdAt
                    );

                    const serviceName =
                      e.service?.name || "Service not available";

                    const customerName =
                      e.customer?.name || "Customer not available";

                    const customerPhone =
                      e.customer?.phone || "Phone not available";

                    const status = e.status?.toLowerCase() || "";

                    const st = statusStyles[status] || {
                      dot: "#6c757d",
                      color: "#6c757d",
                    };

                    const serviceIcon = getServiceIcon(serviceName);

                    return (
                      <tr
                        key={e._id || e.paymentId || i}
                        style={{
                          borderBottom:
                            i !== history.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td className="ps-4 py-3">
                          <div
                            className="fw-semibold"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.88rem",
                            }}
                          >
                            {dateTime.date}
                          </div>

                          <div
                            className="text-secondary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {dateTime.time}
                          </div>
                        </td>

                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                              style={{
                                width: "36px",
                                height: "36px",
                                backgroundColor: serviceIcon.iconBg,
                              }}
                            >
                              {serviceIcon.icon}
                            </div>

                            <div>
                              <div
                                className="fw-semibold"
                                style={{
                                  color: "#0f1724",
                                  fontSize: "0.88rem",
                                }}
                              >
                                {serviceName}
                              </div>

                              <span
                                className="badge rounded-pill fw-medium"
                                style={{
                                  backgroundColor: "#e6f4ee",
                                  color: "#0e8a5f",
                                  fontSize: "0.68rem",
                                }}
                              >
                                {e.paymentId || "Payment"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                backgroundColor: "#e6f4ee",
                                color: "#0e8a5f",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                              }}
                            >
                              {customerName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <div
                                className="fw-semibold"
                                style={{
                                  color: "#0f1724",
                                  fontSize: "0.86rem",
                                }}
                              >
                                {customerName}
                              </div>

                              <div
                                className="text-secondary"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {customerPhone}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          className="py-3 fw-bold"
                          style={{ color: "#0f1724" }}
                        >
                          {formatAmount(e.totalAmount)}
                        </td>

                        <td className="py-3">
                          <span
                            className="d-flex align-items-center gap-2"
                            style={{
                              color: st.color,
                              fontSize: "0.86rem",
                              fontWeight: 500,
                            }}
                          >
                            <span
                              className="rounded-circle"
                              style={{
                                width: "7px",
                                height: "7px",
                                backgroundColor: st.dot,
                                display: "inline-block",
                              }}
                            />

                            {e.status || "Unknown"}
                          </span>
                        </td>

                        <td className="pe-4 py-3">
                          <button
                            onClick={() => onViewDetails && onViewDetails(e)}
                            className="btn btn-sm rounded-3 fw-medium px-3"
                            style={{
                              border: "1.5px solid #0e8a5f",
                              color: "#0e8a5f",
                              fontSize: "0.8rem",
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-4 pt-3">
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Showing {startRecord} to {endRecord} of {totalHistory} Salarys
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ChevronLeft size={13} />
              </button>

              {[1, 2, 3]
                .filter((p) => p <= totalPages)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => onPageChange && onPageChange(p)}
                    className="btn rounded-3 fw-medium"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === p ? "#0e8a5f" : "#ffffff",
                      color: currentPage === p ? "#ffffff" : "#0f1724",
                      border: currentPage === p ? "none" : "1px solid #d9dee3",
                      fontSize: "0.82rem",
                    }}
                  >
                    {p}
                  </button>
                ))}

              {totalPages > 3 && (
                <>
                  <span className="text-secondary">...</span>

                  <button
                    onClick={() => onPageChange && onPageChange(totalPages)}
                    className="btn rounded-3 fw-medium"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === totalPages ? "#0e8a5f" : "#ffffff",
                      color: currentPage === totalPages ? "#ffffff" : "#0f1724",
                      border:
                        currentPage === totalPages
                          ? "none"
                          : "1px solid #d9dee3",
                      fontSize: "0.82rem",
                    }}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ChevronRight size={13} />
              </button>
            </div>

            <select
              value={`${perPage} per page`}
              onChange={(e) => {
                const nextLimit = Number(e.target.value.split(" ")[0]);

                onLimitChange && onLimitChange(nextLimit);
              }}
              className="form-select"
              style={{
                width: "auto",
                fontSize: "0.85rem",
              }}
            >
              <option>5 per page</option>
              <option>10 per page</option>
              <option>25 per page</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalarysHistory;
