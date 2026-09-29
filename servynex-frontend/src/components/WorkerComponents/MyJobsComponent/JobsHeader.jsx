import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ClipboardCheckFill,
  GearFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const JobsHeader = ({ todayJobs = 0, totalJobs = 0, completedJobs = 0 }) => {
  const completionRate =
    totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

  const stats = [
    {
      label: "Today's Jobs",
      value: todayJobs,
      icon: <ClipboardCheckFill size={18} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: <GearFill size={18} color="#0f1724" />,
      iconBg: "#f3f4f6",
    },
    {
      label: "Completed",
      value: completedJobs,
      icon: <CheckCircleFill size={18} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
  ];

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <section className="py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                color: "#0f1724",
                fontSize: "1.9rem",
              }}
            >
              My Jobs
            </h1>

            <p className="text-secondary mb-0">
              Manage all your assigned jobs in one place.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <div className="d-flex align-items-center gap-2" key={i}>
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: s.iconBg,
                  }}
                >
                  {s.icon}
                </div>

                <div>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {s.label}
                  </p>

                  <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                    {s.value}
                  </h5>
                </div>
              </div>
            ))}

            <div className="d-flex align-items-center gap-2">
              <svg width="46" height="46" viewBox="0 0 46 46">
                <circle
                  cx="23"
                  cy="23"
                  r={radius}
                  fill="none"
                  stroke="#e6f4ee"
                  strokeWidth="4"
                />

                <circle
                  cx="23"
                  cy="23"
                  r={radius}
                  fill="none"
                  stroke="#0e8a5f"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 23 23)"
                />
              </svg>

              <div>
                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.78rem" }}
                >
                  Completion Rate
                </p>

                <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                  {completionRate}%
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsHeader;
