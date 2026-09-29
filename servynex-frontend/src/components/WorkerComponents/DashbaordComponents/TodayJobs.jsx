import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PersonFill,
  GeoAltFill,
  TelephoneFill,
  CalendarEventFill,
  ArrowRight,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import API from "../../../api/api";

const TodayJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/workers/today-jobs");

        const todayJobs = response?.data?.data?.jobs;

        setJobs(Array.isArray(todayJobs) ? todayJobs : []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load today's jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTodayJobs();
  }, []);

  const formatTime = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div
        className="rounded-4 p-4 bg-white h-100"
        style={{ border: "1px solid #eef0f2" }}
      >
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Today's Jobs
        </h5>

        <div className="text-secondary mt-4">Loading today's jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-4 p-4 bg-white h-100"
        style={{ border: "1px solid #eef0f2" }}
      >
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Today's Jobs
        </h5>

        <div className="alert alert-danger mt-3 mb-0">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="rounded-4 p-4 bg-white h-100 d-flex flex-column"
      style={{ border: "1px solid #eef0f2" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
          Today's Jobs
        </h5>

        <Link
          to="/jobs"
          className="d-flex align-items-center gap-1 fw-medium text-decoration-none"
          style={{
            color: "#0e8a5f",
            fontSize: "0.85rem",
          }}
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center text-secondary">
            <CalendarEventFill size={28} className="mb-2" />

            <p className="mb-0">No jobs scheduled for today.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-grow-1">
            {jobs.map((job, i) => {
              const customerName = job?.user?.name || "Customer";

              const customerPhone = job?.user?.phone || "";

              const serviceName = job?.service?.name || "Service";

              const address = job?.address || "Address not available";

              const formattedTime = formatTime(job?.date);

              const [time, period] = formattedTime.split(" ");

              return (
                <div key={job?._id || i}>
                  <div className="d-flex align-items-start gap-3 py-3">
                    <div
                      className="rounded-3 text-center flex-shrink-0 px-2 py-2"
                      style={{
                        backgroundColor: "#e6f4ee",
                        minWidth: "64px",
                      }}
                    >
                      <span
                        className="fw-bold d-block"
                        style={{
                          color: "#0e8a5f",
                          fontSize: "0.85rem",
                        }}
                      >
                        {time || "--"}
                      </span>

                      <span
                        className="d-block"
                        style={{
                          color: "#0e8a5f",
                          fontSize: "0.7rem",
                        }}
                      >
                        {period || ""}
                      </span>
                    </div>

                    <div className="flex-grow-1">
                      <h6
                        className="fw-semibold mb-1"
                        style={{
                          color: "#0f1724",
                          fontSize: "0.92rem",
                        }}
                      >
                        {serviceName}
                      </h6>

                      <div
                        className="d-flex align-items-center gap-1 text-secondary mb-1"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <PersonFill size={11} />
                        {customerName}
                      </div>

                      <div
                        className="d-flex align-items-center gap-1 text-secondary"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <GeoAltFill size={11} />
                        {address}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      {job?.status === "accepted" ? (
                        <button
                          className="btn btn-sm text-white rounded-3 fw-medium px-3"
                          style={{
                            backgroundColor: "#0e8a5f",
                            fontSize: "0.78rem",
                          }}
                        >
                          Start Job
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm rounded-3 fw-medium px-3"
                          style={{
                            border: "1.5px solid #0e8a5f",
                            color: "#0e8a5f",
                            fontSize: "0.78rem",
                          }}
                        >
                          View Details
                        </button>
                      )}

                      {customerPhone ? (
                        <a
                          href={`tel:${customerPhone}`}
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          style={{
                            border: "1.5px solid #d9dee3",
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <TelephoneFill size={13} color="#0e8a5f" />
                        </a>
                      ) : (
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          disabled
                          style={{
                            border: "1.5px solid #d9dee3",
                            width: "34px",
                            height: "34px",
                          }}
                        >
                          <TelephoneFill size={13} color="#9ca3af" />
                        </button>
                      )}
                    </div>
                  </div>

                  {i !== jobs.length - 1 && <hr className="m-0" />}
                </div>
              );
            })}
          </div>

          <div
            className="d-flex align-items-center gap-2 text-secondary pt-3"
            style={{ fontSize: "0.82rem" }}
          >
            <CalendarEventFill size={13} />
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} scheduled for
            today
          </div>
        </>
      )}
    </div>
  );
};

export default TodayJobs;
