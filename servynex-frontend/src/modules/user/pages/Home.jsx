import React, { useEffect, useState } from "react";

import API from "../../../api/api.js";

import CTASection from "../../../components/UserComponent/HomeComponents.jsx/CTASection";
import FAQSection from "../../../components/UserComponent/HomeComponents.jsx/FaqSection";
import FeaturedWorkers from "../../../components/UserComponent/HomeComponents.jsx/FeaturedWorkerSection";
import HeroSection from "../../../components/UserComponent/HomeComponents.jsx/HeroSection";
import HowItWorks from "../../../components/UserComponent/HomeComponents.jsx/HowtoWork";
import ServicesSection from "../../../components/UserComponent/HomeComponents.jsx/ServiceSection";
import TestimonialsSection from "../../../components/UserComponent/HomeComponents.jsx/TestimonialsSection";
import WhyChooseSection from "../../../components/UserComponent/HomeComponents.jsx/WhyChooseSection";

export default function Home() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/homecontent");

        if (!response.data?.success) {
          throw new Error(response.data?.message || "Failed to load homepage");
        }

        setHome(response.data.data);
      } catch (err) {
        console.error("Homepage fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load homepage"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">{error}</div>
    );
  }

  if (!home) {
    return null;
  }

  return (
    <>
      <HeroSection data={home.hero} statistics={home.statistics} />

      <ServicesSection data={home.popularServices} />

      <HowItWorks data={home.howItWorks} />

      <WhyChooseSection data={home.whyChoose} />

      <FeaturedWorkers data={home.featuredProfessionals || []} />

      <TestimonialsSection data={home.reviews} />

      <CTASection data={home.cta} />

      <FAQSection data={home.faqs} />
    </>
  );
}
