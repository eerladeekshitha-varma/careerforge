import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Applications.css";

const STATUS_OPTIONS = {
  SAVED: ["APPLIED"],
  APPLIED: ["ASSESSMENT", "REJECTED"],
  ASSESSMENT: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["SELECTED", "REJECTED"],
  SELECTED: [],
  REJECTED: [],
};

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("applications/");
        const data = response.data;
        const results = Array.isArray(data) ? data : data.results || [];

        setApplications(results);

        const initialStatuses = {};
        results.forEach((application) => {
          initialStatuses[application.id] = application.status;
        });

        setSelectedStatuses(initialStatuses);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to load applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = (applicationId, newStatus) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [applicationId]: newStatus,
    }));

    setMessages((previous) => ({
      ...previous,
      [applicationId]: "",
    }));
  };

  const handleSaveStatus = async (application) => {
    const newStatus = selectedStatuses[application.id];

    if (!newStatus || newStatus === application.status) {
      return;
    }

    setSavingId(application.id);
    setMessages((previous) => ({
      ...previous,
      [application.id]: "",
    }));

    try {
      const response = await api.patch(`applications/${application.id}/`, {
        status: newStatus,
      });

      const updatedApplication = response.data;

      setApplications((previous) =>
        previous.map((item) =>
          item.id === application.id
            ? { ...item, ...updatedApplication }
            : item
        )
      );

      setSelectedStatuses((previous) => ({
        ...previous,
        [application.id]: updatedApplication.status || newStatus,
      }));

      setMessages((previous) => ({
        ...previous,
        [application.id]: "Status updated successfully! ✓",
      }));
    } catch (err) {
      console.error("Error updating application status:", err);

      const data = err.response?.data;
      let errorMessage = "Unable to update status. Please try again.";

      if (data?.detail) {
        errorMessage = data.detail;
      } else if (data && typeof data === "object") {
        errorMessage = Object.values(data).flat().join(" ") || errorMessage;
      }

      setMessages((previous) => ({
        ...previous,
        [application.id]: errorMessage,
      }));

      // Restore the dropdown to the last saved status.
      setSelectedStatuses((previous) => ({
        ...previous,
        [application.id]: application.status,
      }));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p>Loading your applications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="applications-page">
      <h1>My Applications</h1>
      <p>Track the progress of your job applications.</p>

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            const currentStatus = application.status;
            const allowedStatuses = STATUS_OPTIONS[currentStatus] || [];
            const selectedStatus =
              selectedStatuses[application.id] || currentStatus;

            return (
              <div className="application-card" key={application.id}>
                <h3>
                  {application.job_title ||
                    application.job?.title ||
                    `Application #${application.id}`}
                </h3>

                <p>
                  Company:{" "}
                  {application.company_name ||
                    application.job?.company?.name ||
                    "Not available"}
                </p>

                <p>
                  Current status: <strong>{currentStatus || "Unknown"}</strong>
                </p>

                <p>
                  Applied on:{" "}
                  {application.applied_date
                    ? new Date(application.applied_date).toLocaleDateString()
                    : "Not available"}
                </p>

                {allowedStatuses.length > 0 ? (
                  <div className="application-status-control">
                    <label htmlFor={`status-${application.id}`}>
                      Update status:
                    </label>

                    <select
                      id={`status-${application.id}`}
                      value={selectedStatus}
                      onChange={(event) =>
                        handleStatusChange(application.id, event.target.value)
                      }
                    >
                      <option value={currentStatus}>
                        {currentStatus} (current)
                      </option>

                      {allowedStatuses.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleSaveStatus(application)}
                      disabled={
                        savingId === application.id ||
                        selectedStatus === currentStatus
                      }
                    >
                      {savingId === application.id ? "Saving..." : "Save status"}
                    </button>
                  </div>
                ) : (
                  <p>This application has reached a final status.</p>
                )}

                {messages[application.id] && (
                  <p
                    className={
                      messages[application.id].includes("successfully")
                        ? "application-success"
                        : "application-error"
                    }
                    role="status"
                  >
                    {messages[application.id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applications;