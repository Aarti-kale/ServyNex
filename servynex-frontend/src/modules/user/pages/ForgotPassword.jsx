import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HouseFill,
  ShieldFillCheck,
  LightningChargeFill,
  AwardFill,
  EnvelopeFill,
  SendFill,
  ArrowLeft,
  LockFill,
} from "react-bootstrap-icons";

const features = [
  {
    title: "Secure Password Reset",
    desc: "Your account is protected with advanced security.",
    icon: <ShieldFillCheck size={20} color="#0e8a5f" />,
  },
  {
    title: "Quick Account Recovery",
    desc: "Reset your password in just a few simple steps.",
    icon: <LightningChargeFill size={20} color="#0e8a5f" />,
  },
  {
    title: "Trusted & Safe Process",
    desc: "We follow a verified process to keep your data safe.",
    icon: <AwardFill size={20} color="#0e8a5f" />,
  },
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="py-3 py-md-4"
      style={{ backgroundColor: "#f4f6f5", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row g-5 align-items-center py-4">
          <div className="col-lg-6">
            <h1
              className="fw-bold mb-3"
              style={{ color: "#0f1724", fontSize: "2.4rem", lineHeight: 1.2 }}
            >
              Forgot Your
              <br />
              <span style={{ color: "#0e8a5f" }}>Password?</span>
            </h1>
            <p className="text-secondary mb-4" style={{ maxWidth: "420px" }}>
              Don't worry! Enter your registered email address and we'll help
              you reset your password securely.
            </p>

            <div className="d-flex flex-column gap-4 mb-4">
              {features.map((f, i) => (
                <div className="d-flex align-items-start gap-3" key={i}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#eef7f3",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h6
                      className="fw-semibold mb-1"
                      style={{ color: "#0f1724" }}
                    >
                      {f.title}
                    </h6>
                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.85rem", maxWidth: "320px" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-none d-md-block">
              <img
                src="https://via.placeholder.com/500x360?text=Password+Reset+Illustration"
                alt="Person resetting password on phone"
                className="img-fluid"
                style={{ maxHeight: "320px", objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div
              className="rounded-4 p-4 p-lg-5 bg-white mx-auto"
              style={{
                maxWidth: "500px",
                border: "1px solid #e2e8e5",
                boxShadow: "0 4px 24px rgba(15, 23, 36, 0.05)",
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#0e8a5f",
                  }}
                >
                  <HouseFill color="#fff" size={18} />
                </span>
                <span className="fw-bold fs-4" style={{ color: "#0f1724" }}>
                  ServyNex
                </span>
              </div>

              <h2
                className="fw-bold text-center mb-1"
                style={{ color: "#0f1724", fontSize: "1.6rem" }}
              >
                Reset Password
              </h2>
              <p className="text-secondary text-center mb-4">
                Enter your registered email address.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Registered Email Address
                  </label>
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3"
                    style={{ border: "1px solid #d9dee3" }}
                  >
                    <EnvelopeFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 text-white d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold mb-3"
                  style={{ backgroundColor: "#0e8a5f" }}
                >
                  <SendFill size={15} /> Send Reset Link
                </button>

                {submitted && (
                  <p
                    className="text-center mb-3"
                    style={{ color: "#0e8a5f", fontSize: "0.85rem" }}
                  >
                    ✓ If an account exists for that email, a reset link has been
                    sent.
                  </p>
                )}

                <div className="d-flex align-items-center gap-3 mb-3">
                  <hr className="flex-grow-1 m-0" />
                  <span
                    className="text-secondary"
                    style={{ fontSize: "0.85rem" }}
                  >
                    or
                  </span>
                  <hr className="flex-grow-1 m-0" />
                </div>

                <div className="text-center mb-4">
                  <a
                    href="#login"
                    className="fw-semibold text-decoration-none d-inline-flex align-items-center gap-2"
                    style={{ color: "#0e8a5f" }}
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </a>
                </div>

                <div
                  className="rounded-3 p-3 d-flex align-items-center gap-3"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-white flex-shrink-0"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <LockFill size={16} color="#0e8a5f" />
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#0f1724" }}>
                    We'll send a secure password reset link to your email
                    address.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
