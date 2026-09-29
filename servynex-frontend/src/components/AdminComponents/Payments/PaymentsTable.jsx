import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  EyeFill,
  ReceiptCutoff,
  ChevronLeft,
  ChevronRight,
  Snow,
  Droplet,
  LightningChargeFill,
  Brush,
  PaletteFill,
} from "react-bootstrap-icons";

const statusStyles = {
  paid: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },
  pending: {
    bg: "#fdf1de",
    color: "#b5730a",
  },
  failed: {
    bg: "#fdecec",
    color: "#dc3545",
  },
  refunded: {
    bg: "#efe8fc",
    color: "#7c5ad1",
  },
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatStatus = (status) => {
  if (!status) {
    return "Not Available";
  }

  return String(status)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatMethod = (method) => {
  if (!method) {
    return "Not Available";
  }

  const methodMap = {
    upi: "UPI",
    card: "Card",
    cash: "Cash",
    wallet: "Wallet",
    netbanking: "Net Banking",
    "net banking": "Net Banking",
  };

  const normalized = String(method).trim().toLowerCase();

  return (
    methodMap[normalized] ||
    String(method)
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

const formatDate = (value) => {
  if (!value) {
    return {
      date: "Not Available",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: "Not Available",
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
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

const getServiceIcon = (serviceName) => {
  const service = String(serviceName || "").toLowerCase();

  if (service.includes("ac") || service.includes("air")) {
    return {
      icon: <Snow size={15} color="#185fa5" />,
      bg: "#e0edfb",
    };
  }

  if (service.includes("plumb")) {
    return {
      icon: <Droplet size={15} color="#185fa5" />,
      bg: "#e0edfb",
    };
  }

  if (service.includes("electric")) {
    return {
      icon: <LightningChargeFill size={15} color="#d18a1c" />,
      bg: "#fbedd6",
    };
  }

  if (service.includes("clean")) {
    return {
      icon: <Brush size={15} color="#0e8a5f" />,
      bg: "#e6f4ee",
    };
  }

  if (service.includes("paint")) {
    return {
      icon: <PaletteFill size={15} color="#7c5ad1" />,
      bg: "#efe8fc",
    };
  }

  return {
    icon: <ReceiptCutoff size={15} color="#6b7280" />,
    bg: "#f3f4f6",
  };
};

const PaymentsTable = ({
  payments = [],
  pagination = {},
  loading = false,
  onSelectPayment,
  onPageChange,
}) => {
  const currentPage = Number(pagination.currentPage || 1);

  const totalPages = Number(pagination.totalPages || 1);

  const totalPayments = Number(pagination.totalPayments || 0);

  const perPage = Number(pagination.perPage || payments.length || 1);

  const startItem = totalPayments === 0 ? 0 : (currentPage - 1) * perPage + 1;

  const endItem =
    totalPayments === 0 ? 0 : Math.min(currentPage * perPage, totalPayments);

  const handlePageChange = (page) => {
    const nextPage = Math.max(1, Math.min(totalPages, page));

    if (nextPage !== currentPage) {
      onPageChange?.(nextPage);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 bg-white"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
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
                    className="ps-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Payment ID
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Booking ID
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Customer
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Service
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Amount
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    GST
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Method
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Status
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Date
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-5 text-secondary"
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-5 text-secondary"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => {
                    const statusKey = String(
                      payment.status || ""
                    ).toLowerCase();

                    const status = statusStyles[statusKey] || {
                      bg: "#f3f4f6",
                      color: "#6b7280",
                    };

                    const serviceName =
                      payment.service?.name || payment.service || "";

                    const serviceIcon = getServiceIcon(serviceName);

                    const customerName =
                      payment.customer?.name ||
                      payment.customer ||
                      "Not Available";

                    const customerPhone =
                      payment.customer?.phone ||
                      payment.phone ||
                      "Not Available";

                    const bookingId =
                      payment.booking?.bookingId ||
                      payment.bookingId ||
                      "Not Available";

                    const paymentDate =
                      payment.paymentDate || payment.createdAt || payment.date;

                    const formattedDate = formatDate(paymentDate);

                    return (
                      <tr
                        key={payment._id || payment.paymentId || index}
                        style={{
                          borderBottom:
                            index !== payments.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td
                          className="ps-3 py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.84rem",
                          }}
                        >
                          {payment.paymentId || payment.id || "Not Available"}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.84rem",
                          }}
                        >
                          {bookingId}
                        </td>

                        <td className="py-2">
                          <p
                            className="fw-medium mb-0"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.84rem",
                            }}
                          >
                            {customerName}
                          </p>

                          <p
                            className="text-secondary mb-0"
                            style={{
                              fontSize: "0.72rem",
                            }}
                          >
                            {customerPhone}
                          </p>
                        </td>

                        <td className="py-2">
                          <span
                            className="d-flex align-items-center gap-2"
                            style={{
                              fontSize: "0.84rem",
                              color: "#0f1724",
                            }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center rounded-2"
                              style={{
                                width: "28px",
                                height: "28px",
                                backgroundColor: serviceIcon.bg,
                              }}
                            >
                              {serviceIcon.icon}
                            </span>

                            {serviceName || "Not Available"}
                          </span>
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.84rem",
                          }}
                        >
                          {formatCurrency(payment.totalAmount)}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.84rem",
                          }}
                        >
                          {formatCurrency(payment.gst)}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.84rem",
                          }}
                        >
                          {formatMethod(
                            payment.paymentMethod || payment.method
                          )}
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: status.bg,
                              color: status.color,
                              fontSize: "0.72rem",
                            }}
                          >
                            {formatStatus(payment.status)}
                          </span>
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.78rem",
                          }}
                        >
                          {formattedDate.date}

                          {formattedDate.time && (
                            <>
                              <br />
                              {formattedDate.time}
                            </>
                          )}
                        </td>

                        <td className="pe-3 py-2">
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectPayment?.(payment)}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#6b7280",
                              }}
                              title="View payment"
                            >
                              <EyeFill size={14} />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#6b7280",
                              }}
                              title="Invoice"
                            >
                              <ReceiptCutoff size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && totalPayments > 0 && (
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
              <span
                className="text-secondary"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                Showing {startItem} to {endItem} of {totalPayments} payments
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="btn d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    border: "1px solid #d9dee3",
                    width: "32px",
                    height: "32px",
                    opacity: currentPage <= 1 ? 0.5 : 1,
                  }}
                >
                  <ChevronLeft size={13} />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className="btn rounded-3 fw-medium"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === page ? "#0e8a5f" : "#ffffff",
                      color: currentPage === page ? "#ffffff" : "#0f1724",
                      border:
                        currentPage === page ? "none" : "1px solid #d9dee3",
                      fontSize: "0.82rem",
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="btn d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    border: "1px solid #d9dee3",
                    width: "32px",
                    height: "32px",
                    opacity: currentPage >= totalPages ? 0.5 : 1,
                  }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentsTable;
