import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import API from "../../../api/api.js";

const PendingApprovals = ({ data = [], count = 0 }) => {
  const [approvals, setApprovals] = useState(Array.isArray(data) ? data : []);

  const [processingId, setProcessingId] = useState(null);

  React.useEffect(() => {
    setApprovals(Array.isArray(data) ? data : []);
  }, [data]);

  const getInitial = (name) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  const getWorkerRole = (worker) => {
    if (worker?.profession) {
      return worker.profession;
    }

    if (Array.isArray(worker?.skills) && worker.skills.length > 0) {
      return worker.skills[0];
    }

    return "Field not available";
  };

  const handleAction = async (workerId, action) => {
    if (!workerId || processingId) return;

    try {
      setProcessingId(workerId);

      const endpoint =
        action === "approve"
          ? `/admin/workers/${workerId}/approve`
          : `/admin/workers/${workerId}/reject`;

      const response = await API.patch(endpoint);

      if (!response.data?.success) {
        throw new Error(response.data?.message || `Failed to ${action} worker`);
      }

      setApprovals((prev) => prev.filter((worker) => worker._id !== workerId));
    } catch (error) {
      console.error(`Worker ${action} error:`, error);

      window.alert(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${action} worker`
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Pending Worker Approvals
        </h6>

        <a
          href="#all-approvals"
          className="fw-medium text-decoration-none flex-shrink-0"
          style={{
            color: "#0e8a5f",
            fontSize: "0.8rem",
          }}
        >
          View All
        </a>
      </div>

      {approvals.length === 0 ? (
        <p className="text-secondary text-center py-4 mb-0">
          No pending approvals 🎉
        </p>
      ) : (
        approvals.map((a, i) => {
          const workerId = a?._id;

          const initial = getInitial(a?.name);

          const role = getWorkerRole(a);

          const isProcessing = processingId === workerId;

          return (
            <div key={workerId || `${a?.name || "worker"}-${i}`}>
              <div className="py-2">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#e6f4ee",
                      color: "#0e8a5f",
                      fontWeight: 700,
                    }}
                  >
                    {initial}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p
                      className="fw-semibold mb-0 text-truncate"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.86rem",
                      }}
                    >
                      {a?.name || "Field not available"}
                    </p>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.76rem",
                      }}
                    >
                      {role}
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {/* Approve */}
                  <button
                    onClick={() => handleAction(workerId, "approve")}
                    disabled={!workerId || processingId !== null}
                    className="btn btn-sm text-white rounded-2 fw-medium flex-fill"
                    style={{
                      backgroundColor: "#0e8a5f",
                      fontSize: "0.78rem",
                    }}
                  >
                    {isProcessing ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleAction(workerId, "reject")}
                    disabled={!workerId || processingId !== null}
                    className="btn btn-sm text-white rounded-2 fw-medium flex-fill"
                    style={{
                      backgroundColor: "#dc3545",
                      fontSize: "0.78rem",
                    }}
                  >
                    {isProcessing ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>

              {i !== approvals.length - 1 && <hr className="m-0" />}
            </div>
          );
        })
      )}
    </div>
  );
};

export default PendingApprovals;
