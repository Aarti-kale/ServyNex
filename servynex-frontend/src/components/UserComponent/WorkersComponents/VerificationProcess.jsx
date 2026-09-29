import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FileEarmarkPersonFill,
  PersonVcardFill,
  AwardFill,
  ShieldFillCheck,
  MortarboardFill,
  PeopleFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const VerificationProcess = ({ data = [], title, subtitle }) => {
  const icons = {
    FileEarmarkPersonFill,
    PersonVcardFill,
    AwardFill,
    ShieldFillCheck,
    MortarboardFill,
    PeopleFill,
  };

  const steps = Array.isArray(data) ? data : [];

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2
          className="fw-bold mb-2"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {title || "Our Hiring & Verification Process"}
        </h2>

        <p className="text-secondary mb-5">
          {subtitle ||
            "We follow a strict process to ensure the best professionals for you"}
        </p>

        <div className="row g-4 position-relative">
          {steps.map((step, index) => {
            const Icon = icons[step.icon] || CheckCircleFallback;

            return (
              <div className="col-6 col-md-4 col-lg-2" key={step._id || index}>
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    {Icon && <Icon size={22} color="#0e8a5f" />}
                  </div>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold mb-2 text-white"
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: "#0e8a5f",
                      fontSize: "0.7rem",
                    }}
                  >
                    {step.step || index + 1}
                  </div>

                  <h6
                    className="fw-semibold mb-1"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {step.title}
                  </h6>

                  <p
                    className="text-secondary"
                    style={{
                      fontSize: "0.78rem",
                    }}
                  >
                    {step.description || step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CheckCircleFallback = CheckCircleFill;

export default VerificationProcess;
