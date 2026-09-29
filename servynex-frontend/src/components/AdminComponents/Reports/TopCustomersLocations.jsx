import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const formatValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Data Not Available";
  }

  return value;
};

const normalizeLocation = (item) => {
  const name =
    item?.name ||
    item?.location ||
    item?.city ||
    (item?.city || item?.state
      ? [item.city, item.state].filter(Boolean).join(", ")
      : null);

  const count = item?.count ?? item?.customers ?? item?.customerCount;

  const percentage =
    item?.percent ?? item?.percentage ?? item?.customerPercentage;

  return {
    name: name || "Data Not Available",
    count,
    percentage,
  };
};

const calculatePercentage = (count, total) => {
  const numericCount = Number(count);
  const numericTotal = Number(total);

  if (
    !Number.isFinite(numericCount) ||
    !Number.isFinite(numericTotal) ||
    numericTotal <= 0
  ) {
    return null;
  }

  return Math.round((numericCount / numericTotal) * 100);
};

const TopCustomerLocations = ({ data = [], loading = false }) => {
  const locations = Array.isArray(data) ? data.map(normalizeLocation) : [];

  const totalCustomers = locations.reduce((total, location) => {
    const count = Number(location.count);

    return Number.isFinite(count) ? total + count : total;
  }, 0);

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6
        className="fw-bold mb-3"
        style={{
          color: "#0f1724",
        }}
      >
        Top Customer Locations
      </h6>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && locations.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            minHeight: "180px",
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && locations.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {locations.map((location, index) => {
            const calculatedPercentage = calculatePercentage(
              location.count,
              totalCustomers
            );

            const percentage = location.percentage ?? calculatedPercentage;

            const validPercentage =
              typeof percentage === "number" && Number.isFinite(percentage)
                ? Math.min(Math.max(percentage, 0), 100)
                : null;

            return (
              <div key={`${location.name}-${index}`}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span
                    style={{
                      fontSize: "0.86rem",
                      color: "#0f1724",
                    }}
                  >
                    {formatValue(location.name)}
                  </span>

                  <span
                    className="fw-medium"
                    style={{
                      fontSize: "0.82rem",
                      color: "#0f1724",
                    }}
                  >
                    {formatValue(location.count)}{" "}
                    {validPercentage !== null
                      ? `(${validPercentage}%)`
                      : "(Data Not Available)"}
                  </span>
                </div>

                <div
                  className="rounded-pill"
                  style={{
                    height: "8px",
                    backgroundColor: "#eef0f2",
                  }}
                >
                  {validPercentage !== null && (
                    <div
                      className="rounded-pill"
                      style={{
                        width: `${validPercentage}%`,
                        height: "100%",
                        backgroundColor: "#0e8a5f",
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopCustomerLocations;
