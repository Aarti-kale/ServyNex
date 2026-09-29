import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Plus, Share2, Trash2 } from "lucide-react";

function FacebookIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a20.5 20.5 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />

      <circle cx="12" cy="12" r="4" />

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-6.9L4.2 22H1l8.1-9.3L.9 2H8l5 6.3L18.9 2Zm-1.2 18h1.9L6.4 4H4.4L17.7 20Z" />
    </svg>
  );
}

function YouTubeIcon({ size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.4 3.8-6.4 3.8Z" />
    </svg>
  );
}
const PLATFORM_STYLES = {
  facebook: {
    icon: FacebookIcon,
    backgroundColor: "#1877f2",
  },

  instagram: {
    icon: InstagramIcon,
    background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
  },

  twitter: {
    icon: XIcon,
    backgroundColor: "#000000",
  },

  youtube: {
    icon: YouTubeIcon,
    backgroundColor: "#ff0000",
  },
};

function SocialLink({
  links,
  onLinkChange,
  onLinkToggle,
  onLinkRemove,
  onLinkAdd,
}) {
  const safeLinks = Array.isArray(links) ? links : [];

  return (
    <section className="border rounded-3 bg-white p-4">
      <div className="d-flex align-items-start gap-3 mb-4">
        <span
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#ecfdf5",
            color: "#0e8a5f",
          }}
        >
          <Share2 size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              color: "#0f1724",
            }}
          >
            Social Links
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Manage your social media links.
          </p>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {safeLinks.map((link, index) => {
          const platform =
            typeof link?.platform === "string" ? link.platform : "";

          const url = typeof link?.url === "string" ? link.url : "";

          const isActive = Boolean(link?.isActive);

          const platformKey = platform.trim().toLowerCase();

          const platformStyle = PLATFORM_STYLES[platformKey] || {};

          const Icon = platformStyle.icon;

          const linkId = link?._id ?? index;

          return (
            <div key={linkId} className="d-flex align-items-center gap-3">
              <span
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 text-white"
                style={{
                  width: "36px",
                  height: "36px",

                  background:
                    platformStyle.background ||
                    platformStyle.backgroundColor ||
                    "#9ca3af",
                }}
              >
                {Icon ? <Icon size={16} /> : <Share2 size={16} />}
              </span>

              <span
                className="fw-medium flex-shrink-0"
                style={{
                  width: "75px",
                  fontSize: "0.8rem",
                  color: "#374151",
                }}
              >
                {platform || "Social"}
              </span>
              <input
                type="text"
                value={url}
                onChange={(event) => onLinkChange?.(linkId, event.target.value)}
                className="form-control flex-grow-1"
                placeholder="https://..."
                style={{
                  height: "38px",
                  fontSize: "0.8rem",
                  borderColor: "#d1d5db",
                  borderRadius: "8px",
                  boxShadow: "none",
                }}
              />

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label={`Toggle ${platform || "social"} link`}
                onClick={() => onLinkToggle?.(linkId)}
                className="border-0 p-0 position-relative rounded-pill flex-shrink-0"
                style={{
                  width: "44px",
                  height: "24px",
                  backgroundColor: isActive ? "#10b981" : "#d1d5db",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <span
                  className="position-absolute rounded-circle bg-white shadow-sm"
                  style={{
                    width: "20px",
                    height: "20px",
                    top: "2px",
                    left: isActive ? "22px" : "2px",
                    transition: "left 0.2s ease",
                  }}
                />
              </button>

              <button
                type="button"
                onClick={() => onLinkRemove?.(linkId)}
                aria-label={`Remove ${platform || "social"} link`}
                className="btn d-flex align-items-center justify-content-center flex-shrink-0 p-0"
                style={{
                  width: "32px",
                  height: "32px",
                  color: "#ef4444",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#fef2f2";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        {safeLinks.length === 0 && (
          <div
            className="border border-dashed rounded-3 text-center py-4"
            style={{
              borderColor: "#d1d5db",
              backgroundColor: "#f9fafb",
            }}
          >
            <Share2 size={20} className="text-secondary mb-2" />

            <p
              className="mb-0 text-secondary"
              style={{
                fontSize: "0.8rem",
              }}
            >
              No social links added yet.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onLinkAdd?.()}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-4"
        style={{
          minHeight: "40px",
          border: "1px dashed #6ee7b7",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#0e8a5f",
          fontSize: "0.8rem",
          fontWeight: 500,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = "#ecfdf5";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = "#ffffff";
        }}
      >
        <Plus size={16} />
        Add Social Link
      </button>
    </section>
  );
}

export default SocialLink;
