import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  EnvelopeFill,
  TelephoneFill,
  CalendarEventFill,
  PencilFill,
} from "react-bootstrap-icons";

const formatMemberSince = (date) => {
  if (!date) return "Member since -";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Member since -";
  }

  return `Member since ${parsedDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })}`;
};

const ProfileCard = ({ profile = null }) => {
  return (
    <section className="py-2">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white position-relative overflow-hidden"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div
            className="row align-items-center g-3 position-relative"
            style={{ zIndex: 1 }}
          >
            <div className="col-auto">
              <img
                src={
                  profile?.profileImage ||
                  "https://via.placeholder.com/80?text=User"
                }
                alt={profile?.name || "User"}
                className="rounded-circle"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col">
              <h5 className="fw-bold mb-2" style={{ color: "#0f1724" }}>
                {profile?.name || "User"}
              </h5>

              <div className="d-flex flex-wrap gap-4">
                <span
                  className="d-flex align-items-center gap-2 text-secondary"
                  style={{ fontSize: "0.88rem" }}
                >
                  <EnvelopeFill size={14} color="#0e8a5f" />

                  {profile?.email || "-"}
                </span>

                <span
                  className="d-flex align-items-center gap-2 text-secondary"
                  style={{ fontSize: "0.88rem" }}
                >
                  <TelephoneFill size={14} color="#0e8a5f" />

                  {profile?.phone || "-"}
                </span>

                <span
                  className="d-flex align-items-center gap-2 text-secondary"
                  style={{ fontSize: "0.88rem" }}
                >
                  <CalendarEventFill size={14} color="#0e8a5f" />

                  {formatMemberSince(profile?.createdAt)}
                </span>
              </div>
            </div>

            <div className="col-auto">
              <button
                type="button"
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                }}
              >
                <PencilFill size={13} /> Edit Profile
              </button>
            </div>
          </div>

          <img
            src="https://via.placeholder.com/260x140?text=House+Illustration"
            alt=""
            className="position-absolute d-none d-md-block"
            style={{
              bottom: 0,
              right: 0,
              height: "100px",
              objectFit: "contain",
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
