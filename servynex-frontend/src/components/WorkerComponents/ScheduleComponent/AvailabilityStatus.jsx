import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PersonFill,
  CheckCircleFill,
  DashCircleFill,
} from "react-bootstrap-icons";

const AvailabilityStatus = ({
  availability = "offline",
  loading = false,
  onAvailabilityChange,
}) => {
  const [status, setStatus] = useState(availability);

  useEffect(() => {
    if (availability) {
      setStatus(availability);
    }
  }, [availability]);

  const handleSelect = async (value) => {
    if (loading || value === status) return;

    setStatus(value);

    if (onAvailabilityChange) {
      await onAvailabilityChange(value);
    }
  };

  return (
    <section className="pb-2">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex align-items-center gap-2 mb-3">
            <PersonFill size={18} color="#0f1724" />

            <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              Availability Status
            </h5>
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-6">
                  <div
                    onClick={() => handleSelect("available")}
                    className="rounded-3 p-3 d-flex align-items-center gap-3"
                    style={{
                      border:
                        status === "available"
                          ? "1.5px solid #0e8a5f"
                          : "1px solid #e2e8e5",
                      backgroundColor:
                        status === "available" ? "#eef7f3" : "#ffffff",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <CheckCircleFill size={22} color="#0e8a5f" />

                    <div>
                      <h6
                        className="fw-semibold mb-0"
                        style={{ color: "#0f1724" }}
                      >
                        Available
                      </h6>

                      <p
                        className="text-secondary mb-0"
                        style={{ fontSize: "0.78rem" }}
                      >
                        You are visible for new jobs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div
                    onClick={() => handleSelect("offline")}
                    className="rounded-3 p-3 d-flex align-items-center gap-3"
                    style={{
                      border:
                        status === "offline"
                          ? "1.5px solid #dc3545"
                          : "1px solid #e2e8e5",
                      backgroundColor:
                        status === "offline" ? "#fdecec" : "#ffffff",
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <DashCircleFill size={22} color="#dc3545" />

                    <div>
                      <h6
                        className="fw-semibold mb-0"
                        style={{ color: "#0f1724" }}
                      >
                        Offline
                      </h6>

                      <p
                        className="text-secondary mb-0"
                        style={{ fontSize: "0.78rem" }}
                      >
                        You are not visible for new jobs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 text-center d-none d-md-block">
              <img
                src="https://via.placeholder.com/140x120?text=Calendar"
                alt="Availability illustration"
                style={{
                  maxHeight: "110px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityStatus;
