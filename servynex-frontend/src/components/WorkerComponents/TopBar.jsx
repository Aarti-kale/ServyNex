import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { List, ChevronDown } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";

const TopBar = ({ user, onMenuClick, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userName = user?.name || "User";

  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Worker";

  const userInitial = userName.charAt(0).toUpperCase();

  const handleDropdownToggle = () => {
    setDropdownOpen((previous) => !previous);
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (onLogout) {
      onLogout();
    }

    navigate("/", { replace: true });
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#eef0f2",
      }}
    >
      <div className="d-flex align-items-center gap-3 flex-grow-1">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn p-1 d-lg-none"
          style={{
            color: "#0f1724",
          }}
        >
          <List size={22} />
        </button>
      </div>

      <div className="d-flex align-items-center flex-shrink-0">
        <div
          onClick={handleDropdownToggle}
          className="d-flex align-items-center gap-2 position-relative"
          style={{
            cursor: "pointer",
          }}
        >
          {user?.avatar || user?.profileImage ? (
            <img
              src={user.avatar || user.profileImage}
              alt={userName}
              className="rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#0e8a5f",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              {userInitial}
            </div>
          )}

          <div className="d-none d-md-block">
            <div
              className="fw-semibold"
              style={{
                color: "#0f1724",
                fontSize: "0.9rem",
                lineHeight: 1.2,
              }}
            >
              {userName}
            </div>

            <div
              style={{
                color: "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              {userRole}
            </div>
          </div>

          <ChevronDown
            size={14}
            style={{
              color: "#9ca3af",
            }}
          />

          {dropdownOpen && (
            <div
              className="position-absolute bg-white rounded-3 shadow"
              style={{
                top: "48px",
                right: 0,
                minWidth: "180px",
                border: "1px solid #eef0f2",
                zIndex: 10,
              }}
            >
              <NavLink
                to="/profile"
                onClick={handleProfileClick}
                className="d-block px-3 py-2 text-decoration-none"
                style={{
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                My Profile
              </NavLink>

              <hr className="my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="btn border-0 w-100 text-start px-3 py-2"
                style={{
                  color: "#ff8080",
                  fontSize: "0.88rem",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
