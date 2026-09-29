import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminComponents/Dashboard/AdminSideBar";
import AdminTopBar from "../components/AdminComponents/Dashboard/AdminTopBar";

export default function AdminLayout() {
  return (
    <>
      <div
        className="d-flex"
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
        }}
      >
        <AdminSidebar />

        <div className="flex-grow-1 d-flex flex-column">
          <AdminTopBar />

          <div
            className="flex-grow-1"
            style={{
              padding: "24px",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
