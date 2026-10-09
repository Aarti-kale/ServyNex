
import { useEffect, useState } from "react";
import API from "../../../api/api";

export default function AddWorkerPanel({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
    employeeId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    location: "",
    skills: "",
    experience: "",
    profileImage: "",
    isVerified: false,
    isActive: true,
    isAvailable: true,
    isFeatured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setFormData((previous) => ({
      ...previous,
      profileImage: "",
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return formData.profileImage;

    const data = new FormData();
    data.append("image", imageFile);

    try {
      setImageUploading(true);

      // Replace with your actual image upload route.
      const response = await API.post("admin/upload/image", data);

      const imageUrl = response?.data?.data?.url;

      if (!imageUrl) {
        throw new Error("Image upload response did not contain a URL.");
      }

      setFormData((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));

      return imageUrl;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      let profileImage = formData.profileImage;

      if (imageFile) {
        profileImage = await uploadProfileImage();
      }

      const payload = {
        ...formData,
        experience: Number(formData.experience || 0),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        profileImage,
        dateOfBirth: formData.dateOfBirth || null,
      };

      // This endpoint must match your backend worker creation route.
      const response = await API.post("/admin/workers", payload);

      setSuccess("Worker added successfully.");

      if (onSuccess) {
        await onSuccess(response?.data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add worker."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputFields = [
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "phone", label: "Phone Number" },
    { name: "username", label: "Username" },
    { name: "employeeId", label: "Employee ID" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "address", label: "Address" },
    { name: "location", label: "Location" },
    { name: "experience", label: "Experience (years)", type: "number" },
  ];

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(15, 23, 36, 0.45)",
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div className="container py-4">
        <div
          className="card border-0 shadow mx-auto"
          style={{ maxWidth: "850px" }}
        >
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Add Worker</h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              <div className="mb-4">
                <label className="form-label">Profile Image</label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <small className="text-muted">
                  Select an image up to 5 MB.
                </small>

                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Worker profile preview"
                      style={{
                        width: "110px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="row">
                {inputFields.map((field) => (
                  <div className="col-md-6 mb-3" key={field.name}>
                    <label className="form-label">
                      {field.label}
                      {field.required && " *"}
                    </label>

                    <input
                      className="form-control"
                      name={field.name}
                      type={field.type || "text"}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required || false}
                      min={field.type === "number" ? "0" : undefined}
                    />
                  </div>
                ))}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Skills (comma-separated)
                  </label>
                  <input
                    className="form-control"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Plumbing, Electrical, Cleaning"
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-4 mb-3">
                {[
                  ["isVerified", "Verified"],
                  ["isActive", "Active"],
                  ["isAvailable", "Available"],
                  ["isFeatured", "Featured"],
                ].map(([name, label]) => (
                  <div className="form-check" key={name}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={name}
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={name}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-footer bg-white d-flex justify-content-end gap-2 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting || imageUploading}
              >
                {imageUploading
                  ? "Uploading image..."
                  : submitting
                    ? "Adding worker..."
                    : "Add Worker"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
