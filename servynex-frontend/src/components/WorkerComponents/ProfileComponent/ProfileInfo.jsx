import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilFill } from "react-bootstrap-icons";
const ProfileInfo = ({
  icon,
  title,
  editLabel,
  editIcon,
  onEdit,
  rows = [],
}) => {
  return (
    <section className="pb-3">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#e6f4ee",
                }}
              >
                {icon}
              </div>

              <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                {title}
              </h5>
            </div>

            {editLabel && (
              <button
                type="button"
                onClick={onEdit}
                className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                  fontSize: "0.85rem",
                }}
              >
                {editIcon || <PencilFill size={13} />}
                {editLabel}
              </button>
            )}
          </div>

          <div>
            {rows.map((row, index) => (
              <div key={row.label?.toString() || index}>
                <div className="row py-3 align-items-center">
                  <div
                    className="col-5 col-md-4 text-secondary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {row.label}
                  </div>

                  <div
                    className="col-7 col-md-8 fw-medium"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.92rem",
                    }}
                  >
                    {row.value ?? "-"}
                  </div>
                </div>

                {index !== rows.length - 1 && <hr className="m-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;
