import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Mic, Robot } from "react-bootstrap-icons";

import {
  useConversationControls,
  useConversationStatus,
} from "@elevenlabs/react";

const TalkToNexFloating = () => {

  const { startSession, endSession } = useConversationControls();

  const { status } = useConversationStatus();

  const handleClick = async () => {
    if (status === "connected") {
      endSession();
      return;
    }

    await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    await startSession({

      onConnect: () => {
        console.log("Connected");
      },

      onDisconnect: () => {
        console.log("Disconnected");
      },

      onError: (err) => {
        console.error(err);
      },
    });
  };

  return (
    <div
      className="position-fixed"
      style={{
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}
    >
      <button
        onClick={handleClick}
        className="btn rounded-pill shadow-lg d-flex align-items-center gap-3 text-white"
        style={{
          background: "#0e8a5f",
          border: "none",
          padding: "10px 20px",
        }}
      >
        <span
          className="bg-white rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 36,
            height: 36,
          }}
        >
          <Robot color="#0e8a5f" size={18} />
        </span>

        <div className="text-start">
          <div className="fw-bold">
            {status === "connected"
              ? "Listening..."
              : "Talk to Nex"}
          </div>

          <small>
            {status === "connected"
              ? "Tap to End"
              : "AI Assistant"}
          </small>
        </div>

        <Mic size={16} />
      </button>
    </div>
  );
};

export default TalkToNexFloating;
