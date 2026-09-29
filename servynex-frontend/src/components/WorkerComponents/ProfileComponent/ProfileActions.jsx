import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SaveFill, XLg } from "react-bootstrap-icons";

const ProfileActions = ({ onSave, onCancel }) => {
  return (
    <section className="pb-5">
      <div className="container">
        <div className="d-flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            className="btn text-white d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-semibold flex-grow-1"
            style={{
              backgroundColor: "#0e8a5f",
              maxWidth: "280px",
            }}
          >
            <SaveFill size={15} />
            Save Changes
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-semibold flex-grow-1"
            style={{
              border: "1px solid #d9dee3",
              color: "#0f1724",
              maxWidth: "280px",
            }}
          >
            <XLg size={15} />
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileActions;
