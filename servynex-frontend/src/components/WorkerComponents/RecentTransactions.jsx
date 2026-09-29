import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ArrowDownCircleFill,
  ClockFill,
  ExclamationCircleFill,
  ChevronRight,
} from "react-bootstrap-icons";

const formatDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const getStatusConfig = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "paid":
      return {
        label: "Credited",
        color: "#0e8a5f",
        icon: <ArrowDownCircleFill size={18} color="#0e8a5f" />,
        iconBg: "#e6f4ee",
      };

    case "processing":
      return {
        label: "Processing",
        color: "#d18a1c",
        icon: <ClockFill size={18} color="#d18a1c" />,
        iconBg: "#fdf1de",
      };

    case "pending":
      return {
        label: "Pending",
        color: "#dc3545",
        icon: <ExclamationCircleFill size={18} color="#dc3545" />,
        iconBg: "#fdecec",
      };

    default:
      return {
        label: status || "Unknown",
        color: "#6c757d",
        icon: <ClockFill size={18} color="#6c757d" />,
        iconBg: "#f1f3f5",
      };
  }
};

const RecentTransactions = ({ transactions = [], loading = false }) => {
  return (
    <div
      className="rounded-4 p-4 bg-white h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <h5 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
        Recent Transactions
      </h5>

      <div className="flex-grow-1">
        {loading ? (
          <div className="text-secondary py-3">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-secondary py-3">
            No recent transactions found.
          </div>
        ) : (
          transactions.map((transaction, index) => {
            const statusConfig = getStatusConfig(transaction.status);

            return (
              <div key={transaction._id || transaction.paymentId || index}>
                <div className="d-flex align-items-center gap-3 py-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: statusConfig.iconBg,
                    }}
                  >
                    {statusConfig.icon}
                  </div>

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {formatDate(
                        transaction.paymentDate || transaction.createdAt
                      )}
                    </p>

                    <p
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.88rem",
                      }}
                    >
                      {transaction.service?.name || "Service"}
                    </p>
                  </div>

                  <div className="text-end flex-shrink-0">
                    <p
                      className="fw-bold mb-0"
                      style={{ color: statusConfig.color }}
                    >
                      {formatAmount(transaction.totalAmount)}
                    </p>

                    <p
                      className="mb-0"
                      style={{
                        color: statusConfig.color,
                        fontSize: "0.75rem",
                      }}
                    >
                      {statusConfig.label}
                    </p>
                  </div>
                </div>

                {index !== transactions.length - 1 && <hr className="m-0" />}
              </div>
            );
          })
        )}
      </div>

      <a
        href="#all-transactions"
        className="d-flex align-items-center justify-content-between text-decoration-none pt-3"
        style={{ color: "#0e8a5f" }}
      >
        <span className="fw-medium">View All Transactions</span>
        <ChevronRight size={16} />
      </a>
    </div>
  );
};

export default RecentTransactions;
