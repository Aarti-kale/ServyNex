import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Data Not Available";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  return value;
};

const MonthlySummary = ({ data = [], loading = false }) => {
  const summary = Array.isArray(data) ? data : [];

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6
        className="fw-bold mb-3"
        style={{
          color: "#0f1724",
        }}
      >
        Monthly Summary
      </h6>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && summary.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && summary.length > 0 && (
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
                  Month
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Total Bookings
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Revenue
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  New Customers
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Completed Jobs
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Cancellations
                </th>
              </tr>
            </thead>

            <tbody>
              {summary.map((row, index) => {
                const cancellations = formatValue(row?.cancellations);

                return (
                  <tr
                    key={row?._id || `${row?.month || "month"}-${index}`}
                    style={{
                      borderBottom:
                        index !== summary.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.86rem",
                      }}
                    >
                      {formatValue(row?.month)}
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.86rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatValue(row?.totalBookings)}
                    </td>

                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.86rem",
                      }}
                    >
                      {formatCurrency(row?.revenue)}
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.86rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatValue(row?.newCustomers)}
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.86rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatValue(row?.completedJobs)}
                    </td>

                    <td
                      className="py-2 fw-medium"
                      style={{
                        color:
                          cancellations === "Data Not Available"
                            ? "#6c757d"
                            : "#dc3545",
                        fontSize: "0.86rem",
                      }}
                    >
                      {cancellations}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
