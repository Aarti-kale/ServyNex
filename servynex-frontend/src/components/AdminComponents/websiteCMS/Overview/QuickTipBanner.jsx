import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LightbulbFill } from "react-bootstrap-icons";

const QuickTipBanner = ({
  tip = "Keep your website content fresh and updated to provide the best experience to your visitors.",
}) => {
  return (
    <section className="pb-4">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 p-3 d-flex align-items-center gap-3"
          style={{ backgroundColor: "#eef7f3" }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#ffffff",
            }}
          >
            <LightbulbFill size={20} color="#0e8a5f" />
          </div>
          <div>
            <h6 className="fw-bold mb-1" style={{ color: "#0e8a5f" }}>
              Quick Tip
            </h6>
            <p
              className="mb-0"
              style={{ color: "#0f1724", fontSize: "0.88rem" }}
            >
              {tip}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickTipBanner;
