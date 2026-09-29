import { useEffect, useState } from "react";

import api from "../../../api/api";

import BecomeProfessional from "../../../components/UserComponent/WorkersComponents/BecomeProfessional";
import FeaturedProfessionals from "../../../components/UserComponent/WorkersComponents/FeaturedProfessional";
import ProfessionalAchievements from "../../../components/UserComponent/WorkersComponents/ProfessionalAchievement";
import ProfessionalCategories from "../../../components/UserComponent/WorkersComponents/ProfessionalCategories";
import ProfessionalStandards from "../../../components/UserComponent/WorkersComponents/ProfessionalStandards";
import VerificationProcess from "../../../components/UserComponent/WorkersComponents/VerificationProcess";
import WorkersHero from "../../../components/UserComponent/WorkersComponents/WorkersHero";

export default function ProfessionalWorker() {
  const [professionals, setProfessionals] = useState({
    statistics: {},
    categories: [],
    featured: {
      count: 0,
      workers: [],
    },
    hiringProcess: [],
    professionalStandards: [],
    joinProfessional: {},
    hero: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/professionalinfo/overview");

        if (response.data?.success) {
          setProfessionals(response.data.data || {});
        } else {
          setError(
            response.data?.message || "Failed to load professionals data."
          );
        }
      } catch (error) {
        console.error("Workers overview fetch error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load professionals data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <p className="mb-0">Loading professionals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger mb-0">{error}</p>
      </div>
    );
  }

  return (
    <>
      <WorkersHero
        data={professionals.hero}
        statistics={professionals.statistics}
      />

      <ProfessionalCategories data={professionals.categories} />

      <FeaturedProfessionals data={professionals.featured} />

      <VerificationProcess data={professionals.hiringProcess} />

      <ProfessionalStandards data={professionals.professionalStandards} />

      <ProfessionalAchievements statistics={professionals.statistics} />

      <BecomeProfessional data={professionals.joinProfessional} />
    </>
  );
}
