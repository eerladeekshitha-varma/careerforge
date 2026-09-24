import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Interviews.css";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("interviews/");

        const data = response.data;
        setInterviews(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Error fetching interviews:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load interviews. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const formatDate = (dateTime) => {
    if (!dateTime) return "Not scheduled";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="interviews-page">
        <p>Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interviews-page">
        <h1>My Interviews</h1>
        <p className="interviews-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="interviews-page">
      <div className="interviews-heading">
        <div>
          <h1>My Interviews</h1>
          <p>Keep track of your upcoming and completed interviews.</p>
        </div>

        <div className="interviews-count">
          {interviews.length}{" "}
          {interviews.length === 1 ? "Interview" : "Interviews"}
        </div>
      </div>

      {interviews.length === 0 ? (
        <div className="interviews-empty">
          <h2>No interviews yet</h2>
          <p>
            Interviews associated with your job applications will appear here.
          </p>
        </div>
      ) : (
        <div className="interviews-list">
          {interviews.map((interview) => (
            <article className="interview-card" key={interview.id}>
              <div className="interview-card-header">
                <div>
                  <h2>{interview.job_title || "Job title unavailable"}</h2>
                  <p className="interview-company">
                    {interview.company_name || "Company not specified"}
                  </p>
                </div>

                <span
                  className={`interview-status ${
                    interview.status?.toLowerCase().replace(/\s+/g, "-") || ""
                  }`}
                >
                  {interview.status || "Status unavailable"}
                </span>
              </div>

              <div className="interview-details">
                <div className="interview-detail">
                  <span className="detail-label">📅 Date & time</span>
                  <span>{formatDate(interview.scheduled_at)}</span>
                </div>

                <div className="interview-detail">
                  <span className="detail-label">🎯 Round</span>
                  <span>{interview.round_name || "Not specified"}</span>
                </div>

                <div className="interview-detail">
                  <span className="detail-label">💻 Interview mode</span>
                  <span>{interview.mode || "Not specified"}</span>
                </div>

                <div className="interview-detail">
                  <span className="detail-label">👤 Interviewer</span>
                  <span>{interview.interviewer || "Not specified"}</span>
                </div>
              </div>

              {interview.notes && (
                <div className="interview-notes">
                  <h3>Notes</h3>
                  <p>{interview.notes}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews;
