import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ChevronRight,
  Download,
  PersonPlusFill,
  PeopleFill,
  PersonCheckFill,
  PersonPlus,
  PersonXFill,
} from "react-bootstrap-icons";

const getStatValue = (stats, field) => {
  if (!Object.prototype.hasOwnProperty.call(stats || {}, field)) {
    return "Field Not Available";
  }

  const value = stats[field];

  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  return value;
};

const CustomersHeader = ({ stats = {}, onExport, onAddCustomer }) => {
  const statCards = [
    {
      label: "Total Customers",
      field: "totalCustomers",
      noteField: "totalCustomersGrowth",
      noteColor: "#0e8a5f",
      icon: <PeopleFill size={24} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      label: "Active Customers",
      field: "activeCustomers",
      noteField: "activeCustomersGrowth",
      noteColor: "#0e8a5f",
      icon: <PersonCheckFill size={24} color="#0e8a5f" />,
      iconBg: "#e6f4ee",
    },
    {
      label: "New This Month",
      field: "newThisMonth",
      noteField: "newThisMonthGrowth",
      noteColor: "#0e8a5f",
      icon: <PersonPlus size={24} color="#7c5ad1" />,
      iconBg: "#efe8fc",
    },
    {
      label: "Blocked Customers",
      field: "blockedCustomers",
      noteField: "blockedCustomersGrowth",
      noteColor: "#dc3545",
      icon: <PersonXFill size={24} color="#dc3545" />,
      iconBg: "#fdecec",
    },
  ];

  return (
    <section className="py-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{ color: "#0f1724", fontSize: "1.9rem" }}
            >
              Customers
            </h1>

            <nav style={{ fontSize: "0.88rem" }}>
              <span className="fw-medium" style={{ color: "#0e8a5f" }}>
                Dashboard
              </span>{" "}
              <ChevronRight size={11} className="text-secondary mx-1" />
              <span className="text-secondary">Customers</span>
            </nav>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={onExport}
              className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
              style={{ border: "1px solid #d9dee3", color: "#0f1724" }}
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        <div className="row g-3">
          {statCards.map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div
                className="rounded-4 p-3 h-100 bg-white d-flex align-items-start gap-3"
                style={{ border: "1px solid #eef0f2" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: s.iconBg,
                  }}
                >
                  {s.icon}
                </div>

                <div>
                  <p
                    className="text-secondary mb-1"
                    style={{ fontSize: "0.82rem" }}
                  >
                    {s.label}
                  </p>

                  <h3 className="fw-bold mb-1" style={{ color: "#0f1724" }}>
                    {getStatValue(stats, s.field)}
                  </h3>

                  <p
                    className="fw-medium mb-0"
                    style={{
                      color: s.noteColor,
                      fontSize: "0.76rem",
                    }}
                  >
                    {getStatValue(stats, s.noteField)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomersHeader;
