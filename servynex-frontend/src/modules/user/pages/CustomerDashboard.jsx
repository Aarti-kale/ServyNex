import { useEffect, useState } from "react";

import API from "../../../api/api";

import Addresses from "../../../components/UserComponent/DashboardComponents/Addresses";
import LogoutBanner from "../../../components/UserComponent/DashboardComponents/LogoutBanner";
import MyBookings from "../../../components/UserComponent/DashboardComponents/MyBookings";
import ProfileCard from "../../../components/UserComponent/DashboardComponents/ProfileCard";
import TrustStats from "../../../components/UserComponent/DashboardComponents/TrustStats";
import WelcomeProfile from "../../../components/UserComponent/DashboardComponents/WelcomeProfile";

export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, bookingsResponse, addressesResponse] =
          await Promise.all([
            API.get("/users/profile"),
            API.get("/users/bookings"),
            API.get("/users/addresses"),
          ]);

        setProfile(profileResponse?.data?.data || null);

        setBookings(bookingsResponse?.data?.data?.bookings || []);

        setAddresses(addressesResponse?.data?.data || []);
      } catch (err) {
        console.error("User home data error:", err);

        setError(
          err?.response?.data?.message || "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary mb-0">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <WelcomeProfile profile={profile} />

      <ProfileCard profile={profile} />

      <Addresses addresses={addresses} />

      <MyBookings bookings={bookings} />

      <LogoutBanner />

      <TrustStats />
    </>
  );
}
