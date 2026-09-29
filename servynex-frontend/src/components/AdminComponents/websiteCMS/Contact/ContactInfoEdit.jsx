import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactInfoEdit({ data, saving = false, onChange, onSave, onReset }) {
  const DEFAULT_CARDS = [
    {
      key: "phone",
      title: "Phone",
      value: "",
      secondaryValue: "",
      link: "",
      icon: "phone",
      order: 1,
      isActive: true,
    },
    {
      key: "email",
      title: "Email",
      value: "",
      secondaryValue: "",
      link: "",
      icon: "email",
      order: 2,
      isActive: true,
    },
    {
      key: "office",
      title: "Office Address",
      value: "",
      secondaryValue: "",
      link: "",
      icon: "location",
      order: 3,
      isActive: true,
    },
    {
      key: "working-hours",
      title: "Working Hours",
      value: "",
      secondaryValue: "",
      link: "",
      icon: "clock",
      order: 4,
      isActive: true,
    },
  ];

  const [cards, setCards] = useState(
    Array.isArray(data?.contactCards) ? data.contactCards : DEFAULT_CARDS
  );

  useEffect(() => {
    if (Array.isArray(data?.contactCards)) {
      setCards(data.contactCards);
    }
  }, [data?.contactCards]);

  const ICON_OPTIONS = [
    {
      value: "phone",
      label: "Phone",
      symbol: "☎",
    },
    {
      value: "email",
      label: "Email",
      symbol: "✉",
    },
    {
      value: "location",
      label: "Location",
      symbol: "⌖",
    },
    {
      value: "clock",
      label: "Clock",
      symbol: "◷",
    },
  ];

  const updateCard = (index, field, value) => {
    setCards((previousCards) => {
      const updatedCards = previousCards.map((card, cardIndex) => {
        if (cardIndex !== index) {
          return card;
        }

        return {
          ...card,
          [field]: value,
        };
      });

      return updatedCards;
    });
  };

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      ...data,
      contactCards: cards,
    });
  }, [cards]);

  const handleSave = () => {
    if (!onSave) {
      return;
    }

    onSave({
      ...data,
      contactCards: cards,
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const renderIcon = (icon) => {
    const selectedIcon = ICON_OPTIONS.find((item) => item.value === icon);

    return selectedIcon?.symbol || "•";
  };

  if (!cards.length) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center py-5">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#e8f8f1",
              color: "#087f5b",
              fontSize: "24px",
            }}
          >
            ☎
          </div>

          <h5 className="fw-bold">Contact Information</h5>

          <p className="text-secondary mb-0">No contact cards are available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              backgroundColor: "#e6f7f0",
              color: "#087f5b",
              fontSize: "21px",
            }}
          >
            ☎
          </div>

          <div>
            <h5 className="fw-bold mb-1">Contact Information</h5>

            <p className="text-secondary mb-0 small">
              Update contact cards (phone, email, address and working hours)
            </p>
          </div>
        </div>

        <div className="row g-3">
          {cards.map((card, index) => (
            <div
              className="col-12 col-lg-6"
              key={card.key || `contact-card-${index}`}
            >
              <div
                className="border rounded-3 h-100 p-3"
                style={{
                  borderColor: "#dce8e4",
                  backgroundColor: "#fff",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="text-secondary"
                      style={{
                        fontSize: "17px",
                        letterSpacing: "-3px",
                      }}
                    >
                      ⋮⋮
                    </span>

                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                      style={{
                        width: "27px",
                        height: "27px",
                        backgroundColor: "#d8f3e8",
                        color: "#087f5b",
                        fontSize: "12px",
                      }}
                    >
                      {card.order}
                    </span>

                    <span className="fw-semibold ms-1">
                      {card.title || "Contact Card"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-switch m-0 d-flex align-items-center gap-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={card.isActive !== false}
                        onChange={(event) =>
                          updateCard(index, "isActive", event.target.checked)
                        }
                        style={{
                          cursor: "pointer",
                          width: "36px",
                          height: "19px",
                        }}
                      />

                      <span className="small text-secondary">Active</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm border-0 p-0"
                      disabled
                      title="Delete is not available in this editor"
                      style={{
                        color: "#dc3545",
                        fontSize: "17px",
                        opacity: 0.8,
                      }}
                    >
                      ♡
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-medium mb-1">
                    Title <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={card.title || ""}
                    onChange={(event) =>
                      updateCard(index, "title", event.target.value)
                    }
                    placeholder="Enter title"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-medium mb-1">
                    Value <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={card.value || ""}
                    onChange={(event) =>
                      updateCard(index, "value", event.target.value)
                    }
                    placeholder="Enter value"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-medium mb-1">
                    Secondary Value
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={card.secondaryValue || ""}
                    onChange={(event) =>
                      updateCard(index, "secondaryValue", event.target.value)
                    }
                    placeholder="Enter secondary value"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <label className="form-label small fw-medium mb-1">
                      Link <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={card.link || ""}
                      onChange={(event) =>
                        updateCard(index, "link", event.target.value)
                      }
                      placeholder="tel:, mailto:, URL or #"
                    />
                  </div>

                  <div className="col-12 col-md-5">
                    <label className="form-label small fw-medium mb-1">
                      Icon <span className="text-danger">*</span>
                    </label>

                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          backgroundColor: "#f0faf6",
                          color: "#087f5b",
                          borderColor: "#ceded8",
                        }}
                      >
                        {renderIcon(card.icon)}
                      </span>

                      <select
                        className="form-select"
                        value={card.icon || ""}
                        onChange={(event) =>
                          updateCard(index, "icon", event.target.value)
                        }
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label small fw-medium mb-1">
                    Order <span className="text-danger">*</span>
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={card.order ?? ""}
                    onChange={(event) =>
                      updateCard(index, "order", Number(event.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            disabled={saving}
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn px-4 text-white"
            disabled={saving}
            onClick={handleSave}
            style={{
              backgroundColor: "#087f5b",
              borderColor: "#087f5b",
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
              "Save Section"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoEdit;
