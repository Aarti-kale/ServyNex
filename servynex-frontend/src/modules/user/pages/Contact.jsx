import React, { useEffect, useState } from "react";

import ContactForm from "../../../components/UserComponent/ContactComponents/ContactForm";
import ContactHero from "../../../components/UserComponent/ContactComponents/ContactHero";
import Contactinfo from "../../../components/UserComponent/ContactComponents/Contactinfo";
import HowCanWeHelp from "../../../components/UserComponent/ContactComponents/HowCanweHelp";
import OfficeLocation from "../../../components/UserComponent/ContactComponents/OfficeLocation";
import StillNeedHelp from "../../../components/UserComponent/ContactComponents/StillneedHelp";

import API from "../../../api/api.js";

export default function ContactPage() {
  const [contact, setContact] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/contact");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Failed to load Contact page"
          );
        }

        setContact(response.data.data);
      } catch (error) {
        console.error("Contact page error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load Contact page"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();
  }, []);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">{error}</div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <>
      <ContactHero data={contact.hero} />

      <Contactinfo data={contact.contactCards} />

      <ContactForm data={contact.contactForm} />

      <OfficeLocation data={contact.officeLocation} />

      <HowCanWeHelp data={contact.helpSection} />

      <StillNeedHelp data={contact.supportCta} />
    </>
  );
}
