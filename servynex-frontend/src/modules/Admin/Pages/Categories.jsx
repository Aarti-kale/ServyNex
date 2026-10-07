import React, { useCallback, useEffect, useState } from "react";
import CategoriesHeader from "../../../components/AdminComponents/Categories/CategoriesHeader";
import CategoriesTable from "../../../components/AdminComponents/Categories/CategoriesTable";
import AddCategoryPanel from "../../../components/AdminComponents/Categories/AddCategoryPanel";
import API from "../../../api/api";

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(8);
  const [pagination, setPagination] = useState(null);

  const loadCategoryStats = useCallback(async () => {
    try {
      const response = await API.get("/admin/categories/stats");

      const data = getResponseData(response);

      setStats(data || null);
    } catch (error) {
      console.error("loadCategoryStats error:", error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/categories", {
        params: {
          search: filters.search.trim(),
          status: filters.status,
          page: currentPage,
          limit: pageLimit,
        },
      });

      const data = getResponseData(response);

      setCategories(Array.isArray(data?.categories) ? data.categories : []);

      setPagination(data?.pagination || null);
    } catch (error) {
      console.error("loadCategories error:", error);

      setCategories([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.status, currentPage, pageLimit]);

  useEffect(() => {
    loadCategoryStats();
  }, [loadCategoryStats]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openAddPanel = () => {
    setEditingCategory(null);
    setPanelOpen(true);
  };

  const openEditPanel = async (category) => {
    try {
      setLoading(true);

      const response = await API.get(`/admin/categories/${category._id}`);

      const data = getResponseData(response);

      setEditingCategory(data || category);
      setPanelOpen(true);
    } catch (error) {
      console.error("openEditPanel error:", error);

      setEditingCategory(category);
      setPanelOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingCategory(null);
  };
  const handleSaveCategory = async (formData, imageFile) => {
    try {
      setSaving(true);
  
      const payload = {
        ...formData,
      };
  
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
  
        const uploadResponse = await API.post(
          "/admin/upload/image",
          uploadData
        );
  
        const uploadedImage = getResponseData(uploadResponse);
  
        payload.image = uploadedImage?.url || "";
      }
  
      if (editingCategory?._id) {
        await API.put(`/admin/categories/${editingCategory._id}`, payload);
      } else {
        await API.post("/admin/categories", payload);
      }
  
      closePanel();
  
      await Promise.all([loadCategories(), loadCategoryStats()]);
    } catch (error) {
      console.error("handleSaveCategory error:", error);
  
      window.alert(
        error?.response?.data?.message || "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteCategory = async (category) => {
    const confirmed = window.confirm(`Delete "${category.name}" category?`);

    if (!confirmed) return;

    try {
      setLoading(true);

      await API.delete(`/admin/categories/${category._id}`);

      await Promise.all([loadCategories(), loadCategoryStats()]);
    } catch (error) {
      console.error("handleDeleteCategory error:", error);

      window.alert(
        error?.response?.data?.message || "Failed to delete category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivateCategory = async (category) => {
    try {
      setLoading(true);

      await API.put(`/admin/categories/${category._id}/activate`);

      await Promise.all([loadCategories(), loadCategoryStats()]);
    } catch (error) {
      console.error("handleActivateCategory error:", error);

      window.alert(
        error?.response?.data?.message || "Failed to activate category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateCategory = async (category) => {
    try {
      setLoading(true);

      await API.put(`/admin/categories/${category._id}/deactivate`);

      await Promise.all([loadCategories(), loadCategoryStats()]);
    } catch (error) {
      console.error("handleDeactivateCategory error:", error);

      window.alert(
        error?.response?.data?.message || "Failed to deactivate category."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      search,
    }));
  };

  const handleStatusChange = (status) => {
    setCurrentPage(1);

    setFilters((previous) => ({
      ...previous,
      status,
    }));
  };

  const handleResetFilters = () => {
    setCurrentPage(1);

    setFilters({
      search: "",
      status: "all",
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <CategoriesHeader stats={stats} onAddCategory={openAddPanel} />

        <CategoriesTable
          categories={categories}
          loading={loading}
          pagination={pagination}
          filters={filters}
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          onAddCategory={openAddPanel}
          onSelectCategory={openEditPanel}
          onDeleteCategory={handleDeleteCategory}
          onActivateCategory={handleActivateCategory}
          onDeactivateCategory={handleDeactivateCategory}
          onPageChange={setCurrentPage}
          pageLimit={pageLimit}
          onPageLimitChange={(limit) => {
            setCurrentPage(1);
            setPageLimit(limit);
          }}
        />
      </div>

      {panelOpen && (
        <AddCategoryPanel
          category={editingCategory}
          loading={saving}
          onClose={closePanel}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}
