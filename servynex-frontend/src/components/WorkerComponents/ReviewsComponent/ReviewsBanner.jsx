import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LightbulbFill,
  ChatSquareTextFill,
  StarFill,
} from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const ReviewsBanner = () => {
  return (
    <section className="pb-4">
      <div className="container">
        <div
          className="rounded-4 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ backgroundColor: "#eef7f3" }}
        >
          <div className="d-flex align-items-center gap-3">
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
              <p
                className="mb-0"
                style={{ color: "#0f1724", fontSize: "0.92rem" }}
              >
                Customer feedback helps you improve and provide better service.
              </p>
              <p
                className="fw-semibold mb-0"
                style={{ color: "#0e8a5f", fontSize: "0.92rem" }}
              >
                Keep up the good work!
              </p>
            </div>
          </div>

          <div
            className="position-relative flex-shrink-0 d-none d-md-block"
            style={{ width: "60px", height: "50px" }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "48px",
                height: "38px",
                backgroundColor: "#0e8a5f",
              }}
            >
              <ChatSquareTextFill size={18} color="#ffffff" />
            </div>
            <StarFill
              size={16}
              color="#f5b301"
              style={{ position: "absolute", bottom: "-4px", right: "0px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsBanner;
