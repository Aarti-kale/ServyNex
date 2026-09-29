import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import API from "../../../api/api";
import {
  ShieldFillCheck,
  CalendarEventFill,
  LockFill,
  PersonFill,
  PersonBadgeFill,
  EnvelopeFill,
  Eye,
  EyeSlash,
  HeadsetVr,
  PeopleFill,
  StarFill,
  EmojiSmileFill,
} from "react-bootstrap-icons";
import { use } from "react";

const features = [
  {
    title: "Book trusted professionals",
    desc: "Verified and experienced experts",
    icon: <ShieldFillCheck size={20} color="#0e8a5f" />,
  },
  {
    title: "Track your bookings",
    desc: "Real-time updates and notifications",
    icon: <CalendarEventFill size={20} color="#0e8a5f" />,
  },
  {
    title: "Secure & Fast",
    desc: "Your data is safe with us",
    icon: <LockFill size={20} color="#0e8a5f" />,
  },
];

const stats = [
  {
    icon: <PeopleFill size={22} color="#0f1724" />,
    value: "500+",
    label: "Verified Professionals",
  },
  {
    icon: <StarFill size={22} color="#0f1724" />,
    value: "4.8/5",
    label: "Customer Rating",
  },
  {
    icon: <EmojiSmileFill size={22} color="#0f1724" />,
    value: "10K+",
    label: "Happy Customers",
  },
  {
    icon: <HeadsetVr size={22} color="#0f1724" />,
    value: "24/7",
    label: "Customer Support",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState("customer");
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: accountType === "customer" ? "user" : "worker",
      });

      const token = response.data.data.token;
      const loggedInUser = response.data.data.user;

      login(loggedInUser, token);

      alert("Login Successful");

      if (loggedInUser.role === "user") {
        navigate("/");
      } else if (loggedInUser.role === "worker") {
        navigate("/worker-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };
  return (
    <div
      className="py-3 py-md-4"
      style={{ backgroundColor: "#f4f6f5", minHeight: "100vh" }}
    >
      <div className="container">
        <div
          className="row g-0 rounded-4 overflow-hidden mb-4"
          style={{
            border: "1px solid #e2e8e5",
            boxShadow: "0 4px 24px rgba(15, 23, 36, 0.05)",
          }}
        >
          <div
            className="col-lg-6 d-flex flex-column justify-content-between p-4 p-lg-5"
            style={{ backgroundColor: "#eef7f3" }}
          >
            <div>
              <h1
                className="fw-bold mb-3"
                style={{ color: "#0f1724", fontSize: "2.4rem" }}
              >
                Welcome Back!
              </h1>
              <p className="text-secondary mb-4" style={{ maxWidth: "420px" }}>
                Access your ServyNex account to book services or manage your
                work.
              </p>

              <div className="d-flex flex-column gap-4 mb-4">
                {features.map((f, i) => (
                  <div className="d-flex align-items-start gap-3" key={i}>
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#ffffff",
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
                        style={{ fontSize: "0.85rem" }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mb-4 d-none d-md-block">
                <img
                  src="https://via.placeholder.com/460x340?text=Service+Booked+Illustration"
                  alt="Customer booking a service"
                  className="img-fluid"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            </div>

            <div
              className="rounded-4 p-3 bg-white d-flex flex-wrap align-items-center justify-content-between gap-3"
              style={{ border: "1px solid #d9ecdf" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  <HeadsetVr size={20} color="#0e8a5f" />
                </div>
                <div>
                  <h6
                    className="fw-semibold mb-0"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Need Help?
                  </h6>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Our support team is here for you.
                  </p>
                </div>
              </div>
              <button
                className="btn rounded-3 px-3 py-2 fw-medium flex-shrink-0"
                style={{ border: "1.5px solid #0e8a5f", color: "#0e8a5f" }}
              >
                Contact Support
              </button>
            </div>
          </div>

          <div
            className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-lg-5"
            style={{ backgroundColor: "#fbfdfd" }}
          >
            <div className="w-100" style={{ maxWidth: "460px" }}>
              <h2
                className="fw-bold mb-1"
                style={{ color: "#0f1724", fontSize: "1.75rem" }}
              >
                Login to Your Account
              </h2>
              <p className="text-secondary mb-4">
                Choose how you want to continue
              </p>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div
                    onClick={() => setAccountType("customer")}
                    className="rounded-3 p-3 d-flex align-items-center gap-2"
                    style={{
                      border:
                        accountType === "customer"
                          ? "2px solid #0e8a5f"
                          : "1px solid #e2e8e5",
                      backgroundColor:
                        accountType === "customer" ? "#eef7f3" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <PersonFill
                      size={20}
                      color={accountType === "customer" ? "#0e8a5f" : "#6b7280"}
                    />
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ color: "#0f1724", fontSize: "0.9rem" }}
                      >
                        Customer
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Book Services
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    onClick={() => setAccountType("professional")}
                    className="rounded-3 p-3 d-flex align-items-center gap-2"
                    style={{
                      border:
                        accountType === "professional"
                          ? "2px solid #0e8a5f"
                          : "1px solid #e2e8e5",
                      backgroundColor:
                        accountType === "professional" ? "#eef7f3" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <PersonBadgeFill
                      size={20}
                      color={
                        accountType === "professional" ? "#0e8a5f" : "#6b7280"
                      }
                    />
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ color: "#0f1724", fontSize: "0.9rem" }}
                      >
                        Professional
                      </div>
                      <div
                        className="text-secondary"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Manage Work
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Email Address
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
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Password
                  </label>
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3"
                    style={{ border: "1px solid #d9dee3" }}
                  >
                    <LockFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-secondary flex-shrink-0"
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="form-check-input mt-0"
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#0e8a5f",
                      }}
                      id="rememberMe"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="form-check-label"
                      style={{ fontSize: "0.88rem", color: "#0f1724" }}
                    >
                      Remember Me
                    </label>
                  </div>
                  <a
                    href="#forgot"
                    className="fw-medium text-decoration-none"
                    style={{ color: "#0e8a5f", fontSize: "0.88rem" }}
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn w-100 text-white d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold mb-3"
                  style={{ backgroundColor: "#0e8a5f" }}
                >
                  <LockFill size={15} /> Log In
                </button>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <hr className="flex-grow-1 m-0" />
                  <span
                    className="text-secondary"
                    style={{ fontSize: "0.85rem" }}
                  >
                    or continue with
                  </span>
                  <hr className="flex-grow-1 m-0" />
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium"
                      style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 48 48">
                        <path
                          fill="#FFC107"
                          d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.5 29.6 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5 44.5 35.3 44.5 24c0-1.2-.1-2.4-.3-3.5z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.5 29.6 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44.5c5.5 0 10.4-1.9 14-5l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.8-3.3-11.4-8l-6.6 5C9.7 40.1 16.3 44.5 24 44.5z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5c-.5.4 6.7-4.9 6.7-15.5 0-1.2-.1-2.4-.3-3.5z"
                        />
                      </svg>
                      <span style={{ fontSize: "0.88rem" }}>
                        Continue with Google
                      </span>
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-medium"
                      style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="#1877F2"
                      >
                        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                      </svg>
                      <span style={{ fontSize: "0.88rem" }}>
                        Continue with Facebook
                      </span>
                    </button>
                  </div>
                </div>

                <p
                  className="text-center mb-3"
                  style={{ fontSize: "0.9rem", color: "#0f1724" }}
                >
                  Don't have an account?{" "}
                  <a
                    href="#signup"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "#0e8a5f" }}
                  >
                    Sign Up
                  </a>
                </p>

                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-between gap-2 flex-wrap"
                  style={{ backgroundColor: "#eef7f3" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <ShieldFillCheck
                      size={18}
                      color="#0e8a5f"
                      className="flex-shrink-0"
                    />
                    <span style={{ fontSize: "0.82rem", color: "#0f1724" }}>
                      Professional accounts are created after approval by the
                      ServyNex team.
                    </span>
                  </div>
                  <a
                    href="#learn-more"
                    className="fw-semibold text-decoration-none flex-shrink-0"
                    style={{ color: "#0e8a5f", fontSize: "0.82rem" }}
                  >
                    Learn More
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row g-3 text-center py-3">
          {stats.map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="d-flex flex-column align-items-center">
                <div className="mb-2">{s.icon}</div>
                <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                  {s.value}
                </h5>
                <p
                  className="text-secondary mb-0"
                  style={{ fontSize: "0.8rem" }}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
