import React from "react";

const WelcomeProfile = ({ profile = null }) => {
  return (
    <section className="py-4">
      <div className="container">
        <h1
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "1.9rem",
          }}
        >
          Welcome back, {profile?.name || "User"}! 👋
        </h1>

        <p className="text-secondary mb-0">
          Manage your bookings, profile and account settings.
        </p>
      </div>
    </section>
  );
};

export default WelcomeProfile;
