import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FileEarmarkPdfFill,
  FileEarmarkSpreadsheetFill,
  PrinterFill,
} from "react-bootstrap-icons";

const ExportReports = ({
  onExportPdf,
  onExportExcel,
  onPrint,
  loading = false,
}) => {
  const handleExportPdf = () => {
    if (loading || typeof onExportPdf !== "function") {
      return;
    }

    onExportPdf();
  };

  const handleExportExcel = () => {
    if (loading || typeof onExportExcel !== "function") {
      return;
    }

    onExportExcel();
  };

  const handlePrint = () => {
    if (loading || typeof onPrint !== "function") {
      return;
    }

    onPrint();
  };

  return (
    <div
      className="rounded-4 bg-white p-3 h-100"
      style={{
        border: "1px solid #eef0f2",
      }}
    >
      <h6
        className="fw-bold mb-3"
        style={{
          color: "#0f1724",
        }}
      >
        Export Reports
      </h6>

      <div className="d-flex flex-column gap-2">
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={loading || typeof onExportPdf !== "function"}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
          }}
        >
          <FileEarmarkPdfFill size={16} color="#dc3545" />

          {loading ? "Preparing..." : "Export as PDF"}
        </button>

        <button
          type="button"
          onClick={handleExportExcel}
          disabled={loading || typeof onExportExcel !== "function"}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
          }}
        >
          <FileEarmarkSpreadsheetFill size={16} color="#0e8a5f" />

          {loading ? "Preparing..." : "Export as Excel"}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          disabled={loading || typeof onPrint !== "function"}
          className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
          style={{
            border: "1px solid #d9dee3",
            color: "#0f1724",
          }}
        >
          <PrinterFill size={16} color="#185fa5" />
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ExportReports;
