import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const statusStyles = {
  Pending: {
    bg: "#fdf1de",
    color: "#b5730a",
  },

  Assigned: {
    bg: "#e0edfb",
    color: "#185fa5",
  },

  Completed: {
    bg: "#e6f4ee",
    color: "#0e8a5f",
  },

  Cancelled: {
    bg: "#fde8e8",
    color: "#dc3545",
  },
};

const formatDate = (date) => {
  if (!date) {
    return "Field not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Field not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "Field not available";
  }

  return String(status).charAt(0).toUpperCase() + String(status).slice(1);
};

const RecentBookings = ({ data = [] }) => {
  const bookings = Array.isArray(data) ? data : [];

  return (
    <div
      className="rounded-4 bg-white h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 pb-2">
        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f1724",
          }}
        >
          Recent Bookings
        </h6>

        <a
          href="#all-bookings"
          className="fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.82rem",
          }}
        >
          View All
        </a>
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
                className="ps-3 py-2 text-secondary fw-medium"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Customer
              </th>

              <th
                className="py-2 text-secondary fw-medium"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Service
              </th>

              <th
                className="py-2 text-secondary fw-medium"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Worker
              </th>

              <th
                className="py-2 text-secondary fw-medium"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Date
              </th>

              <th
                className="pe-3 py-2 text-secondary fw-medium"
                style={{
                  fontSize: "0.76rem",
                }}
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-secondary py-4"
                  style={{
                    fontSize: "0.82rem",
                  }}
                >
                  No recent bookings
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => {
                const status = formatStatus(booking?.status);

                const statusStyle = statusStyles[status] || {
                  bg: "#f1f3f5",
                  color: "#6c757d",
                };

                return (
                  <tr
                    key={booking?._id || `booking-${index}`}
                    style={{
                      borderBottom:
                        index !== bookings.length - 1
                          ? "1px solid #eef0f2"
                          : "none",
                    }}
                  >
                    <td
                      className="ps-3 py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      {booking?.user?.name || "Field not available"}
                    </td>

                    <td
                      className="py-2 text-secondary"
                      style={{
                        fontSize: "0.85rem",
                      }}
                    >
                      {booking?.service?.name || "Field not available"}
                    </td>

                    <td
                      className="py-2 text-secondary"
                      style={{
                        fontSize: "0.85rem",
                      }}
                    >
                      {booking?.worker?.name || "Field not available"}
                    </td>

                    <td
                      className="py-2 text-secondary"
                      style={{
                        fontSize: "0.85rem",
                      }}
                    >
                      {formatDate(booking?.date)}
                    </td>

                    <td className="pe-3 py-2">
                      <span
                        className="badge rounded-pill fw-medium"
                        style={{
                          backgroundColor: statusStyle.bg,

                          color: statusStyle.color,

                          fontSize: "0.72rem",
                        }}
                      >
                        {status}
                      </span>
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

export default RecentBookings;
