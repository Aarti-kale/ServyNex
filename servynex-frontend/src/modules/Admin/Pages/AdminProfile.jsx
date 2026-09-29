import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../../api/api";

import ProfileHeader from "../../../components/AdminComponents/Profile/ProfileHeader";
import PersonalInfoCard from "../../../components/AdminComponents/Profile/PersonalInfoCard";
import AccountInfoCard from "../../../components/AdminComponents/Profile/AccountInfoCard";
import SecurityCard from "../../../components/AdminComponents/Profile/SecurityCard";
import ActivitySummary from "../../../components/AdminComponents/Profile/ActivitySummary";
import RecentActivity from "../../../components/AdminComponents/Profile/RecentActivity";
import QuickActions from "../../../components/AdminComponents/Profile/QuickAction";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? {};
};

const INITIAL_PROFILE = {
  name: "",
  email: "",
  phone: "",
  username: "",
  employeeId: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  profileImage: "",
  role: "admin",
  isActive: true,
  isVerified: false,
  lastLoginAt: null,
  lastLoginIP: "",
};

const INITIAL_ACTIVITY_SUMMARY = {
  customersManaged: 0,
  workersApproved: 0,
  bookingsManaged: 0,
  websiteUpdates: 0,
};

const INITIAL_SECURITY = {
  passwordConfigured: false,
  twoFactorAuthentication: false,
};

export default function AdminProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const [activitySummary, setActivitySummary] = useState(
    INITIAL_ACTIVITY_SUMMARY
  );

  const [security, setSecurity] = useState(INITIAL_SECURITY);

  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState({
    profile: true,
    update: false,
    password: false,
    activity: false,
  });

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const fetchAdminProfile = useCallback(async () => {
    try {
      setLoading((previous) => ({
        ...previous,
        profile: true,
      }));

      setError("");

      const response = await API.get("/admin/profile");

      const data = getResponseData(response);

      setProfile({
        ...INITIAL_PROFILE,
        ...(data?.profile || {}),
      });

      setActivitySummary({
        ...INITIAL_ACTIVITY_SUMMARY,
        ...(data?.activitySummary || {}),
      });

      setSecurity({
        ...INITIAL_SECURITY,
        ...(data?.security || {}),
      });

      setRecentActivity(
        Array.isArray(data?.recentActivity) ? data.recentActivity : []
      );
    } catch (requestError) {
      console.error("fetchAdminProfile error:", requestError);

      setError(
        requestError?.response?.data?.message || "Failed to load admin profile."
      );
    } finally {
      setLoading((previous) => ({
        ...previous,
        profile: false,
      }));
    }
  }, []);

  const handleUpdateProfile = useCallback(async (profileData) => {
    try {
      setLoading((previous) => ({
        ...previous,
        update: true,
      }));

      setError("");
      setSuccessMessage("");

      const response = await API.put("/admin/profile", profileData);

      const updatedProfile = getResponseData(response);

      setProfile((previous) => ({
        ...previous,
        ...(updatedProfile || {}),
      }));

      setSuccessMessage("Profile updated successfully.");

      return updatedProfile;
    } catch (requestError) {
      console.error("handleUpdateProfile error:", requestError);

      const message =
        requestError?.response?.data?.message ||
        "Failed to update admin profile.";

      setError(message);

      throw requestError;
    } finally {
      setLoading((previous) => ({
        ...previous,
        update: false,
      }));
    }
  }, []);

  const handleChangePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        setLoading((previous) => ({
          ...previous,
          password: true,
        }));

        setError("");
        setSuccessMessage("");

        const response = await API.put("/admin/profile/password", {
          currentPassword,
          newPassword,
        });

        const data = getResponseData(response);

        setSuccessMessage(data?.message || "Password changed successfully.");

        return data;
      } catch (requestError) {
        console.error("handleChangePassword error:", requestError);

        const message =
          requestError?.response?.data?.message || "Failed to change password.";

        setError(message);

        throw requestError;
      } finally {
        setLoading((previous) => ({
          ...previous,
          password: false,
        }));
      }
    },
    []
  );

  const handleRefreshActivity = useCallback(async () => {
    try {
      setLoading((previous) => ({
        ...previous,
        activity: true,
      }));

      setError("");

      const response = await API.get("/admin/profile/activity");

      const data = getResponseData(response);

      setRecentActivity(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error("handleRefreshActivity error:", requestError);

      setError(
        requestError?.response?.data?.message ||
          "Failed to load recent activity."
      );
    } finally {
      setLoading((previous) => ({
        ...previous,
        activity: false,
      }));
    }
  }, []);

  const handleEditProfile = useCallback(() => {}, []);

  const handleChangePhoto = useCallback(() => {}, []);

  const handleEditPersonalInfo = useCallback(() => {}, []);

  const handleSecurityPasswordChange = useCallback(() => {}, []);

  const handleViewSessions = useCallback(() => {}, []);

  const handleViewDevices = useCallback(() => {}, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");

    navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (!successMessage && !error) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage, error]);

  return (
    <div style={{ minHeight: "100vh" }}>
      {(error || successMessage) && (
        <div className="container-fluid px-4 pt-3">
          {error && (
            <div className="alert alert-danger mb-2" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success mb-2" role="alert">
              {successMessage}
            </div>
          )}
        </div>
      )}

      <ProfileHeader
        profile={profile}
        loading={loading.profile}
        onEditProfile={handleEditProfile}
        onChangePhoto={handleChangePhoto}
      />

      <div className="container-fluid px-4 pb-3">
        <div className="row g-3">
          <div className="col-lg-4">
            <PersonalInfoCard
              profile={profile}
              loading={loading.profile}
              onEdit={handleEditPersonalInfo}
            />
          </div>

          <div className="col-lg-4">
            <AccountInfoCard profile={profile} loading={loading.profile} />
          </div>

          <div className="col-lg-4">
            <SecurityCard
              profile={profile}
              security={security}
              loading={loading.profile}
              passwordLoading={loading.password}
              onChangePassword={handleSecurityPasswordChange}
              onViewSessions={handleViewSessions}
              onViewDevices={handleViewDevices}
            />
          </div>
        </div>
      </div>

      <ActivitySummary summary={activitySummary} loading={loading.profile} />

      <div className="container-fluid px-4 pb-4">
        <div className="row g-3">
          <div className="col-lg-7">
            <RecentActivity
              activities={recentActivity}
              loading={loading.profile || loading.activity}
              onRefresh={handleRefreshActivity}
            />
          </div>

          <div className="col-lg-5">
            <QuickActions
              loading={loading.profile || loading.update || loading.password}
              onEditProfile={handleEditProfile}
              onChangePassword={handleSecurityPasswordChange}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
