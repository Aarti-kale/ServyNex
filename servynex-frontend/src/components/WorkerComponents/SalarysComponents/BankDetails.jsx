import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bank, ShieldFillCheck } from "react-bootstrap-icons";

const BankDetails = ({
  bankName = "",
  accountNumber = "",
  ifscCode = "",
  branch = "",
  onUpdate,
}) => {
  return (
    <section className="pb-4">
      <div className="container">
        <div
          className="rounded-4 p-4 bg-white"
          style={{ border: "1px solid #eef0f2" }}
        >
          <h5 className="fw-bold mb-3" style={{ color: "#0f1724" }}>
            Bank Details
          </h5>

          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#e6f4ee",
                  }}
                >
                  <Bank size={22} color="#0e8a5f" />
                </div>

                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                    {bankName || "Bank details not available"}
                  </h6>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    A/C No. &nbsp;{accountNumber || "Not available"}
                  </p>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    IFSC Code &nbsp;{ifscCode || "Not available"}
                  </p>

                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Branch &nbsp;&nbsp;&nbsp;&nbsp;{branch || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div
                className="rounded-3 p-3 d-flex align-items-start gap-2"
                style={{ backgroundColor: "#eef7f3" }}
              >
                <ShieldFillCheck
                  size={18}
                  color="#0e8a5f"
                  className="flex-shrink-0 mt-1"
                />

                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#0f1724",
                  }}
                >
                  <strong>Your Salarys are transferred securely.</strong>
                  <br />
                  Salarys are credited to your bank account within 1-2 working
                  days.
                </span>
              </div>
            </div>

            <div className="col-md-2 text-md-end">
              <button
                onClick={onUpdate}
                className="btn rounded-3 px-3 py-2 fw-medium w-100"
                style={{
                  border: "1.5px solid #0e8a5f",
                  color: "#0e8a5f",
                }}
              >
                Update Bank Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankDetails;
