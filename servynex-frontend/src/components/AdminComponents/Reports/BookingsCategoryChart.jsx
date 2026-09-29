import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CHART_HEIGHT = 220;
const MAX_BAR_HEIGHT = 170;

const getCategoryLabel = (category) => {
  if (!category) {
    return "Field Not Available";
  }

  if (
    category.categoryName === undefined ||
    category.categoryName === null ||
    category.categoryName === ""
  ) {
    return "Field Not Available";
  }

  return category.categoryName;
};

const getBookingValue = (category) => {
  if (!category || category.bookings === undefined) {
    return null;
  }

  if (category.bookings === null || category.bookings === "") {
    return null;
  }

  const value = Number(category.bookings);

  return Number.isFinite(value) ? value : null;
};

const getChartMaxValue = (categories) => {
  const values = categories
    .map(getBookingValue)
    .filter((value) => value !== null && value >= 0);

  if (values.length === 0) {
    return 1;
  }

  const highestValue = Math.max(...values);

  if (highestValue <= 10) {
    return 10;
  }

  const step = highestValue <= 100 ? 20 : 50;

  return Math.ceil(highestValue / step) * step;
};

const BookingsCategoryChart = ({ data = [], loading = false }) => {
  const categories = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  }, [data]);

  const maxValue = useMemo(() => {
    return getChartMaxValue(categories);
  }, [categories]);

  const hasData = categories.length > 0;

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Bookings by Service Category
        </h6>

        <span
          className="d-flex align-items-center gap-2"
          style={{
            fontSize: "0.8rem",
            color: "#0f1724",
          }}
        >
          <span
            className="rounded-circle"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#0e8a5f",
              display: "inline-block",
            }}
          />
          Bookings
        </span>
      </div>

      {loading && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            height: `${CHART_HEIGHT}px`,
            fontSize: "0.85rem",
          }}
        >
          Loading data...
        </div>
      )}

      {!loading && !hasData && (
        <div
          className="d-flex align-items-center justify-content-center text-secondary"
          style={{
            height: `${CHART_HEIGHT}px`,
            fontSize: "0.85rem",
          }}
        >
          Data Not Available
        </div>
      )}

      {!loading && hasData && (
        <>
          <div
            className="d-flex align-items-end justify-content-between"
            style={{
              height: `${CHART_HEIGHT}px`,
              overflowX: "auto",
              gap: "4px",
            }}
          >
            {categories.map((category, index) => {
              const bookingValue = getBookingValue(category);

              const barHeight =
                bookingValue !== null && bookingValue >= 0
                  ? (bookingValue / maxValue) * MAX_BAR_HEIGHT
                  : 0;

              return (
                <div
                  key={category._id || category.categoryName || index}
                  className="d-flex flex-column align-items-center justify-content-end h-100"
                  style={{
                    flex: "1 0 70px",
                    minWidth: "70px",
                  }}
                >
                  <span
                    className="fw-semibold mb-1 text-center"
                    style={{
                      fontSize: "0.78rem",
                      color: "#0f1724",
                    }}
                  >
                    {bookingValue === null
                      ? "Field Not Available"
                      : bookingValue}
                  </span>

                  {bookingValue !== null ? (
                    <div
                      className="rounded-top-2"
                      style={{
                        width: "60%",
                        maxWidth: "38px",
                        height: `${barHeight}px`,
                        minHeight: bookingValue === 0 ? "2px" : undefined,
                        backgroundColor: "#0e8a5f",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-top-2"
                      style={{
                        width: "60%",
                        maxWidth: "38px",
                        height: "2px",
                        backgroundColor: "#d9dee3",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="d-flex justify-content-between mt-2"
            style={{
              overflowX: "auto",
              gap: "4px",
            }}
          >
            {categories.map((category, index) => (
              <span
                key={category._id || category.categoryName || `label-${index}`}
                className="text-secondary text-center"
                style={{
                  flex: "1 0 70px",
                  minWidth: "70px",
                  fontSize: "0.7rem",
                  lineHeight: "1.2",
                }}
              >
                {getCategoryLabel(category)}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsCategoryChart;
