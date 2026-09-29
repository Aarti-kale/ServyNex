import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  ChevronRight,
  ClockFill,
  ShieldFillCheck,
  GeoAltFill,
  CalendarEventFill,
  LockFill,
  HeadsetVr,
  PersonBadgeFill,
  ReceiptCutoff,
} from "react-bootstrap-icons";

import API from "../../../api/api.js";

const TIME_SLOTS = [
  {
    label: "Morning",
    time: "9 AM - 12 PM",
    startHour: 9,
  },
  {
    label: "Afternoon",
    time: "12 PM - 4 PM",
    startHour: 12,
  },
  {
    label: "Evening",
    time: "4 PM - 8 PM",
    startHour: 16,
  },
  {
    label: "Night",
    time: "8 PM - 10 PM",
    startHour: 20,
  },
];

// Current platform fee displayed by the booking UI.

// Razorpay checkout script URL.
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const TRUST_FEATURES = [
  {
    title: "Verified Professionals",
    desc: "Skilled & background checked experts",
    icon: <PersonBadgeFill size={22} color="#0e8a5f" />,
  },
  {
    title: "On-time Service",
    desc: "We value your time",
    icon: <ClockFill size={22} color="#0e8a5f" />,
  },
  {
    title: "Affordable Pricing",
    desc: "Transparent & no hidden charges",
    icon: <ReceiptCutoff size={22} color="#0e8a5f" />,
  },
  {
    title: "Satisfaction Guaranteed",
    desc: "Not happy? We'll make it right",
    icon: <ShieldFillCheck size={22} color="#0e8a5f" />,
  },
];
const extractService = (responseData) => {
  if (!responseData) {
    return null;
  }

  if (responseData.service) {
    return responseData.service;
  }

  if (responseData.data?.service) {
    return responseData.data.service;
  }

  if (responseData.data) {
    return responseData.data;
  }

  return null;
};

const extractBooking = (responseData) => {
  if (!responseData) {
    return null;
  }

  if (responseData.booking) {
    return responseData.booking;
  }

  if (responseData.data?.booking) {
    return responseData.data.booking;
  }

  if (responseData.data && responseData.data._id) {
    return responseData.data;
  }

  return null;
};

const extractPaymentData = (responseData) => {
  if (!responseData) {
    return null;
  }

  if (responseData.data) {
    return responseData.data;
  }

  return responseData;
};

const formatReadableDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getWeekday = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
  });
};

const buildBookingDate = (dateValue, slot) => {
  if (!dateValue || !slot) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day || !Number.isInteger(slot.startHour)) {
    return null;
  }

  const bookingDate = new Date(year, month - 1, day, slot.startHour, 0, 0, 0);

  return Number.isNaN(bookingDate.getTime()) ? null : bookingDate;
};

const getTodayDateValue = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getServicePrice = (service) => {
  if (!service) {
    return 0;
  }

  const price =
    service.price ??
    service.startingPrice ??
    service.basePrice ??
    service.amount ??
    0;

  const numericPrice = Number(price);

  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const getServiceDuration = (service) => {
  if (!service) {
    return "45 - 60 mins";
  }

  return (
    service.duration ||
    service.serviceDuration ||
    service.estimatedDuration ||
    "45 - 60 mins"
  );
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));

      existingScript.addEventListener("error", () => resolve(false));

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const BookingService = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState(null);

  const [loadingService, setLoadingService] = useState(true);

  const [serviceError, setServiceError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    pincode: "",
    landmark: "",
    date: "",
  });

  const [selectedSlot, setSelectedSlot] = useState("Afternoon");

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchService = async () => {
      if (!serviceId) {
        if (isMounted) {
          setService(null);
          setServiceError("Service ID is missing.");
          setLoadingService(false);
        }

        return;
      }

      try {
        setLoadingService(true);
        setServiceError("");

        const response = await API.get(`/services/${serviceId}`);

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Unable to fetch service details."
          );
        }

        const fetchedService = extractService(response.data);

        if (!fetchedService) {
          throw new Error("Service data was not returned by the server.");
        }

        if (isMounted) {
          setService(fetchedService);
        }
      } catch (error) {
        console.error("FETCH SERVICE ERROR:", error);

        if (isMounted) {
          setService(null);

          setServiceError(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load service."
          );
        }
      } finally {
        if (isMounted) {
          setLoadingService(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setForm((previousForm) => ({
        ...previousForm,

        fullName: user?.name || user?.fullName || previousForm.fullName,

        phone: user?.phone || previousForm.phone,

        city: user?.city || previousForm.city,
      }));
    } catch (error) {
      console.error("LOAD STORED USER ERROR:", error);
    }
  }, []);

  const selectedSlotData = useMemo(() => {
    return TIME_SLOTS.find((slot) => slot.label === selectedSlot);
  }, [selectedSlot]);

  const servicePrice = getServicePrice(service);

  const platformFee = PLATFORM_FEE;

  const totalAmount = servicePrice + platformFee;

  const minimumDate = getTodayDateValue();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setSubmitError("");
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setSubmitError("");
  };

  const handleChangeService = () => {
    if (serviceId) {
      navigate(`/servicesid?serviceId=${serviceId}`);

      return;
    }

    navigate("/servicesid");
  };

  const validateForm = () => {
    if (!serviceId) {
      return "Service ID is missing.";
    }

    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!form.city.trim()) {
      return "Please select your city.";
    }

    if (!form.address.trim()) {
      return "Please enter your complete address.";
    }

    if (!form.pincode.trim()) {
      return "Please enter your pincode.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!form.date) {
      return "Please select a service date.";
    }

    if (!selectedSlotData) {
      return "Please select a time slot.";
    }

    const bookingDate = buildBookingDate(form.date, selectedSlotData);

    if (!bookingDate) {
      return "Please select a valid service date and time.";
    }

    if (bookingDate <= new Date()) {
      return "Selected time slot has already passed. Please choose another slot.";
    }

    if (servicePrice <= 0) {
      return "This service currently has an invalid price.";
    }

    return null;
  };

  const createCodBooking = async ({ completeAddress, bookingDate }) => {
    const bookingPayload = {
      service: serviceId,
      address: completeAddress,
      date: bookingDate.toISOString(),
      paymentMethod: "cod",
    };

    const response = await API.post("/bookings", bookingPayload);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Unable to create booking.");
    }

    const createdBooking = extractBooking(response.data);

    navigate("/booking-success", {
      state: {
        booking: createdBooking,
        service,
        paymentMethod: "cod",
        totalAmount,
      },
    });
  };
  const createOnlinePayment = async ({ completeAddress, bookingDate }) => {
    const paymentPayload = {
      service: serviceId,
      address: completeAddress,
      date: bookingDate.toISOString(),
    };

    const orderResponse = await API.post(
      "/bookings/payment/create",
      paymentPayload
    );

    if (!orderResponse.data?.success) {
      throw new Error(
        orderResponse.data?.message || "Unable to create payment order."
      );
    }

    const paymentData = extractPaymentData(orderResponse.data);

    if (!paymentData?.bookingId) {
      throw new Error("Booking ID was not returned by the payment server.");
    }

    if (!paymentData?.razorpayOrderId) {
      throw new Error("Razorpay order ID was not returned by the server.");
    }

    if (!paymentData?.razorpayKeyId) {
      throw new Error("Razorpay key ID was not returned by the server.");
    }

    const razorpayLoaded = await loadRazorpayScript();

    if (!razorpayLoaded) {
      throw new Error(
        "Unable to load Razorpay checkout. Please check your internet connection and try again."
      );
    }

    if (typeof window.Razorpay !== "function") {
      throw new Error("Razorpay checkout is unavailable.");
    }

    const options = {
      key: paymentData.razorpayKeyId,

      amount: paymentData.amount,

      currency: paymentData.currency || "INR",

      name: "ServyNex",

      description: service?.name || "ServyNex Service Booking",

      order_id: paymentData.razorpayOrderId,

      handler: async (razorpayResponse) => {
        try {
          setSubmitting(true);
          setSubmitError("");

          const verifyResponse = await API.post("/bookings/payment/verify", {
            bookingId: paymentData.bookingId,

            razorpay_payment_id: razorpayResponse.razorpay_payment_id,

            razorpay_order_id: razorpayResponse.razorpay_order_id,

            razorpay_signature: razorpayResponse.razorpay_signature,
          });

          if (!verifyResponse.data?.success) {
            throw new Error(
              verifyResponse.data?.message || "Payment verification failed."
            );
          }

          navigate("/booking-success", {
            state: {
              booking: {
                _id: paymentData.bookingId,

                razorpayOrderId: paymentData.razorpayOrderId,

                razorpayPaymentId: razorpayResponse.razorpay_payment_id,

                paymentStatus: "paid",

                paymentMethod: "online",
              },

              service,

              paymentMethod: "online",

              totalAmount,
            },
          });
        } catch (error) {
          console.error("PAYMENT VERIFICATION ERROR:", error);

          setSubmitError(
            error?.response?.data?.message ||
              error?.message ||
              "Payment verification failed. Please contact support if money was deducted."
          );
        } finally {
          setSubmitting(false);
        }
      },

      prefill: {
        name: form.fullName.trim(),

        contact: form.phone.trim(),
      },

      notes: {
        bookingId: paymentData.bookingId,

        serviceId: serviceId,
      },

      theme: {
        color: "#0e8a5f",
      },

      modal: {
        ondismiss: () => {
          setSubmitting(false);

          setSubmitError(
            "Payment was cancelled. Your booking has not been marked as paid."
          );
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      console.error("========== RAZORPAY PAYMENT FAILED ==========");

      console.error("CODE:", response?.error?.code);

      console.error("DESCRIPTION:", response?.error?.description);

      console.error("SOURCE:", response?.error?.source);

      console.error("STEP:", response?.error?.step);

      console.error("REASON:", response?.error?.reason);

      console.error(
        "FULL ERROR:",
        JSON.stringify(response?.error || response, null, 2)
      );

      console.error("============================================");

      setSubmitting(false);

      setSubmitError(
        response?.error?.description ||
          "Online payment failed. Please try again."
      );
    });
    razorpay.open();
  };
  const handleConfirm = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitError("");

    const validationError = validateForm();

    if (validationError) {
      setSubmitError(validationError);

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signup", {
        state: {
          from: `/booking?serviceId=${serviceId}`,
        },
      });

      return;
    }

    try {
      setSubmitting(true);

      const bookingDate = buildBookingDate(form.date, selectedSlotData);

      if (!bookingDate) {
        throw new Error("Invalid booking date or time.");
      }

      const completeAddress = [
        form.address.trim(),

        form.landmark.trim() ? `Landmark: ${form.landmark.trim()}` : "",

        `${form.city.trim()} - ${form.pincode.trim()}`,
      ]
        .filter(Boolean)
        .join(", ");
      if (paymentMethod === "cod") {
        await createCodBooking({
          completeAddress,
          bookingDate,
        });

        return;
      }

      if (paymentMethod === "online") {
        await createOnlinePayment({
          completeAddress,
          bookingDate,
        });

        return;
      }

      throw new Error("Invalid payment method selected.");
    } catch (error) {
      console.error("CREATE BOOKING ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("BACKEND RESPONSE:", error?.response?.data);

      console.error("REQUEST URL:", error?.config?.url);

      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong while creating booking."
      );

      setSubmitting(false);
    }
  };

  if (loadingService) {
    return (
      <div
        className="py-5 d-flex justify-content-center align-items-center"
        style={{
          minHeight: "60vh",
          backgroundColor: "#fbfdfd",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{
              color: "#0e8a5f",
            }}
            role="status"
            aria-label="Loading"
          />

          <p className="text-secondary mb-0">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div
        className="py-5"
        style={{
          minHeight: "60vh",
          backgroundColor: "#fbfdfd",
        }}
      >
        <div className="container">
          <div className="alert alert-danger rounded-4" role="alert">
            {serviceError || "Service not found."}
          </div>

          <button
            type="button"
            className="btn text-white rounded-3"
            style={{
              backgroundColor: "#0e8a5f",
            }}
            onClick={() => navigate("/servicesid")}
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-4"
      style={{
        backgroundColor: "#fbfdfd",
      }}
    >
      <div className="container">
        <nav
          className="mb-3"
          style={{
            fontSize: "0.85rem",
          }}
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="fw-medium border-0 bg-transparent p-0"
            style={{
              color: "#0e8a5f",
            }}
          >
            Home
          </button>

          <ChevronRight size={10} className="text-secondary mx-1" />

          <button
            type="button"
            onClick={() => navigate("/servicesid")}
            className="fw-medium border-0 bg-transparent p-0"
            style={{
              color: "#0e8a5f",
            }}
          >
            Services
          </button>

          <ChevronRight size={10} className="text-secondary mx-1" />

          <span
            className="fw-medium"
            style={{
              color: "#0e8a5f",
            }}
          >
            {service.name || service.title || "Service"}
          </span>

          <ChevronRight size={10} className="text-secondary mx-1" />

          <span className="text-secondary">Book Service</span>
        </nav>

        <h1
          className="fw-bold mb-1"
          style={{
            color: "#0f1724",
            fontSize: "2rem",
          }}
        >
          Book Your Service
        </h1>

        <p className="text-secondary mb-4">
          Just a few steps away from hassle-free service
        </p>

        {submitError && (
          <div className="alert alert-danger rounded-3 mb-4" role="alert">
            {submitError}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <form onSubmit={handleConfirm}>
              <div className="position-relative ps-5">
                <div
                  className="position-absolute"
                  style={{
                    left: "17px",
                    top: "18px",
                    bottom: "18px",
                    width: "2px",
                    backgroundColor: "#d9ecdf",
                  }}
                />

                <div className="position-relative mb-4">
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                    style={{
                      left: "-40px",
                      top: 0,
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#0e8a5f",
                    }}
                  >
                    1
                  </span>

                  <h5
                    className="fw-bold mb-3"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Service Information
                  </h5>

                  <div
                    className="rounded-4 p-3 bg-white d-flex flex-wrap align-items-center justify-content-between gap-3"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "64px",
                          height: "64px",
                          backgroundColor: "#e6f4ee",
                        }}
                      >
                        <PersonBadgeFill size={28} color="#0e8a5f" />
                      </div>

                      <div>
                        <h6
                          className="fw-bold mb-1"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          {service.name || service.title || "Service"}
                        </h6>

                        <p
                          className="mb-1"
                          style={{
                            fontSize: "0.85rem",
                          }}
                        >
                          Starting at{" "}
                          <span
                            className="fw-bold"
                            style={{
                              color: "#0e8a5f",
                            }}
                          >
                            ₹{servicePrice}
                          </span>
                        </p>

                        <div
                          className="d-flex flex-wrap gap-3 text-secondary"
                          style={{
                            fontSize: "0.78rem",
                          }}
                        >
                          <span className="d-flex align-items-center gap-1">
                            <ClockFill size={12} />

                            {getServiceDuration(service)}
                          </span>

                          <span className="d-flex align-items-center gap-1">
                            <ShieldFillCheck size={12} />
                            Verified Professionals
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleChangeService}
                      className="btn rounded-3 fw-medium px-3 py-2"
                      style={{
                        border: "1.5px solid #0e8a5f",
                        color: "#0e8a5f",
                      }}
                    >
                      Change Service
                    </button>
                  </div>
                </div>

                <div className="position-relative mb-4">
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                    style={{
                      left: "-40px",
                      top: 0,
                      width: "36px",
                      height: "36px",
                      border: "2px solid #0e8a5f",
                      color: "#0e8a5f",
                      backgroundColor: "#fff",
                    }}
                  >
                    2
                  </span>

                  <h5
                    className="fw-bold mb-3"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Address Details
                  </h5>

                  <div
                    className="rounded-4 p-4 bg-white"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="fullName"
                          className="form-label small fw-medium"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Full Name
                        </label>

                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="form-control py-2"
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="phone"
                          className="form-label small fw-medium"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          className="form-control py-2"
                          autoComplete="tel"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="city"
                        className="form-label small fw-medium"
                        style={{
                          color: "#0f1724",
                        }}
                      >
                        City
                      </label>

                      <select
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="form-select py-2"
                        required
                      >
                        <option value="">Select your city</option>

                        <option value="Pune">Pune</option>

                        <option value="Mumbai">Mumbai</option>

                        <option value="Delhi">Delhi</option>

                        <option value="Bengaluru">Bengaluru</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="address"
                        className="form-label small fw-medium"
                        style={{
                          color: "#0f1724",
                        }}
                      >
                        Complete Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="House / Flat / Building, Street, Area"
                        rows={2}
                        className="form-control py-2"
                        autoComplete="street-address"
                        required
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="pincode"
                          className="form-label small fw-medium"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Pincode
                        </label>

                        <input
                          id="pincode"
                          type="text"
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="Enter pincode"
                          className="form-control py-2"
                          inputMode="numeric"
                          maxLength={6}
                          autoComplete="postal-code"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="landmark"
                          className="form-label small fw-medium"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Landmark (Optional)
                        </label>

                        <input
                          id="landmark"
                          type="text"
                          name="landmark"
                          value={form.landmark}
                          onChange={handleChange}
                          placeholder="Nearby landmark"
                          className="form-control py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="position-relative mb-4">
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                    style={{
                      left: "-40px",
                      top: 0,
                      width: "36px",
                      height: "36px",
                      border: "2px solid #0e8a5f",
                      color: "#0e8a5f",
                      backgroundColor: "#fff",
                    }}
                  >
                    3
                  </span>

                  <h5
                    className="fw-bold mb-3"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Choose Date &amp; Time
                  </h5>

                  <div
                    className="rounded-4 p-4 bg-white"
                    style={{
                      border: "1px solid #eef0f2",
                    }}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="date"
                        className="form-label small fw-medium"
                        style={{
                          color: "#0f1724",
                        }}
                      >
                        Select Date
                      </label>

                      <div
                        className="d-flex align-items-center gap-2 rounded-3 px-3"
                        style={{
                          border: "1px solid #d9dee3",
                        }}
                      >
                        <CalendarEventFill
                          size={16}
                          className="text-secondary"
                        />

                        <input
                          id="date"
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          min={minimumDate}
                          className="form-control border-0 shadow-none px-0 py-2"
                          required
                        />
                      </div>
                    </div>

                    <label
                      className="form-label small fw-medium"
                      style={{
                        color: "#0f1724",
                      }}
                    >
                      Select Time Slot
                    </label>

                    <div className="row g-2">
                      {TIME_SLOTS.map((slot) => (
                        <div className="col-6 col-md-3" key={slot.label}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot.label);

                              setSubmitError("");
                            }}
                            className="btn w-100 rounded-3 py-2 text-start"
                            style={{
                              border:
                                selectedSlot === slot.label
                                  ? "2px solid #0e8a5f"
                                  : "1px solid #d9dee3",

                              backgroundColor:
                                selectedSlot === slot.label
                                  ? "#f3faf6"
                                  : "#ffffff",
                            }}
                            aria-pressed={selectedSlot === slot.label}
                          >
                            <div
                              className="fw-semibold"
                              style={{
                                color: "#0f1724",
                                fontSize: "0.85rem",
                              }}
                            >
                              {slot.label}
                            </div>

                            <div
                              className="text-secondary"
                              style={{
                                fontSize: "0.72rem",
                              }}
                            >
                              {slot.time}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="position-relative mb-4">
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                    style={{
                      left: "-40px",
                      top: 0,
                      width: "36px",
                      height: "36px",
                      border: "2px solid #0e8a5f",
                      color: "#0e8a5f",
                      backgroundColor: "#fff",
                    }}
                  >
                    4
                  </span>

                  <h5
                    className="fw-bold mb-3"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Payment Options
                  </h5>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePaymentMethodChange("cod")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handlePaymentMethodChange("cod");
                      }
                    }}
                    className="rounded-4 p-3 mb-3 d-flex align-items-center justify-content-between bg-white"
                    style={{
                      border:
                        paymentMethod === "cod"
                          ? "2px solid #0e8a5f"
                          : "1px solid #eef0f2",

                      cursor: "pointer",

                      backgroundColor:
                        paymentMethod === "cod" ? "#f3faf6" : "#fff",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => handlePaymentMethodChange("cod")}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#0e8a5f",
                        }}
                      />

                      <div>
                        <h6
                          className="fw-semibold mb-1"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Cash on Delivery
                        </h6>

                        <p
                          className="text-secondary mb-0"
                          style={{
                            fontSize: "0.8rem",
                          }}
                        >
                          Pay after service completion
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePaymentMethodChange("online")}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handlePaymentMethodChange("online");
                      }
                    }}
                    className="rounded-4 p-3 d-flex align-items-center justify-content-between bg-white flex-wrap gap-2"
                    style={{
                      border:
                        paymentMethod === "online"
                          ? "2px solid #0e8a5f"
                          : "1px solid #eef0f2",

                      cursor: "pointer",

                      backgroundColor:
                        paymentMethod === "online" ? "#f3faf6" : "#fff",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "online"}
                        onChange={() => handlePaymentMethodChange("online")}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#0e8a5f",
                        }}
                      />

                      <div>
                        <h6
                          className="fw-semibold mb-1"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Online Payment
                        </h6>

                        <p
                          className="text-secondary mb-0"
                          style={{
                            fontSize: "0.8rem",
                          }}
                        >
                          Pay securely online now
                        </p>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      {["UPI", "VISA", "Mastercard", "RuPay"].map((payment) => (
                        <span
                          key={payment}
                          className="badge bg-light text-dark border"
                          style={{
                            fontSize: "0.7rem",
                          }}
                        >
                          {payment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="position-relative">
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                    style={{
                      left: "-40px",
                      top: 0,
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#0e8a5f",
                    }}
                  >
                    5
                  </span>

                  <h5
                    className="fw-bold mb-3"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    Confirm Booking
                  </h5>

                  <div
                    className="rounded-4 p-4 mb-3"
                    style={{
                      backgroundColor: "#f3faf6",
                      border: "1px solid #d9ecdf",
                    }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      <ShieldFillCheck
                        size={20}
                        color="#0e8a5f"
                        className="flex-shrink-0 mt-1"
                      />

                      <div>
                        <h6
                          className="fw-semibold mb-1"
                          style={{
                            color: "#0f1724",
                          }}
                        >
                          Almost done!
                        </h6>

                        <p
                          className="text-secondary mb-0"
                          style={{
                            fontSize: "0.85rem",
                          }}
                        >
                          Please review your details and confirm your booking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn w-100 text-white d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-semibold mb-3"
                    style={{
                      backgroundColor: submitting ? "#75b89f" : "#0e8a5f",
                    }}
                  >
                    <LockFill size={16} />

                    {submitting
                      ? paymentMethod === "online"
                        ? "Opening Payment..."
                        : "Creating Booking..."
                      : paymentMethod === "online"
                      ? "Pay & Confirm Booking"
                      : "Confirm Booking"}
                  </button>

                  <p
                    className="text-center text-secondary"
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    By confirming, you agree to our{" "}
                    <a
                      href="#terms"
                      className="fw-medium text-decoration-none"
                      style={{
                        color: "#0e8a5f",
                      }}
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#privacy"
                      className="fw-medium text-decoration-none"
                      style={{
                        color: "#0e8a5f",
                      }}
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </form>

            <div className="row g-3 mt-4">
              {TRUST_FEATURES.map((feature) => (
                <div className="col-6 col-md-3" key={feature.title}>
                  <div
                    className="rounded-3 p-3 h-100"
                    style={{
                      backgroundColor: "#f3faf6",
                    }}
                  >
                    <div className="mb-2">{feature.icon}</div>

                    <h6
                      className="fw-semibold mb-1"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      {feature.title}
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="rounded-4 p-4 bg-white position-sticky"
              style={{
                border: "1px solid #eef0f2",
                top: "20px",
              }}
            >
              <h5
                className="fw-bold mb-3"
                style={{
                  color: "#0f1724",
                }}
              >
                Booking Summary
              </h5>

              <p
                className="fw-semibold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "0.85rem",
                }}
              >
                Service
              </p>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: "#e6f4ee",
                    }}
                  >
                    <PersonBadgeFill size={18} color="#0e8a5f" />
                  </div>

                  <span
                    className="fw-medium"
                    style={{
                      color: "#0f1724",
                      fontSize: "0.9rem",
                    }}
                  >
                    {service.name || service.title || "Service"}
                  </span>
                </div>

                <span
                  className="fw-bold"
                  style={{
                    color: "#0e8a5f",
                  }}
                >
                  ₹{servicePrice}
                </span>
              </div>

              <hr />

              <p
                className="fw-semibold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "0.85rem",
                }}
              >
                Date &amp; Time
              </p>

              <div className="d-flex align-items-center gap-2 mb-1">
                <CalendarEventFill size={14} color="#0e8a5f" />

                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#0f1724",
                  }}
                >
                  {form.date ? formatReadableDate(form.date) : "Select date"}
                </span>
              </div>

              <p
                className="text-secondary mb-2"
                style={{
                  fontSize: "0.78rem",
                  marginLeft: "20px",
                }}
              >
                {form.date ? getWeekday(form.date) : "Select date"}
              </p>

              <div className="d-flex align-items-center gap-2 mb-3">
                <ClockFill size={14} color="#0e8a5f" />

                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#0f1724",
                  }}
                >
                  {selectedSlotData?.time || "Select time slot"}
                </span>
              </div>

              <hr />

              <p
                className="fw-semibold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "0.85rem",
                }}
              >
                Address
              </p>

              <div className="d-flex align-items-start gap-2 mb-3">
                <GeoAltFill
                  size={14}
                  color="#0e8a5f"
                  className="mt-1 flex-shrink-0"
                />

                <div
                  style={{
                    fontSize: "0.82rem",
                  }}
                >
                  <div
                    className="fw-semibold"
                    style={{
                      color: "#0f1724",
                    }}
                  >
                    {form.fullName || "Your Name"}
                  </div>

                  <div className="text-secondary">
                    {form.address || "Your complete address will appear here."}

                    {form.landmark && (
                      <>
                        <br />
                        Landmark: {form.landmark}
                      </>
                    )}

                    <br />

                    {form.city || "City"}

                    {form.pincode ? ` - ${form.pincode}` : ""}
                  </div>
                </div>
              </div>

              <hr />

              <p
                className="fw-semibold mb-2"
                style={{
                  color: "#0f1724",
                  fontSize: "0.85rem",
                }}
              >
                Price Details
              </p>

              <div
                className="d-flex justify-content-between mb-1"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                <span className="text-secondary">Service Charge</span>

                <span
                  style={{
                    color: "#0f1724",
                  }}
                >
                  ₹{servicePrice}
                </span>
              </div>

              <div
                className="d-flex justify-content-between mb-2"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                <span className="text-secondary">Platform Fee</span>

                <span
                  style={{
                    color: "#0f1724",
                  }}
                >
                  ₹{platformFee}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-1">
                <span
                  className="fw-bold"
                  style={{
                    color: "#0f1724",
                  }}
                >
                  Total Amount
                </span>

                <span
                  className="fw-bold"
                  style={{
                    color: "#0e8a5f",
                    fontSize: "1.2rem",
                  }}
                >
                  ₹{totalAmount}
                </span>
              </div>

              <p
                className="text-secondary mb-3"
                style={{
                  fontSize: "0.72rem",
                }}
              >
                (Incl. of all taxes)
              </p>

              <div
                className="rounded-3 p-3"
                style={{
                  backgroundColor: "#f3faf6",
                }}
              >
                <div className="d-flex align-items-start gap-2 mb-3">
                  <ShieldFillCheck
                    size={18}
                    color="#0e8a5f"
                    className="flex-shrink-0 mt-1"
                  />

                  <div>
                    <h6
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      Secure Booking
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      Your data is 100% safe
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2 mb-3">
                  <PersonBadgeFill
                    size={18}
                    color="#0e8a5f"
                    className="flex-shrink-0 mt-1"
                  />

                  <div>
                    <h6
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      Verified Professionals
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      Background checked experts
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2">
                  <HeadsetVr
                    size={18}
                    color="#0e8a5f"
                    className="flex-shrink-0 mt-1"
                  />

                  <div>
                    <h6
                      className="fw-semibold mb-0"
                      style={{
                        color: "#0f1724",
                        fontSize: "0.85rem",
                      }}
                    >
                      24/7 Support
                    </h6>

                    <p
                      className="text-secondary mb-0"
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      We're here to help
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

export default BookingService;
