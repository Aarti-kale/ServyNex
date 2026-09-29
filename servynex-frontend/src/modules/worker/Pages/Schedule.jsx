import React, { useEffect, useState } from "react";

import AvailabilityStatus from "../../../components/WorkerComponents/ScheduleComponent/AvailabilityStatus";
import ScheduleHeader from "../../../components/WorkerComponents/ScheduleComponent/ScheduleHeader";
import TodaysSchedule from "../../../components/WorkerComponents/ScheduleComponent/TodaysSchedule";
import UpcomingSchedule from "../../../components/WorkerComponents/DashbaordComponents/UpcomingSchedule";
import WorkingHours from "../../../components/WorkerComponents/ScheduleComponent/WorkingHours";

import API from "../../../api/api";

export default function Schedule() {
  const [dashboardData, setDashboardData] = useState(null);
  const [todayJobs, setTodayJobs] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, todayResponse, upcomingResponse] =
        await Promise.all([
          API.get("/workers/dashboard"),
          API.get("/workers/today-jobs"),
          API.get("/workers/upcoming-schedule"),
        ]);

      setDashboardData(dashboardResponse?.data?.data || null);

      setTodayJobs(todayResponse?.data?.data?.jobs || []);

      setUpcomingSchedule(
        Array.isArray(upcomingResponse?.data?.data)
          ? upcomingResponse.data.data
          : []
      );
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load schedule data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const handleAvailabilityChange = async (availability) => {
    try {
      setError("");

      await API.put("/workers/availability", {
        availability,
      });

      await fetchScheduleData();
    } catch (error) {
      console.error("Failed to update availability:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to update availability. Please try again."
      );
    }
  };

  return (
    <>
      <ScheduleHeader
        dashboard={dashboardData}
        overview={dashboardData?.overview}
        loading={loading}
      />

      <div className="container pb-2">
        <div className="row g-3">
          <div className="col-lg-6">
            <TodaysSchedule
              jobs={todayJobs}
              loading={loading}
              error={error}
              onRetry={fetchScheduleData}
            />
          </div>

          <div className="col-lg-6">
            <UpcomingSchedule
              schedule={upcomingSchedule}
              loading={loading}
              error={error}
              onRetry={fetchScheduleData}
            />
          </div>
        </div>
      </div>

      <AvailabilityStatus
        availability={dashboardData?.worker?.availability}
        loading={loading}
        onAvailabilityChange={handleAvailabilityChange}
      />

      <WorkingHours />
    </>
  );
}
