import React, { useEffect, useState } from "react";

import API from "../../../api/api.js";

import DashboardHeader from "../../../components/AdminComponents/Dashboard/DashboardHeader";
import PendingApprovals from "../../../components/AdminComponents/Dashboard/PendingApprovals";
import QuickActions from "../../../components/AdminComponents/Dashboard/QuickActions";
import RecentBookings from "../../../components/AdminComponents/Dashboard/RecentBookings";
import RecentReviews from "../../../components/AdminComponents/Dashboard/RecentReviews";
import RevenueOverview from "../../../components/AdminComponents/Dashboard/RevenueOverview";
import WebsiteStatus from "../../../components/AdminComponents/Dashboard/WebsiteStauts";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [pendingApprovals, setPendingApprovals] = useState(null);

  const [revenueOverview, setRevenueOverview] = useState(null);

  const [websiteStatus, setWebsiteStatus] = useState(null);

  const [recentReviews, setRecentReviews] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResponse,
          approvalsResponse,
          revenueResponse,
          websiteStatusResponse,
          reviewsResponse,
        ] = await Promise.all([
          API.get("/admin/dashboard-overview"),

          API.get("/admin/pending-approvals"),

          API.get("/admin/revenue-overview"),

          API.get("/admin/website-status"),

          API.get("/admin/recent-reviews"),
        ]);

        if (!dashboardResponse.data?.success) {
          throw new Error(
            dashboardResponse.data?.message || "Failed to fetch dashboard data"
          );
        }

        setDashboardData(dashboardResponse.data.data);

        if (approvalsResponse.data?.success) {
          setPendingApprovals(approvalsResponse.data.data);
        }

        if (revenueResponse.data?.success) {
          setRevenueOverview(revenueResponse.data.data);
        }

        if (websiteStatusResponse.data?.success) {
          setWebsiteStatus(websiteStatusResponse.data.data);
        }

        if (reviewsResponse.data?.success) {
          setRecentReviews(reviewsResponse.data.data);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid px-4 py-5">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border"
            role="status"
            style={{ color: "#0e8a5f" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-4 py-5">
        <div className="alert alert-danger rounded-3" role="alert">
          <strong>Dashboard Error:</strong> {error}
        </div>
      </div>
    );
  }

  const dashboard = dashboardData || {};

  const header = dashboard.header || {};

  const recentBookings = dashboard.recentBookings || [];

  const approvals = pendingApprovals?.workers || [];

  const reviews = recentReviews?.reviews || [];

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <DashboardHeader adminName="Admin" date={currentDate} data={header} />

      <div className="container-fluid px-4 pb-3">
        <div className="row g-3">
          <div className="col-lg-5">
            <RecentBookings data={recentBookings} />
          </div>

          <div className="col-lg-3">
            <PendingApprovals
              data={approvals}
              count={pendingApprovals?.count || 0}
            />
          </div>

          <div className="col-lg-4">
            <RevenueOverview data={revenueOverview} />
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 pb-4">
        <div className="row g-3">
          <div className="col-lg-5">
            <RecentReviews data={reviews} count={recentReviews?.count || 0} />
          </div>

          <div className="col-lg-3">
            <QuickActions onAction={(action) => {}} />
          </div>

          <div className="col-lg-4">
            <WebsiteStatus data={websiteStatus} />
          </div>
        </div>
      </div>
    </>
  );
}
