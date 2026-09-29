import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";

import API from "../../../api/api";

const statusStyles = {
  pending: {
    bg: "#fdf1de",
    color: "#b5730a",
  },
  approved: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },
  rejected: {
    bg: "#fdecec",
    color: "#dc3545",
  },
  completed: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },
};

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toLocaleString("en-IN")}`;
};

const formatStatus = (status = "") => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const RefundRequests = ({ onViewAll }) => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRefunds = async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/payments/refunds", {
        params: {
          page: 1,
          limit: 10,
        },
      });

      const data = response?.data?.data;

      setRefunds(Array.isArray(data?.refunds) ? data.refunds : []);
    } catch (error) {
      console.error("Failed to fetch refund requests:", error);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleAction = async (refundId, action) => {
    if (!refundId || processingId) return;

    try {
      setProcessingId(refundId);

      await API.put(`/admin/payments/refunds/${refundId}/${action}`);

      await fetchRefunds();
    } catch (error) {
      console.error(`Failed to ${action} refund:`, error);

      const message =
        error?.response?.data?.message || `Failed to ${action} refund`;

      alert(message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Refund Requests
        </h6>

        <button
          type="button"
          onClick={onViewAll}
          className="btn p-0 fw-medium"
          style={{
            color: "#0e8a5f",
            fontSize: "0.82rem",
          }}
        >
          View All
        </button>
      </div>

      <div className="table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #eef0f2",
              }}
            >
              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Refund ID
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Booking ID
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Customer
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Amount
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Reason
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Status
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-secondary">
                  Loading refund requests...
                </td>
              </tr>
            ) : refunds.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-secondary">
                  No refund requests found.
                </td>
              </tr>
            ) : (
              refunds.map((refund, index) => {
                const status = refund.status || "pending";
                const style = statusStyles[status] || statusStyles.pending;

                const refundId =
                  refund.refundId || refund._id || "Not Available";

                const bookingId = refund.booking?.bookingId || "Not Available";

                const customerName = refund.customer?.name || "Not Available";

                const reason = refund.reason || "Not Available";

                const isProcessing = processingId === refund._id;

                return (
                  <tr
                    key={refund._id || refundId}
                    style={{
                      borderBottom:
                        index !== refunds.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.84rem",
                      }}
                    >
                      {refundId}
                    </td>

                    <td
                      className="py-2 text-secondary"
                      style={{ fontSize: "0.84rem" }}
                    >
                      {bookingId}
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.84rem",
                        color: "#0f1724",
                      }}
                    >
                      {customerName}
                    </td>

                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.84rem",
                      }}
                    >
                      {formatCurrency(refund.amount)}
                    </td>

                    <td
                      className="py-2 text-secondary"
                      style={{ fontSize: "0.84rem" }}
                    >
                      {reason}
                    </td>

                    <td className="py-2">
                      <span
                        className="badge rounded-pill fw-medium"
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                          fontSize: "0.72rem",
                        }}
                      >
                        {formatStatus(status)}
                      </span>
                    </td>

                    <td className="py-2">
                      {status === "pending" ? (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleAction(refund._id, "approve")}
                            className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                            style={{
                              width: "26px",
                              height: "26px",
                              color: "#0e8a5f",
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            title="Approve refund"
                          >
                            <CheckCircleFill size={16} />
                          </button>

                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleAction(refund._id, "reject")}
                            className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                            style={{
                              width: "26px",
                              height: "26px",
                              color: "#dc3545",
                              opacity: isProcessing ? 0.5 : 1,
                            }}
                            title="Reject refund"
                          >
                            <XCircleFill size={16} />
                          </button>
                        </div>
                      ) : (
                        <span
                          className="text-secondary"
                          style={{ fontSize: "0.76rem" }}
                        >
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundRequests;
