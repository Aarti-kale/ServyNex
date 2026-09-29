import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CheckCircleFill,
  CalendarEventFill,
  ShieldFillCheck,
  PersonBadgeFill,
  ClockFill,
  WalletFill,
  PersonFill,
  TelephoneFill,
  GeoAltFill,
  ListTask,
  HouseFill,
  Grid3x3GapFill,
  EnvelopeFill,
  HeadsetVr,
  ClipboardCheck,
} from "react-bootstrap-icons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getDayName = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
  });
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusStyle = (status) => {
  switch (status) {
    case "accepted":
      return {
        backgroundColor: "#e6f4ee",
        color: "#0e8a5f",
      };

    case "completed":
      return {
        backgroundColor: "#e6f4ee",
        color: "#0e8a5f",
      };

    case "cancelled":
      return {
        backgroundColor: "#fde8e8",
        color: "#b42318",
      };

    default:
      return {
        backgroundColor: "#fdf1de",
        color: "#b5730a",
      };
  }
};

const formatTime = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatBookingId = (id) => {
  if (!id) return "N/A";

  return `#${String(id).slice(-8).toUpperCase()}`;
};

const getWorkflowSteps = (status) => {
  const normalizedStatus = status || "pending";

  const workerAssigned =
    normalizedStatus === "accepted" || normalizedStatus === "completed";

  const serviceCompleted = normalizedStatus === "completed";

  return [
    {
      step: 1,
      title: "Booking received",
      desc: "We have received your booking.",
      icon: <CheckCircleFill size={20} color="#0e8a5f" />,
      active: true,
    },
    {
      step: 2,
      title: "Worker will be assigned",
      desc: workerAssigned
        ? "A professional has been assigned to your booking."
        : "A professional will be assigned to you soon.",
      icon: (
        <PersonBadgeFill
          size={20}
          color={workerAssigned ? "#0e8a5f" : "#9ca3af"}
        />
      ),
      active: workerAssigned,
    },
    {
      step: 3,
      title: "Worker will contact you",
      desc: workerAssigned
        ? "Your assigned professional can contact you to confirm details."
        : "The worker will call you after assignment.",
      icon: (
        <TelephoneFill
          size={20}
          color={workerAssigned ? "#0e8a5f" : "#9ca3af"}
        />
      ),
      active: workerAssigned,
    },
    {
      step: 4,
      title: "Service will be completed",
      desc: serviceCompleted
        ? "Your service has been completed."
        : "The service will be completed as per your schedule.",
      icon: (
        <ShieldFillCheck
          size={20}
          color={serviceCompleted ? "#0e8a5f" : "#9ca3af"}
        />
      ),
      active: serviceCompleted,
    },
  ];
};

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);

  const [paymentMethod, setPaymentMethod] = useState(
    location.state?.paymentMethod || "cod"
  );

  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState("");

  useEffect(() => {
    const bookingId = location.state?.bookingId || location.state?.booking?._id;

    if (!bookingId) {
      setLoading(false);
      setError("Booking information is not available.");
      return;
    }

    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login to view your booking.");
        }

        const response = await fetch(`${API_URL}/bookings/my/${bookingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch booking details.");
        }

        setBooking(data.data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [location.state]);

  const customer = useMemo(() => {
    return booking?.user && typeof booking.user === "object"
      ? booking.user
      : {};
  }, [booking]);

  const service = useMemo(() => {
    return booking?.service && typeof booking.service === "object"
      ? booking.service
      : {};
  }, [booking]);

  const nextSteps = useMemo(() => {
    return getWorkflowSteps(booking?.status);
  }, [booking?.status]);

  const handleHome = () => {
    navigate("/");
  };

  const handleBrowseServices = () => {
    navigate("/services");
  };

  const handleCopyBookingId = async () => {
    if (!booking?._id) return;

    try {
      await navigator.clipboard.writeText(booking._id);
    } catch (copyError) {
      console.error("Unable to copy booking ID:", copyError);
    }
  };

  if (loading) {
    return (
      <div
        className="py-5 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#fbfdfd",
          minHeight: "70vh",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{ color: "#0e8a5f" }}
            role="status"
          />
          <p className="text-secondary mb-0">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div
        className="py-5"
        style={{
          backgroundColor: "#fbfdfd",
          minHeight: "70vh",
        }}
      >
        <div className="container" style={{ maxWidth: "700px" }}>
          <div
            className="rounded-4 p-5 bg-white text-center"
            style={{ border: "1px solid #eef0f2" }}
          >
            <h4 className="fw-bold mb-2" style={{ color: "#0f1724" }}>
              Booking details unavailable
            </h4>

            <p className="text-secondary mb-4">
              {error || "We could not find this booking."}
            </p>

            <button
              onClick={handleHome}
              className="btn text-white px-4 py-2 rounded-3 fw-medium"
              style={{ backgroundColor: "#0e8a5f" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bookingStatus = booking.status || "pending";
  const statusStyle = getStatusStyle(bookingStatus);

  const bookingDate = formatDate(booking.date);
  const bookingDay = getDayName(booking.date);
  const bookingTime = formatTime(booking.date);

  const serviceName = service.name || service.title || "Selected Service";

  const customerName = customer.name || "Customer";

  const customerPhone = customer.phone || customer.mobile || "Not available";

  const address = booking.address || "Address not available";

  const price = service.price ?? service.startingPrice ?? booking.amount ?? 0;

  return (
    <div className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container" style={{ maxWidth: "950px" }}>
        <div className="text-center mb-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: "110px",
              height: "110px",
              backgroundColor: "#e6f4ee",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#0e8a5f",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              color: "#0e8a5f",
              fontSize: "2rem",
            }}
          >
            Booking Confirmed!
          </h1>

          <p className="text-secondary mb-0">
            Your booking has been successfully placed.
            <br />A professional will be assigned soon.
          </p>
        </div>

        <div
          className="rounded-4 p-4 mb-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <CalendarEventFill size={20} color="#0e8a5f" />

              <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
                Booking Details
              </h5>
            </div>

            <button
              type="button"
              onClick={handleCopyBookingId}
              className="border-0 d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                backgroundColor: "#e6f4ee",
                fontSize: "0.85rem",
              }}
            >
              <span className="text-secondary">Booking ID</span>

              <span className="fw-bold" style={{ color: "#0e8a5f" }}>
                {formatBookingId(booking._id)}
              </span>

              <ClipboardCheck size={14} color="#0e8a5f" />
            </button>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <PersonBadgeFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Service
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {serviceName}
              </p>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldFillCheck size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Package
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {service.packageName || "Standard"}
              </p>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CalendarEventFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Date
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {bookingDate}
              </p>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ClockFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Time
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {bookingTime}
              </p>
            </div>
          </div>

          <hr />

          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <WalletFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Payment Method
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {paymentMethod === "online"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </p>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ClockFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Status
                </span>
              </div>

              <span
                className="fw-semibold px-2 py-1 rounded-2 d-inline-block"
                style={{
                  backgroundColor: statusStyle.backgroundColor,
                  color: statusStyle.color,
                  fontSize: "0.8rem",
                }}
              >
                {formatStatus(bookingStatus)}
              </span>
            </div>

            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <WalletFill size={18} color="#0e8a5f" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Service Price
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                ₹{Number(price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-4 p-4 mb-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex align-items-center gap-2 mb-4">
            <PersonFill size={20} color="#0e8a5f" />

            <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              Customer Details
            </h5>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <PersonFill size={16} color="#6b7280" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Name
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {customerName}
              </p>
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <TelephoneFill size={16} color="#6b7280" />

                <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                  Phone
                </span>
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                {customerPhone}
              </p>
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-start gap-2 mb-2">
                <GeoAltFill size={16} color="#6b7280" className="mt-1" />

                <div>
                  <span
                    className="text-secondary d-block"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Address
                  </span>

                  <p className="fw-semibold mb-0" style={{ color: "#0f1724" }}>
                    {address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-4 p-4 mb-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="d-flex align-items-center gap-2 mb-5">
            <ListTask size={20} color="#0e8a5f" />

            <h5 className="fw-bold mb-0" style={{ color: "#0f1724" }}>
              What happens next?
            </h5>
          </div>

          <div className="row position-relative">
            <div
              className="d-none d-md-block position-absolute"
              style={{
                top: "16px",
                left: "12%",
                right: "12%",
                borderTop: "2px dashed #d9dee3",
                zIndex: 0,
              }}
            />

            {nextSteps.map((step) => (
              <div
                className="col-6 col-md-3 mb-4 mb-md-0"
                key={step.step}
                style={{ zIndex: 1 }}
              >
                <div className="d-flex flex-column align-items-center text-center">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white mb-3"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: step.active ? "#0e8a5f" : "#d1d5db",
                      fontSize: "0.85rem",
                    }}
                  >
                    {step.step}
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: step.active ? "#e6f4ee" : "#f3f4f6",
                    }}
                  >
                    {step.icon}
                  </div>

                  <h6
                    className="fw-semibold mb-1"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {step.title}
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{
                      fontSize: "0.78rem",
                      maxWidth: "160px",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-4 p-4 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{ backgroundColor: "#e6f4ee" }}
        >
          <div>
            <h6 className="fw-bold mb-1" style={{ color: "#0e8a5f" }}>
              🎉 Thank you for choosing ServyNex!
            </h6>

            <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
              We look forward to serving you.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleHome}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium bg-white"
              style={{
                border: "1px solid #d1d5db",
                color: "#0f1724",
              }}
            >
              <HouseFill size={14} />
              Back to Home
            </button>

            <button
              type="button"
              onClick={handleBrowseServices}
              className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{ backgroundColor: "#0e8a5f" }}
            >
              <Grid3x3GapFill size={14} />
              Browse More Services
            </button>
          </div>
        </div>

        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  <HeadsetVr size={28} color="#0e8a5f" />
                </div>

                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                    Need Help?
                  </h6>

                  <p
                    className="text-secondary mb-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Our support team is here to help you.
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-1">
                    <TelephoneFill size={14} color="#0e8a5f" />

                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#0f1724",
                      }}
                    >
                      +91 98765 43210
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <EnvelopeFill size={14} color="#0e8a5f" />

                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#0f1724",
                      }}
                    >
                      support@servynex.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="rounded-3 p-3"
                style={{ backgroundColor: "#f3faf6" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <ClockFill size={16} color="#0e8a5f" />

                  <div>
                    <h6
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.88rem",
                      }}
                    >
                      Support Hours
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Mon - Sat: 9:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <ShieldFillCheck size={16} color="#0e8a5f" />

                  <div>
                    <h6
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.88rem",
                      }}
                    >
                      100% Secure
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Your booking information is safe with us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
