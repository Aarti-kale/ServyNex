import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  FlagFill,
  PeopleFill,
  BuildingFill,
  AwardFill,
  RocketTakeoffFill,
  ShieldFillCheck,
  PersonFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const iconMap = {
  flag: FlagFill,
  users: PeopleFill,
  building: BuildingFill,
  badge: AwardFill,
  rocket: RocketTakeoffFill,
  shield: ShieldFillCheck,
  user: PersonFill,
  check: CheckCircleFill,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={20} color="#0e8a5f" />;
};

const OurJourney = ({ data }) => {
  const milestones = Array.isArray(data?.milestones)
    ? [...data.milestones]
        .filter((milestone) => milestone?.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-5"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {data?.title || ""}
        </h2>

        <div className="row position-relative">
          <div
            className="d-none d-md-block position-absolute"
            style={{
              top: "34px",
              left: "10%",
              right: "10%",
              borderTop: "2px dashed #cfe8dc",
              zIndex: 0,
            }}
          />

          {milestones.map((milestone, index) => (
            <div
              className="col-6 col-md"
              key={milestone._id || `${milestone.year}-${index}`}
              style={{ zIndex: 1 }}
            >
              <div className="d-flex flex-column align-items-center mb-4 mb-md-0">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3 bg-white"
                  style={{
                    width: "68px",
                    height: "68px",
                    border: "1px solid #eef0f2",
                  }}
                >
                  {getIcon(milestone.icon)}
                </div>

                <h5
                  className="fw-bold mb-1"
                  style={{
                    color: "#0e8a5f",
                  }}
                >
                  {milestone.year ?? ""}
                </h5>

                <p
                  className="text-secondary mb-0"
                  style={{
                    fontSize: "0.82rem",
                    maxWidth: "140px",
                  }}
                >
                  {milestone.title || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
