import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PatchCheckFill,
  ShieldFillCheck,
  StarFill,
  CalendarEventFill,
  CameraFill,
} from "react-bootstrap-icons";

const ProfileHeader = ({ profile, onChangePhoto }) => {
  const name = profile?.name || "Worker";
  const profession = profile?.profession || "-";
  const rating = `${profile?.overallRating ?? 0}/5`;
  const experience =
    profile?.experience !== undefined &&
    profile?.experience !== null &&
    profile?.experience !== ""
      ? `${profile.experience} Years`
      : "-";

  const avatar =
    profile?.profileImage ||
    `https://via.placeholder.com/120?text=${encodeURIComponent(
      name.charAt(0)
    )}`;

  const isVerified = profile?.isVerified === true;

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
          My Profile
        </h1>

        <p className="text-secondary mb-4">
          View and manage your personal and professional information.
        </p>

        <div
          className="rounded-4 p-4 bg-white"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="d-flex flex-wrap align-items-center gap-4">
            <div className="position-relative flex-shrink-0">
              <img
                src={avatar}
                alt={name}
                className="rounded-circle"
                style={{
                  width: "96px",
                  height: "96px",
                  objectFit: "cover",
                }}
              />

              <button
                type="button"
                onClick={onChangePhoto}
                className="btn d-flex align-items-center justify-content-center rounded-circle p-0 position-absolute"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#0e8a5f",
                  bottom: 0,
                  right: 0,
                  border: "2px solid #fff",
                }}
              >
                <CameraFill size={14} color="#ffffff" />
              </button>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h4 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                  {name}
                </h4>

                {isVerified && <PatchCheckFill size={18} color="#0e8a5f" />}
              </div>

              <p className="fw-medium mb-2" style={{ color: "#0e8a5f" }}>
                {profession}
              </p>

              <span
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-medium mb-3"
                style={{
                  backgroundColor: isVerified ? "#e6f4ee" : "#f3f4f6",
                  color: isVerified ? "#0e8a5f" : "#6b7280",
                  fontSize: "0.82rem",
                }}
              >
                <ShieldFillCheck size={14} />

                {isVerified ? "Verified Professional" : "Verification Pending"}
              </span>

              <div className="d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center gap-2">
                  <StarFill size={18} color="#f5b301" />

                  <div>
                    <span className="fw-bold" style={{ color: "#0f1724" }}>
                      {rating}
                    </span>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Overall Rating
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CalendarEventFill size={16} color="#0e8a5f" />

                  <div>
                    <span className="fw-bold" style={{ color: "#0f1724" }}>
                      {experience}
                    </span>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
