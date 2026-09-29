import React, { useEffect, useState } from "react";

import BankDetails from "../../../components/WorkerComponents/SalarysComponents/BankDetails";
import PaymentSummary from "../../../components/WorkerComponents/SalarysComponents/PaymentSummary";
import RecentTransactions from "../../../components/WorkerComponents/RecentTransactions";
import SalarysHeader from "../../../components/WorkerComponents/SalarysComponents/SalaryHeader";
import SalarysHistory from "../../../components/WorkerComponents/SalarysComponents/SalaryHistory";

import API from "../../../api/api";

export default function Salarys() {
  const [salaryData, setSalaryData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  const [period, setPeriod] = useState("month");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(true);
  const [bankLoading, setBankLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankError, setBankError] = useState("");

  const fetchSalary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/workers/salary", {
        params: {
          period,
          search,
          page,
          limit,
        },
      });

      setSalaryData(response?.data?.data || null);
    } catch (error) {
      console.error("Failed to fetch worker salary:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load earnings data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      setBankLoading(true);
      setBankError("");

      const response = await API.get("/workers/salary/bank-details");

      setBankDetails(response?.data?.data || {});
    } catch (error) {
      console.error("Failed to fetch bank details:", error);

      setBankError(
        error?.response?.data?.message || "Unable to load bank details."
      );
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, [period, search, page, limit]);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleBankUpdate = async () => {
    await fetchBankDetails();
  };

  return (
    <>
      <SalarysHeader
        onPeriodChange={handlePeriodChange}
        period={period}
        salary={salaryData?.salary}
        loading={loading}
      />

      <SalarysHistory
        history={salaryData?.history || []}
        pagination={salaryData?.pagination}
        filters={salaryData?.filters}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onRetry={fetchSalary}
        onViewDetails={(row) => console.log("View:", row)}
      />

      <div className="container pb-2">
        <div className="row g-3">
          <div className="col-lg-6">
            <PaymentSummary
              summary={salaryData?.salarySummary}
              loading={loading}
            />
          </div>

          <div className="col-lg-6">
            <RecentTransactions
              transactions={salaryData?.recentTransactions || []}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <BankDetails
        bankDetails={bankDetails || {}}
        loading={bankLoading}
        error={bankError}
        onUpdate={handleBankUpdate}
      />
    </>
  );
}
