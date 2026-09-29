import { createRoot } from "react-dom/client";
import ReactDom from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./app/App.jsx";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ConversationProvider } from "@elevenlabs/react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ConversationProvider agentId={import.meta.env.VITE_ELEVENLABS_AGENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConversationProvider>
  </BrowserRouter>
);
