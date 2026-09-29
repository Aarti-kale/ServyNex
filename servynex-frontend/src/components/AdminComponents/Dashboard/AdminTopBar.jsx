import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { List, Search, BellFill } from "react-bootstrap-icons"; // npm i react-bootstrap-icons

const AdminTopBar = ({
  adminName = "Admin",
  adminRole = "Me",
  adminAvatar = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
  notificationCount = 1,
  onMenuClick,
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/admin-login", { replace: true });
  };
  return (
    <header className="d-flex align-items-center justify-content-between bg-white px-4 py-3 border-bottom">
      <div className="d-flex align-items-center gap-3 flex-grow-1">
        <button
          onClick={onMenuClick}
          className="btn p-1 d-lg-none"
          style={{ color: "#0f1724" }}
        >
          <List size={22} />
        </button>

        <div
          className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
          style={{
            backgroundColor: "#f3f4f6",
            maxWidth: "320px",
            width: "100%",
          }}
        >
          <Search size={16} className="text-secondary flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch && onSearch(e.target.value);
            }}
            placeholder="Search here..."
            className="form-control border-0 shadow-none bg-transparent px-0 py-1"
            style={{ fontSize: "0.9rem" }}
          />
        </div>
      </div>

      <div className="d-flex align-items-center gap-4 flex-shrink-0">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-2"
            onClick={() => navigate("/admin-profile")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={adminAvatar}
              alt={adminName}
              className="rounded-circle"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "cover",
              }}
            />

            <div className="d-none d-md-block">
              <div
                className="fw-semibold"
                style={{
                  color: "#0f1724",
                  fontSize: "0.9rem",
                  lineHeight: 1.2,
                }}
              >
                {adminName}
              </div>

              <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
                {adminRole}
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
