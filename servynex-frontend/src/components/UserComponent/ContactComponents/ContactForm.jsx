import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  ChevronDown,
  ChatSquareTextFill,
  ArrowRight,
} from "react-bootstrap-icons";

import API from "../../../api/api.js";
import getMediaUrl from "../../../utils/getMediaUrl.jsx";

const ContactForm = ({ data }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const contactForm = data || {};

  const subjects =
    contactForm.subjects?.length > 0
      ? contactForm.subjects
      : [
          {
            value: "booking",
            label: "Booking Support",
          },
          {
            value: "payment",
            label: "Payment Support",
          },
          {
            value: "worker-registration",
            label: "Worker Registration",
          },
          {
            value: "general",
            label: "General Inquiry",
          },
        ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (successMessage) {
      setSuccessMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await API.post("/contact/message", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });

      setSuccessMessage(
        response.data?.message || "Your message has been sent successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: "#fbfdfd" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div
              className="fw-semibold text-uppercase mb-2"
              style={{
                color: "#0e8a5f",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              {contactForm.badge || "Send Us a Message"}
            </div>

            <h2
              className="fw-bold mb-2"
              style={{
                color: "#0f1724",
                fontSize: "1.75rem",
              }}
            >
              {contactForm.title || "We'd love to hear from you!"}
            </h2>

            <p className="text-secondary mb-4">
              {contactForm.description ||
                "Fill out the form and our team will get back to you as soon as possible."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3 bg-white"
                    style={{
                      border: "1px solid #d9dee3",
                    }}
                  >
                    <PersonFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="form-control border-0 shadow-none px-0 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3 bg-white"
                    style={{
                      border: "1px solid #d9dee3",
                    }}
                  >
                    <EnvelopeFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="form-control border-0 shadow-none px-0 py-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3 bg-white"
                    style={{
                      border: "1px solid #d9dee3",
                    }}
                  >
                    <TelephoneFill
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="form-control border-0 shadow-none px-0 py-2"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="d-flex align-items-center gap-2 rounded-3 px-3 bg-white"
                    style={{
                      border: "1px solid #d9dee3",
                    }}
                  >
                    <ChevronDown
                      size={16}
                      className="text-secondary flex-shrink-0"
                    />

                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="form-select border-0 shadow-none px-0 py-2"
                      required
                    >
                      <option value="">Select Subject</option>

                      {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div
                  className="d-flex align-items-start gap-2 rounded-3 px-3 bg-white"
                  style={{
                    border: "1px solid #d9dee3",
                  }}
                >
                  <ChatSquareTextFill
                    size={16}
                    className="text-secondary flex-shrink-0 mt-2"
                  />

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={4}
                    className="form-control border-0 shadow-none px-0 py-2"
                    required
                  />
                </div>
              </div>

              {successMessage && (
                <div className="alert alert-success py-2" role="alert">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger py-2" role="alert">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn text-white d-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-medium"
                style={{
                  backgroundColor: "#0e8a5f",
                }}
              >
                {loading
                  ? "Sending..."
                  : contactForm.submitButtonText || "Send Message"}

                {!loading && <ArrowRight />}
              </button>
            </form>
          </div>

          <div className="col-lg-6">
            <div className="rounded-4 overflow-hidden">
              <img
                src={
                  getMediaUrl(contactForm.image) ||
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
                }
                alt="Send us a message illustration"
                className="w-100"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
