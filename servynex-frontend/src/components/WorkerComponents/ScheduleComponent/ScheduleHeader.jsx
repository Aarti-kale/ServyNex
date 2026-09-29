import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CalendarEventFill,
  ClockFill,
  PersonCheckFill,
} from "react-bootstrap-icons";

const ScheduleHeader = ({ overview = {}, loading = false }) => {
  const stats = [
    {
      label: "Today's Jobs",
      value: Number(overview?.todayJobs || 0),
      icon: <CalendarEventFill size={22} color="#0e8a5f" />,
    },
    {
      label: "Upcoming",
      value: Number(overview?.upcomingTodayJobs || 0),
      icon: <ClockFill size={22} color="#0e8a5f" />,
    },
    {
      label: "Available Slots",
      value: "—",
      icon: <PersonCheckFill size={22} color="#0e8a5f" />,
    },
    {
      label: "Working Hours",
      value: "—",
      icon: <ClockFill size={22} color="#0e8a5f" />,
    },
  ];

  return (
    <section className="py-4">
      <div className="container">
        <h1
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.9rem",
          }}
        >
          Schedule
        </h1>

        <p className="text-secondary mb-4">Manage your upcoming work</p>

        <div className="row g-3">
          {stats.map((stat, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div
                className="rounded-4 p-4 h-100 bg-white text-center"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {stat.icon}
                </div>

                <p
                  className="text-secondary mb-2"
                  style={{ fontSize: "0.88rem" }}
                >
                  {stat.label}
                </p>

                <h3
                  className="fw-bold mb-0"
                  style={{
                    color: "#0f1724",
                    fontSize:
                      String(stat.value).length > 4 ? "1.3rem" : "1.6rem",
                  }}
                >
                  {loading ? "..." : stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleHeader;
