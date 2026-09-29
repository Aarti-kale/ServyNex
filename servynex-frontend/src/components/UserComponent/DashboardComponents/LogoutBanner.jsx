import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BoxArrowRight } from "react-bootstrap-icons";

const LogoutBanner = ({ onLogout }) => {
  return (
    <section className="py-2">
      <div className="container">
        <div
          className="rounded-4 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{
            backgroundColor: "#fdecec",
            border: "1px solid #f7d3d3",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <BoxArrowRight size={24} color="#dc3545" />

            <div>
              <h6 className="fw-bold mb-1" style={{ color: "#dc3545" }}>
                Logout
              </h6>

              <p
                className="text-secondary mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                Securely log out from your account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="btn text-white px-4 py-2 rounded-3 fw-semibold"
            style={{ backgroundColor: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default LogoutBanner;
