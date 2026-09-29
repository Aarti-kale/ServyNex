import React from "react";

const HelpEdit = ({ data, onChange, onSave, onReset, saving = false }) => {
  const helpSection = {
    title: data?.title || "",
    description: data?.description || "",
    topics: Array.isArray(data?.topics) ? data.topics : [],
  };

  const handleSectionChange = (field, value) => {
    onChange({
      ...helpSection,
      [field]: value,
    });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...helpSection.topics];

    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value,
    };

    onChange({
      ...helpSection,
      topics: updatedTopics,
    });
  };

  const handleAddTopic = () => {
    const nextOrder = helpSection.topics.length + 1;

    const newTopic = {
      key: `topic-${Date.now()}`,
      title: "",
      description: "",
      link: "",
      linkText: "Get Help",
      icon: "headset",
      order: nextOrder,
      isActive: true,
    };

    onChange({
      ...helpSection,
      topics: [...helpSection.topics, newTopic],
    });
  };

  const handleDeleteTopic = (index) => {
    const updatedTopics = helpSection.topics
      .filter((_, topicIndex) => topicIndex !== index)
      .map((topic, topicIndex) => ({
        ...topic,
        order: topicIndex + 1,
      }));

    onChange({
      ...helpSection,
      topics: updatedTopics,
    });
  };

  const handleToggleTopic = (index) => {
    const topic = helpSection.topics[index];

    handleTopicChange(index, "isActive", topic.isActive === false);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;

    const updatedTopics = [...helpSection.topics];

    [updatedTopics[index - 1], updatedTopics[index]] = [
      updatedTopics[index],
      updatedTopics[index - 1],
    ];

    const reorderedTopics = updatedTopics.map((topic, topicIndex) => ({
      ...topic,
      order: topicIndex + 1,
    }));

    onChange({
      ...helpSection,
      topics: reorderedTopics,
    });
  };

  const handleMoveDown = (index) => {
    if (index === helpSection.topics.length - 1) return;

    const updatedTopics = [...helpSection.topics];

    [updatedTopics[index], updatedTopics[index + 1]] = [
      updatedTopics[index + 1],
      updatedTopics[index],
    ];

    const reorderedTopics = updatedTopics.map((topic, topicIndex) => ({
      ...topic,
      order: topicIndex + 1,
    }));

    onChange({
      ...helpSection,
      topics: reorderedTopics,
    });
  };

  const titleLength = helpSection.title.length;
  const descriptionLength = helpSection.description.length;

  return (
    <div className="w-100">
      <div className="mb-4">
        <div className="row g-4">
          <div className="col-12">
            <label className="form-label fw-semibold text-dark">
              Main Title <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              className="form-control"
              value={helpSection.title}
              onChange={(e) => handleSectionChange("title", e.target.value)}
              placeholder="How Can We Help You?"
              maxLength={100}
            />

            <div className="text-end small text-muted mt-1">
              {titleLength}/100
            </div>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold text-dark">
              Description <span className="text-danger">*</span>
            </label>

            <textarea
              className="form-control"
              rows="4"
              value={helpSection.description}
              onChange={(e) =>
                handleSectionChange("description", e.target.value)
              }
              placeholder="Choose a topic and we'll connect you to the right team."
              maxLength={300}
            />

            <div className="text-end small text-muted mt-1">
              {descriptionLength}/300
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="fw-bold mb-1">Help Topics</h6>

          <p className="text-muted small mb-0">
            Manage support topics displayed in the help section.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-success d-flex align-items-center gap-2"
          onClick={handleAddTopic}
        >
          <span className="fs-5">+</span>
          Add Topic
        </button>
      </div>

      {helpSection.topics.length === 0 ? (
        <div className="border rounded-3 p-5 text-center bg-light">
          <div
            className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "54px",
              height: "54px",
              backgroundColor: "#e8f8f1",
              color: "#008f5a",
              fontSize: "24px",
            }}
          >
            ?
          </div>

          <h6 className="fw-semibold">No Help Topics</h6>

          <p className="text-muted small mb-3">
            Add a topic to display support options.
          </p>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddTopic}
          >
            + Add First Topic
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {helpSection.topics.map((topic, index) => {
            const isActive = topic.isActive !== false;

            return (
              <div
                key={`${topic.key}-${index}`}
                className="border rounded-3 bg-white"
                style={{
                  borderColor: isActive ? "#dcefe7" : "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <div
                  className="px-3 py-3 d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: isActive ? "#f3fbf7" : "#f8f9fa",
                    borderBottom: "1px solid #e8eee9",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#dff5eb",
                        color: "#008f5a",
                      }}
                    >
                      {topic.order || index + 1}
                    </div>

                    <div>
                      <div className="fw-semibold text-dark">
                        {topic.title || "Untitled Topic"}
                      </div>

                      <div className="small text-muted">
                        Key: {topic.key || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-light border"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-light border"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === helpSection.topics.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>

                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={isActive}
                        onChange={() => handleToggleTopic(index)}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>

                    <span
                      className="small fw-medium"
                      style={{
                        color: isActive ? "#008f5a" : "#6c757d",
                      }}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => handleDeleteTopic(index)}
                      title="Delete topic"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Topic Key <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={topic.key || ""}
                        onChange={(e) =>
                          handleTopicChange(index, "key", e.target.value)
                        }
                        placeholder="booking"
                      />

                      <div className="form-text">
                        Example: booking, payment, worker-registration
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Icon</label>

                      <select
                        className="form-select"
                        value={topic.icon || ""}
                        onChange={(e) =>
                          handleTopicChange(index, "icon", e.target.value)
                        }
                      >
                        <option value="">Select Icon</option>

                        <option value="headset">Headset</option>

                        <option value="payment">Payment</option>

                        <option value="user">User</option>

                        <option value="phone">Phone</option>

                        <option value="email">Email</option>

                        <option value="booking">Booking</option>

                        <option value="help">Help</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Topic Title <span className="text-danger">*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={topic.title || ""}
                        onChange={(e) =>
                          handleTopicChange(index, "title", e.target.value)
                        }
                        placeholder="Booking Support"
                        maxLength={100}
                      />

                      <div className="text-end small text-muted mt-1">
                        {(topic.title || "").length}/100
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Topic Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        value={topic.description || ""}
                        onChange={(e) =>
                          handleTopicChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Need help with your booking or rescheduling?"
                        maxLength={300}
                      />

                      <div className="text-end small text-muted mt-1">
                        {(topic.description || "").length}/300
                      </div>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-semibold">
                        Help Link
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={topic.link || ""}
                        onChange={(e) =>
                          handleTopicChange(index, "link", e.target.value)
                        }
                        placeholder="/help/booking"
                        maxLength={200}
                      />

                      <div className="text-end small text-muted mt-1">
                        {(topic.link || "").length}/200
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Button Text
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={topic.linkText || ""}
                        onChange={(e) =>
                          handleTopicChange(index, "linkText", e.target.value)
                        }
                        placeholder="Get Help"
                        maxLength={50}
                      />

                      <div className="text-end small text-muted mt-1">
                        {(topic.linkText || "").length}/50
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Display Order
                      </label>

                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={topic.order || index + 1}
                        onChange={(e) =>
                          handleTopicChange(
                            index,
                            "order",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="d-flex justify-content-end gap-2 mt-4 pt-3"
        style={{
          borderTop: "1px solid #e5ebe8",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={onReset}
          disabled={saving}
        >
          ↻&nbsp; Reset
        </button>

        <button
          type="button"
          className="btn btn-success px-4 d-flex align-items-center gap-2"
          onClick={() => onSave(helpSection)}
          disabled={saving}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              />
              Saving...
            </>
          ) : (
            <>
              <span>▣</span>
              Save Section
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HelpEdit;
