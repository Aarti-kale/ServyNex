import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  EyeFill,
  Bullseye,
  ShieldFillCheck,
  PersonFill,
  PeopleFill,
  AwardFill,
  ClipboardCheckFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const iconMap = {
  target: Bullseye,
  eye: EyeFill,
  shield: ShieldFillCheck,
  user: PersonFill,
  users: PeopleFill,
  badge: AwardFill,
  scale: ClipboardCheckFill,
  check: CheckCircleFill,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={24} color="#0e8a5f" />;
};

const MissionVision = ({ data }) => {
  const mission = data?.mission;
  const vision = data?.vision;

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container">
        <h2
          className="fw-bold text-center mb-4"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {data?.title || ""}
        </h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div
              className="rounded-4 p-4 h-100 bg-white d-flex align-items-start gap-3"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#e6f4ee",
                }}
              >
                {getIcon(mission?.icon)}
              </div>

              <div>
                <h5
                  className="fw-semibold mb-2"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {mission?.title || ""}
                </h5>

                <p className="text-secondary mb-0">
                  {mission?.description || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="rounded-4 p-4 h-100 bg-white d-flex align-items-start gap-3"
              style={{
                border: "1px solid #eef0f2",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#e6f4ee",
                }}
              >
                {getIcon(vision?.icon)}
              </div>

              <div>
                <h5
                  className="fw-semibold mb-2"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {vision?.title || ""}
                </h5>

                <p className="text-secondary mb-0">
                  {vision?.description || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
