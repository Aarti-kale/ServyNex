import React, { useEffect, useState } from "react";
import API from "../../../api/api";

import OverView from "../../../components/WorkerComponents/DashbaordComponents/OverView";
import TodayJobs from "../../../components/WorkerComponents/DashbaordComponents/TodayJobs";
import WelcomeWorker from "../../../components/WorkerComponents/DashbaordComponents/WelcomeWorker";
import Notifications from "../../../components/WorkerComponents/DashbaordComponents/Notifications";
import RecentReview from "../../../components/WorkerComponents/DashbaordComponents/RecentReview";
import UpcomingSchedule from "../../../components/WorkerComponents/DashbaordComponents/UpcomingSchedule";
import SalarySummary from "../../../components/WorkerComponents/DashbaordComponents/SaalarySummary";

export default function WorkerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/workers/dashboard");

        const dashboardData = response?.data?.data;

        if (!dashboardData) {
          throw new Error("Dashboard data not found");
        }

        setDashboard(dashboardData);
      } catch (error) {
        console.error(
          "WORKER DASHBOARD ERROR:",
          error?.response?.data || error?.message
        );

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  if (!dashboard) {
    return (
      <div className="alert alert-warning m-4">No dashboard data found.</div>
    );
  }

  return (
    <>
      <WelcomeWorker worker={dashboard.worker} />

      <OverView overview={dashboard.overview} />

      <div className="container py-2">
        <div className="row g-3">
          <div className="col-lg-6">
            <TodayJobs />
          </div>

          <div className="col-lg-6">
            <UpcomingSchedule />
          </div>
        </div>
      </div>

      <div className="container py-2 pb-4">
        <div className="row g-3">
          <div className="col-lg-4">
            <Notifications />
          </div>

          <div className="col-lg-4">
            <RecentReview />
          </div>

          <div className="col-lg-4">
            <SalarySummary />
          </div>
        </div>
      </div>
    </>
  );
}
