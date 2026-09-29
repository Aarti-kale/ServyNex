import React from "react";
import { GripVertical, LayoutGrid, Plus, Trash2 } from "lucide-react";

import "bootstrap/dist/css/bootstrap.min.css";

function FooterColumn({
  order,
  title,
  links,
  onTitleChange,
  onLinkChange,
  onLinkToggle,
  onLinkRemove,
  onLinkAdd,
  onReorder,
}) {
  const safeLinks = Array.isArray(links) ? links : [];

  const handleDragStart = (event, index) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();

    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));

    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) {
      return;
    }

    onReorder?.(sourceIndex, targetIndex);
  };

  return (
    <div
      className="h-100 rounded-3 bg-white p-3"
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-2 fw-semibold"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#e8f7f0",
              color: "#0e8a5f",
              fontSize: "0.75rem",
            }}
          >
            {order}
          </div>

          <span
            className="fw-medium text-secondary"
            style={{
              fontSize: "0.78rem",
            }}
          >
            Footer Column
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label
          className="form-label fw-medium mb-1"
          style={{
            fontSize: "0.78rem",
            color: "#374151",
          }}
        >
          Title
        </label>

        <input
          type="text"
          value={title ?? ""}
          onChange={(event) => onTitleChange?.(event.target.value)}
          className="form-control form-control-sm"
          style={{
            height: "36px",
            borderColor: "#d1d5db",
            fontSize: "0.82rem",
            boxShadow: "none",
          }}
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mb-2">
        <label
          className="fw-medium mb-0"
          style={{
            fontSize: "0.78rem",
            color: "#374151",
          }}
        >
          Links
        </label>

        <span
          className="text-secondary"
          style={{
            fontSize: "0.7rem",
          }}
        >
          {safeLinks.length} {safeLinks.length === 1 ? "link" : "links"}
        </span>
      </div>

      <div className="d-flex flex-column gap-2">
        {safeLinks.map((link, index) => {
          const linkId = link?._id ?? link?.order ?? index;

          const safeLabel = link?.label ?? "";

          const safeHref = link?.href ?? "";

          const safeIsActive = Boolean(link?.isActive);

          return (
            <div
              key={linkId}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              className="rounded-3 p-2"
              style={{
                border: "1px solid #e5e7eb",
                backgroundColor: "#f8f9fa",
              }}
            >
              <div className="d-flex align-items-start gap-2">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 text-secondary"
                  style={{
                    width: "20px",
                    height: "28px",
                    cursor: "grab",
                  }}
                  title="Drag to reorder"
                >
                  <GripVertical size={15} />
                </div>

                <div className="flex-grow-1 min-w-0">
                  <input
                    type="text"
                    value={safeLabel}
                    onChange={(event) =>
                      onLinkChange?.(linkId, "label", event.target.value)
                    }
                    className="form-control form-control-sm mb-2"
                    style={{
                      height: "32px",
                      borderColor: "#d1d5db",
                      fontSize: "0.76rem",
                      boxShadow: "none",
                    }}
                  />

                  <input
                    type="text"
                    value={safeHref}
                    onChange={(event) =>
                      onLinkChange?.(linkId, "href", event.target.value)
                    }
                    className="form-control form-control-sm"
                    style={{
                      height: "29px",
                      borderColor: "#d1d5db",
                      fontSize: "0.7rem",
                      boxShadow: "none",
                    }}
                  />
                </div>

                <div className="d-flex flex-column align-items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={safeIsActive}
                    aria-label={`Toggle ${safeLabel || "link"}`}
                    onClick={() => onLinkToggle?.(linkId)}
                    className="border-0 p-0 position-relative rounded-pill"
                    style={{
                      width: "36px",
                      height: "20px",
                      backgroundColor: safeIsActive ? "#0e8a5f" : "#d1d5db",
                      transition: "background-color 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="position-absolute rounded-circle bg-white"
                      style={{
                        width: "16px",
                        height: "16px",
                        top: "2px",
                        left: safeIsActive ? "18px" : "2px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s ease",
                      }}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => onLinkRemove?.(linkId)}
                    aria-label={`Remove ${safeLabel || "link"}`}
                    className="btn btn-sm d-flex align-items-center justify-content-center border-0 p-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      color: "#9ca3af",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {safeLinks.length === 0 && (
          <div
            className="rounded-3 text-center"
            style={{
              border: "1px dashed #d1d5db",
              backgroundColor: "#f8f9fa",
              padding: "24px 12px",
            }}
          >
            <p
              className="mb-0 text-secondary"
              style={{
                fontSize: "0.75rem",
              }}
            >
              No links added
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onLinkAdd?.()}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
        style={{
          height: "36px",
          border: "1px dashed #9ed9c1",
          backgroundColor: "#f0faf6",
          color: "#0e8a5f",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      >
        <Plus size={14} />
        Add Link
      </button>
    </div>
  );
}

function FooterColumnsSection({
  columns,
  onColumnTitleChange,
  onLinkChange,
  onLinkToggle,
  onLinkRemove,
  onLinkAdd,
  onReorder,
}) {
  const safeColumns = Array.isArray(columns) ? columns : [];

  return (
    <section
      className="w-100 rounded-3 bg-white p-4"
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="d-flex align-items-start gap-3 mb-4">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-2"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#e8f7f0",
            color: "#0e8a5f",
          }}
        >
          <LayoutGrid size={18} />
        </div>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              color: "#111827",
              fontSize: "0.9rem",
            }}
          >
            Footer Columns
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.75rem",
            }}
          >
            Manage footer menu columns and their links.
          </p>
        </div>
      </div>

      {safeColumns.length > 0 ? (
        <div className="row g-3">
          {safeColumns.map((column, index) => {
            const columnId = column?._id ?? column?.order ?? index;

            return (
              <div className="col-12 col-md-6 col-xl-4" key={columnId}>
                <FooterColumn
                  order={column?.order ?? index + 1}
                  title={column?.title ?? ""}
                  links={Array.isArray(column?.links) ? column.links : []}
                  onTitleChange={(value) =>
                    onColumnTitleChange?.(columnId, value)
                  }
                  onLinkChange={(linkId, field, value) =>
                    onLinkChange?.(columnId, linkId, field, value)
                  }
                  onLinkToggle={(linkId) => onLinkToggle?.(columnId, linkId)}
                  onLinkRemove={(linkId) => onLinkRemove?.(columnId, linkId)}
                  onLinkAdd={() => onLinkAdd?.(columnId)}
                  onReorder={(fromIndex, toIndex) =>
                    onReorder?.(columnId, fromIndex, toIndex)
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="rounded-3 text-center"
          style={{
            border: "1px dashed #d1d5db",
            backgroundColor: "#f8f9fa",
            padding: "40px 20px",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-2 rounded-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#e8f7f0",
              color: "#0e8a5f",
            }}
          >
            <LayoutGrid size={18} />
          </div>

          <p
            className="fw-medium mb-1"
            style={{
              color: "#4b5563",
              fontSize: "0.82rem",
            }}
          >
            No footer columns available
          </p>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.72rem",
            }}
          >
            Add footer columns from the settings.
          </p>
        </div>
      )}
    </section>
  );
}

export { FooterColumn, FooterColumnsSection };

export default FooterColumnsSection;
