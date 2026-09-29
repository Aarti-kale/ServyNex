import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ClipboardCheckFill,
  WalletFill,
  XCircleFill,
  ShieldFillCheck,
} from "react-bootstrap-icons";

const getNotificationStyle = (type) => {
  const styles = {
    job: {
      icon: <ClipboardCheckFill size={16} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    payment: {
      icon: <WalletFill size={16} color="#185fa5" />,
      iconBg: "#e0edfb",
    },
    cancelled: {
      icon: <XCircleFill size={16} color="#d18a1c" />,
      iconBg: "#fbedd6",
    },
    verified: {
      icon: <ShieldFillCheck size={16} color="#7c5ad1" />,
      iconBg: "#efe8fc",
    },
  };

  return styles[type] || styles.job;
};

const formatNotification = (notification) => {
  const style = getNotificationStyle(notification?.type);

  return {
    title: notification?.title || "Notification",
    desc: notification?.description || notification?.desc || "-",
    time: notification?.time || "Recently",
    icon: style.icon,
    iconBg: style.iconBg,
  };
};

const Notifications = ({ notifications = [] }) => {
  const formattedNotifications = notifications.map(formatNotification);

  return (
    <div
      className="rounded-4 p-4 bg-white h-100"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Notifications
        </h5>

        <a
          href="#all-notifications"
          className="fw-medium text-decoration-none"
          style={{ color: "#0e8a5f", fontSize: "0.85rem" }}
        >
          View All
        </a>
      </div>

      <div className="d-flex flex-column gap-3">
        {formattedNotifications.map((n, i) => (
          <div className="d-flex align-items-start gap-3" key={n.id || i}>
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: n.iconBg,
              }}
            >
              {n.icon}
            </div>

            <div>
              <h6
                className="fw-semibold mb-1"
                style={{
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                {n.title}
              </h6>

              <p className="text-secondary mb-1" style={{ fontSize: "0.8rem" }}>
                {n.desc}
              </p>

              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.72rem" }}
              >
                {n.time}
              </p>
            </div>
          </div>
        ))}

        {formattedNotifications.length === 0 && (
          <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>
            No notifications available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
