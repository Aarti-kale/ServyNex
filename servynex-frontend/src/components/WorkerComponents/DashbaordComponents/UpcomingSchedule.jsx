import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CalendarEventFill, ArrowRight } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import API from "../../../api/api";

const UpcomingSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUpcomingSchedule = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/workers/upcoming-schedule");

        const upcomingSchedule = response?.data?.data;

        setSchedule(Array.isArray(upcomingSchedule) ? upcomingSchedule : []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load upcoming schedule"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingSchedule();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return {
        day: "--",
        month: "---",
      };
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return {
        day: "--",
        month: "---",
      };
    }

    return {
      day: d.getDate(),
      month: d
        .toLocaleString("en-US", {
          month: "short",
        })
        .toUpperCase(),
    };
  };

  const formatTime = (date) => {
    if (!date) return "--";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "--";
    }

    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="rounded-4 p-4 bg-white h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Upcoming Schedule
        </h5>

        <Link
          to="/schedule"
          className="d-flex align-items-center gap-1 fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.85rem",
          }}
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      {loading && (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <span className="text-secondary">Loading schedule...</span>
        </div>
      )}

      {!loading && error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && schedule.length === 0 && (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center text-secondary">
            <CalendarEventFill size={28} className="mb-2" />

            <p className="mb-0">No upcoming jobs scheduled.</p>
          </div>
        </div>
      )}

      {!loading && !error && schedule.length > 0 && (
        <div className="flex-grow-1">
          {schedule.map((item, i) => {
            const date = formatDate(item?.date);

            return (
              <div key={item?._id || i}>
                <div className="d-flex align-items-start gap-3 py-3">
                  <div
                    className="rounded-3 text-center flex-shrink-0 px-2 py-2"
                    style={{
                      backgroundColor: "#f3f4f6",
                      minWidth: "56px",
                    }}
                  >
                    <span
                      className="fw-bold d-block"
                      style={{
                        color: "#0f1724",
                        fontSize: "1.1rem",
                      }}
                    >
                      {date.day}
                    </span>

                    <span
                      className="d-block text-secondary"
                      style={{ fontSize: "0.68rem" }}
                    >
                      {date.month}
                    </span>
                  </div>

                  <div className="flex-grow-1">
                    <p
                      className="text-secondary mb-1"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {formatTime(item?.date)}
                    </p>

                    <h6
                      className="fw-semibold mb-1"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.92rem",
                      }}
                    >
                      {item?.title || "Service"}
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {item?.location || "Address not available"}
                    </p>
                  </div>

                  <span
                    className="badge rounded-pill fw-medium flex-shrink-0"
                    style={{
                      backgroundColor:
                        item?.status === "Upcoming" ? "#fdf1de" : "#e6f4ee",
                      color:
                        item?.status === "Upcoming" ? "#b5730a" : "#0e8a5f",
                      fontSize: "0.72rem",
                      padding: "5px 10px",
                    }}
                  >
                    {item?.status || "Pending"}
                  </span>
                </div>

                {i !== schedule.length - 1 && <hr className="m-0" />}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && (
        <div
          className="d-flex align-items-center gap-2 text-secondary pt-3"
          style={{ fontSize: "0.82rem" }}
        >
          <CalendarEventFill size={13} />
          {schedule.length} {schedule.length === 1 ? "job" : "jobs"} upcoming
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;
