import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  EyeFill,
  PencilFill,
  TrashFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const getDisplayValue = (value) => {
  if (value === undefined) {
    return "Field Not Available";
  }

  if (value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const getInitials = (name) => {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatBookingDate = (date) => {
  if (!date) {
    return "Not Available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not Available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatBookingTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  if (status === undefined) {
    return "Field Not Available";
  }

  if (!status) {
    return "Not Available";
  }

  return status
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return {
        backgroundColor: "#e6f4ee",
        color: "#0e8a5f",
      };

    case "accepted":
      return {
        backgroundColor: "#efe8fc",
        color: "#7c5ad1",
      };

    case "pending":
      return {
        backgroundColor: "#fbedd6",
        color: "#d18a1c",
      };

    case "cancelled":
      return {
        backgroundColor: "#fdecec",
        color: "#dc3545",
      };

    default:
      return {
        backgroundColor: "#f1f3f5",
        color: "#6c757d",
      };
  }
};
const getAvatarStyle = (index) => {
  const styles = [
    {
      backgroundColor: "#e6f4ee",
      color: "#0e8a5f",
    },
    {
      backgroundColor: "#e0edfb",
      color: "#185fa5",
    },
    {
      backgroundColor: "#efe8fc",
      color: "#7c5ad1",
    },
    {
      backgroundColor: "#fbedd6",
      color: "#d18a1c",
    },
  ];

  return styles[index % styles.length];
};

const BookingTable = ({
  bookings = [],
  pagination = {},
  loading = false,
  onSelectBooking,
  onPageChange,
  onPageLimitChange,
}) => {
 
  const paginationData = useMemo(() => {
    return {
      currentPage: Number(pagination?.currentPage) || 1,
      perPage: Number(pagination?.perPage) || 10,
      totalBookings: Number(pagination?.totalBookings) || 0,
      totalPages: Number(pagination?.totalPages) || 0,
      hasNextPage: Boolean(pagination?.hasNextPage),
      hasPreviousPage: Boolean(pagination?.hasPreviousPage),
    };
  }, [pagination]);

  const pageNumbers = useMemo(() => {
    const { currentPage, totalPages } = paginationData;

    if (totalPages <= 1) {
      return totalPages === 1 ? [1] : [];
    }

    const pages = new Set();

    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);

    if (currentPage > 1) {
      pages.add(currentPage - 1);
    }

    if (currentPage < totalPages) {
      pages.add(currentPage + 1);
    }

    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }, [paginationData]);

  const getRowNumber = (index) => {
    return (
      (paginationData.currentPage - 1) *
        paginationData.perPage +
      index +
      1
    );
  };

  const handleView = (booking) => {
    if (typeof onSelectBooking === "function") {
      onSelectBooking(booking);
    }
  };

  const handlePageChange = (page) => {
    if (
      typeof onPageChange !== "function" ||
      page < 1 ||
      page > paginationData.totalPages ||
      page === paginationData.currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  const handlePageLimitChange = (event) => {
    const limit = Number(event.target.value);

    if (
      typeof onPageLimitChange !== "function" ||
      !Number.isFinite(limit) ||
      limit < 1
    ) {
      return;
    }

    onPageLimitChange(limit);
  };

  const showingFrom =
    paginationData.totalBookings === 0
      ? 0
      : (paginationData.currentPage - 1) *
          paginationData.perPage +
        1;

  const showingTo = Math.min(
    paginationData.currentPage *
      paginationData.perPage,
    paginationData.totalBookings
  );

  return (
    <section className="pb-4">
      <div className="container-fluid px-4">
        <div
          className="rounded-4 bg-white"
          style={{
            border: "1px solid #eef0f2",
          }}
        >
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr
                  style={{
                    borderTop: "1px solid #eef0f2",
                    borderBottom:
                      "1px solid #eef0f2",
                  }}
                >
                  <th
                    className="ps-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    #
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Booking ID
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Customer
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Worker
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Service
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Date & Time
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Amount
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Payment
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Status
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                
                {loading && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-5 text-secondary"
                    >
                      Loading bookings...
                    </td>
                  </tr>
                )}

                {!loading && bookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-5 text-secondary"
                    >
                      Data Not Available
                    </td>
                  </tr>
                )}

                {!loading &&
                  bookings.map((booking, index) => {
                    const customer =
                      booking?.user;

                    const worker =
                      booking?.worker;

                    const service =
                      booking?.service;

                    const customerName =
                      customer?.name;

                    const avatarStyle =
                      getAvatarStyle(index);

                    const statusStyle =
                      getStatusStyle(
                        booking?.status
                      );

                    return (
                      <tr
                        key={
                          booking?._id ||
                          `${index}-${customerName || "booking"}`
                        }
                        style={{
                          borderBottom:
                            index !==
                            bookings.length - 1
                              ? "1px solid #eef0f2"
                              : "none",
                        }}
                      >
                        <td
                          className="ps-3 py-2 text-secondary"
                          style={{
                            fontSize: "0.85rem",
                          }}
                        >
                          {getRowNumber(index)}
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.82rem",
                          }}
                        >
                          {getDisplayValue(
                            booking?._id
                          )}
                        </td>

                        <td className="py-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor:
                                  avatarStyle.backgroundColor,
                                color:
                                  avatarStyle.color,
                                fontWeight: 700,
                                fontSize:
                                  "0.78rem",
                              }}
                            >
                              {getInitials(
                                customerName
                              )}
                            </div>

                            <div>
                              <div
                                className="fw-medium"
                                style={{
                                  color: "#0f1724",
                                  fontSize:
                                    "0.84rem",
                                }}
                              >
                                {getDisplayValue(
                                  customerName
                                )}
                              </div>

                              <div
                                className="text-secondary"
                                style={{
                                  fontSize:
                                    "0.72rem",
                                }}
                              >
                                {getDisplayValue(
                                  customer?.phone
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2">
                          <div
                            className="fw-medium"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.82rem",
                            }}
                          >
                            {getDisplayValue(
                              worker?.name
                            )}
                          </div>

                          <div
                            className="text-secondary"
                            style={{
                              fontSize: "0.72rem",
                            }}
                          >
                            {getDisplayValue(
                              worker?.phone
                            )}
                          </div>
                        </td>

                        <td className="py-2">
                          <div
                            className="fw-medium"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.82rem",
                            }}
                          >
                            {getDisplayValue(
                              service?.name
                            )}
                          </div>
                        </td>

                        <td className="py-2">
                          <div
                            className="fw-medium"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.8rem",
                            }}
                          >
                            {formatBookingDate(
                              booking?.date
                            )}
                          </div>

                          {formatBookingTime(
                            booking?.date
                          ) && (
                            <div
                              className="text-secondary"
                              style={{
                                fontSize:
                                  "0.72rem",
                              }}
                            >
                              {formatBookingTime(
                                booking?.date
                              )}
                            </div>
                          )}
                        </td>

                        <td
                          className="py-2"
                          style={{
                            fontSize: "0.82rem",
                          }}
                        >
                          <span className="text-secondary">
                            Field Not Available
                          </span>
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor:
                                "#f1f3f5",
                              color: "#6c757d",
                              fontSize:
                                "0.7rem",
                            }}
                          >
                            Field Not Available
                          </span>
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor:
                                statusStyle.backgroundColor,
                              color:
                                statusStyle.color,
                              fontSize:
                                "0.7rem",
                            }}
                          >
                            {formatStatus(
                              booking?.status
                            )}
                          </span>
                        </td>

                        <td className="pe-3 py-2">
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  booking
                                )
                              }
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border:
                                  "1px solid #d9dee3",
                              }}
                              title="View Booking"
                            >
                              <EyeFill
                                size={13}
                                color="#0f1724"
                              />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border:
                                  "1px solid #d9dee3",
                              }}
                              title="Edit Booking"
                            >
                              <PencilFill
                                size={12}
                                color="#185fa5"
                              />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm d-flex align-items-center justify-content-center rounded-2 p-0"
                              style={{
                                width: "30px",
                                height: "30px",
                                border:
                                  "1px solid #d9dee3",
                              }}
                              title="Delete Booking"
                            >
                              <TrashFill
                                size={12}
                                color="#dc3545"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3">
            <div className="d-flex align-items-center gap-3">
              <span
                className="text-secondary"
                style={{
                  fontSize: "0.85rem",
                }}
              >
                {paginationData.totalBookings ===
                0
                  ? "Showing 0 entries"
                  : `Showing ${showingFrom} to ${showingTo} of ${paginationData.totalBookings} entries`}
              </span>

              {typeof onPageLimitChange ===
                "function" && (
                <select
                  value={paginationData.perPage}
                  onChange={
                    handlePageLimitChange
                  }
                  className="form-select form-select-sm"
                  style={{
                    width: "75px",
                    fontSize: "0.78rem",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              )}
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                disabled={
                  !paginationData.hasPreviousPage
                }
                onClick={() =>
                  handlePageChange(
                    paginationData.currentPage -
                      1
                  )
                }
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border:
                    "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                  opacity:
                    paginationData.hasPreviousPage
                      ? 1
                      : 0.5,
                }}
              >
                <ChevronLeft size={13} />
              </button>

              {pageNumbers.map(
                (page, index) => {
                  const previousPage =
                    pageNumbers[index - 1];

                  const shouldShowDots =
                    index > 0 &&
                    page - previousPage > 1;

                  return (
                    <React.Fragment
                      key={page}
                    >
                      {shouldShowDots && (
                        <span className="text-secondary">
                          ...
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(page)
                        }
                        className="btn rounded-3 fw-medium"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor:
                            paginationData.currentPage ===
                            page
                              ? "#0e8a5f"
                              : "#ffffff",
                          color:
                            paginationData.currentPage ===
                            page
                              ? "#ffffff"
                              : "#0f1724",
                          border:
                            paginationData.currentPage ===
                            page
                              ? "none"
                              : "1px solid #d9dee3",
                          fontSize:
                            "0.82rem",
                        }}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
              )}

              <button
                type="button"
                disabled={
                  !paginationData.hasNextPage
                }
                onClick={() =>
                  handlePageChange(
                    paginationData.currentPage +
                      1
                  )
                }
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border:
                    "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                  opacity:
                    paginationData.hasNextPage
                      ? 1
                      : 0.5,
                }}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingTable;