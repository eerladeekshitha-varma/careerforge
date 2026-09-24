import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/axios";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const [jobResponse, skillsResponse] = await Promise.all([
          api.get(`jobs/${id}/`),
          api.get("skills/"),
        ]);

        setJob(jobResponse.data);
        setSkills(skillsResponse.data.results ?? skillsResponse.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Unable to load this job. It may not exist or the server may be unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
  setApplying(true);
  setApplicationMessage("");
  setApplicationError("");

  try {
    await api.post("applications/", {
      job: Number(id),
      status: "APPLIED",
    });

    setApplicationMessage("Application submitted successfully! 🎉");
  } catch (err) {
    console.error("Error submitting application:", err);

    const data = err.response?.data;

    if (data?.detail) {
      setApplicationError(data.detail);
    } else if (data && typeof data === "object") {
      const messages = Object.values(data).flat().join(" ");
      setApplicationError(
        messages || "Unable to submit your application. Please try again."
      );
    } else {
      setApplicationError(
        "Unable to submit your application. Please try again."
      );
    }
  } finally {
    setApplying(false);
  }
};

  if (loading) {
    return <div className="job-details-message">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="job-details-message">
        <h2>Job details unavailable</h2>
        <p>{error || "We couldn't find this job."}</p>
        <Link to="/jobs" className="back-link">
          ← Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Link to="/jobs" className="back-link">
        ← Back to jobs
      </Link>

      <section className="job-details-card">
        <div className="job-details-header">
          <div className="company-avatar">
            {job.company_name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <p className="job-details-company">
              {job.company_name || "Company not specified"}
            </p>
            <h1>{job.title}</h1>
          </div>
        </div>

        <div className="job-details-tags">
          <span>📍 {job.location || "Location not specified"}</span>
          <span>
            💼 {job.employment_type?.replace("_", " ") || "Not specified"}
          </span>
          <span>
            🎯 {job.experience_level?.replace("_", " ") || "Not specified"}
          </span>
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="job-details-section">
            <h2>Salary</h2>
            <p>
              {job.salary_min ?? "Not specified"} –{" "}
              {job.salary_max ?? "Not specified"}
            </p>
          </div>
        )}

        <div className="job-details-section">
          <h2>Job description</h2>
          <p className="job-description">
            {job.description || "No description has been provided yet."}
          </p>
        </div>

        <div className="job-details-section">
          <h2>Required skills</h2>

          {job.required_skills?.length > 0 ? (
            <div className="required-skills">
              {job.required_skills.map((skillId) => {
                const skill = skills.find(
                  (item) => Number(item.id) === Number(skillId)
                );

                return (
                  <span className="skill-tag" key={skillId}>
                    {skill ? skill.name : `Skill #${skillId}`}
                  </span>
                );
              })}
            </div>
          ) : (
            <p>No required skills listed.</p>
          )}
        </div>

        {job.deadline && (
          <div className="job-details-section">
            <h2>Application deadline</h2>
            <p>{job.deadline}</p>
          </div>
        )}

        <div className="job-details-footer">
  <p>Interested in this opportunity?</p>

  <button
    type="button"
    onClick={handleApply}
    disabled={applying}
  >
    {applying ? "Submitting..." : "Apply for this job"}
  </button>

  {applicationMessage && (
    <p className="application-success">{applicationMessage}</p>
  )}

  {applicationError && (
    <p className="application-error">{applicationError}</p>
  )}
</div>
      </section>
    </div>
  );
}

export default JobDetails;