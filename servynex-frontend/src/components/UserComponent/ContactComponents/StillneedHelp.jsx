import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowRepeat } from "react-bootstrap-icons";
import getMediaUrl from "../../../utils/getMediaUrl";
const StillNeedHelp = ({ data = {} }) => {
  const {
    title = "Still Need Help?",
    description = "",
    buttonText = "Contact Support",
    buttonLink = "#contact-form",
    image = "",
  } = data;
  const supportImage = getMediaUrl(image);

  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 p-4 p-md-5 d-flex flex-wrap align-items-center justify-content-between gap-4"
          style={{
            backgroundColor: "#0e8a5f",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            {supportImage && (
              <img
                src={supportImage}
                alt="ServyNex support agent"
                style={{
                  height: "90px",
                  objectFit: "contain",
                }}
                className="d-none d-sm-block"
              />
            )}

            <div>
              <h3
                className="fw-bold text-white mb-2"
                style={{
                  fontSize: "1.4rem",
                }}
              >
                {title}
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "#d7f0e3",
                  fontSize: "0.9rem",
                  maxWidth: "420px",
                }}
              >
                {description}
              </p>
            </div>
          </div>

          <a
            href={buttonLink}
            className="btn bg-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium flex-shrink-0"
            style={{
              color: "#0e8a5f",
            }}
          >
            {buttonText}
            <ArrowRepeat />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StillNeedHelp;
