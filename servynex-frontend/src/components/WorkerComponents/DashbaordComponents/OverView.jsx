import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ClipboardCheckFill,
  ClockFill,
  CheckCircleFill,
  WalletFill,
} from "react-bootstrap-icons";

const OverView = ({ overview }) => {
  const cards = [
    {
      title: "Today's Jobs",
      value: overview?.todayJobs ?? 0,
      note: `${overview?.upcomingTodayJobs ?? 0} upcoming`,
      noteColor: "#0e8a5f",
      icon: <ClipboardCheckFill size={20} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      title: "Pending Jobs",
      value: overview?.pendingJobs ?? 0,
      note: "Need attention",
      noteColor: "#185fa5",
      icon: <ClockFill size={20} color="#185fa5" />,
      iconBg: "#e0edfb",
    },
    {
      title: "Completed Jobs",
      value: overview?.completedJobs ?? 0,
      note: "Total completed",
      noteColor: "#7c5ad1",
      icon: <CheckCircleFill size={20} color="#7c5ad1" />,
      iconBg: "#efe8fc",
    },
    {
      title: "Today's Salary",
      value: overview?.todaySalary ?? "₹0",
      note: overview?.salaryChange ?? "No change",
      noteColor: "#0e8a5f",
      icon: <WalletFill size={20} color="#d18a1c" />,
      iconBg: "#fbedd6",
    },
  ];

  return (
    <section className="py-2">
      <div className="container">
        <div className="row g-3">
          {cards.map((c, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div
                className="rounded-4 p-3 h-100 bg-white"
                style={{ border: "1px solid #eef0f2" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: c.iconBg,
                  }}
                >
                  {c.icon}
                </div>

                <p
                  className="text-secondary mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  {c.title}
                </p>

                <h3 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                  {c.value}
                </h3>

                <p
                  className="fw-medium mb-0"
                  style={{
                    color: c.noteColor,
                    fontSize: "0.8rem",
                  }}
                >
                  {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverView;
