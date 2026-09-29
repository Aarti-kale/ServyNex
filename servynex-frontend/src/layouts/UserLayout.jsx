import { Outlet } from "react-router-dom";
import Navbar from "../components/UserComponent/Navbar";
import BubbleBackground from "../components/UserComponent/BubbleBackground";
import Footer from "../components/UserComponent/Footer";
import TalkToNexFloating from "../components/UserComponent/TalktoNex";
export default function UserLayout() {
  return (
    <>
      <BubbleBackground />
      <Navbar />
      <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
        <Outlet />
      </div>
      <Footer />
      <TalkToNexFloating />
    </>
  );
}
