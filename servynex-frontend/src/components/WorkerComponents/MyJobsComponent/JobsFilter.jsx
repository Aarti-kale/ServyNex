import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const JobsFilter = ({ jobs = [], onChange }) => {
  const [active, setActive] = useState("all");

  const counts = useMemo(() => {
    const safeJobs = Array.isArray(jobs) ? jobs : [];

    return {
      all: safeJobs.length,

      assigned: safeJobs.filter((job) => job?.status === "pending").length,

      inprogress: safeJobs.filter((job) => job?.status === "in-progress")
        .length,

      completed: safeJobs.filter((job) => job?.status === "completed").length,

      cancelled: safeJobs.filter((job) => job?.status === "cancelled").length,
    };
  }, [jobs]);

  const tabs = [
    {
      key: "all",
      label: "All Jobs",
      count: counts.all,
      color: "#0f1724",
    },
    {
      key: "assigned",
      label: "Assigned",
      count: counts.assigned,
      color: "#b5730a",
    },
    {
      key: "inprogress",
      label: "In Progress",
      count: counts.inprogress,
      color: "#185fa5",
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
      color: "#0e8a5f",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: counts.cancelled,
      color: "#dc3545",
    },
  ];

  const handleClick = (key) => {
    setActive(key);

    if (onChange) {
      onChange(key);
    }
  };

  return (
    <section className="pb-3">
      <div className="container">
        <div className="d-flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = active === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => handleClick(tab.key)}
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor: isActive ? "#e6f4ee" : "#ffffff",
                  border: isActive
                    ? "1.5px solid #0e8a5f"
                    : "1px solid #e2e8e5",
                  color: isActive
                    ? "#0e8a5f"
                    : tab.key === "cancelled"
                    ? "#dc3545"
                    : "#0f1724",
                  fontSize: "0.9rem",
                }}
              >
                {tab.label}

                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: isActive ? "#0e8a5f" : "#f3f4f6",
                    color: isActive ? "#ffffff" : "#0f1724",
                    fontSize: "0.72rem",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JobsFilter;
