export default function StepCard({ step }) {
  return (
    <div
      style={{
        height: "100%",
        transition: ".35s",
        cursor: "pointer",
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
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "40px 30px",
          border: "1px solid var(--border)",
          height: "100%",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "20px",
            right: "25px",
            fontSize: "42px",
            fontWeight: 700,
            color: "#e5e7eb",
          }}
        >
          {step.number}
        </span>

        <div
          className="d-flex justify-content-center align-items-center mb-4"
          style={{
            width: "78px",
            height: "78px",
            borderRadius: "20px",
            background: "#ecfdf5",
            color: "var(--primary)",
            fontSize: "34px",
          }}
        >
          <i className={step.icon}></i>
        </div>

        <h4 className="fw-bold mb-3" style={{ color: "var(--text)" }}>
          {step.title}
        </h4>

        <p
          style={{
            color: "var(--subtext)",
            lineHeight: "1.8",
          }}
        >
          {step.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span
            style={{
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            Learn More
          </span>

          <div
            className="d-flex justify-content-center align-items-center"
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
