import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronRight,
  Download,
  CalendarEventFill,
  HourglassSplit,
  PersonCheckFill,
  ClockHistory,
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";

const getDisplayValue = (value) => {
  if (value === undefined) {
    return "Field Not Available";
  }

  if (value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const getStatsConfig = (stats) => {
  return [
    {
      label: "Total Bookings",
      value: getDisplayValue(stats?.totalBookings),
      note: "Field Not Available",
      icon: <CalendarEventFill size={20} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      label: "Pending Assignment",
      value: getDisplayValue(stats?.pendingAssignment),
      note: "Field Not Available",
      icon: <HourglassSplit size={20} color="#d18a1c" />,
      iconBg: "#fbedd6",
    },
    {
      label: "Assigned",
      value: getDisplayValue(stats?.assigned),
      note: "Field Not Available",
      icon: <PersonCheckFill size={20} color="#185fa5" />,
      iconBg: "#e0edfb",
    },
    {
      label: "In Progress",
      value: getDisplayValue(stats?.inProgress),
      note: "Field Not Available",
      icon: <ClockHistory size={20} color="#7c5ad1" />,
      iconBg: "#efe8fc",
    },
    {
      label: "Completed",
      value: getDisplayValue(stats?.completed),
      note: "Field Not Available",
      icon: <CheckCircleFill size={20} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      label: "Cancelled",
      value: getDisplayValue(stats?.cancelled),
      note: "Field Not Available",
      icon: <XCircleFill size={20} color="#dc3545" />,
      iconBg: "#fdecec",
    },
  ];
};

const BookingsStats = ({ stats = {}, loading = false, onExport }) => {
  const statsCards = useMemo(() => getStatsConfig(stats), [stats]);

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
              Bookings Management
            </h1>

            <nav style={{ fontSize: "0.86rem" }}>
              <span className="fw-medium" style={{ color: "#0e8a5f" }}>
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Bookings</span>
            </nav>
          </div>

          <button
            type="button"
            onClick={onExport}
            disabled={!onExport}
            className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
            }}
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        <div className="row g-3">
          {statsCards.map((stat) => (
            <div className="col-6 col-lg-2" key={stat.label}>
              <div
                className="rounded-4 p-3 h-100 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: stat.iconBg,
                    }}
                  >
                    {stat.icon}
                  </div>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.76rem",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>

                {loading ? (
                  <div
                    className="placeholder-glow mb-1"
                    style={{ height: "29px" }}
                  >
                    <span
                      className="placeholder col-6 rounded"
                      style={{
                        display: "inline-block",
                        height: "22px",
                      }}
                    />
                  </div>
                ) : (
                  <h4 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                    {stat.value}
                  </h4>
                )}

                {!loading && (
                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: "#6c757d",
                      fontSize: "0.72rem",
                    }}
                  >
                    {stat.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingsStats;
