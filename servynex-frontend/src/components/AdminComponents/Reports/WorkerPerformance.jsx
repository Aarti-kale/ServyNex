import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { StarFill } from "react-bootstrap-icons";

const AVATAR_STYLES = [
  {
    background: "#e6f4ee",
    color: "#0e8a5f",
  },
  {
    background: "#e0edfb",
    color: "#185fa5",
  },
  {
    background: "#efe8fc",
    color: "#7c5ad1",
  },
  {
    background: "#fbedd6",
    color: "#d18a1c",
  },
];

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  return value;
};

const formatRating = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return "Data Not Available";
  }

  return rating.toFixed(1);
};

const formatSalary = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  const salary = Number(value);

  if (!Number.isFinite(salary)) {
    return "Data Not Available";
  }

  return `₹${salary.toLocaleString("en-IN")}`;
};

const getInitial = (name) => {
  if (!name || typeof name !== "string") {
    return "?";
  }

  return name.trim().charAt(0).toUpperCase();
};

const getAvatarStyle = (index) => {
  return AVATAR_STYLES[index % AVATAR_STYLES.length];
};

const WorkerPerformance = ({ data = [], loading = false }) => {
  const workers = Array.isArray(data) ? data : [];

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
        Worker Performance
      </h6>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && workers.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && workers.length > 0 && (
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #eef0f2",
                }}
              >
                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  #
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Worker
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Jobs Completed
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Avg Rating
                </th>

                <th
                  className="text-secondary fw-medium text-uppercase pb-2"
                  style={{ fontSize: "0.7rem" }}
                >
                  Salary
                </th>
              </tr>
            </thead>

            <tbody>
              {workers.map((worker, index) => {
                const avatarStyle = getAvatarStyle(index);

                const rating = formatRating(worker?.averageRating);

                const name = formatValue(worker?.workerName);

                return (
                  <tr
                    key={
                      worker?.workerId ||
                      worker?._id ||
                      `${worker?.workerName || "worker"}-${index}`
                    }
                    style={{
                      borderBottom:
                        index !== workers.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <td
                      className="py-2 text-secondary"
                      style={{
                        fontSize: "0.84rem",
                      }}
                    >
                      {index + 1}
                    </td>

                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: avatarStyle.background,
                            color: avatarStyle.color,
                            fontWeight: 700,
                            fontSize: "0.76rem",
                          }}
                        >
                          {getInitial(worker?.workerName)}
                        </div>

                        <span
                          className="fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.86rem",
                          }}
                        >
                          {name}
                        </span>
                      </div>
                    </td>

                    <td
                      className="py-2"
                      style={{
                        fontSize: "0.86rem",
                        color: "#0f1724",
                      }}
                    >
                      {formatValue(worker?.jobsCompleted)}
                    </td>

                    <td className="py-2">
                      <span
                        className="d-flex align-items-center gap-1"
                        style={{
                          fontSize: "0.86rem",
                          color: "#0f1724",
                        }}
                      >
                        {rating !== "Data Not Available" && (
                          <StarFill size={12} color="#f5b301" />
                        )}

                        {rating}
                      </span>
                    </td>

                    <td
                      className="py-2 fw-medium"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.86rem",
                      }}
                    >
                      {formatSalary(worker?.salary)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkerPerformance;
