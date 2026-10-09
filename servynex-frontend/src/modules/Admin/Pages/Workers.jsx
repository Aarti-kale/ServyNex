import { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import CustomersFilter from "../../../components/AdminComponents/Customers/CustomerFilter";
import WorkerDetails from "../../../components/AdminComponents/Workers/WorkersDetails";
import WorkersStats from "../../../components/AdminComponents/Workers/WorkersStats";
import WorkersTable from "../../../components/AdminComponents/Workers/WorkersTable";
import AddWorkerPanel from "../../../components/AdminComponents/Workers/AddWorkerPanel";

import API from "../../../api/api";

const getResponseData = (response) => {
  return response?.data?.data;
};

export default function Workers() {
  const [workers, setWorkers] = useState([]);

  const [stats, setStats] = useState(null);

  const [selectedWorker, setSelectedWorker] = useState(null);

  const [workerReviews, setWorkerReviews] = useState([]);

  const [workerActivity, setWorkerActivity] = useState([]);

  const [showAddWorker, setShowAddWorker] = useState(false);

  const [loading, setLoading] = useState(true);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    verification: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [pageLimit, setPageLimit] = useState(10);

  const [pagination, setPagination] = useState(null);

  const loadWorkers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: pageLimit,
      };

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      if (filters.verification && filters.verification !== "all") {
        params.verification = filters.verification;
      }

      const response = await API.get("/admin/workers", {
        params,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch workers");
      }

      const data = getResponseData(response);

      const workerList = Array.isArray(data) ? data : data?.workers || [];

      setWorkers(workerList);

      setPagination(Array.isArray(data) ? null : data?.pagination || null);
    } catch (error) {
      console.error("WORKERS FETCH ERROR:", error);

      setWorkers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageLimit, filters]);

  const loadWorkerStats = useCallback(async () => {
    try {
      const response = await API.get("/admin/workers/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch worker stats"
        );
      }

      setStats(getResponseData(response));
    } catch (error) {
      console.error("WORKER STATS ERROR:", error);

      setStats(null);
    }
  }, []);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  useEffect(() => {
    loadWorkerStats();
  }, [loadWorkerStats]);

  const handleSearch = (search) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      search,
    }));
  };

  const handleStatusChange = (status) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      status: status || "all",
    }));
  };

  const handleVerificationChange = (verification) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      verification: verification || "all",
    }));
  };

  const handlePageChange = (page) => {
    if (!page || page < 1) return;

    setCurrentPage(page);
  };

  const handlePageLimitChange = (limit) => {
    const nextLimit = Number(limit);

    if (!Number.isFinite(nextLimit) || nextLimit < 1) {
      return;
    }

    setCurrentPage(1);
    setPageLimit(nextLimit);
  };

  const handleSelectWorker = async (worker) => {
    if (!worker?._id) return;

    try {
      setDetailsLoading(true);

      setSelectedWorker(null);
      setWorkerReviews([]);
      setWorkerActivity([]);

      const [detailsResponse, reviewsResponse, activityResponse] =
        await Promise.all([
          API.get(`/admin/workers/${worker._id}`),
          API.get(`/admin/workers/${worker._id}/reviews`),
          API.get(`/admin/workers/${worker._id}/activity`),
        ]);

      if (!detailsResponse.data?.success) {
        throw new Error(
          detailsResponse.data?.message || "Failed to fetch worker details"
        );
      }

      const detailsData = getResponseData(detailsResponse);
      const reviewsData = getResponseData(reviewsResponse);
      const activityData = getResponseData(activityResponse);

      const workerDetails = {
        ...(detailsData?.worker || worker),
        statistics: detailsData?.statistics || {},
        recentBookings: detailsData?.recentBookings || [],
      };

      setSelectedWorker(workerDetails);

      setWorkerReviews(
        Array.isArray(reviewsData) ? reviewsData : reviewsData?.reviews || []
      );

      setWorkerActivity(
        Array.isArray(activityData)
          ? activityData
          : activityData?.activity || []
      );
    } catch (error) {
      console.error("WORKER DETAILS ERROR:", error);

      setSelectedWorker(null);
      setWorkerReviews([]);
      setWorkerActivity([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedWorker(null);
    setWorkerReviews([]);
    setWorkerActivity([]);
    setDetailsLoading(false);
  };

  return (
    <>
      <WorkersStats stats={stats}
      onAddWorker={() => setShowAddWorker(true)} />

      <CustomersFilter
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onVerificationChange={handleVerificationChange}
      />

      <WorkersTable
        workers={workers}
        loading={loading}
        pagination={pagination}
        onSelectWorker={handleSelectWorker}
        onPageChange={handlePageChange}
        pageLimit={pageLimit}
        onPageLimitChange={handlePageLimitChange}
      />
{showAddWorker && (
  <AddWorkerPanel
    onClose={() => setShowAddWorker(false)}
    onSuccess={async () => {
      setShowAddWorker(false);
      await Promise.all([
        loadWorkers(),
        loadWorkerStats(),
      ]);
    }}
  />
)}
      {selectedWorker && (
        <WorkerDetails
          worker={selectedWorker}
          reviews={workerReviews}
          activity={workerActivity}
          loading={detailsLoading}
          onClose={handleCloseDetails}
        />
      )}

      
    </>
  );
}
