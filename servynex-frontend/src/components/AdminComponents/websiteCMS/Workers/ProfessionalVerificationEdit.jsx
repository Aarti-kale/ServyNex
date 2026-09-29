import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { CheckCircleFill, PlusLg, Save, Trash3 } from "react-bootstrap-icons";

const createEmptyStep = () => {
  return {
    title: "",
    description: "",
    icon: "verification",
  };
};

const normalizeVerificationData = (data) => {
  return {
    title: data?.title || "",
    subtitle: data?.subtitle || "",
    steps: Array.isArray(data?.steps)
      ? data.steps.map((step) => ({
          title: step?.title || "",
          description: step?.description || "",
          icon: step?.icon || "verification",
        }))
      : [],
  };
};

function ProfessionalVerificationEdit({
  data = {},
  onChange,
  onSave,
  onReset,
  saving = false,
}) {
  const [form, setForm] = useState(() => normalizeVerificationData(data));

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(normalizeVerificationData(data));
    setValidationError("");
  }, [data]);

  const updateForm = (updatedForm) => {
    setForm(updatedForm);
    onChange?.(updatedForm);
  };

  const handleFieldChange = (fieldName, value) => {
    updateForm({
      ...form,
      [fieldName]: value,
    });
  };

  const handleStepChange = (stepIndex, fieldName, value) => {
    const updatedSteps = form.steps.map((step, index) => {
      if (index !== stepIndex) {
        return step;
      }

      return {
        ...step,
        [fieldName]: value,
      };
    });

    updateForm({
      ...form,
      steps: updatedSteps,
    });
  };

  const handleAddStep = () => {
    if (saving) {
      return;
    }

    updateForm({
      ...form,
      steps: [...form.steps, createEmptyStep()],
    });
  };

  const handleRemoveStep = (stepIndex) => {
    if (saving) {
      return;
    }

    updateForm({
      ...form,
      steps: form.steps.filter((_, index) => index !== stepIndex),
    });
  };

  const handleSave = () => {
    const cleanedSteps = form.steps
      .map((step) => ({
        title: step.title.trim(),
        description: step.description.trim(),
        icon: step.icon || "verification",
      }))
      .filter((step) => step.title && step.description);

    if (!form.title.trim()) {
      setValidationError("Section title is required.");
      return;
    }

    if (!form.subtitle.trim()) {
      setValidationError("Section subtitle is required.");
      return;
    }

    if (!cleanedSteps.length) {
      setValidationError("Add at least one complete verification step.");
      return;
    }

    setValidationError("");

    onSave?.({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      steps: cleanedSteps,
    });
  };

  const handleReset = () => {
    if (saving) {
      return;
    }

    setValidationError("");
    onReset?.();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div className="card-header bg-white border-bottom px-4 py-3">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold text-dark mb-0">
                Verification Process Section
              </h5>

              <span className="badge rounded-pill text-bg-success">Active</span>
            </div>

            <p className="text-secondary small mb-0 mt-1">
              Manage the verification process section content
            </p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        {validationError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {validationError}
          </div>
        )}

        <div className="mb-3">
          <label
            htmlFor="verificationSectionTitle"
            className="form-label fw-semibold small"
          >
            Section Title
          </label>

          <input
            id="verificationSectionTitle"
            type="text"
            className="form-control"
            value={form.title}
            maxLength={150}
            disabled={saving}
            onChange={(event) => handleFieldChange("title", event.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="verificationSectionSubtitle"
            className="form-label fw-semibold small"
          >
            Section Subtitle
          </label>

          <textarea
            id="verificationSectionSubtitle"
            className="form-control"
            rows="3"
            value={form.subtitle}
            maxLength={300}
            disabled={saving}
            onChange={(event) =>
              handleFieldChange("subtitle", event.target.value)
            }
          />

          <p className="text-secondary text-end small mb-0 mt-1">
            {form.subtitle.length}/300
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold text-dark mb-0">Steps</h6>

          <span className="badge text-bg-success">
            {form.steps.length} Steps
          </span>
        </div>

        <div className="d-flex flex-column gap-3">
          {form.steps.map((step, index) => (
            <div
              className="border rounded-3 p-3 bg-white"
              key={`${step.title}-${index}`}
            >
              <div className="d-flex align-items-start gap-3">
                <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center px-3 py-2 fw-bold">
                  {index + 1}
                </div>

                <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center p-2">
                  <CheckCircleFill size={20} />
                </div>

                <div className="flex-grow-1">
                  <div className="row g-3">
                    <div className="col-12 col-lg-6">
                      <label
                        htmlFor={`verificationStepTitle-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Step Title
                      </label>

                      <input
                        id={`verificationStepTitle-${index}`}
                        type="text"
                        className="form-control"
                        placeholder="Identity Verification"
                        value={step.title}
                        maxLength={100}
                        disabled={saving}
                        onChange={(event) =>
                          handleStepChange(index, "title", event.target.value)
                        }
                      />
                    </div>

                    <div className="col-12 col-lg-6">
                      <label
                        htmlFor={`verificationStepIcon-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Icon Name
                      </label>

                      <select
                        id={`verificationStepIcon-${index}`}
                        className="form-select"
                        value={step.icon}
                        disabled={saving}
                        onChange={(event) =>
                          handleStepChange(index, "icon", event.target.value)
                        }
                      >
                        <option value="identity">Identity Verification</option>
                        <option value="background">Background Check</option>
                        <option value="skills">Skills Assessment</option>
                        <option value="document">Document Verification</option>
                        <option value="training">
                          Training and Orientation
                        </option>
                        <option value="monitoring">Ongoing Monitoring</option>
                        <option value="verification">
                          General Verification
                        </option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label
                        htmlFor={`verificationStepDescription-${index}`}
                        className="form-label fw-semibold small"
                      >
                        Step Description
                      </label>

                      <textarea
                        id={`verificationStepDescription-${index}`}
                        className="form-control"
                        rows="2"
                        placeholder="Describe this verification step..."
                        value={step.description}
                        maxLength={200}
                        disabled={saving}
                        onChange={(event) =>
                          handleStepChange(
                            index,
                            "description",
                            event.target.value
                          )
                        }
                      />

                      <p className="text-secondary text-end small mb-0 mt-1">
                        {step.description.length}/200
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  disabled={saving}
                  onClick={() => handleRemoveStep(index)}
                  aria-label={`Remove step ${index + 1}`}
                >
                  <Trash3 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-outline-success w-100 mt-3 d-inline-flex align-items-center justify-content-center gap-2"
          disabled={saving}
          onClick={handleAddStep}
        >
          <PlusLg size={15} />
          Add New Step
        </button>
      </div>

      <div className="card-footer bg-white border-top px-4 py-3">
        <div className="d-flex justify-content-end gap-2">
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
            className="btn btn-success px-4 d-inline-flex align-items-center gap-2"
            disabled={saving}
            onClick={handleSave}
          >
            <Save size={16} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalVerificationEdit;
