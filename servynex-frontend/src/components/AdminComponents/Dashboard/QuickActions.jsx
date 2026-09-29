import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PlusCircleFill,
  PersonPlusFill,
  CalendarEventFill,
  MegaphoneFill,
} from "react-bootstrap-icons";

const actions = [
  {
    label: "Add New",
    label2: "Service",
    icon: <PlusCircleFill size={20} color="#ffffff" />,
    bg: "#0e8a5f",
    action: "Add New Service",
  },
  {
    label: "Add New",
    label2: "Worker",
    icon: <PersonPlusFill size={20} color="#ffffff" />,
    bg: "#185fa5",
    action: "Add New Worker",
  },
  {
    label: "View",
    label2: "Bookings",
    icon: <CalendarEventFill size={20} color="#ffffff" />,
    bg: "#7c5ad1",
    action: "View Bookings",
  },
  {
    label: "Send",
    label2: "Notice",
    icon: <MegaphoneFill size={20} color="#ffffff" />,
    bg: "#d18a1c",
    action: "Send Notice",
  },
];

const QuickActions = ({ onAction }) => {
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
        Quick Actions
      </h6>

      <div className="row g-3 text-center">
        {actions.map((a) => (
          <div className="col-6" key={a.action}>
            <button
              onClick={() => onAction?.(a.action)}
              className="btn w-100 d-flex flex-column align-items-center gap-2 py-3"
              style={{
                border: "none",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: a.bg,
                }}
              >
                {a.icon}
              </div>

              <span
                className="fw-medium"
                style={{
                  color: "#0f1724",
                  fontSize: "0.8rem",
                }}
              >
                {a.label}
                <br />
                {a.label2}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
