import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GripVertical, List, Plus, Trash2 } from "lucide-react";

function MenuItemsSection({
  items,
  onItemChange,
  onItemToggle,
  onItemRemove,
  onItemAdd,
  onReorder,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const handleDragStart = (event, index) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDrop = (event, index) => {
    event.preventDefault();

    const fromIndex = Number(event.dataTransfer.getData("text/plain"));

    if (!Number.isNaN(fromIndex) && fromIndex !== index) {
      onReorder?.(fromIndex, index);
    }
  };

  return (
    <section
      className="border rounded-3 bg-white p-4 h-100"
      style={{
        borderColor: "#e5e7eb",
      }}
    >
      <div className="d-flex align-items-start gap-3 mb-4">
        <span
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#ecfdf5",
            color: "#0e8a5f",
          }}
        >
          <List size={18} />
        </span>

        <div>
          <h3
            className="fw-semibold mb-1"
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.2",
              color: "#0f1724",
            }}
          >
            Menu Items
          </h3>

          <p
            className="text-secondary mb-0"
            style={{
              fontSize: "0.72rem",
              lineHeight: "1.4",
            }}
          >
            Manage your navigation menu items
          </p>
        </div>
      </div>

      <div
        className="d-grid align-items-center mb-2 px-1"
        style={{
          gridTemplateColumns:
            "22px 28px minmax(0, 1fr) minmax(0, 1fr) 44px 32px",
          columnGap: "8px",
          fontSize: "0.68rem",
          color: "#9ca3af",
        }}
      >
        <span></span>
        <span>#</span>
        <span>Label</span>
        <span>Href</span>
        <span>Active</span>
        <span></span>
      </div>

      <div className="d-flex flex-column gap-2">
        {safeItems.map((item, index) => {
          const itemId = item?._id ?? index;

          return (
            <div
              key={itemId}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              className="d-grid align-items-center"
              style={{
                gridTemplateColumns:
                  "22px 28px minmax(0, 1fr) minmax(0, 1fr) 44px 32px",
                columnGap: "8px",
              }}
            >
              <span
                className="d-flex align-items-center justify-content-center"
                title="Drag to reorder"
                style={{
                  color: "#9ca3af",
                  cursor: "grab",
                }}
              >
                <GripVertical size={15} />
              </span>

              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "28px",
                  height: "34px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "7px",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                  fontSize: "0.75rem",
                }}
              >
                {item?.order ?? index + 1}
              </span>

              <input
                type="text"
                value={item?.label ?? ""}
                onChange={(event) =>
                  onItemChange?.(itemId, "label", event.target.value)
                }
                className="form-control"
                style={{
                  height: "36px",
                  minWidth: 0,
                  fontSize: "0.78rem",
                  color: "#111827",
                  borderColor: "#d1d5db",
                  borderRadius: "7px",
                  boxShadow: "none",
                }}
              />

              <input
                type="text"
                value={item?.href ?? ""}
                onChange={(event) =>
                  onItemChange?.(itemId, "href", event.target.value)
                }
                className="form-control"
                style={{
                  height: "36px",
                  minWidth: 0,
                  fontSize: "0.78rem",
                  color: "#111827",
                  borderColor: "#d1d5db",
                  borderRadius: "7px",
                  boxShadow: "none",
                }}
              />

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(item?.isActive)}
                aria-label="Toggle menu item"
                onClick={() => onItemToggle?.(itemId)}
                className="border-0 p-0 position-relative rounded-pill"
                style={{
                  width: "36px",
                  height: "20px",
                  backgroundColor: item?.isActive ? "#10b981" : "#d1d5db",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                  justifySelf: "center",
                }}
              >
                <span
                  className="position-absolute rounded-circle bg-white shadow-sm"
                  style={{
                    width: "16px",
                    height: "16px",
                    top: "2px",
                    left: item?.isActive ? "18px" : "2px",
                    transition: "left 0.2s ease",
                  }}
                />
              </button>

              <button
                type="button"
                onClick={() => onItemRemove?.(itemId)}
                aria-label="Remove menu item"
                className="btn d-flex align-items-center justify-content-center p-0"
                style={{
                  width: "30px",
                  height: "30px",
                  color: "#ef4444",
                  borderRadius: "7px",
                  border: "none",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#fef2f2";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}

        {safeItems.length === 0 && (
          <div
            className="border rounded-3 text-center py-4"
            style={{
              borderStyle: "dashed",
              borderColor: "#d1d5db",
              backgroundColor: "#f9fafb",
            }}
          >
            <List size={20} className="text-secondary mb-2" />

            <p
              className="mb-0 text-secondary"
              style={{
                fontSize: "0.78rem",
              }}
            >
              No menu items available.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onItemAdd?.()}
        className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-4"
        style={{
          minHeight: "40px",
          border: "1px dashed #6ee7b7",
          borderRadius: "7px",
          backgroundColor: "#ffffff",
          color: "#0e8a5f",
          fontSize: "0.78rem",
          fontWeight: 500,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = "#ecfdf5";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = "#ffffff";
        }}
      >
        <Plus size={15} />
        Add Menu Item
      </button>
    </section>
  );
}

export default MenuItemsSection;
