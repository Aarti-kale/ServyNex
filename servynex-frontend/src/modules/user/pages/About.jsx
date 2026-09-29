import React, { useEffect, useState } from "react";

import AboutHero from "../../../components/UserComponent/AboutComponents/AboutHero";
import CoreValues from "../../../components/UserComponent/AboutComponents/CoreValues";
import MissionVision from "../../../components/UserComponent/AboutComponents/MissionVision";
import OurCommitment from "../../../components/UserComponent/AboutComponents/OurCommitment";
import OurImpact from "../../../components/UserComponent/AboutComponents/OurImpact";
import OurJourney from "../../../components/UserComponent/AboutComponents/OurJourney";
import OurStory from "../../../components/UserComponent/AboutComponents/OurStory";

import API from "../../../api/api.js";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/about");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Failed to load About page"
          );
        }

        setAbout(response.data.data);
      } catch (error) {
        console.error("About page error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load About page"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">{error}</div>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <>
      <AboutHero data={about.hero} />

      <OurStory data={about.story} />

      <MissionVision data={about.missionVision} />

      <CoreValues data={about.coreValues} />

      <OurJourney data={about.journey} />

      <OurImpact data={about.impact} />

      <OurCommitment data={about.commitment} />
    </>
  );
}
