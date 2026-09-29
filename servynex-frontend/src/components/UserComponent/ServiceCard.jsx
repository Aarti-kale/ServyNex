export default function ServiceCard({ service }) {
  return (
    <div
      className="h-100"
      style={{
        cursor: "pointer",
        transition: "0.35s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(15,118,110,.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="h-100"
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "22px",
          padding: "32px",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center mb-4"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "#ecfdf5",
            color: "var(--primary)",
            fontSize: "32px",
          }}
        >
          <i className={service.icon}></i>
        </div>

        <h4
          className="fw-bold mb-3"
          style={{
            color: "var(--text)",
          }}
        >
          {service.name}
        </h4>

        <p
          style={{
            color: "var(--subtext)",
            lineHeight: "1.8",
            minHeight: "55px",
          }}
        >
          {service.description}
        </p>

        <div className="mt-4">
          <div className="d-flex align-items-center mb-2">
            <i
              className="bi bi-patch-check-fill me-2"
              style={{ color: "var(--primary)" }}
            ></i>

            <small>Verified Professionals</small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <i
              className="bi bi-clock-fill me-2"
              style={{ color: "var(--primary)" }}
            ></i>

            <small>Quick Response</small>
          </div>

          <div className="d-flex align-items-center">
            <i
              className="bi bi-star-fill me-2"
              style={{ color: "#f59e0b" }}
            ></i>

            <small>Top Rated Service</small>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-5">
          <span
            style={{
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            Explore
          </span>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#ecfdf5",
              color: "var(--primary)",
            }}
          >
            <i className="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
