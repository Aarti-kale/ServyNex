import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  EyeFill,
  PencilFill,
  TrashFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const getFieldValue = (worker, field) => {
  if (!worker || !Object.prototype.hasOwnProperty.call(worker, field)) {
    return "Field Not Available";
  }

  const value = worker[field];

  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const formatJoinedDate = (worker) => {
  if (!worker || !Object.prototype.hasOwnProperty.call(worker, "createdAt")) {
    return "Field Not Available";
  }

  if (!worker.createdAt) {
    return "Not Available";
  }

  const date = new Date(worker.createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const WorkersTable = ({
  workers = [],
  loading = false,
  pagination = null,
  onSelectWorker,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const perPage = pagination?.perPage || workers.length || 10;
  const totalWorkers = pagination?.totalWorkers || 0;

  const getRowNumber = (index) => {
    return (currentPage - 1) * perPage + index + 1;
  };

  return (
    <section className="pb-4">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
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
                    className="ps-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    #
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
                    Phone
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Email
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Total Bookings
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Total Spent
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Joined Date
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Status
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-secondary">
                      Loading workers...
                    </td>
                  </tr>
                ) : workers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-secondary">
                      No workers found.
                    </td>
                  </tr>
                ) : (
                  workers.map((worker, i) => {
                    const status = worker.isBlocked ? "Blocked" : "Active";

                    const name = getFieldValue(worker, "name");

                    return (
                      <tr
                        key={worker._id}
                        style={{
                          borderBottom:
                            i !== workers.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td
                          className="ps-3 py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getRowNumber(i)}
                        </td>

                        <td className="py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#e6f4ee",
                                color: "#0e8a5f",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                              }}
                            >
                              {name !== "Field Not Available" &&
                              name !== "Not Available"
                                ? String(name).charAt(0).toUpperCase()
                                : "W"}
                            </div>

                            <span
                              className="fw-medium"
                              style={{
                                color: "#0f1724",
                                fontSize: "0.86rem",
                              }}
                            >
                              {name}
                            </span>
                          </div>
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(worker, "phone")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(worker, "email")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(worker, "bookings")}
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.85rem",
                          }}
                        >
                          {getFieldValue(worker, "spent")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formatJoinedDate(worker)}
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor:
                                status === "Active" ? "#e6f4ee" : "#fdecec",
                              color:
                                status === "Active" ? "#0e8a5f" : "#dc3545",
                              fontSize: "0.72rem",
                            }}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="pe-3 py-2">
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectWorker?.(worker)}
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border: "1px solid #d9dee3",
                              }}
                            >
                              <EyeFill size={13} color="#0f1724" />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border: "1px solid #d9dee3",
                              }}
                            >
                              <PencilFill size={12} color="#185fa5" />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border: "1px solid #d9dee3",
                              }}
                            >
                              <TrashFill size={12} color="#dc3545" />
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

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Showing {totalWorkers === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
              to {Math.min(currentPage * perPage, totalWorkers)} of{" "}
              {totalWorkers} entries
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                disabled={!pagination?.hasPreviousPage}
                onClick={() => onPageChange?.(currentPage - 1)}
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
                .filter((page) => page <= totalPages)
                .map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => onPageChange?.(page)}
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

              {totalPages > 3 && (
                <>
                  <span className="text-secondary">...</span>

                  <button
                    type="button"
                    onClick={() => onPageChange?.(totalPages)}
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
                type="button"
                disabled={!pagination?.hasNextPage}
                onClick={() => onPageChange?.(currentPage + 1)}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkersTable;
