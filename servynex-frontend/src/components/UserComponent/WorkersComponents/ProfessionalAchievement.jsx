import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PeopleFill,
  BriefcaseFill,
  StarFill,
  EmojiSmileFill,
} from "react-bootstrap-icons";

const ProfessionalAchievements = ({ statistics }) => {
  const achievements = [
    {
      icon: <PeopleFill size={26} color="#ffffff" />,
      value: `${statistics?.verifiedProfessionals ?? 0}+`,
      label: "Verified Professionals",
    },
    {
      icon: <BriefcaseFill size={26} color="#ffffff" />,
      value: `${statistics?.jobsCompleted ?? 0}+`,
      label: "Jobs Completed",
    },
    {
      icon: <StarFill size={26} color="#ffffff" />,
      value: `${statistics?.averageRating ?? 0}★`,
      label: "Average Rating",
    },
    {
      icon: <EmojiSmileFill size={26} color="#ffffff" />,
      value: `${statistics?.customerSatisfaction ?? 0}%`,
      label: "Customer Satisfaction",
    },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 py-5 px-3"
          style={{ backgroundColor: "#0f3d2e" }}
        >
          <div className="row g-4 text-center">
            {achievements.map((a, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="d-flex justify-content-center mb-2">
                  {a.icon}
                </div>

                <h3 className="fw-bold text-white mb-1">{a.value}</h3>

                <p
                  className="mb-0"
                  style={{
                    color: "#c8e6d8",
                    fontSize: "0.85rem",
                  }}
                >
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalAchievements;
