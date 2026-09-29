import React, { useCallback, useEffect, useState } from "react";

import API from "../../../api/api";

import PaymentsHeader from "../../../components/AdminComponents/Payments/PaymentsHeader";
import RevenueOverview from "../../../components/AdminComponents/Payments/RevenueOverView";
import PaymentMethods from "../../../components/AdminComponents/Payments/PaymentMethods";
import PaymentsFilter from "../../../components/AdminComponents/Payments/PaymentsFilter";
import PaymentsTable from "../../../components/AdminComponents/Payments/PaymentsTable";
import RefundRequests from "../../../components/AdminComponents/Payments/RefundRequest";
import MonthlyRevenueSummary from "../../../components/AdminComponents/Payments/MonthlyRevenueSummary";
import PaymentDetailPanel from "../../../components/AdminComponents/Payments/PaymentDetailPanel";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

export default function Payments() {
  const [stats, setStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    method: "all",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 5,
    totalPayments: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [refundPagination, setRefundPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState({
    stats: false,
    payments: false,
    revenue: false,
    methods: false,
    refunds: false,
    monthlySummary: false,
    details: false,
  });

  const loadStats = useCallback(async () => {
    setLoading((prev) => ({ ...prev, stats: true }));

    try {
      const response = await API.get("/admin/payments/stats");
      const data = getResponseData(response);

      setStats(data || {});
    } catch (error) {
      console.error("Failed to load payment stats:", error);
      setStats({});
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  }, []);

  const loadPayments = useCallback(
    async (page = pagination.currentPage) => {
      setLoading((prev) => ({ ...prev, payments: true }));

      try {
        const params = {
          page,
          limit: pagination.perPage,
          search: filters.search.trim(),
          status: filters.status,
          method: filters.method,
        };

        if (filters.startDate) {
          params.startDate = filters.startDate;
        }

        if (filters.endDate) {
          params.endDate = filters.endDate;
        }

        const response = await API.get("/admin/payments", { params });
        const data = getResponseData(response);

        setPayments(Array.isArray(data?.payments) ? data.payments : []);

        setPagination(
          data?.pagination || {
            currentPage: page,
            perPage: pagination.perPage,
            totalPayments: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          }
        );
      } catch (error) {
        console.error("Failed to load payments:", error);
        setPayments([]);
      } finally {
        setLoading((prev) => ({ ...prev, payments: false }));
      }
    },
    [filters, pagination.currentPage, pagination.perPage]
  );

  const loadRevenue = useCallback(async () => {
    setLoading((prev) => ({ ...prev, revenue: true }));

    try {
      const response = await API.get("/admin/payments/revenue");
      const data = getResponseData(response);

      setRevenue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load revenue:", error);
      setRevenue([]);
    } finally {
      setLoading((prev) => ({ ...prev, revenue: false }));
    }
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    setLoading((prev) => ({ ...prev, methods: true }));

    try {
      const response = await API.get("/admin/payments/methods");
      const data = getResponseData(response);

      setPaymentMethods(Array.isArray(data?.breakdown) ? data.breakdown : []);
    } catch (error) {
      console.error("Failed to load payment methods:", error);
      setPaymentMethods([]);
    } finally {
      setLoading((prev) => ({ ...prev, methods: false }));
    }
  }, []);

  const loadRefunds = useCallback(
    async (page = refundPagination.currentPage) => {
      setLoading((prev) => ({ ...prev, refunds: true }));

      try {
        const response = await API.get("/admin/payments/refunds", {
          params: {
            page,
            limit: refundPagination.perPage,
          },
        });

        const data = getResponseData(response);

        setRefunds(Array.isArray(data?.refunds) ? data.refunds : []);

        setRefundPagination(
          data?.pagination || {
            currentPage: page,
            perPage: refundPagination.perPage,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (error) {
        console.error("Failed to load refunds:", error);
        setRefunds([]);
      } finally {
        setLoading((prev) => ({ ...prev, refunds: false }));
      }
    },
    [refundPagination.currentPage, refundPagination.perPage]
  );

  const loadMonthlySummary = useCallback(async () => {
    setLoading((prev) => ({
      ...prev,
      monthlySummary: true,
    }));

    try {
      const response = await API.get("/admin/payments/monthly-summary");

      const data = getResponseData(response);

      setMonthlySummary(Array.isArray(data?.summary) ? data.summary : []);
    } catch (error) {
      console.error("Failed to load monthly summary:", error);
      setMonthlySummary([]);
    } finally {
      setLoading((prev) => ({
        ...prev,
        monthlySummary: false,
      }));
    }
  }, []);

  const loadPaymentDetails = useCallback(async (payment) => {
    if (!payment?._id) {
      return;
    }

    setSelectedPayment(payment);
    setLoading((prev) => ({
      ...prev,
      details: true,
    }));

    try {
      const response = await API.get(`/admin/payments/${payment._id}`);

      const data = getResponseData(response);

      setPaymentDetails(data || null);
    } catch (error) {
      console.error("Failed to load payment details:", error);
      setPaymentDetails(null);
    } finally {
      setLoading((prev) => ({
        ...prev,
        details: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadRevenue();
    loadPaymentMethods();
    loadMonthlySummary();
    loadRefunds(1);
  }, [
    loadStats,
    loadRevenue,
    loadPaymentMethods,
    loadMonthlySummary,
    loadRefunds,
  ]);

  useEffect(() => {
    loadPayments(pagination.currentPage);
  }, [loadPayments, pagination.currentPage, pagination.perPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      method: "all",
      startDate: "",
      endDate: "",
    });

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePaymentPageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handlePaymentLimitChange = (limit) => {
    setPagination((prev) => ({
      ...prev,
      perPage: Number(limit),
      currentPage: 1,
    }));
  };

  const handleRefundPageChange = (page) => {
    setRefundPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    loadRefunds(page);
  };

  const refreshPaymentData = async () => {
    await Promise.all([
      loadStats(),
      loadPayments(pagination.currentPage),
      loadRefunds(refundPagination.currentPage),
      loadMonthlySummary(),
    ]);

    if (selectedPayment?._id) {
      await loadPaymentDetails(selectedPayment);
    }
  };

  const handleExport = () => {
    if (!payments.length) {
      console.warn("No payments available for export.");
      return;
    }

    const headers = [
      "Payment ID",
      "Booking ID",
      "Customer",
      "Service",
      "Amount",
      "GST",
      "Method",
      "Status",
      "Date",
    ];

    const rows = payments.map((payment) => [
      payment.paymentId || "",
      payment.booking?.bookingId || "",
      payment.customer?.name || "",
      payment.service?.name || "",
      payment.totalAmount ?? 0,
      payment.gst ?? 0,
      payment.paymentMethod || "",
      payment.status || "",
      payment.paymentDate || payment.createdAt || "",
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
    link.download = "payments.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <PaymentsHeader
          stats={stats}
          loading={loading.stats}
          onExport={handleExport}
        />

        <div className="container-fluid px-4 pb-3">
          <div className="row g-3">
            <div className="col-lg-6">
              <RevenueOverview data={revenue} loading={loading.revenue} />
            </div>

            <div className="col-lg-6">
              <PaymentMethods
                data={paymentMethods}
                total={stats.totalRevenue || 0}
                loading={loading.methods}
              />
            </div>
          </div>
        </div>

        <PaymentsFilter
          filters={filters}
          onSearch={(value) => handleFilterChange("search", value)}
          onStatusChange={(value) => handleFilterChange("status", value)}
          onMethodChange={(value) => handleFilterChange("method", value)}
          onStartDateChange={(value) => handleFilterChange("startDate", value)}
          onEndDateChange={(value) => handleFilterChange("endDate", value)}
          onReset={handleResetFilters}
        />

        <PaymentsTable
          payments={payments}
          loading={loading.payments}
          pagination={pagination}
          onSelectPayment={loadPaymentDetails}
          onPageChange={handlePaymentPageChange}
          onPageLimitChange={handlePaymentLimitChange}
        />

        <div className="container-fluid px-4 pb-4">
          <div className="row g-3">
            <div className="col-lg-6">
              <RefundRequests
                refunds={refunds}
                loading={loading.refunds}
                pagination={refundPagination}
                onPageChange={handleRefundPageChange}
                onRefresh={refreshPaymentData}
              />
            </div>

            <div className="col-lg-6">
              <MonthlyRevenueSummary
                data={monthlySummary}
                loading={loading.monthlySummary}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedPayment && (
        <PaymentDetailPanel
          payment={paymentDetails?.payment || selectedPayment}
          refunds={paymentDetails?.refunds || []}
          loading={loading.details}
          onClose={() => {
            setSelectedPayment(null);
            setPaymentDetails(null);
          }}
        />
      )}
    </div>
  );
}
