import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowRight } from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const BecomeProfessional = ({ data = {} }) => {
  const title = data.title || "Want to become a ServyNex Professional?";

  const description =
    data.description ||
    "Join our growing network of trusted professionals and grow your business with us.";

  const buttonText = data.buttonText || "Register as a Professional";

  const registrationRoute = data.registrationRoute || "/register?role=worker";

  const defaultImage =
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600";

  const imageUrl = data.image ? getMediaUrl(data.image) : defaultImage;

  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 overflow-hidden"
          style={{
            backgroundColor: "#eef7f3",
          }}
        >
          <div className="row g-0 align-items-center">
            <div className="col-lg-7 p-4 p-lg-5">
              <h2
                className="fw-bold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "1.75rem",
                }}
              >
                {title}
              </h2>

              <p
                className="text-secondary mb-4"
                style={{
                  maxWidth: "460px",
                }}
              >
                {description}
              </p>

              <a
                href={registrationRoute}
                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium text-decoration-none"
                style={{
                  backgroundColor: "#0e8a5f",
                  width: "fit-content",
                }}
              >
                {buttonText}

                <ArrowRight />
              </a>
            </div>

            <div className="col-lg-5 text-center p-4 p-lg-0">
              <img
                src={imageUrl}
                alt={title}
                className="img-fluid"
                style={{
                  maxHeight: "320px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeProfessional;
