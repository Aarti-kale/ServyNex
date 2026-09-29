import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ShieldFillCheck,
  AwardFill,
  ClipboardCheckFill,
  PersonFill,
} from "react-bootstrap-icons";

const iconMap = {
  shield: ShieldFillCheck,
  badge: AwardFill,
  scale: ClipboardCheckFill,
  user: PersonFill,
};

const CoreValues = ({ data }) => {
  const values = Array.isArray(data?.values)
    ? [...data.values]
        .filter((value) => value?.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];

    if (!IconComponent) {
      return null;
    }

    return <IconComponent size={22} color="#0e8a5f" />;
  };

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2
          className="fw-bold mb-4"
          style={{
            color: "#0f1724",
            fontSize: "1.6rem",
          }}
        >
          {data?.title || ""}
        </h2>

        <div className="row g-3">
          {values.map((value) => (
            <div
              className="col-6 col-lg-3"
              key={value._id || value.key || value.title}
            >
              <div
                className="rounded-4 p-4 h-100 text-start bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {getIcon(value.icon)}
                </div>

                <h6
                  className="fw-semibold mb-2"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  {value.title || ""}
                </h6>

                <p
                  className="text-secondary mb-0"
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  {value.description || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
