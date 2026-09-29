import { useEffect, useMemo, useState } from "react";
import API from "../../../api/api";

import JobsHeader from "../../../components/WorkerComponents/MyJobsComponent/JobsHeader";
import JobsSearchFilter from "../../../components/WorkerComponents/MyJobsComponent/JobsSearchFilter";
import JobsFilter from "../../../components/WorkerComponents/MyJobsComponent/JobsFilter";
import JobDetails from "../../../components/WorkerComponents/MyJobsComponent/JobDetails";
import JobsList from "../../../components/WorkerComponents/MyJobsComponent/JobsList";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    query: "",
    dateFilter: "",
    serviceType: "",
    location: "",
    sortBy: "",
  });

  const [activeStatus, setActiveStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/workers/my-jobs");

      const fetchedJobs = response?.data?.data?.jobs;

      setJobs(Array.isArray(fetchedJobs) ? fetchedJobs : []);
    } catch (error) {
      console.error(
        "Failed to fetch worker jobs:",
        error?.response?.data || error?.message
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const getAddressText = (address) => {
    if (!address) {
      return "";
    }

    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object") {
      return [
        address.address,
        address.street,
        address.area,
        address.locality,
        address.city,
        address.state,
        address.pincode,
        address.zipCode,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return "";
  };

  const getServiceName = (job) => {
    return job?.title || job?.info?.serviceType || "Service";
  };

  const getCustomerName = (job) => {
    return job?.customer?.name || "Customer";
  };

  const getCustomerAddress = (job) => {
    return getAddressText(job?.customer?.address);
  };

  const matchesDateFilter = (jobDate, dateFilter) => {
    if (!dateFilter) {
      return true;
    }

    if (!jobDate) {
      return false;
    }

    const jobDateObject = new Date(jobDate);

    if (Number.isNaN(jobDateObject.getTime())) {
      return false;
    }

    const now = new Date();

    if (dateFilter === "Today") {
      return jobDateObject.toDateString() === now.toDateString();
    }

    if (dateFilter === "This Week") {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();

      startOfWeek.setDate(startOfWeek.getDate() - day);

      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);

      endOfWeek.setDate(endOfWeek.getDate() + 7);

      return jobDateObject >= startOfWeek && jobDateObject < endOfWeek;
    }

    if (dateFilter === "This Month") {
      return (
        jobDateObject.getMonth() === now.getMonth() &&
        jobDateObject.getFullYear() === now.getFullYear()
      );
    }

    return true;
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (activeStatus !== "all") {
      result = result.filter((job) => {
        const status = job?.status;

        if (activeStatus === "assigned") {
          return status === "pending";
        }

        if (activeStatus === "inprogress") {
          return status === "in-progress";
        }

        if (activeStatus === "completed") {
          return status === "completed";
        }

        if (activeStatus === "cancelled") {
          return status === "cancelled";
        }

        return true;
      });
    }

    const searchQuery = filters.query.trim().toLowerCase();

    if (searchQuery) {
      result = result.filter((job) => {
        const serviceName = getServiceName(job);
        const customerName = getCustomerName(job);
        const customerAddress = getCustomerAddress(job);
        const problem = job?.info?.problem || "";

        return [serviceName, customerName, customerAddress, problem].some(
          (value) => String(value).toLowerCase().includes(searchQuery)
        );
      });
    }

    if (filters.dateFilter) {
      result = result.filter((job) =>
        matchesDateFilter(job?.date, filters.dateFilter)
      );
    }

    if (filters.serviceType) {
      const selectedService = filters.serviceType.trim().toLowerCase();

      result = result.filter((job) => {
        const serviceName = getServiceName(job).trim().toLowerCase();

        return serviceName === selectedService;
      });
    }

    if (filters.location) {
      const selectedLocation = filters.location.trim().toLowerCase();

      result = result.filter((job) => {
        const jobLocation = getCustomerAddress(job).trim().toLowerCase();

        return jobLocation === selectedLocation;
      });
    }

    if (filters.sortBy === "Newest First") {
      result.sort((a, b) => {
        return new Date(b?.date || 0) - new Date(a?.date || 0);
      });
    }

    if (filters.sortBy === "Oldest First") {
      result.sort((a, b) => {
        return new Date(a?.date || 0) - new Date(b?.date || 0);
      });
    }

    if (filters.sortBy === "Price: High to Low") {
      result.sort((a, b) => {
        const priceA =
          Number(
            String(a?.info?.estimatedAmount || "").replace(/[^\d.-]/g, "")
          ) || 0;

        const priceB =
          Number(
            String(b?.info?.estimatedAmount || "").replace(/[^\d.-]/g, "")
          ) || 0;

        return priceB - priceA;
      });
    }

    return result;
  }, [jobs, filters, activeStatus]);

  const handleFilterChange = (newFilters) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      ...newFilters,
    }));
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      dateFilter: "",
      serviceType: "",
      location: "",
      sortBy: "",
    });

    setActiveStatus("all");
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  const handleAcceptJob = () => {
    if (!selectedJob?.id) {
      return;
    }
  };

  const handleRejectJob = () => {
    if (!selectedJob?.id) {
      return;
    }
  };

  const todayJobs = useMemo(() => {
    const today = new Date();

    return jobs.filter((job) => {
      if (!job?.date) {
        return false;
      }

      const jobDate = new Date(job.date);

      if (Number.isNaN(jobDate.getTime())) {
        return false;
      }

      return jobDate.toDateString() === today.toDateString();
    }).length;
  }, [jobs]);

  const completedJobs = useMemo(() => {
    return jobs.filter((job) => job?.status === "completed").length;
  }, [jobs]);

  return (
    <div style={{ backgroundColor: "#fbfdfd" }}>
      <JobsHeader
        todayJobs={todayJobs}
        totalJobs={jobs.length}
        completedJobs={completedJobs}
      />

      <JobsFilter jobs={jobs} onChange={handleStatusChange} />

      <JobsSearchFilter
        jobs={jobs}
        onSearch={(query) => {
          handleFilterChange({ query });
        }}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="container pb-5">
        <div className="row g-3">
          <div className={selectedJob ? "col-lg-8" : "col-lg-12"}>
            <JobsList
              jobs={filteredJobs}
              hasJobs={jobs.length > 0}
              loading={loading}
              error={error}
              onSelectJob={handleSelectJob}
            />
          </div>

          {selectedJob && (
            <div className="col-lg-4">
              <JobDetails
                job={selectedJob}
                onClose={handleCloseJobDetails}
                onAccept={handleAcceptJob}
                onReject={handleRejectJob}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
