import { useEffect, useState } from "react";

import AllServices from "../../../components/UserComponent/ServiceComponents/AllServices";
import FeaturedService from "../../../components/UserComponent/ServiceComponents/FeaturedServices";
import PopularServices from "../../../components/UserComponent/ServiceComponents/PopularServices";
import RelatedServices from "../../../components/UserComponent/ServiceComponents/RelatedServices";
import ServiceHero from "../../../components/UserComponent/ServiceComponents/ServiceHero";

import api from "../../../api/api";

export default function Service() {
  const [popularServices, setPopularServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [featuredService, setFeaturedService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [hero, setHero] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        const [allRes, popularRes, featuredRes, relatedRes, heroRes] =
          await Promise.all([
            api.get("/services"),

            api.get("/services?popular=true"),

            api.get("/services?featured=true"),

            api.get("/services?related=true"),

            api.get("/service-hero"),
          ]);

        if (allRes.data?.success) {
          setAllServices(allRes.data.data || []);
        }

        if (popularRes.data?.success) {
          setPopularServices(popularRes.data.data || []);
        }

        if (featuredRes.data?.success) {
          setFeaturedService(featuredRes.data.data?.[0] || null);
        }

        if (relatedRes.data?.success) {
          setRelatedServices(relatedRes.data.data || []);
        }

        if (heroRes.data?.success) {
          setHero(heroRes.data.data?.hero || {});
        }
      } catch (error) {
        console.error("SERVICE PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <>
      <ServiceHero data={hero} />

      <PopularServices services={popularServices} />

      <AllServices services={allServices} />

      <FeaturedService service={featuredService} />

      <RelatedServices services={relatedServices} />
    </>
  );
}
