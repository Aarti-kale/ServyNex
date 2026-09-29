import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  PeopleFill,
  BriefcaseFill,
  StarFill,
  EmojiSmileFill,
  AwardFill,
  ShieldFillCheck,
  PersonFill,
  CheckCircleFill,
} from "react-bootstrap-icons";

const iconMap = {
  users: PeopleFill,
  briefcase: BriefcaseFill,
  star: StarFill,
  smile: EmojiSmileFill,
  badge: AwardFill,
  shield: ShieldFillCheck,
  user: PersonFill,
  check: CheckCircleFill,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={26} color="#ffffff" />;
};

const OurImpact = ({ data }) => {
  const stats = Array.isArray(data?.stats) ? data.stats : [];

  return (
    <section className="py-5">
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

        <div
          className="rounded-4 py-5 px-3"
          style={{
            backgroundColor: "#0f3d2e",
          }}
        >
          <div className="row g-4 text-center">
            {stats.map((stat, index) => (
              <div
                className="col-6 col-md-3"
                key={stat._id || `${stat.label}-${index}`}
              >
                <div className="d-flex justify-content-center mb-2">
                  {getIcon(stat.icon)}
                </div>

                <h3 className="fw-bold text-white mb-1">
                  {stat.displayValue ?? stat.value ?? ""}
                </h3>

                <p
                  className="mb-0"
                  style={{
                    color: "#c8e6d8",
                    fontSize: "0.85rem",
                  }}
                >
                  {stat.label || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurImpact;
