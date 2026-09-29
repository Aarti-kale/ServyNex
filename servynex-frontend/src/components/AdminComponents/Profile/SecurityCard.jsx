import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LockFill } from "react-bootstrap-icons";

const getFieldValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Field not available";
  }

  return value;
};

const getSecurityStatus = (value) => {
  if (typeof value !== "boolean") {
    return "Field not available";
  }

  return value ? "Enabled" : "Disabled";
};

const SecurityCard = ({
  security = {},
  onChangePassword,
  onViewSessions,
  onViewDevices,
}) => {
  const passwordConfigured = security?.passwordConfigured;

  const twoFactorAuthentication = security?.twoFactorAuthentication;

  const activeSessions = "Field not available";

  const loginDevices = "Field not available";

  return (
    <div
      className="rounded-4 bg-white p-4 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <LockFill size={18} color="#0e8a5f" />

        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Security
        </h6>
      </div>

      <div className="row py-2 align-items-center">
        <div className="col-5 text-secondary" style={{ fontSize: "0.85rem" }}>
          Password
        </div>

        <div
          className="col-4 fw-medium"
          style={{
            color: "#0f1724",
            fontSize: "0.85rem",
          }}
        >
          {typeof passwordConfigured === "boolean"
            ? passwordConfigured
              ? "Configured"
              : "Not configured"
            : getFieldValue(null)}
        </div>

        <div className="col-3 text-end">
          <button
            type="button"
            onClick={onChangePassword}
            className="btn btn-sm rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.76rem",
            }}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="row py-2 align-items-center">
        <div className="col-7 text-secondary" style={{ fontSize: "0.85rem" }}>
          Two-Factor Authentication
        </div>

        <div className="col-5">
          <span
            className="badge rounded-pill fw-medium"
            style={{
              backgroundColor:
                twoFactorAuthentication === true
                  ? "#e6f4ee"
                  : twoFactorAuthentication === false
                  ? "#fdecec"
                  : "#f1f3f5",

              color:
                twoFactorAuthentication === true
                  ? "#0e8a5f"
                  : twoFactorAuthentication === false
                  ? "#dc3545"
                  : "#6b7280",

              fontSize: "0.78rem",
            }}
          >
            {getSecurityStatus(twoFactorAuthentication)}
          </span>
        </div>
      </div>

      <div className="row py-2 align-items-center">
        <div className="col-5 text-secondary" style={{ fontSize: "0.85rem" }}>
          Active Sessions
        </div>

        <div
          className="col-4 fw-medium"
          style={{
            color: "#0f1724",
            fontSize: "0.85rem",
          }}
        >
          {activeSessions}
        </div>

        <div className="col-3 text-end">
          <button
            type="button"
            onClick={onViewSessions}
            className="btn btn-sm rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.76rem",
            }}
          >
            View Sessions
          </button>
        </div>
      </div>

      <div className="row py-2 align-items-center">
        <div className="col-5 text-secondary" style={{ fontSize: "0.85rem" }}>
          Login Devices
        </div>

        <div
          className="col-4 fw-medium"
          style={{
            color: "#0f1724",
            fontSize: "0.85rem",
          }}
        >
          {loginDevices}
        </div>

        <div className="col-3 text-end">
          <button
            type="button"
            onClick={onViewDevices}
            className="btn btn-sm rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              fontSize: "0.76rem",
            }}
          >
            View Devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityCard;
