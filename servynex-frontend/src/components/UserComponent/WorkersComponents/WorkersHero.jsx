import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PeopleFill,
  ArrowRight,
  PlayCircleFill,
  BriefcaseFill,
  StarFill,
} from "react-bootstrap-icons";

const DEFAULT_HERO = {
  badge: "OUR PROFESSIONALS",
  title: "Meet Our Trusted",
  highlightedTitle: "Professionals",
  description:
    "500+ verified experts delivering quality home services with professionalism and care.",
  primaryButton: {
    text: "Explore Services",
    link: "/services",
  },
  secondaryButton: {
    text: "See How It Works",
    link: "#hiring-process",
  },
  image: "",
};

const normalizeHero = (data = {}) => ({
  badge: data.badge || DEFAULT_HERO.badge,

  title: data.title || DEFAULT_HERO.title,

  highlightedTitle: data.highlightedTitle || DEFAULT_HERO.highlightedTitle,

  description: data.description || DEFAULT_HERO.description,

  primaryButton: {
    text: data.primaryButton?.text || DEFAULT_HERO.primaryButton.text,

    link: data.primaryButton?.link || DEFAULT_HERO.primaryButton.link,
  },

  secondaryButton: {
    text: data.secondaryButton?.text || DEFAULT_HERO.secondaryButton.text,

    link: data.secondaryButton?.link || DEFAULT_HERO.secondaryButton.link,
  },

  image: data.image || DEFAULT_HERO.image,
});

const getMediaUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  const fullUrl = `${backendUrl}${cleanPath}`;

  return fullUrl;
};

const formatStatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN").format(number);
};

const WorkersHero = ({ data = {}, statistics = {} }) => {
  const hero = normalizeHero(data);

  const heroImageUrl = getMediaUrl(hero.image);

  const verifiedProfessionals = formatStatNumber(
    statistics?.verifiedProfessionals
  );

  const jobsCompleted = formatStatNumber(statistics?.jobsCompleted);

  const averageRating = Number(statistics?.averageRating ?? 0).toFixed(1);

  const stats = [
    {
      icon: <PeopleFill size={16} color="#6b7280" />,
      value: `${verifiedProfessionals}+`,
      label: "Verified Experts",
    },

    {
      icon: <BriefcaseFill size={16} color="#6b7280" />,
      value: `${jobsCompleted}+`,
      label: "Jobs Completed",
    },

    {
      icon: <StarFill size={16} color="#f5b301" />,
      value: averageRating,
      label: "Average Rating",
    },
  ];

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: "#eef7f3",
      }}
    >
      <div className="container py-3">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3 fw-medium"
              style={{
                backgroundColor: "#ffffff",
                color: "#0e8a5f",
                fontSize: "0.75rem",
              }}
            >
              <PeopleFill size={12} />

              {hero.badge}
            </span>

            <h1
              className="fw-bold mb-3"
              style={{
                color: "#0f1724",
                fontSize: "2.75rem",
                lineHeight: 1.15,
              }}
            >
              {hero.title}

              {hero.highlightedTitle && (
                <>
                  <br />

                  <span
                    style={{
                      color: "#0e8a5f",
                    }}
                  >
                    {hero.highlightedTitle}
                  </span>
                </>
              )}
            </h1>

            <p
              className="text-secondary mb-4"
              style={{
                maxWidth: "460px",
              }}
            >
              {hero.description}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
              <a
                href={hero.primaryButton.link}
                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium text-decoration-none"
                style={{
                  backgroundColor: "#0e8a5f",
                }}
              >
                {hero.primaryButton.text}

                <ArrowRight size={18} />
              </a>

              <a
                href={hero.secondaryButton.link}
                className="d-flex align-items-center gap-2 fw-medium text-decoration-none"
                style={{
                  color: "#0f1724",
                }}
              >
                <PlayCircleFill size={28} color="#0e8a5f" />

                {hero.secondaryButton.text}
              </a>
            </div>

            <div className="d-flex flex-wrap gap-4">
              {stats.map((stat) => (
                <div
                  className="d-flex align-items-center gap-2"
                  key={stat.label}
                >
                  {stat.icon}

                  <div>
                    <div
                      className="fw-bold"
                      style={{
                        color: "#0f1724",
                        fontSize: "1rem",
                      }}
                    >
                      {stat.value}
                    </div>

                    <div
                      className="text-secondary"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            {heroImageUrl ? (
              <div
                className="rounded-4 overflow-hidden"
                style={{
                  backgroundColor: "#dceee7",
                }}
              >
                <img
                  src={heroImageUrl}
                  alt="ServyNex professionals team"
                  className="w-100 d-block"
                  loading="eager"
                  style={{
                    objectFit: "cover",
                    aspectRatio: "1.35 / 1",
                  }}
                  onLoad={() => {}}
                  onError={(event) => {
                    console.error(
                      "================================================"
                    );

                    console.error("[WorkersHero] IMAGE LOAD FAILED");

                    console.error("[WorkersHero] Raw image:", hero.image);

                    console.error(
                      "[WorkersHero] Final image URL:",
                      heroImageUrl
                    );

                    console.error(
                      "[WorkersHero] Image element:",
                      event.currentTarget
                    );

                    console.error(
                      "================================================"
                    );
                  }}
                />
              </div>
            ) : (
              <div
                className="rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  minHeight: "360px",
                  backgroundColor: "#dceee7",
                  color: "#0e8a5f",
                }}
              >
                <div className="text-center px-4">
                  <PeopleFill size={48} />

                  <p className="mb-0 mt-2 fw-medium">Professionals Team</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkersHero;
