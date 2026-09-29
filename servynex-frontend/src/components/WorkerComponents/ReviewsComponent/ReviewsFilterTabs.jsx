import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ReviewsFilterTabs = ({ activeRating = "all", summary, onChange }) => {
  const counts = summary?.ratingDistribution || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  const tabs = [
    { label: "All Reviews", value: "all", count: summary?.totalReviews || 0 },
    { label: "5 Stars", value: "5", count: counts[5] || 0 },
    { label: "4 Stars", value: "4", count: counts[4] || 0 },
    { label: "3 Stars", value: "3", count: counts[3] || 0 },
    { label: "2 Stars", value: "2", count: counts[2] || 0 },
    { label: "1 Star", value: "1", count: counts[1] || 0 },
  ];

  const handleClick = (value) => {
    onChange?.(value);
  };

  return (
    <section className="pb-3">
      <div className="container">
        <div className="d-flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeRating === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => handleClick(tab.value)}
                className="btn px-3 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor: isActive ? "#0e8a5f" : "#ffffff",
                  color: isActive ? "#ffffff" : "#0f1724",
                  border: isActive ? "none" : "1px solid #d9dee3",
                  fontSize: "0.88rem",
                }}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReviewsFilterTabs;
