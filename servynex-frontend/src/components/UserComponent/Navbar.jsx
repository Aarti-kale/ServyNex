import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HouseFill, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";

import { useAuth } from "../../Context/AuthContext";
import API from "../../api/api.js";

import getMediaUrl from "../../utils/getMediaUrl";
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [navbar, setNavbar] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await API.get("/site-settings");

        const settings = response?.data?.data;

        if (settings?.navbar?.isActive) {
          setNavbar(settings.navbar);
        } else {
          setNavbar(null);
        }
      } catch (error) {
        console.error("Failed to fetch Navbar settings:", error);

        setNavbar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbar();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return null;
  }

  if (!navbar) {
    return null;
  }

  const menuItems = Array.isArray(navbar.menuItems) ? navbar.menuItems : [];

  const logoSrc =
    typeof navbar.logo === "string" && navbar.logo.startsWith("blob:")
      ? navbar.logo
      : getMediaUrl(navbar.logo);

  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 border-bottom sticky-top">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4"
          to={navbar.logoLink || "/"}
        >
          {navbar.logo ? (
            <img
              src={logoSrc}
              alt={navbar.logoAlt || "ServyNex"}
              onLoad={(event) => {}}
              onError={(event) => {}}
              style={{
                maxHeight: "40px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <>
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

              <span
                style={{
                  color: "#0f1724",
                }}
              >
                ServyNex
              </span>
            </>
          )}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto gap-lg-4 text-center">
            {menuItems
              .filter((item) => item.isActive !== false)
              .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
              .map((item, index) => {
                const isActive = location.pathname === item.href;

                return (
                  <li
                    className="nav-item"
                    key={item._id || `${item.label}-${item.href}-${index}`}
                  >
                    <Link
                      className="nav-link fw-medium pb-1"
                      to={item.href}
                      style={{
                        color: isActive ? "#0e8a5f" : "#0f1724",

                        borderBottom: isActive
                          ? "2px solid #0e8a5f"
                          : "2px solid transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 justify-content-center">
            {!isAuthenticated ? (
              <>
                {navbar.loginButton?.enabled !== false && (
                  <Link
                    to={navbar.loginButton?.link || "/login"}
                    className="btn rounded-3 px-3 fw-medium"
                    style={{
                      border: "1px solid #d1d5db",
                      color: "#0f1724",
                    }}
                  >
                    {navbar.loginButton?.text || "Log In"}
                  </Link>
                )}

                {navbar.signupButton?.enabled !== false && (
                  <Link
                    to={navbar.signupButton?.link || "/signup"}
                    className="btn text-white rounded-3 px-3 fw-medium"
                    style={{
                      backgroundColor: "#0e8a5f",
                    }}
                  >
                    {navbar.signupButton?.text || "Sign Up"}
                  </Link>
                )}
              </>
            ) : (
              <>
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <PersonCircle size={22} />

                    {user?.name || "Account"}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/customer-dashboard">
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/customer-dashboard">
                        My Bookings
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger d-flex align-items-center gap-2"
                        onClick={handleLogout}
                      >
                        <BoxArrowRight />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
