import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  EyeFill,
  PencilFill,
  TrashFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";

const getServiceIcon = (category) => {
  const categoryName = category?.name?.toLowerCase() || "";

  if (categoryName.includes("electric")) {
    return {
      icon: "⚡",
      color: "#d18a1c",
      bg: "#fbedd6",
    };
  }

  if (categoryName.includes("plumb")) {
    return {
      icon: "💧",
      color: "#185fa5",
      bg: "#e0edfb",
    };
  }

  if (categoryName.includes("ac") || categoryName.includes("cool")) {
    return {
      icon: "❄",
      color: "#185fa5",
      bg: "#e0edfb",
    };
  }

  if (categoryName.includes("clean")) {
    return {
      icon: "💧",
      color: "#185fa5",
      bg: "#e0edfb",
    };
  }

  if (categoryName.includes("paint")) {
    return {
      icon: "🎨",
      color: "#0e8a5f",
      bg: "#e6f4ee",
    };
  }

  if (categoryName.includes("carpent")) {
    return {
      icon: "⌂",
      color: "#a9542c",
      bg: "#f6e7dd",
    };
  }

  if (categoryName.includes("appliance")) {
    return {
      icon: "⚙",
      color: "#185fa5",
      bg: "#e0edfb",
    };
  }

  if (categoryName.includes("pest")) {
    return {
      icon: "⚠",
      color: "#dc3545",
      bg: "#fdecec",
    };
  }

  if (categoryName.includes("lock")) {
    return {
      icon: "✓",
      color: "#0e8a5f",
      bg: "#e6f4ee",
    };
  }

  return {
    icon: "⚙",
    color: "#7c5ad1",
    bg: "#efe8fc",
  };
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Not Available";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Not Available";
  }

  return `₹${numericPrice.toLocaleString("en-IN")}`;
};

const formatDuration = (duration) => {
  if (duration === null || duration === undefined || duration === "") {
    return "Not Available";
  }

  return `${duration} min`;
};

const ServicesTable = ({
  services = [],
  loading = false,
  pagination = null,
  onSelectService,
  onDeleteService,
  onActivateService,
  onDeactivateService,
  onPageChange,
  pageLimit,
  onPageLimitChange,
}) => {
  const currentPage = pagination?.currentPage || 1;

  const totalPages = pagination?.totalPages || 1;

  const totalServices = pagination?.totalServices || 0;

  const showingFrom =
    totalServices === 0
      ? 0
      : (currentPage - 1) * (pagination?.perPage || pageLimit || 10) + 1;

  const showingTo =
    totalServices === 0
      ? 0
      : Math.min(
          currentPage * (pagination?.perPage || pageLimit || 10),
          totalServices
        );

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

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
                    borderBottom: "1px solid #eef0f2",
                  }}
                >
                  <th
                    className="ps-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    #
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Icon
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Service Name
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Category
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Price
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Duration
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Status
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{
                      fontSize: "0.74rem",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      Loading services...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service, index) => {
                    const iconData = getServiceIcon(service.category);

                    const rowNumber =
                      (currentPage - 1) *
                        (pagination?.perPage || pageLimit || 10) +
                      index +
                      1;

                    const isActive = service.isActive === true;

                    return (
                      <tr
                        key={service._id}
                        style={{
                          borderBottom:
                            index !== services.length - 1
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
                          {rowNumber}
                        </td>

                        <td className="py-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3"
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor: iconData.bg,
                            }}
                          >
                            <span
                              style={{
                                color: iconData.color,
                                fontSize: "17px",
                                lineHeight: 1,
                              }}
                            >
                              {iconData.icon}
                            </span>
                          </div>
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.88rem",
                          }}
                        >
                          {service.name || "Not Available"}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.86rem",
                          }}
                        >
                          {service.category?.name || "Not Available"}
                        </td>

                        <td
                          className="py-2 fw-medium"
                          style={{
                            color: "#0f1724",
                            fontSize: "0.86rem",
                          }}
                        >
                          {formatPrice(service.price)}
                        </td>

                        <td
                          className="py-2 text-secondary"
                          style={{
                            fontSize: "0.86rem",
                          }}
                        >
                          {formatDuration(service.duration)}
                        </td>

                        <td className="py-2">
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: isActive ? "#e6f4ee" : "#fdecec",
                              color: isActive ? "#0e8a5f" : "#dc3545",
                              fontSize: "0.74rem",
                            }}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="pe-3 py-2">
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => onSelectService?.(service, "view")}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#6b7280",
                              }}
                              title="View service"
                            >
                              <EyeFill size={15} />
                            </button>

                            <button
                              onClick={() => onSelectService?.(service, "edit")}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#185fa5",
                              }}
                              title="Edit service"
                            >
                              <PencilFill size={14} />
                            </button>

                            <button
                              onClick={() => onDeleteService?.(service)}
                              className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                color: "#dc3545",
                              }}
                              title="Delete service"
                            >
                              <TrashFill size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
            <span
              className="text-secondary"
              style={{
                fontSize: "0.85rem",
              }}
            >
              Showing {showingFrom} to {showingTo} of {totalServices} services
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                  opacity: currentPage <= 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className="btn rounded-3 fw-medium"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === page ? "#0e8a5f" : "#ffffff",
                      color: currentPage === page ? "#ffffff" : "#0f1724",
                      border:
                        currentPage === page ? "none" : "1px solid #d9dee3",
                      fontSize: "0.82rem",
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                  opacity: currentPage >= totalPages ? 0.5 : 1,
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

export default ServicesTable;
