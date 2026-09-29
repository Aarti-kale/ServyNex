import { Outlet } from "react-router-dom";
import TopBar from "../components/WorkerComponents/TopBar";
import SideBar from "../components/WorkerComponents/SideBar";
export default function WorkerLayout() {
  return (
    <>
      <div
        className="d-flex"
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
        }}
      >
        <SideBar />

        <div className="flex-grow-1 d-flex flex-column">
          <TopBar />

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
