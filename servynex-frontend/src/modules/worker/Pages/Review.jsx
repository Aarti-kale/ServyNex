import React, { useEffect, useState } from "react";

import ReviewsBanner from "../../../components/WorkerComponents/ReviewsComponent/ReviewsBanner";
import ReviewsFilterTabs from "../../../components/WorkerComponents/ReviewsComponent/ReviewsFilterTabs";
import ReviewsHeader from "../../../components/WorkerComponents/ReviewsComponent/ReviewsHeader";
import ReviewsList from "../../../components/WorkerComponents/ReviewsComponent/ReviewsList";

import API from "../../../api/api";

export default function UserLayout() {
  const [reviewsData, setReviewsData] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [activeRating, setActiveRating] = useState("all");
  const [sortType, setSortType] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/workers/reviews", {
        params: {
          page: 1,
          limit: 1000,
          rating: "all",
        },
      });

      const data = response?.data?.data;

      setReviewsData(data || null);
      setReviews(data?.reviews || []);
    } catch (error) {
      console.error("Failed to fetch worker reviews:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const visibleReviews = [...reviews]
    .filter((review) => {
      if (activeRating === "all") {
        return true;
      }

      return Number(review.rating) === Number(activeRating);
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      switch (sortType) {
        case "oldest":
          return dateA - dateB;

        case "highest":
          return Number(b.rating) - Number(a.rating);

        case "lowest":
          return Number(a.rating) - Number(b.rating);

        case "newest":
        default:
          return dateB - dateA;
      }
    });

  return (
    <>
      <ReviewsHeader
        summary={reviewsData?.summary}
        onFilterChange={setSortType}
      />

      <ReviewsFilterTabs
        activeRating={activeRating}
        summary={reviewsData?.summary}
        onChange={setActiveRating}
      />

      <ReviewsList
        reviews={visibleReviews}
        loading={loading}
        error={error}
        onRetry={fetchReviews}
        onReply={(review) => {}}
      />

      <ReviewsBanner />
    </>
  );
}
