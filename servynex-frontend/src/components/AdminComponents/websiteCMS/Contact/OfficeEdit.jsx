import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function OfficeEdit({ data = {}, saving = false, onChange, onSave, onReset }) {
  const [officeLocation, setOfficeLocation] = useState(data || {});

  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    setOfficeLocation(data || {});
  }, [data]);

  const updateField = (field, value) => {
    const updatedLocation = {
      ...officeLocation,
      [field]: value,
    };

    setOfficeLocation(updatedLocation);

    if (onChange) {
      onChange(updatedLocation);
    }
  };

  const handleSave = () => {
    if (!onSave) {
      return;
    }

    onSave({
      ...officeLocation,
      latitude:
        officeLocation.latitude === "" ||
        officeLocation.latitude === null ||
        officeLocation.latitude === undefined
          ? null
          : Number(officeLocation.latitude),

      longitude:
        officeLocation.longitude === "" ||
        officeLocation.longitude === null ||
        officeLocation.longitude === undefined
          ? null
          : Number(officeLocation.longitude),
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const hasEmbedMap =
    typeof officeLocation.mapEmbedUrl === "string" &&
    officeLocation.mapEmbedUrl.trim() !== "";

  const hasCoordinates =
    officeLocation.latitude !== null &&
    officeLocation.latitude !== undefined &&
    officeLocation.latitude !== "" &&
    officeLocation.longitude !== null &&
    officeLocation.longitude !== undefined &&
    officeLocation.longitude !== "";

  const handleDirections = () => {
    if (
      officeLocation.directionsLink &&
      officeLocation.directionsLink.trim() !== ""
    ) {
      window.open(
        officeLocation.directionsLink,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    if (hasCoordinates) {
      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${officeLocation.latitude},${officeLocation.longitude}`;

      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  const renderMapPlaceholder = () => {
    return (
      <div
        className="rounded-3 d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "225px",
          background: "linear-gradient(135deg, #eef8f4 0%, #f8fbfa 100%)",
          border: "1px solid #dcece6",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.45,
            backgroundImage:
              "linear-gradient(30deg, transparent 45%, #d9ebe4 46%, #d9ebe4 47%, transparent 48%), linear-gradient(120deg, transparent 45%, #d9ebe4 46%, #d9ebe4 47%, transparent 48%)",
            backgroundSize: "75px 75px",
          }}
        />

        <div
          className="d-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: "54px",
            height: "54px",
            backgroundColor: "#ffffff",
            color: "#087f5b",
            boxShadow: "0 5px 18px rgba(8,127,91,0.18)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: "27px",
            }}
          >
            ●
          </span>
        </div>

        <span
          className="small fw-medium"
          style={{
            color: "#087f5b",
            position: "relative",
            zIndex: 2,
          }}
        >
          {officeLocation.officeName || "Office Location"}
        </span>

        {hasCoordinates && (
          <small
            className="text-secondary mt-1"
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            {officeLocation.latitude}, {officeLocation.longitude}
          </small>
        )}
      </div>
    );
  };

  return (
    <div
      className="card border-0 shadow-sm rounded-4 overflow-hidden"
      style={{
        border: "1px solid #e3eee9",
      }}
    >
      <div
        className="px-4 py-3"
        style={{
          borderBottom: "1px solid #e5ece9",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{
              width: "43px",
              height: "43px",
              backgroundColor: "#e5f7ef",
              color: "#087f5b",
              fontSize: "23px",
            }}
          >
            ●
          </div>

          <div>
            <h5
              className="fw-semibold mb-1"
              style={{
                color: "#10233f",
              }}
            >
              Office Location
            </h5>

            <p
              className="small mb-0"
              style={{
                color: "#64748b",
              }}
            >
              Update office location details and map settings
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 p-md-4">
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            className="btn"
            onClick={() => setActiveTab("content")}
            style={{
              backgroundColor: activeTab === "content" ? "#087f5b" : "#ffffff",
              color: activeTab === "content" ? "#ffffff" : "#183153",
              border:
                activeTab === "content"
                  ? "1px solid #087f5b"
                  : "1px solid #d9e5e1",
              borderRadius: "7px",
              padding: "8px 20px",
              fontWeight: 500,
            }}
          >
            Content
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setActiveTab("settings")}
            style={{
              backgroundColor: activeTab === "settings" ? "#087f5b" : "#ffffff",
              color: activeTab === "settings" ? "#ffffff" : "#183153",
              border:
                activeTab === "settings"
                  ? "1px solid #087f5b"
                  : "1px solid #d9e5e1",
              borderRadius: "7px",
              padding: "8px 20px",
              fontWeight: 500,
            }}
          >
            Settings
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setActiveTab("map")}
            style={{
              backgroundColor: activeTab === "map" ? "#087f5b" : "#ffffff",
              color: activeTab === "map" ? "#ffffff" : "#183153",
              border:
                activeTab === "map" ? "1px solid #087f5b" : "1px solid #d9e5e1",
              borderRadius: "7px",
              padding: "8px 20px",
              fontWeight: 500,
            }}
          >
            Map
          </button>
        </div>

        {activeTab === "content" && (
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Section Title <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.title || ""}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Enter section title"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.title?.length || 0}
                /100
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">
                Section Description <span className="text-danger">*</span>
              </label>

              <textarea
                className="form-control"
                rows="4"
                value={officeLocation.description || ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Enter section description"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.description?.length || 0}
                /300
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Office Name <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.officeName || ""}
                onChange={(event) =>
                  updateField("officeName", event.target.value)
                }
                placeholder="Enter office name"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.officeName?.length || 0}
                /100
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Address <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.address || ""}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Enter office address"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.address?.length || 0}
                /200
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Country <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.country || ""}
                onChange={(event) => updateField("country", event.target.value)}
                placeholder="Enter country"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Pincode <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.pincode || ""}
                onChange={(event) => updateField("pincode", event.target.value)}
                placeholder="Enter pincode"
                inputMode="numeric"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.pincode?.length || 0}
                /10
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Directions Text
              </label>

              <input
                type="text"
                className="form-control"
                value={officeLocation.directionsText || ""}
                onChange={(event) =>
                  updateField("directionsText", event.target.value)
                }
                placeholder="Directions"
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.directionsText?.length || 0}
                /50
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Directions Link
              </label>

              <input
                type="url"
                className="form-control"
                value={officeLocation.directionsLink || ""}
                onChange={(event) =>
                  updateField("directionsLink", event.target.value)
                }
                placeholder="https://maps.google.com/..."
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.directionsLink?.length || 0}
                /200
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="row g-3">
            <div className="col-12">
              <div
                className="p-3 rounded-3"
                style={{
                  backgroundColor: "#f2faf6",
                  border: "1px solid #dceee7",
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#d9f3e7",
                      color: "#087f5b",
                    }}
                  >
                    ✓
                  </div>

                  <div>
                    <div className="fw-semibold mb-1">
                      Office location settings
                    </div>

                    <div className="small text-secondary">
                      Configure the location details that appear on the Contact
                      page.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Latitude</label>

              <input
                type="number"
                step="any"
                className="form-control"
                value={officeLocation.latitude ?? ""}
                onChange={(event) =>
                  updateField("latitude", event.target.value)
                }
                placeholder="Enter latitude"
              />

              <div className="text-end small text-secondary mt-1">
                {String(officeLocation.latitude ?? "").length}
                /20
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Longitude</label>

              <input
                type="number"
                step="any"
                className="form-control"
                value={officeLocation.longitude ?? ""}
                onChange={(event) =>
                  updateField("longitude", event.target.value)
                }
                placeholder="Enter longitude"
              />

              <div className="text-end small text-secondary mt-1">
                {String(officeLocation.longitude ?? "").length}
                /20
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Map Embed URL
              </label>

              <input
                type="url"
                className="form-control"
                value={officeLocation.mapEmbedUrl || ""}
                onChange={(event) =>
                  updateField("mapEmbedUrl", event.target.value)
                }
                placeholder="https://www.google.com/maps/embed?..."
              />

              <div className="text-end small text-secondary mt-1">
                {officeLocation.mapEmbedUrl?.length || 0}
                /200
              </div>
            </div>

            <div className="col-12">
              <div
                className="border rounded-3 p-2"
                style={{
                  borderColor: "#dce8e4",
                }}
              >
                {hasEmbedMap ? (
                  <iframe
                    title="Office Location Map"
                    src={officeLocation.mapEmbedUrl}
                    width="100%"
                    height="280"
                    style={{
                      border: 0,
                      borderRadius: "8px",
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  renderMapPlaceholder()
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Latitude</label>

              <input
                type="number"
                step="any"
                className="form-control"
                value={officeLocation.latitude ?? ""}
                onChange={(event) =>
                  updateField("latitude", event.target.value)
                }
                placeholder="Enter latitude"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">Longitude</label>

              <input
                type="number"
                step="any"
                className="form-control"
                value={officeLocation.longitude ?? ""}
                onChange={(event) =>
                  updateField("longitude", event.target.value)
                }
                placeholder="Enter longitude"
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn text-white px-4"
                disabled={!officeLocation.directionsLink && !hasCoordinates}
                onClick={handleDirections}
                style={{
                  backgroundColor: "#087f5b",
                  borderColor: "#087f5b",
                }}
              >
                <span className="me-2">↗</span>

                {officeLocation.directionsText || "Get Directions"}
              </button>
            </div>
          </div>
        )}

        <div
          className="d-flex justify-content-end gap-3 mt-4 pt-3"
          style={{
            borderTop: "1px solid #e5ece9",
          }}
        >
          <button
            type="button"
            className="btn px-4"
            disabled={saving}
            onClick={handleReset}
            style={{
              backgroundColor: "#ffffff",
              color: "#183153",
              border: "1px solid #d6e1de",
              borderRadius: "7px",
            }}
          >
            <span className="me-2">↻</span>
            Reset
          </button>

          <button
            type="button"
            className="btn text-white px-4"
            disabled={saving}
            onClick={handleSave}
            style={{
              backgroundColor: "#087f5b",
              borderColor: "#087f5b",
              borderRadius: "7px",
              minWidth: "130px",
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
}

export default OfficeEdit;
