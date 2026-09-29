import React, { useCallback, useEffect, useState } from "react";

import API from "../../../api/api";

import BookingDetails from "../../../components/AdminComponents/Bookings/BookingDetails";
import BookingFilters from "../../../components/AdminComponents/Bookings/BookingFilters";
import BookingStats from "../../../components/AdminComponents/Bookings/BookingStats";
import BookingTable from "../../../components/AdminComponents/Bookings/BookingTable";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? {};
};

const getInitialFilters = () => ({
  search: "",
  status: "all",
  service: "all",
  startDate: "",
  endDate: "",
});

export default function Bookings() {
  const [stats, setStats] = useState({});
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalBookings: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [filters, setFilters] = useState(getInitialFilters);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState({
    stats: true,
    bookings: true,
    details: false,
    action: false,
  });

  const [error, setError] = useState("");

  const fetchBookingStats = useCallback(async () => {
    try {
      setLoading((previous) => ({
        ...previous,
        stats: true,
      }));

      const response = await API.get("/admin/bookings/stats");

      const data = getResponseData(response);

      setStats(data || {});
    } catch (error) {
      console.error("fetchBookingStats error:", error);

      setError("Failed to load booking statistics.");
    } finally {
      setLoading((previous) => ({
        ...previous,
        stats: false,
      }));
    }
  }, []);

  const fetchBookings = useCallback(
    async (page = 1, limit = pagination.perPage) => {
      try {
        setLoading((previous) => ({
          ...previous,
          bookings: true,
        }));

        const params = {
          search: filters.search.trim(),
          status: filters.status,
          service: filters.service,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          page,
          limit,
        };

        const response = await API.get("/admin/bookings", {
          params,
        });

        const data = getResponseData(response);

        setBookings(Array.isArray(data?.bookings) ? data.bookings : []);

        setPagination(
          data?.pagination || {
            currentPage: page,
            perPage: limit,
            totalBookings: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } catch (error) {
        console.error("fetchBookings error:", error);

        setBookings([]);
        setError("Failed to load bookings.");
      } finally {
        setLoading((previous) => ({
          ...previous,
          bookings: false,
        }));
      }
    },
    [
      filters.search,
      filters.status,
      filters.service,
      filters.startDate,
      filters.endDate,
      pagination.perPage,
    ]
  );

  const fetchBookingDetails = useCallback(async (booking) => {
    if (!booking?._id) {
      return;
    }

    try {
      setLoading((previous) => ({
        ...previous,
        details: true,
      }));

      const response = await API.get(`/admin/bookings/${booking._id}`);

      const data = getResponseData(response);

      setSelectedBooking(data || booking);
    } catch (error) {
      console.error("fetchBookingDetails error:", error);

      setError("Failed to load booking details.");
    } finally {
      setLoading((previous) => ({
        ...previous,
        details: false,
      }));
    }
  }, []);

  const handleSelectBooking = useCallback(
    (booking) => {
      fetchBookingDetails(booking);
    },
    [fetchBookingDetails]
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedBooking(null);
  }, []);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters((previous) => ({
      ...previous,
      ...nextFilters,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(getInitialFilters);
    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination((previous) => ({
      ...previous,
      currentPage: page,
    }));
  }, []);

  const handlePageLimitChange = useCallback((limit) => {
    const nextLimit = Number(limit);

    if (!Number.isFinite(nextLimit) || nextLimit < 1) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
      perPage: nextLimit,
    }));
  }, []);

  const handleAssignWorker = useCallback(
    async (workerId) => {
      if (!selectedBooking?._id || !workerId) {
        return;
      }

      try {
        setLoading((previous) => ({
          ...previous,
          action: true,
        }));

        const response = await API.put(
          `/admin/bookings/${selectedBooking._id}/assign-worker`,
          {
            workerId,
          }
        );

        const updatedBooking = getResponseData(response);

        setSelectedBooking(updatedBooking);

        await fetchBookings(pagination.currentPage, pagination.perPage);

        await fetchBookingStats();
      } catch (error) {
        console.error("handleAssignWorker error:", error);

        setError(error?.response?.data?.message || "Failed to assign worker.");
      } finally {
        setLoading((previous) => ({
          ...previous,
          action: false,
        }));
      }
    },
    [
      selectedBooking,
      pagination.currentPage,
      pagination.perPage,
      fetchBookings,
      fetchBookingStats,
    ]
  );

  const handleRescheduleBooking = useCallback(
    async (date) => {
      if (!selectedBooking?._id || !date) {
        return;
      }

      try {
        setLoading((previous) => ({
          ...previous,
          action: true,
        }));

        const response = await API.put(
          `/admin/bookings/${selectedBooking._id}/reschedule`,
          {
            date,
          }
        );

        const updatedBooking = getResponseData(response);

        setSelectedBooking(updatedBooking);

        await fetchBookings(pagination.currentPage, pagination.perPage);
      } catch (error) {
        console.error("handleRescheduleBooking error:", error);

        setError(
          error?.response?.data?.message || "Failed to reschedule booking."
        );
      } finally {
        setLoading((previous) => ({
          ...previous,
          action: false,
        }));
      }
    },
    [selectedBooking, pagination.currentPage, pagination.perPage, fetchBookings]
  );

  const handleCancelBooking = useCallback(async () => {
    if (!selectedBooking?._id) {
      return;
    }

    try {
      setLoading((previous) => ({
        ...previous,
        action: true,
      }));

      const response = await API.put(
        `/admin/bookings/${selectedBooking._id}/cancel`
      );

      const updatedBooking = getResponseData(response);

      setSelectedBooking(updatedBooking);

      await fetchBookings(pagination.currentPage, pagination.perPage);

      await fetchBookingStats();
    } catch (error) {
      console.error("handleCancelBooking error:", error);

      setError(error?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setLoading((previous) => ({
        ...previous,
        action: false,
      }));
    }
  }, [
    selectedBooking,
    pagination.currentPage,
    pagination.perPage,
    fetchBookings,
    fetchBookingStats,
  ]);

  const handleCompleteBooking = useCallback(async () => {
    if (!selectedBooking?._id) {
      return;
    }

    try {
      setLoading((previous) => ({
        ...previous,
        action: true,
      }));

      const response = await API.put(
        `/admin/bookings/${selectedBooking._id}/complete`
      );

      const updatedBooking = getResponseData(response);

      setSelectedBooking(updatedBooking);

      await fetchBookings(pagination.currentPage, pagination.perPage);

      await fetchBookingStats();
    } catch (error) {
      console.error("handleCompleteBooking error:", error);

      setError(error?.response?.data?.message || "Failed to complete booking.");
    } finally {
      setLoading((previous) => ({
        ...previous,
        action: false,
      }));
    }
  }, [
    selectedBooking,
    pagination.currentPage,
    pagination.perPage,
    fetchBookings,
    fetchBookingStats,
  ]);

  useEffect(() => {
    fetchBookingStats();
  }, [fetchBookingStats]);

  useEffect(() => {
    fetchBookings(pagination.currentPage, pagination.perPage);
  }, [fetchBookings, pagination.currentPage, pagination.perPage]);

  useEffect(() => {
    if (!loading.bookings && !loading.stats) {
      setError("");
    }
  }, [filters, loading.bookings, loading.stats]);

  return (
    <div style={{ minHeight: "100vh" }}>
      {error && (
        <div className="container-fluid px-4 pt-3">
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      )}

      <BookingStats stats={stats} loading={loading.stats} />

      <BookingFilters
        filters={filters}
        services={services}
        loading={loading.bookings}
        onFiltersChange={handleFiltersChange}
        onFilter={() => fetchBookings(1, pagination.perPage)}
        onReset={handleResetFilters}
      />
      <BookingTable
        bookings={bookings}
        pagination={pagination}
        loading={loading.bookings}
        onSelectBooking={handleSelectBooking}
        onPageChange={handlePageChange}
        onPageLimitChange={handlePageLimitChange}
      />

      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          loading={loading.details}
          actionLoading={loading.action}
          onClose={handleCloseDetails}
          onAssignWorker={handleAssignWorker}
          onReschedule={handleRescheduleBooking}
          onCancel={handleCancelBooking}
          onComplete={handleCompleteBooking}
        />
      )}
    </div>
  );
}
