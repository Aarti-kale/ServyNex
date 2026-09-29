import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PeopleFill,
  PersonBadgeFill,
  GearFill,
  CalendarEventFill,
  HourglassSplit,
  CashCoin,
} from "react-bootstrap-icons";

const DashboardHeader = ({ adminName, date, data }) => {
  const header = data || {};

  const stats = [
    {
      label: "Total Customers",
      value:
        header.totalCustomers !== undefined
          ? header.totalCustomers.toLocaleString("en-IN")
          : "Field not available",
      note: "Field not available",
      icon: <PeopleFill size={22} color="#0e8a5f" />,
    },

    {
      label: "Total Workers",
      value:
        header.totalWorkers !== undefined
          ? header.totalWorkers.toLocaleString("en-IN")
          : "Field not available",
      note: "Field not available",
      icon: <PersonBadgeFill size={22} color="#0e8a5f" />,
    },

    {
      label: "Total Services",
      value:
        header.totalServices !== undefined
          ? header.totalServices.toLocaleString("en-IN")
          : "Field not available",
      note: "Field not available",
      icon: <GearFill size={22} color="#0e8a5f" />,
    },

    {
      label: "Today's Bookings",
      value:
        header.todayBookings !== undefined
          ? header.todayBookings.toLocaleString("en-IN")
          : "Field not available",
      note: "Field not available",
      icon: <CalendarEventFill size={22} color="#0e8a5f" />,
    },

    {
      label: "Pending Approvals",
      value:
        header.pendingApprovals !== undefined
          ? header.pendingApprovals.toLocaleString("en-IN")
          : "Field not available",
      note: "Field not available",
      icon: <HourglassSplit size={22} color="#0e8a5f" />,
    },

    {
      label: "Monthly Revenue",
      value:
        header.monthlyRevenue !== undefined
          ? `₹${Number(header.monthlyRevenue).toLocaleString("en-IN")}`
          : "Field not available",
      note: "Field not available",
      icon: <CashCoin size={22} color="#0e8a5f" />,
    },
  ];

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.7rem",
              }}
            >
              Good Morning, {adminName || "Field not available"} 👋
            </h1>

            <p className="text-secondary mb-0">
              Here's what's happening with your business today.
            </p>
          </div>

          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 bg-white"
            style={{
              border: "1px solid #d9dee3",
            }}
          >
            <CalendarEventFill size={14} color="#0e8a5f" />

            <span
              style={{
                fontSize: "0.88rem",
                color: "#0f1724",
              }}
            >
              {date || "Field not available"}
            </span>
          </div>
        </div>

        <div className="row g-3">
          {stats.map((s, i) => (
            <div className="col-6 col-md-4 col-lg-2" key={i}>
              <div
                className="rounded-4 p-3 h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.76rem",
                    }}
                  >
                    {s.label}
                  </p>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "34px",
                      height: "34px",
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    {s.icon}
                  </div>
                </div>

                <h4
                  className="fw-bold mb-1"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {s.value}
                </h4>

                <p
                  className="fw-medium mb-0"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "0.72rem",
                  }}
                >
                  {s.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
