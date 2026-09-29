import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ClockFill, InfoCircleFill, SaveFill } from "react-bootstrap-icons";

const timeOptions = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

const WorkingHours = ({
  startTime: initialStartTime = "09:00 AM",
  endTime: initialEndTime = "07:00 PM",
  loading = false,
  onSave,
}) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime]);

  const handleSave = async () => {
    if (loading) return;

    if (startTime === endTime) {
      return;
    }

    if (onSave) {
      await onSave({
        startTime,
        endTime,
      });
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
            <ClockFill size={18} color="#0f1724" />

            <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              Working Hours
            </h5>
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label
                className="form-label fw-medium"
                style={{
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                Start Time
              </label>

              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-select py-2"
                disabled={loading}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label
                className="form-label fw-medium"
                style={{
                  color: "#0f1724",
                  fontSize: "0.88rem",
                }}
              >
                End Time
              </label>

              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-select py-2"
                disabled={loading}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <button
                onClick={handleSave}
                disabled={loading || startTime === endTime}
                className="btn w-100 text-white d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-semibold"
                style={{
                  backgroundColor: "#0e8a5f",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <SaveFill size={15} />

                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-3 p-3 mt-3 d-flex align-items-center gap-2"
          style={{ backgroundColor: "#eef7f3" }}
        >
          <InfoCircleFill size={16} color="#0e8a5f" className="flex-shrink-0" />

          <span
            style={{
              fontSize: "0.85rem",
              color: "#0f1724",
            }}
          >
            Your working hours and availability help customers know when you are
            active.
          </span>
        </div>
      </div>
    </section>
  );
};

export default WorkingHours;
