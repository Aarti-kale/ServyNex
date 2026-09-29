import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import API from "../../../api/api";
import {
  HouseFill,
  ShieldFillCheck,
  PeopleFill,
  GraphUpArrow,
  GearFill,
  LockFill,
  EnvelopeFill,
  Eye,
  EyeSlash,
} from "react-bootstrap-icons";

const features = [
  {
    title: "Secure",
    desc: "Data Protection",
    icon: <ShieldFillCheck size={20} color="#ffffff" />,
  },
  {
    title: "Manage",
    desc: "Your Team",
    icon: <PeopleFill size={20} color="#ffffff" />,
  },
  {
    title: "Track",
    desc: "Performance",
    icon: <GraphUpArrow size={20} color="#ffffff" />,
  },
  {
    title: "Business",
    desc: "Automation",
    icon: <GearFill size={20} color="#ffffff" />,
  },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    keepSignedIn: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const originalMargin = document.body.style.margin;
    const originalOverflow = document.body.style.overflow;
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.margin = originalMargin;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (user) {
    if (user.role === "worker") {
      return <Navigate to="/worker-dashboard" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/" replace />;
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/admin/login", {
        email: form.email,
        password: form.password,
      });

      const { user, token } = response.data.data;

      if (user.role !== "admin") {
        alert("Access Denied");
        return;
      }

      login(user, token);

      alert("Admin Login Successful");

      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Admin Credentials");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      style={{
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0e8a5f, #0f1724 100%)",
      }}
    >
      <div
        className="rounded-4 overflow-hidden shadow-lg w-100"
        style={{ maxWidth: "1400px", maxHeight: "96vh" }}
      >
        <div className="row g-0" style={{ height: "100%" }}>
          <div
            className="col-lg-6 d-flex flex-column justify-content-between p-4"
            style={{
              height: "100%",
              background:
                "linear-gradient(160deg, #eaf6ef 0%, #cdeadb 35%, #0e8a5f 75%, #0a6b48 100%)",
            }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "38px",
                    height: "38px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <HouseFill size={20} color="#0e8a5f" />
                </span>
                <div>
                  <div
                    className="fw-bold"
                    style={{
                      color: "#0f1724",
                      fontSize: "1.15rem",
                      lineHeight: 1,
                    }}
                  >
                    Servy<span style={{ color: "#0e8a5f" }}>Nex</span>
                  </div>
                  <div
                    className="text-secondary fw-medium"
                    style={{ fontSize: "0.58rem", letterSpacing: "0.08em" }}
                  >
                    YOUR HOME, OUR PRIORITY
                  </div>
                </div>
              </div>

              <h1
                className="fw-bold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "1.7rem",
                  lineHeight: 1.2,
                }}
              >
                Manage Your
                <br />
                <span style={{ color: "#0e8a5f" }}>Service Business</span>
                <br />
                Efficiently
              </h1>
              <p
                className="text-secondary mb-3"
                style={{ maxWidth: "360px", fontSize: "0.88rem" }}
              >
                Manage Bookings, Workers, Customers, Services, and much more
                from your secure admin dashboard.
              </p>

              <div className="text-center mb-3">
                <svg
                  width="100%"
                  height="180"
                  viewBox="0 0 380 220"
                  style={{ maxWidth: "360px" }}
                >
                  <rect
                    x="20"
                    y="175"
                    width="340"
                    height="8"
                    rx="2"
                    fill="#0a6b48"
                    opacity="0.4"
                  />
                  <rect x="175" y="150" width="10" height="25" fill="#1f2937" />
                  <rect
                    x="150"
                    y="172"
                    width="60"
                    height="6"
                    rx="3"
                    fill="#1f2937"
                  />
                  <rect
                    x="90"
                    y="55"
                    width="180"
                    height="100"
                    rx="6"
                    fill="#1f2937"
                  />
                  <rect
                    x="98"
                    y="63"
                    width="164"
                    height="84"
                    rx="3"
                    fill="#ffffff"
                  />
                  <rect
                    x="106"
                    y="70"
                    width="60"
                    height="10"
                    rx="2"
                    fill="#0e8a5f"
                  />
                  <rect
                    x="106"
                    y="86"
                    width="35"
                    height="24"
                    rx="3"
                    fill="#e6f4ee"
                  />
                  <rect
                    x="146"
                    y="86"
                    width="35"
                    height="24"
                    rx="3"
                    fill="#e6f4ee"
                  />
                  <rect
                    x="186"
                    y="86"
                    width="35"
                    height="24"
                    rx="3"
                    fill="#e6f4ee"
                  />
                  <polyline
                    points="106,140 118,128 132,134 146,118 160,124 174,110 188,116"
                    fill="none"
                    stroke="#0e8a5f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="235"
                    cy="122"
                    r="20"
                    fill="none"
                    stroke="#0e8a5f"
                    strokeWidth="6"
                  />
                  <path
                    d="M235 102 A20 20 0 0 1 253 132"
                    fill="none"
                    stroke="#1877F2"
                    strokeWidth="6"
                  />
                  <circle cx="60" cy="95" r="18" fill="#f2b385" />
                  <path
                    d="M45 88 Q60 70 78 88 Q78 95 60 95 Q45 95 45 88 Z"
                    fill="#1f2937"
                  />
                  <path
                    d="M30 200 Q30 140 60 130 Q95 130 100 175 L100 200 Z"
                    fill="#0e8a5f"
                  />
                  <rect
                    x="20"
                    y="120"
                    width="14"
                    height="80"
                    rx="6"
                    fill="#0a6b48"
                    opacity="0.5"
                  />
                  <rect
                    x="300"
                    y="165"
                    width="26"
                    height="18"
                    rx="3"
                    fill="#1f2937"
                  />
                  <path
                    d="M313 165 Q300 140 313 120 Q326 140 313 165"
                    fill="#4a7c59"
                  />
                  <path
                    d="M313 165 Q295 150 300 130 Q320 145 313 165"
                    fill="#5f9c72"
                  />
                  <rect
                    x="255"
                    y="160"
                    width="20"
                    height="16"
                    rx="3"
                    fill="#ffffff"
                    stroke="#d9dee3"
                  />
                  <circle
                    cx="252"
                    cy="168"
                    r="5"
                    fill="none"
                    stroke="#d9dee3"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="row g-2 text-center">
              {features.map((f, i) => (
                <div className="col-3" key={i}>
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-1"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                      }}
                    >
                      {f.icon}
                    </div>
                    <p
                      className="fw-bold text-white mb-0"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="mb-0"
                      style={{ color: "#e6f4ee", fontSize: "0.68rem" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="col-lg-6 d-flex flex-column"
            style={{ height: "100%", backgroundColor: "#ffffff" }}
          >
            <div
              className="flex-grow-1 d-flex align-items-center justify-content-center p-4"
              style={{ overflowY: "auto" }}
            >
              <div className="w-100" style={{ maxWidth: "400px" }}>
                <div className="text-center mb-2">
                  <span
                    className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-medium"
                    style={{
                      backgroundColor: "#e6f4ee",
                      color: "#0e8a5f",
                      fontSize: "0.8rem",
                    }}
                  >
                    <LockFill size={12} /> Secure Admin Access
                  </span>
                </div>

                <h2
                  className="fw-bold text-center mb-1"
                  style={{ color: "#0f1724", fontSize: "1.6rem" }}
                >
                  Admin <span style={{ color: "#0e8a5f" }}>Login</span>
                </h2>
                <p
                  className="text-secondary text-center mb-3"
                  style={{ fontSize: "0.88rem" }}
                >
                  Welcome back! Please login to your admin account.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label
                      className="form-label fw-medium mb-1"
                      style={{ color: "#0f1724", fontSize: "0.88rem" }}
                    >
                      Email Address
                    </label>
                    <div
                      className="d-flex align-items-center gap-2 rounded-3 px-3"
                      style={{ border: "1px solid #d9dee3" }}
                    >
                      <EnvelopeFill
                        size={15}
                        className="text-secondary flex-shrink-0"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="form-control border-0 shadow-none px-0 py-2"
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label
                      className="form-label fw-medium mb-1"
                      style={{ color: "#0f1724", fontSize: "0.88rem" }}
                    >
                      Password
                    </label>
                    <div
                      className="d-flex align-items-center gap-2 rounded-3 px-3"
                      style={{ border: "1px solid #d9dee3" }}
                    >
                      <LockFill
                        size={15}
                        className="text-secondary flex-shrink-0"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="form-control border-0 shadow-none px-0 py-2"
                        style={{ fontSize: "0.9rem" }}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-secondary flex-shrink-0"
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <EyeSlash size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="form-check d-flex align-items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      name="keepSignedIn"
                      checked={form.keepSignedIn}
                      onChange={handleChange}
                      className="form-check-input mt-0"
                      style={{
                        width: "17px",
                        height: "17px",
                        accentColor: "#0e8a5f",
                      }}
                      id="keepSignedIn"
                    />
                    <label
                      htmlFor="keepSignedIn"
                      className="form-check-label"
                      style={{ fontSize: "0.86rem", color: "#0f1724" }}
                    >
                      Keep me signed in
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 text-white py-2 rounded-3 fw-bold mb-3"
                    style={{
                      backgroundColor: "#0e8a5f",
                      letterSpacing: "0.05em",
                    }}
                  >
                    LOGIN
                  </button>

                  <hr className="my-2" />

                  <p
                    className="d-flex align-items-center justify-content-center gap-2 text-secondary mb-0 mt-2"
                    style={{ fontSize: "0.84rem" }}
                  >
                    <ShieldFillCheck size={14} /> Authorized Personnel Only
                  </p>
                </form>
              </div>
            </div>

            <p
              className="text-center text-secondary pb-3 mb-0"
              style={{ fontSize: "0.8rem" }}
            >
              © 2026{" "}
              <span className="fw-semibold" style={{ color: "#0e8a5f" }}>
                ServyNex
              </span>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
