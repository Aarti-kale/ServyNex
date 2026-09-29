import React, { useEffect, useState } from "react";

import {
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  ClipboardList,
} from "lucide-react";

const DEFAULT_CONTACT_FORM = {
  badge: "Send Us a Message",

  title: "We'd love to hear from you!",

  description:
    "Fill out the form and our team will get back to you as soon as possible.",

  image: "",

  submitButtonText: "Send Message",

  subjects: [
    {
      value: "booking",
      label: "Booking Support",
      order: 1,
      isActive: true,
    },
    {
      value: "payment",
      label: "Payment Support",
      order: 2,
      isActive: true,
    },
    {
      value: "worker-registration",
      label: "Worker Registration",
      order: 3,
      isActive: true,
    },
    {
      value: "general",
      label: "General Inquiry",
      order: 4,
      isActive: true,
    },
  ],
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const getCharacterCount = (value = "") =>
  typeof value === "string" ? value.length : 0;

const mapBackendToImage = (image) => {
  if (!image) {
    return null;
  }

  return {
    name: image.split("/").pop() || "contact-form.jpg",

    size: "Uploaded image",

    url: image,
  };
};

const ContactFormEdit = ({
  data,
  onChange,
  onSave,
  onReset,
  saving = false,
}) => {
  const [contactForm, setContactForm] = useState(() =>
    cloneData(data || DEFAULT_CONTACT_FORM)
  );

  const [image, setImage] = useState(() => mapBackendToImage(data?.image));

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!data) {
      return;
    }

    setContactForm(cloneData(data));

    if (
      typeof data.image === "string" &&
      data.image !== image?.url &&
      !image?.url?.startsWith("blob:")
    ) {
      setImage(mapBackendToImage(data.image));
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (image?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image?.url]);

  const notifyParent = (updatedForm, imageFile = null) => {
    if (typeof onChange !== "function") {
      return;
    }

    const payload = {
      badge: updatedForm.badge ?? "",

      title: updatedForm.title ?? "",

      description: updatedForm.description ?? "",

      submitButtonText: updatedForm.submitButtonText ?? "",

      subjects: Array.isArray(updatedForm.subjects)
        ? updatedForm.subjects.map((subject, index) => ({
            value: subject?.value ?? "",

            label: subject?.label ?? "",

            order:
              Number(subject?.order) > 0 ? Number(subject.order) : index + 1,

            isActive: subject?.isActive !== false,
          }))
        : [],

      image: data?.image ?? "",

      ...(imageFile instanceof File
        ? {
            imageFile,
          }
        : {}),
    };

    onChange(payload);
  };
  const updateField = (field, newValue) => {
    setContactForm((prev) => {
      const updated = {
        ...prev,
        [field]: newValue,
      };

      notifyParent(updated);

      return updated;
    });

    setMessage("");
    setError("");
  };

  const updateSubject = (index, field, newValue) => {
    setContactForm((prev) => {
      const subjects = Array.isArray(prev.subjects) ? [...prev.subjects] : [];

      if (!subjects[index]) {
        return prev;
      }

      subjects[index] = {
        ...subjects[index],

        [field]: field === "order" ? Number(newValue) : newValue,
      };

      const updated = {
        ...prev,
        subjects,
      };

      notifyParent(updated);

      return updated;
    });

    setMessage("");
    setError("");
  };

  const addSubject = () => {
    setContactForm((prev) => {
      const currentSubjects = Array.isArray(prev.subjects) ? prev.subjects : [];

      const newSubject = {
        value: `subject-${currentSubjects.length + 1}`,

        label: "New Subject",

        order: currentSubjects.length + 1,

        isActive: true,
      };

      const updated = {
        ...prev,

        subjects: [...currentSubjects, newSubject],
      };

      notifyParent(updated);

      return updated;
    });

    setMessage("");
    setError("");
  };

  const deleteSubject = (index) => {
    setContactForm((prev) => {
      const currentSubjects = Array.isArray(prev.subjects) ? prev.subjects : [];

      const updatedSubjects = currentSubjects
        .filter((_, subjectIndex) => subjectIndex !== index)
        .map((subject, subjectIndex) => ({
          ...subject,
          order: subjectIndex + 1,
        }));

      const updated = {
        ...prev,
        subjects: updatedSubjects,
      };

      notifyParent(updated);

      return updated;
    });

    setMessage("");
    setError("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setError("");

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

    const previewUrl = URL.createObjectURL(file);

    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const newImage = {
      name: file.name,

      size: `${Math.round(file.size / 1024)} KB`,

      url: previewUrl,

      file,
    };

    setImage(newImage);

    notifyParent(contactForm, file);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setMessage("");
    setError("");

    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    setImage(null);

    setContactForm((prev) => {
      const updated = {
        ...prev,
        image: "",
      };

      if (typeof onChange === "function") {
        onChange({
          badge: updated.badge ?? "",

          title: updated.title ?? "",

          description: updated.description ?? "",

          image: "",

          submitButtonText: updated.submitButtonText ?? "",

          subjects: Array.isArray(updated.subjects) ? updated.subjects : [],

          imageFile: null,
        });
      }

      return updated;
    });
  };

  const handleReset = () => {
    setMessage("");
    setError("");

    if (image?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    const resetData = cloneData(data || DEFAULT_CONTACT_FORM);

    setContactForm(resetData);

    setImage(mapBackendToImage(data?.image));

    if (typeof onReset === "function") {
      onReset();
    } else if (typeof onChange === "function") {
      onChange({
        ...resetData,

        image: data?.image ?? "",

        imageFile: null,
      });
    }

    setMessage("Changes have been reset.");
  };

  const handleSave = () => {
    setMessage("");
    setError("");

    if (typeof onSave !== "function") {
      setError("Save handler is not available.");

      return;
    }

    const payload = {
      badge: contactForm.badge ?? "",

      title: contactForm.title ?? "",

      description: contactForm.description ?? "",

      image: data?.image ?? "",

      submitButtonText: contactForm.submitButtonText ?? "",

      subjects: Array.isArray(contactForm.subjects)
        ? contactForm.subjects.map((subject, index) => ({
            value: subject?.value ?? "",

            label: subject?.label ?? "",

            order:
              Number(subject?.order) > 0 ? Number(subject.order) : index + 1,

            isActive: subject?.isActive !== false,
          }))
        : [],

      imageFile: image?.file instanceof File ? image.file : null,
    };

    onSave(payload);
  };

  const styles = {
    wrapper: {
      width: "100%",
      background: "#ffffff",
      border: "1px solid #e4eaf0",
      borderRadius: "12px",
      overflow: "hidden",
    },

    header: {
      padding: "20px 22px",
      borderBottom: "1px solid #e8edf2",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    },

    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    iconBox: {
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: "#e4f8f0",
      color: "#008f68",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    title: {
      margin: 0,
      color: "#10213b",
      fontSize: "19px",
      fontWeight: 700,
    },

    subtitle: {
      margin: "4px 0 0",
      color: "#71809a",
      fontSize: "13px",
    },

    activeBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      marginLeft: "10px",
      padding: "5px 10px",
      borderRadius: "20px",
      background: "#e1f8ef",
      color: "#008d67",
      fontSize: "12px",
      fontWeight: 600,
    },

    body: {
      padding: "22px",
    },

    label: {
      display: "block",
      marginBottom: "7px",
      color: "#172944",
      fontSize: "13px",
      fontWeight: 600,
    },

    required: {
      color: "#008f68",
    },

    input: {
      width: "100%",
      height: "43px",
      padding: "0 13px",
      border: "1px solid #d9e2eb",
      borderRadius: "7px",
      outline: "none",
      color: "#203653",
      background: "#ffffff",
      fontSize: "13px",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      minHeight: "105px",
      padding: "11px 13px",
      border: "1px solid #d9e2eb",
      borderRadius: "7px",
      outline: "none",
      resize: "vertical",
      color: "#203653",
      background: "#ffffff",
      fontSize: "13px",
      lineHeight: 1.5,
      boxSizing: "border-box",
    },

    counter: {
      marginTop: "4px",
      textAlign: "right",
      color: "#71809a",
      fontSize: "11px",
    },

    section: {
      marginBottom: "24px",
    },

    sectionTitle: {
      margin: "0 0 15px",
      color: "#142741",
      fontSize: "15px",
      fontWeight: 700,
    },

    uploadBox: {
      minHeight: "150px",
      border: "1px dashed #b8c9d9",
      borderRadius: "9px",
      background: "#fbfdfe",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },

    uploadContent: {
      textAlign: "center",
      padding: "25px",
    },

    uploadIcon: {
      width: "40px",
      height: "40px",
      margin: "0 auto 10px",
      borderRadius: "9px",
      background: "#e5f8f0",
      color: "#008f68",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    uploadButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      padding: "9px 15px",
      marginTop: "10px",
      border: "1px solid #00956b",
      borderRadius: "7px",
      color: "#008b64",
      background: "#ffffff",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
    },

    imagePreview: {
      width: "100%",
      height: "190px",
      objectFit: "cover",
      display: "block",
    },

    imageOverlay: {
      position: "absolute",
      right: "10px",
      bottom: "10px",
      display: "flex",
      gap: "7px",
    },

    subjectCard: {
      border: "1px solid #e0e7ed",
      borderRadius: "9px",
      padding: "14px",
      marginBottom: "10px",
      background: "#ffffff",
    },

    subjectTop: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
    },

    dragIcon: {
      color: "#9aa8b8",
      cursor: "grab",
    },

    subjectGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 90px",
      gap: "12px",
    },

    addButton: {
      width: "100%",
      minHeight: "42px",
      border: "1px dashed #00a474",
      borderRadius: "8px",
      background: "#f4fcf9",
      color: "#008d67",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      cursor: "pointer",
    },

    deleteButton: {
      width: "38px",
      height: "38px",
      border: "1px solid #ffd1d1",
      borderRadius: "7px",
      background: "#fff8f8",
      color: "#e54848",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },

    activeToggle: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      color: "#51627b",
      fontSize: "12px",
      whiteSpace: "nowrap",
    },

    footer: {
      padding: "16px 22px",
      borderTop: "1px solid #e8edf2",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: "10px",
    },

    resetButton: {
      minWidth: "120px",
      height: "42px",
      padding: "0 18px",
      border: "1px solid #d5dfe8",
      borderRadius: "7px",
      background: "#ffffff",
      color: "#1d3655",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      cursor: "pointer",
    },

    saveButton: {
      minWidth: "145px",
      height: "42px",
      padding: "0 18px",
      border: "none",
      borderRadius: "7px",
      background: "linear-gradient(135deg, #009d70, #00875f)",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0, 143, 104, 0.16)",
    },

    message: {
      marginBottom: "18px",
      padding: "11px 14px",
      borderRadius: "7px",
      background: "#eaf9f3",
      color: "#00855f",
      fontSize: "13px",
      fontWeight: 500,
    },

    error: {
      marginBottom: "18px",
      padding: "11px 14px",
      borderRadius: "7px",
      background: "#fff2f2",
      color: "#d83e3e",
      fontSize: "13px",
      fontWeight: 500,
    },

    helper: {
      marginTop: "6px",
      color: "#7b899c",
      fontSize: "11px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBox}>
            <ClipboardList size={23} strokeWidth={2} />
          </div>

          <div>
            <h2 style={styles.title}>Contact Form</h2>

            <p style={styles.subtitle}>
              Manage contact form content and settings
            </p>
          </div>

          <span style={styles.activeBadge}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00a875",
              }}
            />
            Active
          </span>
        </div>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.message}>{message}</div>}

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Content</h3>

          <div style={styles.section}>
            <label style={styles.label}>
              Badge / Label <span style={styles.required}>*</span>
            </label>

            <input
              type="text"
              value={contactForm.badge || ""}
              maxLength={50}
              onChange={(e) => updateField("badge", e.target.value)}
              style={styles.input}
              placeholder="Send Us a Message"
            />

            <div style={styles.counter}>
              {getCharacterCount(contactForm.badge)}
              /50
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>
              Main Title <span style={styles.required}>*</span>
            </label>

            <input
              type="text"
              value={contactForm.title || ""}
              maxLength={100}
              onChange={(e) => updateField("title", e.target.value)}
              style={styles.input}
              placeholder="We'd love to hear from you!"
            />

            <div style={styles.counter}>
              {getCharacterCount(contactForm.title)}
              /100
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>
              Description <span style={styles.required}>*</span>
            </label>

            <textarea
              value={contactForm.description || ""}
              maxLength={300}
              onChange={(e) => updateField("description", e.target.value)}
              style={styles.textarea}
              placeholder="Fill out the form and our team will get back to you as soon as possible."
            />

            <div style={styles.counter}>
              {getCharacterCount(contactForm.description)}
              /300
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Image</label>

            <div style={styles.uploadBox}>
              {image ? (
                <>
                  <img
                    src={image.url}
                    alt={image.name || "Contact form"}
                    style={styles.imagePreview}
                  />

                  <div style={styles.imageOverlay}>
                    <label
                      style={{
                        ...styles.uploadButton,
                        marginTop: 0,
                        background: "#ffffff",
                      }}
                    >
                      <Upload size={15} />
                      Change Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        style={{
                          display: "none",
                        }}
                        disabled={saving}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div style={styles.uploadContent}>
                  <div style={styles.uploadIcon}>
                    <ImageIcon size={21} />
                  </div>

                  <div
                    style={{
                      color: "#263b57",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Upload Image
                  </div>

                  <div style={styles.helper}>Recommended size: 1200×800px</div>

                  <label style={styles.uploadButton}>
                    <Upload size={15} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      style={{
                        display: "none",
                      }}
                      disabled={saving}
                    />
                  </label>
                </div>
              )}
            </div>

            {image && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={saving}
                style={{
                  marginTop: "8px",
                  border: "none",
                  background: "transparent",
                  color: "#e54848",
                  fontSize: "12px",
                  cursor: saving ? "not-allowed" : "pointer",
                  padding: 0,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                Remove Image
              </button>
            )}
          </div>

          <div style={styles.section}>
            <label style={styles.label}>
              Submit Button Text <span style={styles.required}>*</span>
            </label>

            <input
              type="text"
              value={contactForm.submitButtonText || ""}
              maxLength={50}
              onChange={(e) => updateField("submitButtonText", e.target.value)}
              style={styles.input}
              placeholder="Send Message"
            />

            <div style={styles.counter}>
              {getCharacterCount(contactForm.submitButtonText)}
              /50
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <div>
              <h3
                style={{
                  ...styles.sectionTitle,
                  marginBottom: "4px",
                }}
              >
                Form Subjects
              </h3>

              <div
                style={{
                  color: "#7b899c",
                  fontSize: "12px",
                }}
              >
                Manage the subject options displayed in the contact form.
              </div>
            </div>
          </div>

          {Array.isArray(contactForm.subjects) &&
            contactForm.subjects.map((subject, index) => (
              <div
                key={`${subject?.value || "subject"}-${index}`}
                style={styles.subjectCard}
              >
                <div style={styles.subjectTop}>
                  <GripVertical size={17} style={styles.dragIcon} />

                  <span
                    style={{
                      color: "#213650",
                      fontSize: "13px",
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    Subject {index + 1}
                  </span>

                  <label style={styles.activeToggle}>
                    <input
                      type="checkbox"
                      checked={subject?.isActive !== false}
                      onChange={(e) =>
                        updateSubject(index, "isActive", e.target.checked)
                      }
                    />
                    Active
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteSubject(index)}
                    disabled={saving}
                    style={{
                      ...styles.deleteButton,
                      opacity: saving ? 0.6 : 1,
                    }}
                    title="Delete Subject"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={styles.subjectGrid}>
                  <div>
                    <label style={styles.label}>
                      Value <span style={styles.required}>*</span>
                    </label>

                    <input
                      type="text"
                      value={subject?.value || ""}
                      onChange={(e) =>
                        updateSubject(index, "value", e.target.value)
                      }
                      style={styles.input}
                      placeholder="booking"
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Label <span style={styles.required}>*</span>
                    </label>

                    <input
                      type="text"
                      value={subject?.label || ""}
                      onChange={(e) =>
                        updateSubject(index, "label", e.target.value)
                      }
                      style={styles.input}
                      placeholder="Booking Support"
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Order</label>

                    <input
                      type="number"
                      min="1"
                      value={subject?.order ?? index + 1}
                      onChange={(e) =>
                        updateSubject(index, "order", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            ))}

          <button
            type="button"
            onClick={addSubject}
            disabled={saving}
            style={{
              ...styles.addButton,
              opacity: saving ? 0.6 : 1,
            }}
          >
            <Plus size={17} />
            Add New Subject
          </button>
        </div>
      </div>

      <div style={styles.footer}>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          style={{
            ...styles.resetButton,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            ...styles.saveButton,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Save size={16} />

          {saving ? "Saving..." : "Save Section"}
        </button>
      </div>
    </div>
  );
};

export default ContactFormEdit;
