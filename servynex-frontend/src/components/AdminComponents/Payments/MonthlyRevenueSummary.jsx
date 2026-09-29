import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "Not Available";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const MonthlyRevenueSummary = ({ data = [], loading = false }) => {
  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Monthly Revenue Summary
        </h6>

        <a
          href="#full-report"
          className="fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.82rem",
          }}
        >
          View Report
        </a>
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
                Month
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
                Orders
              </th>

              <th
                className="text-secondary fw-medium text-uppercase pb-2"
                style={{ fontSize: "0.7rem" }}
              >
                Avg Order Value
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-secondary">
                  Loading revenue summary...
                </td>
              </tr>
            )}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-secondary">
                  No revenue data available
                </td>
              </tr>
            )}

            {!loading &&
              data.map((row, index) => (
                <tr
                  key={`${row.year}-${row.month}-${index}`}
                  style={{
                    borderBottom:
                      index !== data.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <td
                    className="py-2 fw-medium"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.86rem",
                    }}
                  >
                    {row.month || "Not Available"}
                  </td>

                  <td
                    className="py-2 fw-medium"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.86rem",
                    }}
                  >
                    {formatCurrency(row.revenue)}
                  </td>

                  <td
                    className="py-2"
                    style={{
                      fontSize: "0.86rem",
                      color: "#0f1724",
                    }}
                  >
                    {row.orders ?? "Not Available"}
                  </td>

                  <td
                    className="py-2"
                    style={{
                      fontSize: "0.86rem",
                      color: "#0f1724",
                    }}
                  >
                    {formatCurrency(row.avgOrderValue)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyRevenueSummary;
