import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  GlobeCentralSouthAsia,
  PeopleFill,
  PersonBadgeFill,
  ExclamationTriangleFill,
} from "react-bootstrap-icons";

const getWebsiteStatus = (status) => {
  if (!status) {
    return "Field not available";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const WebsiteStatus = ({ data = null }) => {
  const websiteStatus = getWebsiteStatus(data?.status);

  const statusColor =
    data?.status === "maintenance"
      ? "#dc3545"
      : data?.status === "online"
      ? "#0e8a5f"
      : "#0f1724";

  const statusItems = [
    {
      label: "Website",
      value: websiteStatus,
      icon: <GlobeCentralSouthAsia size={17} color={statusColor} />,
      valueColor: statusColor,
      isDot: data?.status === "online" || data?.status === "maintenance",
    },
    {
      label: "Active Workers",
      value: "Field not available",
      icon: <PersonBadgeFill size={17} color="#0e8a5f" />,
      valueColor: "#0f1724",
    },
    {
      label: "Customers Online",
      value: "Field not available",
      icon: <PeopleFill size={17} color="#0e8a5f" />,
      valueColor: "#0f1724",
    },
    {
      label: "Pending Complaints",
      value: "Field not available",
      icon: <ExclamationTriangleFill size={17} color="#dc3545" />,
      valueColor: "#dc3545",
    },
  ];

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
        Website Status
      </h6>

      {statusItems.map((s, i) => (
        <div key={s.label}>
          <div className="d-flex justify-content-between align-items-center py-2">
            <span
              className="d-flex align-items-center gap-2"
              style={{
                fontSize: "0.86rem",
                color: "#0f1724",
              }}
            >
              {s.icon}

              {s.label}
            </span>

            {s.isDot ? (
              <span
                className="d-flex align-items-center gap-2 fw-medium"
                style={{
                  color: s.valueColor,
                  fontSize: "0.85rem",
                }}
              >
                <span
                  className="rounded-circle"
                  style={{
                    width: "7px",
                    height: "7px",
                    backgroundColor: s.valueColor,
                    display: "inline-block",
                  }}
                />

                {s.value}
              </span>
            ) : (
              <span
                className="fw-bold"
                style={{
                  color: s.valueColor,
                  fontSize: "0.78rem",
                }}
              >
                {s.value}
              </span>
            )}
          </div>

          {i !== statusItems.length - 1 && <hr className="m-0" />}
        </div>
      ))}
    </div>
  );
};

export default WebsiteStatus;
