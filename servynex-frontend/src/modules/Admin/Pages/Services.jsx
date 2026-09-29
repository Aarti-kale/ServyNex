import { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import ServicesHeader from "../../../components/AdminComponents/Services/ServicesHeader";
import CustomersFilter from "../../../components/AdminComponents/Customers/CustomerFilter";
import ServicesTable from "../../../components/AdminComponents/Services/ServicesTable";
import AddServicePanel from "../../../components/AdminComponents/Services/AddServicePanel";

import API from "../../../api/api";

const getResponseData = (response) => {
  return response?.data?.data;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  const [stats, setStats] = useState(null);

  const [categories, setCategories] = useState([]);

  const [editingService, setEditingService] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [pageLimit, setPageLimit] = useState(10);

  const [pagination, setPagination] = useState(null);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: pageLimit,
      };

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.category && filters.category !== "all") {
        params.category = filters.category;
      }

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      const response = await API.get("/admin/services", {
        params,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch services");
      }

      const data = getResponseData(response);

      setServices(Array.isArray(data) ? data : data?.services || []);

      setPagination(Array.isArray(data) ? null : data?.pagination || null);
    } catch (error) {
      console.error("SERVICES FETCH ERROR:", error.response?.data || error);

      setServices([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageLimit, filters]);

  const loadServiceStats = useCallback(async () => {
    try {
      const response = await API.get("/admin/services/stats");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to fetch service statistics"
        );
      }

      setStats(getResponseData(response));
    } catch (error) {
      console.error("SERVICE STATS ERROR:", error.response?.data || error);

      setStats(null);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const response = await API.get("/admin/categories");

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to fetch categories");
      }

      const data = getResponseData(response);

      setCategories(Array.isArray(data) ? data : data?.categories || []);
    } catch (error) {
      console.error("SERVICE CATEGORIES ERROR:", error.response?.data || error);

      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    loadServiceStats();
    loadCategories();
  }, [loadServiceStats, loadCategories]);

  const openAddPanel = () => {
    setEditingService(null);
    setPanelOpen(true);
  };

  const openEditPanel = (service) => {
    if (!service?._id) return;

    setEditingService(service);
    setPanelOpen(true);
  };

  const closePanel = () => {
    if (saving) return;

    setPanelOpen(false);
    setEditingService(null);
  };

  const handleSearch = (search) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      search,
    }));
  };

  const handleCategoryChange = (category) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      category: category || "all",
    }));
  };

  const handleStatusChange = (status) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      status: status || "all",
    }));
  };

  const handleResetFilters = () => {
    setCurrentPage(1);

    setFilters({
      search: "",
      category: "all",
      status: "all",
    });
  };

  const handlePageChange = (page) => {
    const nextPage = Number(page);

    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }

    setCurrentPage(nextPage);
  };

  const handlePageLimitChange = (limit) => {
    const nextLimit = Number(limit);

    if (!Number.isInteger(nextLimit) || nextLimit < 1) {
      return;
    }

    setCurrentPage(1);
    setPageLimit(nextLimit);
  };

  const uploadServiceImage = async (file) => {
    if (!(file instanceof File)) {
      return null;
    }

    const imageFormData = new FormData();

    imageFormData.append("image", file);

    const response = await API.post("/admin/upload/image", imageFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to upload service image"
      );
    }

    const imageUrl = response.data?.data?.url;

    if (!imageUrl) {
      throw new Error("Image uploaded but server did not return a valid URL");
    }

    return imageUrl;
  };

  const handleSaveService = async (formData) => {
    try {
      setSaving(true);

      const serviceId = editingService?._id;

      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        imageUrl = await uploadServiceImage(formData.image);
      }

      if (!imageUrl && editingService?.image) {
        imageUrl = editingService.image;
      }

      const price = Number(formData.price);
      const duration = Number(formData.duration);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Please enter a valid service price.");
      }

      if (!Number.isInteger(duration) || duration < 1) {
        throw new Error("Please enter a valid service duration.");
      }

      const payload = {
        name: String(formData.name || "").trim(),
        category: formData.category,
        shortDescription: String(formData.shortDescription || "").trim(),
        description: String(formData.description || "").trim(),
        price,
        duration,
        image: imageUrl || "",
        isActive: Boolean(formData.isActive),
        isPopular: Boolean(formData.isPopular),
        isFeatured: Boolean(formData.isFeatured),
        isRelated: Boolean(formData.isRelated),
      };

      if (!payload.name) {
        throw new Error("Service name is required.");
      }

      if (!payload.category) {
        throw new Error("Service category is required.");
      }

      if (!payload.shortDescription) {
        throw new Error("Short description is required.");
      }

      const response = serviceId
        ? await API.put(`/admin/services/${serviceId}`, payload)
        : await API.post("/admin/services", payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to save service");
      }

      setPanelOpen(false);
      setEditingService(null);

      await Promise.all([loadServices(), loadServiceStats()]);
    } catch (error) {
      console.error("SERVICE SAVE ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (service) => {
    if (!service?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await API.delete(`/admin/services/${service._id}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to delete service");
      }

      await Promise.all([loadServices(), loadServiceStats()]);
    } catch (error) {
      console.error("SERVICE DELETE ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete service"
      );
    }
  };

  const handleActivateService = async (service) => {
    if (!service?._id) return;

    try {
      const response = await API.put(`/admin/services/${service._id}/activate`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to activate service");
      }

      await Promise.all([loadServices(), loadServiceStats()]);
    } catch (error) {
      console.error("SERVICE ACTIVATE ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to activate service"
      );
    }
  };

  const handleDeactivateService = async (service) => {
    if (!service?._id) return;

    try {
      const response = await API.put(
        `/admin/services/${service._id}/deactivate`
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to deactivate service"
        );
      }

      await Promise.all([loadServices(), loadServiceStats()]);
    } catch (error) {
      console.error("SERVICE DEACTIVATE ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate service"
      );
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <ServicesHeader stats={stats} onAddService={openAddPanel} />

        <CustomersFilter
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilters}
          categories={categories}
        />

        <ServicesTable
          services={services}
          loading={loading}
          pagination={pagination}
          onSelectService={(service) => {
            openEditPanel(service);
          }}
          onDeleteService={handleDeleteService}
          onActivateService={handleActivateService}
          onDeactivateService={handleDeactivateService}
          onPageChange={handlePageChange}
          pageLimit={pageLimit}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>

      {panelOpen && (
        <AddServicePanel
          service={editingService}
          categories={categories}
          loading={saving}
          onClose={closePanel}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
}
