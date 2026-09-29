import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ClockHistory } from "react-bootstrap-icons";

const formatActivityTime = (date) => {
  if (!date) {
    return "Field not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Field not available";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getActivityText = (activity) => {
  return activity?.description || activity?.text || "Field not available";
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div
      className="rounded-4 bg-white p-4 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <ClockHistory size={18} color="#0e8a5f" />

        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Recent Activity
        </h6>
      </div>

      <div className="position-relative ps-4">
        <div
          className="position-absolute"
          style={{
            left: "4px",
            top: "6px",
            bottom: "6px",
            width: "2px",
            backgroundColor: "#e6f4ee",
          }}
        />

        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={activity?._id || index}
              className="position-relative pb-3"
            >
              <span
                className="position-absolute rounded-circle"
                style={{
                  left: "-20px",
                  top: "5px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#0e8a5f",
                }}
              />

              <p
                className="fw-semibold mb-1"
                style={{
                  color: "#0f1724",
                  fontSize: "0.82rem",
                }}
              >
                {formatActivityTime(activity?.createdAt)}
              </p>

              <p
                className="text-secondary mb-0"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                {getActivityText(activity)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-secondary" style={{ fontSize: "0.85rem" }}>
            Field not available
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
