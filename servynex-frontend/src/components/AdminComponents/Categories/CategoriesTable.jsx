import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Search,
  PlusLg,
  EyeFill,
  PencilFill,
  TrashFill,
  ChevronLeft,
  ChevronRight,
  LightningChargeFill,
  Droplet,
  Snow,
  Brush,
  PaletteFill,
  Hammer,
  HourglassSplit,
  BugFill,
  FolderFill,
} from "react-bootstrap-icons";

const getCategoryIcon = (category) => {
  const iconName = String(category?.icon || "").toLowerCase();
  const categoryName = String(category?.name || "").toLowerCase();

  const iconMap = {
    electrician: {
      icon: <LightningChargeFill size={18} color="#d18a1c" />,
      background: "#fbedd6",
    },
    plumber: {
      icon: <Droplet size={18} color="#185fa5" />,
      background: "#e0edfb",
    },
    "ac repair": {
      icon: <Snow size={18} color="#185fa5" />,
      background: "#e0edfb",
    },
    cleaning: {
      icon: <Brush size={18} color="#0e8a5f" />,
      background: "#e6f4ee",
    },
    painting: {
      icon: <PaletteFill size={18} color="#7c5ad1" />,
      background: "#efe8fc",
    },
    carpentry: {
      icon: <Hammer size={18} color="#a9542c" />,
      background: "#f6e7dd",
    },
    "appliance repair": {
      icon: <HourglassSplit size={18} color="#185fa5" />,
      background: "#e0edfb",
    },
    "pest control": {
      icon: <BugFill size={18} color="#dc3545" />,
      background: "#fdecec",
    },
  };

  if (iconMap[iconName]) {
    return iconMap[iconName];
  }

  if (iconMap[categoryName]) {
    return iconMap[categoryName];
  }

  return {
    icon: <FolderFill size={18} color="#0e8a5f" />,
    background: "#e6f4ee",
  };
};

const getDisplayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Not Available";
  }

  return value;
};

const CategoriesTable = ({
  categories = [],
  loading = false,
  pagination = null,
  filters = {
    search: "",
    status: "all",
  },
  onSearch,
  onStatusChange,
  onResetFilters,
  onAddCategory,
  onSelectCategory,
  onDeleteCategory,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage ?? 1;
  const perPage = pagination?.perPage ?? 8;
  const totalCategories = pagination?.totalCategories ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const showingFrom =
    totalCategories === 0
      ? 0
      : (currentPage - 1) * perPage + 1;

  const showingTo =
    totalCategories === 0
      ? 0
      : Math.min(
          currentPage * perPage,
          totalCategories
        );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <section className="pb-4">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <div
            className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 flex-grow-1"
            style={{
              border: "1px solid #d9dee3",
              maxWidth: "420px",
            }}
          >
            <Search
              size={15}
              className="text-secondary flex-shrink-0"
            />

            <input
              type="text"
              value={filters?.search ?? ""}
              onChange={(e) =>
                onSearch?.(e.target.value)
              }
              placeholder="Search category by name..."
              className="form-control border-0 shadow-none px-0 py-1"
              style={{ fontSize: "0.9rem" }}
              disabled={loading}
            />
          </div>

          <button
            type="button"
            onClick={onAddCategory}
            className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-medium"
            style={{ backgroundColor: "#0e8a5f" }}
            disabled={loading}
          >
            <PlusLg size={15} />
            Add Category
          </button>
        </div>

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
                    borderTop:
                      "1px solid #eef0f2",
                    borderBottom:
                      "1px solid #eef0f2",
                  }}
                >
                  <th
                    className="ps-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    #
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Icon
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Category Name
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Description
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Services Count
                  </th>

                  <th
                    className="py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Status
                  </th>

                  <th
                    className="pe-3 py-3 text-secondary fw-medium text-uppercase"
                    style={{ fontSize: "0.72rem" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-5 text-secondary"
                    >
                      Loading categories...
                    </td>
                  </tr>
                )}

                {!loading &&
                  categories.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-5 text-secondary"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}

                {!loading &&
                  categories.map(
                    (category, index) => {
                      const categoryIcon =
                        getCategoryIcon(category);

                      const rowNumber =
                        (currentPage - 1) *
                          perPage +
                        index +
                        1;

                      const status =
                        category?.isActive
                          ? "Active"
                          : "Inactive";

                      return (
                        <tr
                          key={category._id}
                          style={{
                            borderBottom:
                              index !==
                              categories.length - 1
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
                                width: "38px",
                                height: "38px",
                                backgroundColor:
                                  categoryIcon.background,
                              }}
                            >
                              {categoryIcon.icon}
                            </div>
                          </td>

                          <td
                            className="py-2 fw-medium"
                            style={{
                              color: "#0f1724",
                              fontSize: "0.9rem",
                            }}
                          >
                            {getDisplayValue(
                              category.name
                            )}
                          </td>

                          <td
                            className="py-2 text-secondary"
                            style={{
                              fontSize: "0.84rem",
                              maxWidth: "320px",
                            }}
                          >
                            {getDisplayValue(
                              category.shortDescription
                            )}
                          </td>

                          <td
                            className="py-2 text-center"
                            style={{
                              fontSize: "0.9rem",
                              color: "#0f1724",
                            }}
                          >
                            {getDisplayValue(
                              category.servicesCount
                            )}
                          </td>

                          <td className="py-2">
                            <span
                              className="badge rounded-pill fw-medium"
                              style={{
                                backgroundColor:
                                  status === "Active"
                                    ? "#e6f4ee"
                                    : "#fdecec",
                                color:
                                  status === "Active"
                                    ? "#0e8a5f"
                                    : "#dc3545",
                                fontSize: "0.74rem",
                              }}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="pe-3 py-2">
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onSelectCategory?.(
                                    category,
                                    "view"
                                  )
                                }
                                className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  color: "#6b7280",
                                }}
                                title="View Category"
                              >
                                <EyeFill size={15} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onSelectCategory?.(
                                    category,
                                    "edit"
                                  )
                                }
                                className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  color: "#6b7280",
                                }}
                                title="Edit Category"
                              >
                                <PencilFill size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onDeleteCategory?.(
                                    category
                                  )
                                }
                                className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  color: "#dc3545",
                                }}
                                title="Delete Category"
                              >
                                <TrashFill size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
            <span
              className="text-secondary"
              style={{ fontSize: "0.85rem" }}
            >
              Showing {showingFrom} to {showingTo} of{" "}
              {totalCategories} categories
            </span>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onPageChange?.(
                    Math.max(1, currentPage - 1)
                  )
                }
                disabled={
                  loading ||
                  !pagination?.hasPreviousPage
                }
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ChevronLeft size={13} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() =>
                    onPageChange?.(page)
                  }
                  disabled={loading}
                  className="btn rounded-3 fw-medium"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor:
                      currentPage === page
                        ? "#0e8a5f"
                        : "#ffffff",
                    color:
                      currentPage === page
                        ? "#ffffff"
                        : "#0f1724",
                    border:
                      currentPage === page
                        ? "none"
                        : "1px solid #d9dee3",
                    fontSize: "0.82rem",
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  onPageChange?.(
                    Math.min(
                      totalPages,
                      currentPage + 1
                    )
                  )
                }
                disabled={
                  loading ||
                  !pagination?.hasNextPage
                }
                className="btn d-flex align-items-center justify-content-center rounded-3"
                style={{
                  border: "1px solid #d9dee3",
                  width: "32px",
                  height: "32px",
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

export default CategoriesTable;