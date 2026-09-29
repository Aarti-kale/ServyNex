import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import CustomersHeader from "../../../components/AdminComponents/Customers/Customersheader";
import CustomersFilter from "../../../components/AdminComponents/Customers/CustomerFilter";
import CustomersTable from "../../../components/AdminComponents/Customers/CustomersTable";
import CustomerDetails from "../../../components/AdminComponents/Customers/CustomerDetails";

import API from "../../../api/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [stats, setStats] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customerReviews, setCustomerReviews] = useState([]);
  const [customerActivity, setCustomerActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    city: "",
    sort: "",
  });

  const [pagination, setPagination] = useState(null);

  const getResponseData = (response) => {
    return response?.data?.data;
  };

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.city) {
        params.city = filters.city;
      }

      if (filters.sort) {
        params.sort = filters.sort;
      }

      const response = await API.get("/admin/customers", {
        params,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch customers");
      }

      const data = getResponseData(response);

      const customerList = Array.isArray(data) ? data : data?.customers || [];

      setCustomers(customerList);

      setPagination(Array.isArray(data) ? null : data?.pagination || null);
    } catch (error) {
      console.error("CUSTOMERS FETCH ERROR:", error);
      setCustomers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadCustomerStats = useCallback(async () => {
    try {
      const response = await API.get("/admin/customers/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch customer stats"
        );
      }

      setStats(getResponseData(response));
    } catch (error) {
      console.error("CUSTOMER STATS ERROR:", error);
      setStats(null);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    loadCustomerStats();
  }, [loadCustomerStats]);

  const handleSearch = (search) => {
    setFilters((previous) => ({
      ...previous,
      search,
    }));
  };

  const handleStatusChange = (status) => {
    setFilters((previous) => ({
      ...previous,
      status,
    }));
  };

  const handleCityChange = (city) => {
    setFilters((previous) => ({
      ...previous,
      city,
    }));
  };

  const handleSortChange = (sort) => {
    setFilters((previous) => ({
      ...previous,
      sort,
    }));
  };

  const handleFilter = () => {
    loadCustomers();
  };
  const handleSelectCustomer = async (customer) => {
    if (!customer?._id) return;

    try {
      setDetailsLoading(true);

      const [detailsResponse, reviewsResponse, activityResponse] =
        await Promise.all([
          API.get(`/admin/customers/${customer._id}`),
          API.get(`/admin/customers/${customer._id}/reviews`),
          API.get(`/admin/customers/${customer._id}/activity`),
        ]);

      if (!detailsResponse.data?.success) {
        throw new Error(
          detailsResponse.data?.message || "Failed to fetch customer details"
        );
      }

      const detailsData = getResponseData(detailsResponse);
      const reviewsData = getResponseData(reviewsResponse);
      const activityData = getResponseData(activityResponse);

      const customerDetails = {
        ...(detailsData?.customer || customer),

        stats: detailsData?.statistics || {},
        recentBookings: detailsData?.recentBookings || [],
      };

      setSelectedCustomer(customerDetails);

      setCustomerReviews(
        Array.isArray(reviewsData) ? reviewsData : reviewsData?.reviews || []
      );

      setCustomerActivity(
        Array.isArray(activityData)
          ? activityData
          : activityData?.activity || []
      );
    } catch (error) {
      console.error("CUSTOMER DETAILS ERROR:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setCustomerReviews([]);
    setCustomerActivity([]);
  };

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        className="flex-grow-1"
        style={{
          minWidth: 0,
        }}
      >
        <CustomersHeader
          stats={stats}
          onExport={() => {}}
          onAddCustomer={() => {}}
        />

        <CustomersFilter
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onCityChange={handleCityChange}
          onSortChange={handleSortChange}
          onFilter={handleFilter}
        />

        <CustomersTable
          customers={customers}
          loading={loading}
          pagination={pagination}
          onSelectCustomer={handleSelectCustomer}
        />
      </div>

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          reviews={customerReviews}
          activity={customerActivity}
          loading={detailsLoading}
          onClose={handleCloseDetails}
          onBlock={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
}
