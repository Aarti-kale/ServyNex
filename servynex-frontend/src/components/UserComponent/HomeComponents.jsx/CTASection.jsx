import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowRight } from "react-bootstrap-icons";

import getMediaUrl from "../../../utils/getMediaUrl";

const CTASection = ({ data }) => {
  const imageSrc = getMediaUrl(data?.image);

  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 p-4 p-md-5 d-flex flex-wrap align-items-center justify-content-between gap-4"
          style={{ backgroundColor: "#0e8a5f" }}
        >
          <div className="d-flex align-items-center gap-3">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={data?.title || "ServyNex professional"}
                style={{
                  height: "90px",
                  objectFit: "contain",
                }}
                className="d-none d-sm-block"
              />
            ) : null}

            <div>
              <h3
                className="fw-bold text-white mb-2"
                style={{ fontSize: "1.4rem" }}
              >
                {data?.title || ""}
              </h3>

              <p
                className="mb-0"
                style={{
                  color: "#d7f0e3",
                  fontSize: "0.9rem",
                }}
              >
                {data?.description || ""}
              </p>
            </div>
          </div>

          <a
            href={data?.buttonLink || "#"}
            className="btn bg-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium flex-shrink-0"
            style={{ color: "#0e8a5f" }}
          >
            {data?.buttonText || ""}
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
