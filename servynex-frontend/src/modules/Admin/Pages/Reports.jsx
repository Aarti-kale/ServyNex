import React, { useCallback, useEffect, useMemo, useState } from "react";

import API from "../../../api/api";

import BookingStatusChart from "../../../components/AdminComponents/Reports/BookingStatusChart";
import BookingsCategoryChart from "../../../components/AdminComponents/Reports/BookingsCategoryChart";
import CustomerGrowth from "../../../components/AdminComponents/Reports/CustomerGrowth";
import ExportReports from "../../../components/AdminComponents/Reports/ExportReports";
import MonthlySummary from "../../../components/AdminComponents/Reports/MonthlySummary";
import ReportsHeader from "../../../components/AdminComponents/Reports/ReportsHeader";
import ReportsStatsCards from "../../../components/AdminComponents/Reports/ReportsStatsCard";
import RevenueTrendChart from "../../../components/AdminComponents/Reports/RevenueTrendChart";
import ServicePerformance from "../../../components/AdminComponents/Reports/ServicePerformance";
import TopCustomerLocations from "../../../components/AdminComponents/Reports/TopCustomersLocations";
import WorkerPerformance from "../../../components/AdminComponents/Reports/WorkerPerformance";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? {};
};

const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultDateRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    startDate: formatDateForApi(start),
    endDate: formatDateForApi(now),
  };
};

export default function Reports() {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);

  const [filters, setFilters] = useState({
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    period: "month",
  });

  const [overview, setOverview] = useState({});

  const [revenueTrend, setRevenueTrend] = useState([]);
  const [bookingsByCategory, setBookingsByCategory] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({
    total: 0,
    statuses: [],
  });

  const [servicePerformance, setServicePerformance] = useState([]);
  const [workerPerformance, setWorkerPerformance] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [customerLocations, setCustomerLocations] = useState([]);

  const [loading, setLoading] = useState({
    overview: true,
    revenueTrend: true,
    bookingsCategory: true,
    bookingStatus: true,
    servicePerformance: true,
    workerPerformance: true,
    customerGrowth: true,
    monthlySummary: true,
    customerLocations: true,
  });

  const [error, setError] = useState("");

  const getReportParams = useCallback(() => {
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
    };
  }, [filters.startDate, filters.endDate]);

  const fetchReports = useCallback(async () => {
    setError("");

    setLoading({
      overview: true,
      revenueTrend: true,
      bookingsCategory: true,
      bookingStatus: true,
      servicePerformance: true,
      workerPerformance: true,
      customerGrowth: true,
      monthlySummary: true,
      customerLocations: true,
    });

    const params = getReportParams();

    const requests = [
      API.get("/admin/reports/overview", { params }),
      API.get("/admin/reports/revenue-trend", { params }),
      API.get("/admin/reports/bookings-by-category", { params }),
      API.get("/admin/reports/booking-status", { params }),
      API.get("/admin/reports/service-performance", { params }),
      API.get("/admin/reports/worker-performance", { params }),
      API.get("/admin/reports/customer-growth", { params }),
      API.get("/admin/reports/monthly-summary", { params }),
      API.get("/admin/reports/customer-locations", { params }),
    ];

    const results = await Promise.allSettled(requests);

    const [
      overviewResult,
      revenueTrendResult,
      categoryResult,
      statusResult,
      serviceResult,
      workerResult,
      growthResult,
      monthlyResult,
      locationsResult,
    ] = results;

    if (overviewResult.status === "fulfilled") {
      const data = getResponseData(overviewResult.value);

      setOverview(data?.overview || {});
    }

    if (revenueTrendResult.status === "fulfilled") {
      const data = getResponseData(revenueTrendResult.value);

      setRevenueTrend(Array.isArray(data) ? data : []);
    }

    if (categoryResult.status === "fulfilled") {
      const data = getResponseData(categoryResult.value);

      setBookingsByCategory(Array.isArray(data) ? data : []);
    }

    if (statusResult.status === "fulfilled") {
      const data = getResponseData(statusResult.value);

      setBookingStatus({
        total: Number(data?.total) || 0,
        statuses: Array.isArray(data?.statuses) ? data.statuses : [],
      });
    }

    if (serviceResult.status === "fulfilled") {
      const data = getResponseData(serviceResult.value);

      setServicePerformance(Array.isArray(data) ? data : []);
    }

    if (workerResult.status === "fulfilled") {
      const data = getResponseData(workerResult.value);

      setWorkerPerformance(Array.isArray(data) ? data : []);
    }

    if (growthResult.status === "fulfilled") {
      const data = getResponseData(growthResult.value);

      setCustomerGrowth(Array.isArray(data) ? data : []);
    }

    if (monthlyResult.status === "fulfilled") {
      const data = getResponseData(monthlyResult.value);

      setMonthlySummary(Array.isArray(data) ? data : []);
    }

    if (locationsResult.status === "fulfilled") {
      const data = getResponseData(locationsResult.value);

      setCustomerLocations(Array.isArray(data) ? data : []);
    }

    const hasFailure = results.some((result) => result.status === "rejected");

    if (hasFailure) {
      setError("Some report data could not be loaded.");
    }

    setLoading({
      overview: false,
      revenueTrend: false,
      bookingsCategory: false,
      bookingStatus: false,
      servicePerformance: false,
      workerPerformance: false,
      customerGrowth: false,
      monthlySummary: false,
      customerLocations: false,
    });
  }, [getReportParams]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setFilters((previous) => ({
      ...previous,
      startDate,
      endDate,
    }));
  }, []);

  const handlePeriodChange = useCallback((period) => {
    const now = new Date();

    if (period === "year") {
      const start = new Date(now.getFullYear(), 0, 1);

      setFilters({
        startDate: formatDateForApi(start),
        endDate: formatDateForApi(now),
        period: "year",
      });

      return;
    }

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    setFilters({
      startDate: formatDateForApi(start),
      endDate: formatDateForApi(now),
      period: "month",
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    const range = getDefaultDateRange();

    setFilters({
      startDate: range.startDate,
      endDate: range.endDate,
      period: "month",
    });
  }, []);

  const handleExport = useCallback((type) => {
    if (type === "print") {
      window.print();
      return;
    }
    console.warn(`Report export requested: ${type}`);
  }, []);

  const reportData = useMemo(
    () => ({
      overview,
      revenueTrend,
      bookingsByCategory,
      bookingStatus,
      servicePerformance,
      workerPerformance,
      customerGrowth,
      monthlySummary,
      customerLocations,
    }),
    [
      overview,
      revenueTrend,
      bookingsByCategory,
      bookingStatus,
      servicePerformance,
      workerPerformance,
      customerGrowth,
      monthlySummary,
      customerLocations,
    ]
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <ReportsHeader
        stats={overview}
        startDate={filters.startDate}
        endDate={filters.endDate}
        period={filters.period}
        loading={loading.overview}
        onDateRangeChange={handleDateRangeChange}
        onPeriodChange={handlePeriodChange}
        onResetFilters={handleResetFilters}
        onExport={handleExport}
      />

      {error && (
        <div className="container-fluid px-4 pt-3">
          <div className="alert alert-warning mb-0">{error}</div>
        </div>
      )}

      <ReportsStatsCards stats={overview} loading={loading.overview} />

      <div className="container-fluid px-4 pb-3">
        <div className="row g-3">
          <div className="col-lg-4">
            <RevenueTrendChart
              data={reportData.revenueTrend}
              loading={loading.revenueTrend}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          <div className="col-lg-4">
            <BookingsCategoryChart
              data={reportData.bookingsByCategory}
              loading={loading.bookingsCategory}
            />
          </div>

          <div className="col-lg-4">
            <BookingStatusChart
              data={reportData.bookingStatus.statuses}
              total={reportData.bookingStatus.total}
              loading={loading.bookingStatus}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 pb-3">
        <div className="row g-3">
          <div className="col-lg-4">
            <ServicePerformance
              data={reportData.servicePerformance}
              loading={loading.servicePerformance}
            />
          </div>

          <div className="col-lg-4">
            <WorkerPerformance
              data={reportData.workerPerformance}
              loading={loading.workerPerformance}
            />
          </div>

          <div className="col-lg-4">
            <CustomerGrowth
              data={reportData.customerGrowth}
              loading={loading.customerGrowth}
              onPeriodChange={handlePeriodChange}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 pb-4">
        <div className="row g-3">
          <div className="col-lg-5">
            <MonthlySummary
              data={reportData.monthlySummary}
              loading={loading.monthlySummary}
            />
          </div>

          <div className="col-lg-4">
            <TopCustomerLocations
              data={reportData.customerLocations}
              loading={loading.customerLocations}
            />
          </div>

          <div className="col-lg-3">
            <ExportReports
              onExportPdf={() => handleExport("pdf")}
              onExportExcel={() => handleExport("excel")}
              onPrint={() => handleExport("print")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
