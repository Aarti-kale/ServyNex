import React, { useCallback, useEffect, useState } from "react";
import API from "../../../api/api";
import ReviewsHeader from "../../../components/AdminComponents/Reviews/ReviewsHeader";
import ReviewsFilter from "../../../components/AdminComponents/Reviews/ReviewsFilter";
import ReviewsTable from "../../../components/AdminComponents/Reviews/ReviewsTable";
import AverageRatings from "../../../components/AdminComponents/Reviews/AverageRatings";
import TopRatedWorkers from "../../../components/AdminComponents/Reviews/TopRatedWorkers";
import LowestRatedWorkers from "../../../components/AdminComponents/Reviews/LowestRatedWorkers";
import ReviewsByRatings from "../../../components/AdminComponents/Reviews/ReviewsByRatings";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

export default function AdminReviews() {
  const [stats, setStats] = useState({});
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState({
    ratingDistribution: [],
    reviewsOverTime: [],
    topRatedWorkers: [],
    lowestRatedWorkers: [],
  });

  const [categories, setCategories] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    rating: "all",
    status: "all",
    category: "all",
    worker: "all",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalReviews: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const response = await API.get("/admin/reviews/stats");
      const data = getResponseData(response);

      setStats(data || {});
    } catch (error) {
      console.error("Failed to load review stats:", error);
      setStats({});
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/reviews", {
        params: {
          search: filters.search,
          rating: filters.rating,
          status: filters.status,
          category: filters.category,
          worker: filters.worker,
          page: pagination.currentPage,
          limit: pagination.perPage,
        },
      });

      const data = getResponseData(response);

      setReviews(Array.isArray(data?.reviews) ? data.reviews : []);

      setPagination((previous) => ({
        ...previous,
        ...(data?.pagination || {}),
      }));
    } catch (error) {
      console.error("Failed to load reviews:", error);

      setReviews([]);

      setPagination((previous) => ({
        ...previous,
        totalReviews: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  const loadAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);

      const response = await API.get("/admin/reviews/analytics");
      const data = getResponseData(response);

      setAnalytics({
        ratingDistribution: Array.isArray(data?.ratingDistribution)
          ? data.ratingDistribution
          : [],
        reviewsOverTime: Array.isArray(data?.reviewsOverTime)
          ? data.reviewsOverTime
          : [],
        topRatedWorkers: Array.isArray(data?.topRatedWorkers)
          ? data.topRatedWorkers
          : [],
        lowestRatedWorkers: Array.isArray(data?.lowestRatedWorkers)
          ? data.lowestRatedWorkers
          : [],
      });
    } catch (error) {
      console.error("Failed to load review analytics:", error);

      setAnalytics({
        ratingDistribution: [],
        reviewsOverTime: [],
        topRatedWorkers: [],
        lowestRatedWorkers: [],
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await API.get("/admin/categories");
      const data = getResponseData(response);

      const categoryList = Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
        ? data.categories
        : [];

      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to load review categories:", error);
      setCategories([]);
    }
  }, []);

  const loadWorkers = useCallback(async () => {
    try {
      const response = await API.get("/admin/workers", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const data = getResponseData(response);

      const workerList = Array.isArray(data)
        ? data
        : Array.isArray(data?.workers)
        ? data.workers
        : [];

      setWorkers(workerList);
    } catch (error) {
      console.error("Failed to load review workers:", error);
      setWorkers([]);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadAnalytics();
    loadCategories();
    loadWorkers();
  }, [loadStats, loadAnalytics, loadCategories, loadWorkers]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      rating: "all",
      status: "all",
      category: "all",
      worker: "all",
    });

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  };

  const refreshReviews = async () => {
    await Promise.all([loadStats(), loadReviews(), loadAnalytics()]);
  };

  const handleReviewAction = async (review, action, payload = {}) => {
    if (!review?._id) return;

    try {
      setActionLoading(true);

      const endpointMap = {
        approve: `/admin/reviews/${review._id}/approve`,
        hide: `/admin/reviews/${review._id}/hide`,
        unhide: `/admin/reviews/${review._id}/unhide`,
        report: `/admin/reviews/${review._id}/report`,
        delete: `/admin/reviews/${review._id}`,
        reply: `/admin/reviews/${review._id}/reply`,
      };

      const endpoint = endpointMap[action];

      if (!endpoint) {
        console.error(`Unsupported review action: ${action}`);
        return;
      }

      if (action === "delete") {
        await API.delete(endpoint);
      } else {
        await API.put(endpoint, payload);
      }

      await refreshReviews();
    } catch (error) {
      console.error(`Failed to ${action} review:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    if (!reviews.length) return;

    const headers = [
      "Customer",
      "Worker",
      "Booking ID",
      "Category",
      "Rating",
      "Review",
      "Status",
      "Date",
    ];

    const rows = reviews.map((review) => [
      review.customer?.name || "Not Available",
      review.worker?.name || "Not Available",
      review.booking?._id || "Not Available",
      review.category?.name || "Not Available",
      review.rating ?? "Not Available",
      review.comment || "Not Available",
      review.status || "Not Available",
      review.createdAt
        ? new Date(review.createdAt).toLocaleDateString()
        : "Not Available",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "servynex-reviews.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <ReviewsHeader
        stats={stats}
        onExport={handleExport}
        onFilters={() => {}}
      />

      <ReviewsFilter
        filters={filters}
        categories={categories}
        workers={workers}
        onSearch={(value) => updateFilter("search", value)}
        onRatingChange={(value) => updateFilter("rating", value)}
        onStatusChange={(value) => updateFilter("status", value)}
        onCategoryChange={(value) => updateFilter("category", value)}
        onWorkerChange={(value) => updateFilter("worker", value)}
        onClear={clearFilters}
      />

      <ReviewsTable
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        actionLoading={actionLoading}
        onPageChange={(page) =>
          setPagination((previous) => ({
            ...previous,
            currentPage: page,
          }))
        }
        onPageLimitChange={(limit) =>
          setPagination((previous) => ({
            ...previous,
            currentPage: 1,
            perPage: Number(limit),
          }))
        }
        onSelectReview={(review) => {}}
        onApprove={(review) => handleReviewAction(review, "approve")}
        onHide={(review, reason = "") =>
          handleReviewAction(review, "hide", { reason })
        }
        onUnhide={(review) => handleReviewAction(review, "unhide")}
        onReport={(review, reason = "Reported by admin") =>
          handleReviewAction(review, "report", { reason })
        }
        onDelete={(review) => handleReviewAction(review, "delete")}
        onReply={(review, text) =>
          handleReviewAction(review, "reply", { text })
        }
      />

      <div className="container-fluid px-4 pb-4">
        <div className="row g-3">
          <div className="col-lg-3">
            <AverageRatings
              data={analytics.reviewsOverTime}
              loading={analyticsLoading}
            />
          </div>

          <div className="col-lg-3">
            <ReviewsByRatings
              data={analytics.ratingDistribution}
              loading={analyticsLoading}
            />
          </div>

          <div className="col-lg-3">
            <TopRatedWorkers
              workers={analytics.topRatedWorkers}
              loading={analyticsLoading}
            />
          </div>

          <div className="col-lg-3">
            <LowestRatedWorkers
              workers={analytics.lowestRatedWorkers}
              loading={analyticsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
