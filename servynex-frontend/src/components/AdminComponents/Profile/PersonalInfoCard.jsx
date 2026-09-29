import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PersonBadgeFill } from "react-bootstrap-icons";

const formatLastLogin = (date) => {
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

const formatRole = (role) => {
  if (!role) {
    return "Field not available";
  }

  return role
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatAccountStatus = (isActive) => {
  if (typeof isActive !== "boolean") {
    return "Field not available";
  }

  return isActive ? "Active" : "Inactive";
};

const AccountInfoCard = ({ profile = {} }) => {
  const accountInformation = [
    ["Username", profile?.username || "Field not available"],
    ["Role", formatRole(profile?.role)],
    ["Last Login", formatLastLogin(profile?.lastLoginAt)],
    ["Last Login IP", profile?.lastLoginIP || "Field not available"],
  ];

  return (
    <div
      className="rounded-4 bg-white p-4 h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <PersonBadgeFill size={18} color="#0e8a5f" />

        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Account Information
        </h6>
      </div>

      {accountInformation.map(([label, value]) => (
        <div key={label} className="row py-2">
          <div className="col-5 text-secondary" style={{ fontSize: "0.85rem" }}>
            {label}
          </div>

          <div
            className="col-7 fw-medium"
            style={{
              color: "#0f1724",
              fontSize: "0.85rem",
            }}
          >
            {value}
          </div>
        </div>
      ))}

      <div className="row py-2 align-items-center">
        <div className="col-5 text-secondary" style={{ fontSize: "0.85rem" }}>
          Account Status
        </div>

        <div className="col-7">
          <span
            className="badge rounded-pill fw-medium"
            style={{
              backgroundColor: "#e6f4ee",
              color: "#0e8a5f",
              fontSize: "0.78rem",
            }}
          >
            {formatAccountStatus(profile?.isActive)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
