import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PeopleFill,
  PersonBadgeFill,
  CalendarEventFill,
  GlobeCentralSouthAsia,
} from "react-bootstrap-icons";

const getStatValue = (value) => {
  if (value === undefined || value === null) {
    return "Field not available";
  }

  return value;
};

const ActivitySummary = ({ activitySummary = {} }) => {
  const stats = [
    {
      key: "customersManaged",
      label: "Customers Managed",
      value: getStatValue(activitySummary?.customersManaged),
      icon: <PeopleFill size={22} color="#0e8a5f" />,
    },
    {
      key: "workersApproved",
      label: "Workers Approved",
      value: getStatValue(activitySummary?.workersApproved),
      icon: <PersonBadgeFill size={22} color="#0e8a5f" />,
    },
    {
      key: "bookingsManaged",
      label: "Bookings Managed",
      value: getStatValue(activitySummary?.bookingsManaged),
      icon: <CalendarEventFill size={22} color="#0e8a5f" />,
    },
    {
      key: "websiteUpdates",
      label: "Website Updates",
      value: getStatValue(activitySummary?.websiteUpdates),
      icon: <GlobeCentralSouthAsia size={22} color="#0e8a5f" />,
    },
  ];

  return (
    <section className="pb-3">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 bg-white p-4"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <CalendarEventFill size={18} color="#0e8a5f" />

            <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              Activity Summary
            </h6>
          </div>

          <div className="row g-3">
            {stats.map((stat) => (
              <div className="col-6 col-md-3" key={stat.key}>
                <div
                  className="rounded-3 p-3 d-flex align-items-center gap-3"
                  style={{
                    backgroundColor: "#eef7f3",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 bg-white"
                    style={{
                      width: "44px",
                      height: "44px",
                    }}
                  >
                    {stat.icon}
                  </div>

                  <div>
                    <h4 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                      {stat.value}
                    </h4>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.78rem",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitySummary;
