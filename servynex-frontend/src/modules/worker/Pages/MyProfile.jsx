import React, { useEffect, useState } from "react";
import API from "../../../api/api";
import ProfileHeader from "../../../components/WorkerComponents/ProfileComponent/ProfileHeader";
import ProfileInfo from "../../../components/WorkerComponents/ProfileComponent/ProfileInfo";
import ProfileActions from "../../../components/WorkerComponents/ProfileComponent/ProfileActions";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setError("User information not found.");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?._id) {
          setError("Invalid user information.");
          return;
        }

        const response = await API.get(`/workers/profile/${user._id}`);

        const profileData = response?.data?.data?.profile;

        if (!profileData) {
          setError("Profile data not found.");
          return;
        }

        setProfile(profileData);
      } catch (err) {
        console.error("Failed to fetch worker profile:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary mb-0">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader profile={profile} />

      <ProfileInfo
        title="Personal Information"
        rows={[
          {
            label: "Full Name",
            value: profile?.name || "-",
          },
          {
            label: "Phone Number",
            value: profile?.phone || "-",
          },
          {
            label: "Email Address",
            value: profile?.email || "-",
          },
          {
            label: "Date of Birth",
            value: profile?.dateOfBirth || "-",
          },
          {
            label: "Gender",
            value: profile?.gender || "-",
          },
        ]}
      />

      <ProfileInfo
        title="Address Information"
        rows={[
          {
            label: "Address",
            value: profile?.address || "-",
          },
          {
            label: "City",
            value: profile?.city || "-",
          },
          {
            label: "State",
            value: profile?.state || "-",
          },
          {
            label: "Pincode",
            value: profile?.pincode || "-",
          },
        ]}
      />

      <ProfileInfo
        title="Professional Information"
        rows={[
          {
            label: "Profession",
            value: profile?.profession || "-",
          },
          {
            label: "Experience",
            value:
              profile?.experience !== undefined
                ? `${profile.experience} Years`
                : "-",
          },
          {
            label: "Skills",
            value:
              profile?.skills?.length > 0 ? profile.skills.join(", ") : "-",
          },
          {
            label: "Languages",
            value:
              profile?.languages?.length > 0
                ? profile.languages.join(", ")
                : "-",
          },
          {
            label: "Service Areas",
            value:
              profile?.serviceAreas?.length > 0
                ? profile.serviceAreas.join(", ")
                : "-",
          },
        ]}
      />

      <ProfileInfo
        title="Account Information"
        rows={[
          {
            label: "Verification Status",
            value: profile?.isVerified ? "Verified" : "Verification Pending",
          },
          {
            label: "Account Status",
            value: profile?.accountStatus || "-",
          },
          {
            label: "Member Since",
            value: profile?.memberSince
              ? new Date(profile.memberSince).toLocaleDateString()
              : "-",
          },
        ]}
      />

      <ProfileActions onSave={() => {}} onCancel={() => {}} />
    </>
  );
};

export default MyProfile;
