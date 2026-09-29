import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HouseFill,
  PeopleFill,
  PersonBadgeFill,
  CalendarEventFill,
  GearFill,
  Grid3x3GapFill,
  StarFill,
  CreditCardFill,
  BrowserChrome,
  BarChartFill,
  BoxArrowRight,
  ChevronDown,
} from "react-bootstrap-icons";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: <HouseFill size={17} />,
  },
  {
    key: "customers",
    label: "Customers",
    path: "/admin-customers",
    icon: <PeopleFill size={17} />,
  },
  {
    key: "workers",
    label: "Workers",
    path: "/admin-workers",
    icon: <PersonBadgeFill size={17} />,
  },
  {
    key: "bookings",
    label: "Bookings",
    path: "/admin-bookings",
    icon: <CalendarEventFill size={17} />,
  },
  {
    key: "services",
    label: "Services",
    path: "/admin-services",
    icon: <GearFill size={17} />,
  },
  {
    key: "categories",
    label: "Categories",
    path: "/admin-categories",
    icon: <Grid3x3GapFill size={17} />,
  },
  {
    key: "reviews",
    label: "Reviews",
    path: "/admin-reviews",
    icon: <StarFill size={17} />,
  },
  {
    key: "payments",
    label: "Payments",
    path: "/admin-payments",
    icon: <CreditCardFill size={17} />,
  },
  {
    key: "reports",
    label: "Reports",
    path: "/admin-reports",
    icon: <BarChartFill size={17} />,
  },
];

const cmsItems = [
  {
    key: "cms-home",
    label: "Home",
    path: "/admin-cmshome",
  },
  {
    key: "cms-services",
    label: "Services",
    path: "/admin-cmsservices",
  },
  {
    key: "cms-professionals",
    label: "Professionals",
    path: "/admin-cmsprofessionals",
  },
  {
    key: "cms-about",
    label: "About",
    path: "/admin-cmsabout",
  },
  {
    key: "cms-contact",
    label: "Contact",
    path: "/admin-cmscontact",
  },
  {
    key: "cms-navigation",
    label: "Navigation",
    path: "/admin-cmsnavigation",
  },
  {
    key: "cms-footer",
    label: "Footer",
    path: "/admin-cmsfooter",
  },
];

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const isCmsRoute = location.pathname.startsWith("/admin-cms");

  const [cmsOpen, setCmsOpen] = useState(isCmsRoute);

  const toggleCms = () => {
    setCmsOpen((previous) => !previous);
  };

  return (
    <aside
      className="d-flex flex-column justify-content-between"
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#0f1724",
      }}
    >
      <div>
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

        <nav className="d-flex flex-column gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end
              className="btn d-flex align-items-center gap-3 text-start px-3 py-2 rounded-3 text-decoration-none"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#0e8a5f" : "transparent",
                color: isActive ? "#ffffff" : "#9ca3af",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.88rem",
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <div>
            <button
              type="button"
              onClick={toggleCms}
              className="btn d-flex align-items-center justify-content-between w-100 text-start px-3 py-2 rounded-3 border-0"
              style={{
                backgroundColor: isCmsRoute ? "#0e8a5f" : "transparent",
                color: isCmsRoute ? "#ffffff" : "#9ca3af",
                fontWeight: isCmsRoute ? 600 : 500,
                fontSize: "0.88rem",
              }}
            >
              <span className="d-flex align-items-center gap-3">
                <BrowserChrome size={17} />
                Website CMS
              </span>

              <ChevronDown
                size={15}
                style={{
                  transform: cmsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {cmsOpen && (
              <div className="d-flex flex-column gap-1 mt-1 ms-3">
                {cmsItems.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    end={item.key === "cms-overview"}
                    className="text-decoration-none rounded-3 px-3 py-2"
                    style={({ isActive }) => ({
                      color: isActive ? "#ffffff" : "#9ca3af",
                      backgroundColor: isActive
                        ? "rgba(14, 138, 95, 0.35)"
                        : "transparent",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.82rem",
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={onLogout}
          className="btn d-flex align-items-center gap-3 text-start px-3 py-2 rounded-3 w-100"
          style={{
            color: "#ff8080",
            fontSize: "0.88rem",
          }}
        >
          <BoxArrowRight size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
