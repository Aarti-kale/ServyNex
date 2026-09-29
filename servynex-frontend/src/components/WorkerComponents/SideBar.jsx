import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HouseFill,
  BriefcaseFill,
  CalendarEventFill,
  CashCoin,
  StarFill,
  PersonFill,
  BoxArrowRight,
  HeadsetVr,
} from "react-bootstrap-icons";

const navItems = [
  {
    label: "Dashboard",
    to: "/worker-dashboard",
    icon: <HouseFill size={18} />,
  },
  {
    label: "My Jobs",
    to: "/jobs",
    icon: <BriefcaseFill size={18} />,
  },
  {
    label: "Schedule",
    to: "/schedule",
    icon: <CalendarEventFill size={18} />,
  },
  {
    label: "Salary",
    to: "/salary",
    icon: <CashCoin size={18} />,
  },
  {
    label: "Reviews",
    to: "/reviews",
    icon: <StarFill size={18} />,
  },
  {
    label: "My Profile",
    to: "/profile",
    icon: <PersonFill size={18} />,
  },
];

const SideBar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onLogout) {
      onLogout();
    }

    navigate("/", { replace: true });
  };

  return (
    <aside
      className="d-flex flex-column justify-content-between"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#0f1724",
      }}
    >
      <div>
        {/* Logo */}
        <div className="d-flex align-items-center gap-2 px-4 py-4">
          <span
            className="d-flex align-items-center justify-content-center rounded-2 bg-white flex-shrink-0"
            style={{
              width: "32px",
              height: "32px",
            }}
          >
            <HouseFill color="#0e8a5f" size={18} />
          </span>

          <span className="fw-bold fs-5 text-white">ServyNex</span>
        </div>

        <nav className="d-flex flex-column gap-1 px-3 pt-3">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={index}
                to={item.to}
                className="text-decoration-none"
                style={{
                  backgroundColor: isActive ? "#0e8a5f" : "transparent",
                  color: isActive ? "#ffffff" : "#9ca3af",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.92rem",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 pb-4">
        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="btn d-flex align-items-center gap-3 text-start px-3 py-2 rounded-3 w-100 mb-3"
          style={{
            color: "#ff8080",
            fontSize: "0.92rem",
          }}
        >
          <BoxArrowRight size={18} />
          Logout
        </button>

        <div
          className="rounded-3 p-3 d-flex align-items-center gap-3"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(14, 138, 95, 0.2)",
            }}
          >
            <HeadsetVr size={18} color="#0e8a5f" />
          </div>

          <div>
            <h6
              className="fw-semibold mb-0"
              style={{
                color: "#ffffff",
                fontSize: "0.85rem",
              }}
            >
              Need Help?
            </h6>

            <p
              className="mb-0"
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              Contact Support
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
