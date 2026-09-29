import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import getMediaUrl from "../../../utils/getMediaUrl.jsx";

const OurStory = ({ data }) => {
  const paragraphs = Array.isArray(data?.paragraphs)
    ? data.paragraphs.filter(Boolean)
    : [];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#0f1724",
                fontSize: "1.75rem",
              }}
            >
              {data?.title || ""}
            </h2>

            {paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 20)}`}
                className={
                  index === paragraphs.length - 1
                    ? "text-secondary mb-0"
                    : "text-secondary mb-3"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="col-lg-6">
            {data?.image ? (
              <div className="rounded-4 overflow-hidden">
                <img
                  src={getMediaUrl(data.image)}
                  alt={data?.title || "Our Story"}
                  className="w-100"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
