import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightningChargeFill,
  PersonFill,
  LockFill,
  BoxArrowRight,
} from "react-bootstrap-icons";

const QuickActions = ({ onEditProfile, onChangePassword, onLogout }) => {
  const actions = [
    {
      key: "edit-profile",
      label: "Edit Profile",
      icon: <PersonFill size={22} color="#0e8a5f" />,
      backgroundColor: "#eef7f3",
      onClick: onEditProfile,
    },
    {
      key: "change-password",
      label: "Change Password",
      icon: <LockFill size={22} color="#d18a1c" />,
      backgroundColor: "#fdf1de",
      onClick: onChangePassword,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <BoxArrowRight size={22} color="#dc3545" />,
      backgroundColor: "#fdecec",
      onClick: onLogout,
    },
  ];

  return (
    <div
      className="rounded-4 bg-white p-4 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <LightningChargeFill size={18} color="#0e8a5f" />

        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Quick Actions
        </h6>
      </div>

      <div className="row g-3">
        {actions.map((action) => (
          <div className="col-4" key={action.key}>
            <button
              type="button"
              onClick={action.onClick}
              className="btn w-100 h-100 d-flex flex-column align-items-center gap-2 py-4 rounded-3"
              style={{
                backgroundColor: action.backgroundColor,
                border: "none",
              }}
            >
              {action.icon}

              <span
                className="fw-medium"
                style={{
                  color: "#0f1724",
                  fontSize: "0.86rem",
                }}
              >
                {action.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
