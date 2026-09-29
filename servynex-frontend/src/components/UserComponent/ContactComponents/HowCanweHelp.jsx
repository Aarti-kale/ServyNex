import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HeadsetVr,
  CreditCardFill,
  PersonFill,
  ArrowRight,
} from "react-bootstrap-icons";

const renderIcon = (icon) => {
  const iconProps = {
    size: 22,
    color: "#0e8a5f",
  };

  switch (icon) {
    case "headset":
      return <HeadsetVr {...iconProps} />;

    case "payment":
      return <CreditCardFill {...iconProps} />;

    case "user":
      return <PersonFill {...iconProps} />;

    default:
      return <HeadsetVr {...iconProps} />;
  }
};
const HowCanWeHelp = ({ data = {} }) => {
  const {
    title = "How Can We Help You?",
    description = "",
    topics = [],
  } = data;

  const activeTopics = Array.isArray(topics)
    ? topics.filter((item) => item.isActive !== false)
    : [];

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {title}
        </h2>

        <p className="text-secondary mb-4">{description}</p>

        <div className="row g-3">
          {activeTopics.map((topic) => (
            <div className="col-md-4" key={topic._id || topic.key}>
              <div
                className="rounded-4 p-4 h-100 text-start bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {renderIcon(topic.icon)}
                </div>

                <h6
                  className="fw-semibold mb-2"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {topic.title}
                </h6>

                <p
                  className="text-secondary mb-3"
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  {topic.description}
                </p>

                {topic.link && (
                  <a
                    href={topic.link}
                    className="fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
                    style={{
                      color: "#0e8a5f",
                      fontSize: "0.85rem",
                    }}
                  >
                    {topic.linkText || "Get Help"}
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}

          {activeTopics.length === 0 && (
            <div className="col-12 text-secondary">
              Help topics are currently unavailable.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowCanWeHelp;
