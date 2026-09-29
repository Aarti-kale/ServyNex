import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  TelephoneFill,
  EnvelopeFill,
  GeoAltFill,
  ClockFill,
} from "react-bootstrap-icons";

const renderIcon = (icon) => {
  const iconProps = {
    size: 20,
    color: "#0e8a5f",
  };

  switch (icon) {
    case "phone":
      return <TelephoneFill {...iconProps} />;

    case "email":
      return <EnvelopeFill {...iconProps} />;

    case "location":
      return <GeoAltFill {...iconProps} />;

    case "clock":
      return <ClockFill {...iconProps} />;

    default:
      return <TelephoneFill {...iconProps} />;
  }
};
const Contactinfo = ({ data = [] }) => {
  const contactCards = Array.isArray(data) ? data : [];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-3">
          {contactCards.map((item) => (
            <div className="col-6 col-md-3" key={item._id || item.key}>
              <div
                className="rounded-3 p-3 h-100 d-flex align-items-start gap-3 bg-white"
                style={{
                  border: "1px solid #eef0f2",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  {renderIcon(item.icon)}
                </div>

                <div>
                  <h6
                    className="fw-semibold mb-1"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.title}
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.78rem",
                    }}
                  >
                    {item.value}
                  </p>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.78rem",
                    }}
                  >
                    {item.secondaryValue}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {contactCards.length === 0 && (
            <div className="col-12 text-center text-secondary">
              Contact information is currently unavailable.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contactinfo;
