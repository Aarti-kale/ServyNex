import React, { useEffect, useState } from "react";

const DEFAULT_SUPPORT_CTA = {
  title: "Still Need Help?",
  description:
    "Our support team is available every day and usually replies within 15 minutes.",
  buttonText: "Contact Support",
  buttonLink: "#contact-form",
  image: "",
};

const SupportCtaEdit = ({
  data,
  saving = false,
  onChange,
  onSave,
  onReset,
}) => {
  const [supportCta, setSupportCta] = useState({
    ...DEFAULT_SUPPORT_CTA,
    ...(data?.supportCta || {}),
  });

  const [image, setImage] = useState({
    name: "",
    size: "",
    url: "",
    file: null,
  });

  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    const backendData = data?.supportCta || {};

    setSupportCta({
      ...DEFAULT_SUPPORT_CTA,
      ...backendData,
    });

    setImage((previousImage) => {
      if (
        previousImage?.file instanceof File &&
        previousImage?.url?.startsWith("blob:")
      ) {
        return previousImage;
      }

      if (backendData?.image) {
        return {
          name: "Current image",
          size: "",
          url: backendData.image,
          file: null,
        };
      }

      return {
        name: "",
        size: "",
        url: "",
        file: null,
      };
    });
  }, [data?.supportCta]);

  useEffect(() => {
    return () => {
      if (image?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image?.url]);

  const notifyParent = (
    updatedSupportCta,
    selectedFile = image?.file instanceof File ? image.file : null
  ) => {
    if (!onChange) return;

    onChange({
      ...data,
      supportCta: {
        ...updatedSupportCta,

        image:
          typeof updatedSupportCta?.image === "string" &&
          !updatedSupportCta.image.startsWith("blob:")
            ? updatedSupportCta.image
            : "",

        imageFile: selectedFile instanceof File ? selectedFile : null,
      },
    });
  };

  const updateField = (field, value) => {
    const updatedSupportCta = {
      ...supportCta,
      [field]: value,
    };

    setSupportCta(updatedSupportCta);

    notifyParent(updatedSupportCta);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const previewUrl = URL.createObjectURL(file);

    const newImage = {
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      url: previewUrl,
      file,
    };

    setImage(newImage);

    notifyParent(
      {
        ...supportCta,
        image: supportCta.image || "",
      },
      file
    );
  };

  const handleRemoveImage = () => {
    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const updatedSupportCta = {
      ...supportCta,
      image: "",
    };

    setSupportCta(updatedSupportCta);

    setImage({
      name: "",
      size: "",
      url: "",
      file: null,
    });

    notifyParent(updatedSupportCta, null);
  };

  const handleSave = () => {
    if (!onSave) return;

    onSave({
      ...data,

      supportCta: {
        title: supportCta.title || "",
        description: supportCta.description || "",
        buttonText: supportCta.buttonText || "",
        buttonLink: supportCta.buttonLink || "",

        image:
          typeof supportCta.image === "string" &&
          !supportCta.image.startsWith("blob:")
            ? supportCta.image
            : "",

        imageFile: image?.file instanceof File ? image.file : null,
      },
    });
  };

  const handleReset = () => {
    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    setImage({
      name: "",
      size: "",
      url: "",
      file: null,
    });

    if (onReset) {
      onReset();
    }
  };

  const inputStyle = {
    border: "1px solid #d8e5e1",
    borderRadius: "7px",
    minHeight: "38px",
    color: "#183153",
    boxShadow: "none",
  };

  const labelStyle = {
    color: "#172b4d",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "7px",
  };

  const tabButtonStyle = (active) => ({
    border: active ? "1px solid #087f5b" : "1px solid #dce6e3",

    backgroundColor: active ? "#087f5b" : "#ffffff",

    color: active ? "#ffffff" : "#183153",

    borderRadius: "7px",

    padding: "8px 18px",

    fontSize: "13px",

    fontWeight: 600,

    cursor: "pointer",

    transition: "all 0.2s ease",
  });

  return (
    <div
      className="card border-0 rounded-4 overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1ebe8",
        boxShadow: "0 4px 18px rgba(15, 61, 46, 0.04)",
      }}
    >
      <div
        className="px-3 px-md-4 py-3"
        style={{
          borderBottom: "1px solid #e5ece9",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              backgroundColor: "#e4f7ef",
              color: "#087f5b",
              fontSize: "22px",
            }}
          >
            📣
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5
                className="mb-1"
                style={{
                  color: "#10233f",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                Support CTA
              </h5>

              <span
                style={{
                  backgroundColor: "#ddf6eb",
                  color: "#087f5b",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                Active
              </span>
            </div>

            <p
              className="mb-0"
              style={{
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              Update support call-to-action section
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 p-md-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            style={tabButtonStyle(activeTab === "content")}
          >
            Content
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            style={tabButtonStyle(activeTab === "settings")}
          >
            Settings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("background")}
            style={tabButtonStyle(activeTab === "background")}
          >
            Background
          </button>
        </div>

        {activeTab === "content" && (
          <div className="row g-3">
            <div className="col-12">
              <label style={labelStyle}>
                Title <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={supportCta.title || ""}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Enter CTA title"
                maxLength={100}
                style={inputStyle}
              />

              <div
                className="text-end mt-1"
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {supportCta.title?.length || 0}/100
              </div>
            </div>

            <div className="col-12">
              <label style={labelStyle}>
                Description <span className="text-danger">*</span>
              </label>

              <textarea
                className="form-control"
                rows="4"
                value={supportCta.description || ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Enter support CTA description"
                maxLength={300}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "92px",
                }}
              />

              <div
                className="text-end mt-1"
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {supportCta.description?.length || 0}
                /300
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={labelStyle}>
                Button Text <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={supportCta.buttonText || ""}
                onChange={(event) =>
                  updateField("buttonText", event.target.value)
                }
                placeholder="Contact Support"
                maxLength={50}
                style={inputStyle}
              />

              <div
                className="text-end mt-1"
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {supportCta.buttonText?.length || 0}
                /50
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label style={labelStyle}>
                Button Link <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={supportCta.buttonLink || ""}
                onChange={(event) =>
                  updateField("buttonLink", event.target.value)
                }
                placeholder="#contact-form"
                maxLength={200}
                style={inputStyle}
              />

              <div
                className="text-end mt-1"
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {supportCta.buttonLink?.length || 0}
                /200
              </div>
            </div>

            <div className="col-12">
              <label style={labelStyle}>Image</label>

              {image?.url ? (
                <div
                  className="position-relative rounded-3 overflow-hidden"
                  style={{
                    height: "145px",
                    border: "1px solid #d7e5e0",
                    backgroundColor: "#f5faf8",
                  }}
                >
                  <img
                    src={image.url}
                    alt="Support CTA"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-sm position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#ffffff",
                      color: "#dc3545",
                      border: "1px solid #e3e3e3",
                      borderRadius: "6px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="support-cta-image"
                  className="w-100 d-flex flex-column align-items-center justify-content-center"
                  style={{
                    height: "105px",
                    border: "1px dashed #b9d8cd",
                    borderRadius: "8px",
                    backgroundColor: "#fbfefd",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      color: "#087f5b",
                      marginBottom: "5px",
                    }}
                  >
                    🖼
                  </div>

                  <div
                    style={{
                      color: "#183153",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Upload Image
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "11px",
                      marginTop: "3px",
                    }}
                  >
                    Recommended size: 1200x600px
                  </div>

                  <input
                    id="support-cta-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div
              className="rounded-3 p-3"
              style={{
                backgroundColor: "#f2faf6",
                border: "1px solid #d8eee5",
              }}
            >
              <div className="d-flex gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: "#ddf5e9",
                    color: "#087f5b",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>

                <div>
                  <div
                    className="fw-semibold"
                    style={{
                      color: "#183153",
                      fontSize: "14px",
                    }}
                  >
                    Support CTA Settings
                  </div>

                  <div
                    className="mt-1"
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      lineHeight: 1.6,
                    }}
                  >
                    The current backend does not define additional Support CTA
                    settings. The editable backend fields are available under
                    the Content tab.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "background" && (
          <div>
            <div
              className="rounded-3 p-3"
              style={{
                backgroundColor: "#f2faf6",
                border: "1px solid #d8eee5",
              }}
            >
              <div className="d-flex gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: "#ddf5e9",
                    color: "#087f5b",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>

                <div>
                  <div
                    className="fw-semibold"
                    style={{
                      color: "#183153",
                      fontSize: "14px",
                    }}
                  >
                    Background
                  </div>

                  <div
                    className="mt-1"
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      lineHeight: 1.6,
                    }}
                  >
                    No separate background field exists in the current
                    <strong> supportCta </strong>
                    backend schema, so no additional background data is sent to
                    the API.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="d-flex justify-content-end gap-2 mt-4 pt-3"
          style={{
            borderTop: "1px solid #e5ece9",
          }}
        >
          <button
            type="button"
            className="btn px-4"
            onClick={handleReset}
            disabled={saving}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #d4e1dd",
              color: "#183153",
              borderRadius: "7px",
              minHeight: "40px",
            }}
          >
            <span className="me-2">↻</span>
            Reset
          </button>

          <button
            type="button"
            className="btn px-4 text-white"
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "#087f5b",
              border: "1px solid #087f5b",
              borderRadius: "7px",
              minHeight: "40px",
              minWidth: "130px",
              fontWeight: 600,
            }}
          >
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Saving...
              </>
            ) : (
              <>
                <span className="me-2">▣</span>
                Save Section
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportCtaEdit;
