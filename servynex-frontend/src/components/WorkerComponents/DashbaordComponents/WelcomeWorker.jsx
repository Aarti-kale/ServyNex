import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PatchCheckFill,
  StarFill,
  CalendarEventFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const getAvailabilityText = (availability) => {
  if (availability === "available") {
    return "Available for work today";
  }

  if (availability === "busy") {
    return "Currently busy";
  }

  return "Currently offline";
};

const getAvailabilityColor = (availability) => {
  if (availability === "available") {
    return "#0e8a5f";
  }

  if (availability === "busy") {
    return "#f5b301";
  }

  return "#6b7280";
};

const formatMemberSince = (createdAt) => {
  if (!createdAt) {
    return "-";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const WelcomeWorker = ({ worker }) => {
  if (!worker) {
    return (
      <section className="py-4">
        <div className="container">
          <p>Worker information could not be loaded.</p>
        </div>
      </section>
    );
  }

  const workerName = worker?.name || "Worker";
  const initial = workerName.charAt(0).toUpperCase();

  const availability = worker?.availability || "offline";
  const availabilityColor = getAvailabilityColor(availability);

  const rating = worker?.rating ?? 0;
  const experience = worker?.experience ?? 0;

  const profession =
    Array.isArray(worker?.skills) && worker.skills.length > 0
      ? worker.skills[0]
      : "Professional";

  const isVerified = Boolean(worker?.isVerified);

  return (
    <section className="py-4">
      <div className="container">
        <h1
          className="fw-bold mb-1"
          style={{ color: "#0f1724", fontSize: "1.9rem" }}
        >
          Welcome back, {workerName}! 👋
        </h1>

        <p className="text-secondary mb-4">
          Here's what's happening with your work today.
        </p>

        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="row align-items-center g-4">
            <div className="col-auto">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "110px",
                  height: "110px",
                  backgroundColor: "#e6f4ee",
                  color: "#0e8a5f",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {initial}
              </div>
            </div>

            <div className="col">
              <h5 className="fw-bold mb-2" style={{ color: "#0f1724" }}>
                {workerName}
              </h5>

              <div className="d-flex align-items-center gap-2 mb-2">
                <PatchCheckFill size={16} color="#0e8a5f" />

                <span
                  className="fw-medium"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "0.88rem",
                  }}
                >
                  {isVerified
                    ? "Verified Professional"
                    : "Verification Pending"}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="rounded-circle"
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: availabilityColor,
                    display: "inline-block",
                  }}
                />

                <span
                  className="text-secondary"
                  style={{ fontSize: "0.88rem" }}
                >
                  {getAvailabilityText(availability)}
                </span>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <span
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "0.88rem" }}
                >
                  <StarFill size={14} color="#f5b301" />

                  <span className="fw-semibold" style={{ color: "#0f1724" }}>
                    {rating}
                  </span>

                  <span className="text-secondary">Rating</span>
                </span>

                <span
                  className="d-flex align-items-center gap-1 text-secondary"
                  style={{ fontSize: "0.88rem" }}
                >
                  <CalendarEventFill size={13} />
                  {experience} Years Experience
                </span>
              </div>
            </div>

            <div className="col-auto d-none d-lg-block">
              <div className="d-flex gap-5">
                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Profession
                  </p>

                  <p className="fw-semibold mb-0" style={{ color: "#0e8a5f" }}>
                    {profession}
                  </p>
                </div>

                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Member Since
                  </p>

                  <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                    {formatMemberSince(worker?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div
                className="rounded-3 px-3 py-2"
                style={{ backgroundColor: "#e6f4ee" }}
              >
                <p
                  className="text-secondary mb-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  Approval Status
                </p>

                <div className="d-flex align-items-center gap-2">
                  <CheckCircleFill
                    size={15}
                    color={isVerified ? "#0e8a5f" : "#f5b301"}
                  />

                  <span
                    className="fw-semibold"
                    style={{
                      color: isVerified ? "#0e8a5f" : "#f5b301",
                      fontSize: "0.9rem",
                    }}
                  >
                    {isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeWorker;
