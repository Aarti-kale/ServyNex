import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  EyeFill,
  PencilFill,
  TrashFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const getFieldValue = (customer, field) => {
  if (!Object.prototype.hasOwnProperty.call(customer || {}, field)) {
    return "Field Not Available";
  }

  const value = customer[field];

  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const formatJoinedDate = (createdAt) => {
  if (!createdAt) {
    return "Not Available";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Not Available";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CustomersTable = ({
  customers = [],
  loading = false,
  pagination = null,
  onSelectCustomer,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 0;

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
                    <td colSpan="9" className="text-center py-5 text-secondary">
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-secondary">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((c, i) => {
                    const status = c.isBlocked ? "Blocked" : "Active";

                    return (
                      <tr
                        key={c._id}
                        style={{
                          borderBottom:
                            i !== customers.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td
                          className="ps-3 py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {(currentPage - 1) * (pagination?.perPage || 10) +
                            i +
                            1}
                        </td>

                        <td className="py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: c.profileImage
                                  ? "#e6f4ee"
                                  : "#e6f4ee",
                                color: "#0e8a5f",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                              }}
                            >
                              {c.profileImage ? (
                                <img
                                  src={c.profileImage}
                                  alt={c.name || "Customer"}
                                  className="rounded-circle"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                c.name?.charAt(0)?.toUpperCase() || "?"
                              )}
                            </div>

                            <span
                              className="fw-medium"
                              style={{
                                color: "#0f1724",
                                fontSize: "0.86rem",
                              }}
                            >
                              {getFieldValue(c, "name")}
                            </span>
                          </div>
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(c, "phone")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(c, "email")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {getFieldValue(c, "bookings")}
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.85rem",
                          }}
                        >
                          {getFieldValue(c, "spent")}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formatJoinedDate(c.createdAt)}
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
                              onClick={() =>
                                onSelectCustomer && onSelectCustomer(c)
                              }
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
              Showing{" "}
              {customers.length > 0
                ? (currentPage - 1) * (pagination?.perPage || 10) + 1
                : 0}{" "}
              to{" "}
              {Math.min(
                currentPage * (pagination?.perPage || 10),
                pagination?.totalCustomers || 0
              )}{" "}
              of {pagination?.totalCustomers ?? "Field Not Available"} entries
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                disabled={!pagination?.hasPreviousPage}
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
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                disabled={!pagination?.hasNextPage}
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

export default CustomersTable;
