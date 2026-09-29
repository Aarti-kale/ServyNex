import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  EnvelopeFill,
  TelephoneFill,
  PersonVcardFill,
  CalendarEventFill,
  CameraFill,
  PencilFill,
} from "react-bootstrap-icons";

const getFieldValue = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "Field not available";
  }

  return value;
};

const formatRole = (role) => {
  if (!role) {
    return "Field not available";
  }

  return role
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (date) => {
  if (!date) {
    return "Field not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Field not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (isActive) => {
  if (typeof isActive !== "boolean") {
    return "Field not available";
  }

  return isActive ? "Active" : "Inactive";
};

const ProfileHeader = ({ profile = {}, onEditProfile, onChangePhoto }) => {
  const name = getFieldValue(profile?.name);

  const role = formatRole(profile?.role);

  const email = getFieldValue(profile?.email);

  const phone = getFieldValue(profile?.phone);

  const employeeId = getFieldValue(profile?.employeeId);

  const adminSince = "Field not available";

  const status = formatStatus(profile?.isActive);

  const avatar = profile?.profileImage || null;

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <h1
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.9rem",
          }}
        >
          Admin Profile
        </h1>

        <nav className="mb-4" style={{ fontSize: "0.86rem" }}>
          <span className="fw-medium" style={{ color: "#0e8a5f" }}>
            Dashboard
          </span>{" "}
          <ChevronRight size={11} className="text-secondary mx-1" />
          <span className="text-secondary">Admin Profile</span>
        </nav>

        <div
          className="rounded-4 p-4 bg-white"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4">
              <div className="position-relative flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="rounded-circle"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "100px",
                      height: "100px",
                      backgroundColor: "#eef0f2",
                      color: "#6b7280",
                      fontSize: "2rem",
                      fontWeight: 600,
                    }}
                  >
                    {profile?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={onChangePhoto}
                  className="btn d-flex align-items-center justify-content-center rounded-circle p-0 position-absolute"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#0e8a5f",
                    bottom: 0,
                    right: 0,
                    border: "2px solid #fff",
                  }}
                >
                  <CameraFill size={15} color="#ffffff" />
                </button>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <h4 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                    {name}
                  </h4>

                  <span
                    className="badge rounded-pill fw-medium"
                    style={{
                      backgroundColor: "#e6f4ee",
                      color: "#0e8a5f",
                      fontSize: "0.78rem",
                    }}
                  >
                    {role}
                  </span>
                </div>

                <div className="d-flex flex-column gap-1">
                  <span
                    className="d-flex align-items-center gap-2 text-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <EnvelopeFill size={13} color="#6b7280" />

                    {email}
                  </span>

                  <span
                    className="d-flex align-items-center gap-2 text-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <TelephoneFill size={13} color="#6b7280" />

                    {phone}
                  </span>

                  <span
                    className="d-flex align-items-center gap-2 text-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <PersonVcardFill size={13} color="#6b7280" />
                    Employee ID: {employeeId}
                  </span>

                  <span
                    className="d-flex align-items-center gap-2 text-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <CalendarEventFill size={13} color="#6b7280" />
                    Admin Since: {adminSince}
                  </span>

                  <span
                    className="d-flex align-items-center gap-2 text-secondary"
                    style={{ fontSize: "0.88rem" }}
                  >
                    <span
                      className="rounded-circle"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor:
                          profile?.isActive === true ? "#0e8a5f" : "#9ca3af",
                        display: "inline-block",
                      }}
                    />
                    Status:
                    <span
                      className="fw-semibold"
                      style={{
                        color:
                          profile?.isActive === true ? "#0e8a5f" : "#6b7280",
                      }}
                    >
                      {status}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onEditProfile}
              className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium flex-shrink-0"
              style={{
                backgroundColor: "#0e8a5f",
              }}
            >
              <PencilFill size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
