import React, { useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import {
  ShieldFillCheck,
  LightningChargeFill,
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  LockFill,
  Eye,
  EyeSlash,
  BriefcaseFill,
} from "react-bootstrap-icons";

const features = [
  {
    title: "Verified Professionals",
    desc: "Background checked & experienced experts",
    icon: <ShieldFillCheck size={20} color="#0e8a5f" />,
  },
  {
    title: "Affordable Pricing",
    desc: "Transparent pricing, no hidden charges",
    icon: (
      <span className="fw-bold" style={{ color: "#0e8a5f", fontSize: "18px" }}>
        ₹
      </span>
    ),
  },
  {
    title: "Quick Booking",
    desc: "Book in just a few clicks",
    icon: <LightningChargeFill size={20} color="#0e8a5f" />,
  },
];

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: true,
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: "user",
      });

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      className="py-3 py-md-4"
      style={{ backgroundColor: "#f4f6f5", minHeight: "100vh" }}
    >
      {}
      <div className="container">
        {}
        <div
          className="row g-0 rounded-4 overflow-hidden"
          style={{
            border: "1px solid #e2e8e5",
            boxShadow: "0 4px 24px rgba(15, 23, 36, 0.05)",
          }}
        >
          {}
          <div
            className="col-lg-6 d-flex flex-column justify-content-between p-4 p-lg-5"
            style={{ backgroundColor: "#eef7f3" }}
          >
            <div>
              <h1
                className="fw-bold mb-3"
                style={{
                  color: "#0f1724",
                  fontSize: "2.4rem",
                  lineHeight: 1.2,
                }}
              >
                Trusted Services,
                <br />
                <span style={{ color: "#0e8a5f" }}>Happy Homes.</span>
              </h1>
              <p className="text-secondary mb-4" style={{ maxWidth: "420px" }}>
                Create your account and book verified professionals for all your
                home needs.
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

              {}
              <div className="text-center mb-4 d-none d-md-block">
                <img
                  src="https://via.placeholder.com/460x340?text=Booking+Confirmed+Illustration"
                  alt="Happy customer booking confirmed"
                  className="img-fluid"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            </div>

            {}
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
                  <BriefcaseFill size={20} color="#0e8a5f" />
                </div>
                <div>
                  <h6
                    className="fw-semibold mb-0"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Are you a service professional?
                  </h6>
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Apply to join our trusted network of experts.
                  </p>
                </div>
              </div>
              <button
                className="btn rounded-3 px-3 py-2 fw-medium flex-shrink-0"
                style={{ border: "1.5px solid #0e8a5f", color: "#0e8a5f" }}
              >
                Become a Professional
              </button>
            </div>
          </div>

          {}
          <div
            className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-lg-5"
            style={{ backgroundColor: "#fbfdfd" }}
          >
            <div className="w-100" style={{ maxWidth: "460px" }}>
              <h2
                className="fw-bold mb-1"
                style={{ color: "#0f1724", fontSize: "1.75rem" }}
              >
                Create Your Account
              </h2>
              <p className="text-secondary mb-4">
                Sign up as a customer to get started with ServyNex.
              </p>

              <form onSubmit={handleSubmit}>
                {}
                <div className="mb-3">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Full Name
                  </label>
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3"
                    style={{ border: "1px solid #d9dee3" }}
                  >
                    <PersonFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                  </div>
                </div>

                {}
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

                {}
                <div className="mb-3">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Phone Number
                  </label>
                  <div className="d-flex gap-2">
                    <div
                      className="d-flex align-items-center gap-1 rounded-3 px-3"
                      style={{ border: "1px solid #d9dee3" }}
                    >
                      <TelephoneFill size={14} className="text-secondary" />
                      <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        className="form-select border-0 shadow-none px-1 py-2"
                        style={{ width: "85px" }}
                      >
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+971</option>
                      </select>
                    </div>
                    <div
                      className="d-flex align-items-center gap-2 rounded-3 px-3 flex-grow-1"
                      style={{ border: "1px solid #d9dee3" }}
                    >
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="form-control border-0 shadow-none px-0 py-2"
                      />
                    </div>
                  </div>
                </div>

                {}
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
                      placeholder="Create a password"
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

                {}
                <div className="mb-3">
                  <label
                    className="form-label fw-medium"
                    style={{ color: "#0f1724", fontSize: "0.9rem" }}
                  >
                    Confirm Password
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
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-secondary flex-shrink-0"
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? (
                        <EyeSlash size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </span>
                  </div>
                </div>

                {}
                <div className="form-check d-flex align-items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={form.agreed}
                    onChange={handleChange}
                    className="form-check-input mt-0"
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "#0e8a5f",
                    }}
                    id="agreeTerms"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="form-check-label"
                    style={{ fontSize: "0.85rem", color: "#0f1724" }}
                  >
                    I agree to the{" "}
                    <a
                      href="#terms"
                      className="fw-medium text-decoration-none"
                      style={{ color: "#0e8a5f" }}
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#privacy"
                      className="fw-medium text-decoration-none"
                      style={{ color: "#0e8a5f" }}
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {}
                <button
                  type="submit"
                  className="btn w-100 text-white py-2 rounded-3 fw-semibold mb-3"
                  style={{ backgroundColor: "#0e8a5f" }}
                >
                  Create Account
                </button>

                {}
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

                {}
                <button
                  type="button"
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold mb-3"
                  style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
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
                  Sign up with Google
                </button>

                <p
                  className="text-center text-secondary mb-0"
                  style={{ fontSize: "0.9rem" }}
                >
                  Already have an account?{" "}
                  <a
                    href="#login"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "#0e8a5f" }}
                  >
                    Log In
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
