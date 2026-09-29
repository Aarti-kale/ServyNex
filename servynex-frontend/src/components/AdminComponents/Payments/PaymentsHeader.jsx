import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronRight,
  Upload,
  CalendarEventFill,
  WalletFill,
  ArrowLeftRight,
  CheckCircleFill,
  ArrowCounterclockwise,
  ReceiptCutoff,
} from "react-bootstrap-icons";

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

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PaymentsHeader = ({
  stats = {},
  loading = false,
  onExport,
  startDate,
  endDate,
}) => {
  const statCards = [
    {
      label: "Total Revenue",
      value: stats.totalRevenue,
      icon: (
        <span
          className="fw-bold"
          style={{
            color: "#fff",
            fontSize: "17px",
          }}
        >
          ₹
        </span>
      ),
      iconBg: "#0e8a5f",
    },
    {
      label: "Today's Collection",
      value: stats.todayCollection,
      icon: <WalletFill size={19} color="#ffffff" />,
      iconBg: "#d18a1c",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      icon: <ArrowLeftRight size={19} color="#ffffff" />,
      iconBg: "#185fa5",
    },
    {
      label: "Successful Payments",
      value: stats.successfulPayments,
      icon: <CheckCircleFill size={19} color="#ffffff" />,
      iconBg: "#7c5ad1",
    },
    {
      label: "Refunded Amount",
      value: stats.refundedAmount,
      icon: <ArrowCounterclockwise size={19} color="#ffffff" />,
      iconBg: "#e67e22",
    },
    {
      label: "GST Collected",
      value: stats.gstCollected,
      icon: <ReceiptCutoff size={19} color="#ffffff" />,
      iconBg: "#17a2a2",
    },
  ];

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const dateRange =
    formattedStartDate && formattedEndDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : "All Dates";

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              Payments
            </h1>

            <nav style={{ fontSize: "0.86rem" }}>
              <span className="fw-medium" style={{ color: "#0e8a5f" }}>
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Payments</span>
            </nav>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExport}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{
                border: "1px solid #d9dee3",
                color: "#0f1724",
              }}
            >
              <Upload size={14} />
              Export
            </button>

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
                {dateRange}
              </span>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {statCards.map((stat) => (
            <div className="col-6 col-lg-2" key={stat.label}>
              <div
                className="rounded-4 p-3 h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-2"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: stat.iconBg,
                  }}
                >
                  {stat.icon}
                </div>

                <p
                  className="text-secondary mb-1"
                  style={{
                    fontSize: "0.76rem",
                  }}
                >
                  {stat.label}
                </p>

                <h5
                  className="fw-bold mb-1"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {loading ? "Loading..." : formatCurrency(stat.value)}
                </h5>

                <p
                  className="fw-medium mb-0"
                  style={{
                    color: "#6b7280",
                    fontSize: "0.7rem",
                  }}
                >
                  {displayValue(stat.growth) === "Not Available"
                    ? "Field Not Available"
                    : stat.growth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentsHeader;
