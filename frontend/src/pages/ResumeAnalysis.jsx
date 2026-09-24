import { useEffect, useState } from "react";

import api from "../api/axios";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [resumeResponse, jobResponse, analysisResponse] =
        await Promise.all([
          api.get("resumes/"),
          api.get("jobs/"),
          api.get("resume-analysis/"),
        ]);

      const resumeData =
        resumeResponse.data.results ?? resumeResponse.data;

      const jobData =
        jobResponse.data.results ?? jobResponse.data;

      const analysisData =
        analysisResponse.data.results ?? analysisResponse.data;

      setResumes(resumeData);
      setJobs(jobData);
      setAnalyses(analysisData);
    } catch (err) {
      console.error("Error loading analysis data:", err);
      setError(
        "Could not load your resumes, jobs, or previous analyses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!selectedResume || !selectedJob) {
      setError("Please select both a resume and a job.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setMessage("");

    try {
      await api.post("resume-analysis/", {
        resume: Number(selectedResume),
        job: Number(selectedJob),
      });

      setMessage("Resume analysis completed successfully!");

      await fetchData();
    } catch (err) {
      console.error("Resume analysis error:", err);

      const data = err.response?.data;

      if (typeof data === "string") {
        setError(data);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data) {
        const details = Object.entries(data)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages);

            return `${field}: ${text}`;
          })
          .join(" ");

        setError(details || "Analysis failed. Please try again.");
      } else {
        setError("Could not connect to the server.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 75) return "score-high";
    if (score >= 50) return "score-medium";
    return "score-low";
  };

  if (loading) {
    return (
      <div className="analysis-page">
        <p className="analysis-state">Loading resume analysis...</p>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <header className="analysis-header">
        <div>
          <p className="eyebrow">UNDERSTAND YOUR SKILL MATCH</p>
          <h1>Resume Analysis</h1>
          <p>
            Compare your resume with a job and discover which skills
            match and which you may want to develop.
          </p>
        </div>

        <div className="analysis-summary-card">
          <span>🧠</span>
          <div>
            <strong>{analyses.length}</strong>
            <small>Analyses completed</small>
          </div>
        </div>
      </header>

      <section className="analysis-form-card">
        <div className="analysis-section-title">
          <span className="analysis-icon">🎯</span>
          <div>
            <h2>Analyze your resume</h2>
            <p>Select a resume and a job to calculate your skill match.</p>
          </div>
        </div>

        {resumes.length === 0 ? (
          <p className="analysis-notice">
            You haven't uploaded a resume yet. Upload one from the
            My Resumes page before starting an analysis.
          </p>
        ) : jobs.length === 0 ? (
          <p className="analysis-notice">
            No jobs are currently available to analyze.
          </p>
        ) : (
          <form onSubmit={handleAnalyze} className="analysis-form">
            <div className="analysis-field">
              <label htmlFor="analysis-resume">Choose a resume</label>
              <select
                id="analysis-resume"
                value={selectedResume}
                onChange={(event) => setSelectedResume(event.target.value)}
                required
              >
                <option value="">Select your resume</option>

                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="analysis-field">
              <label htmlFor="analysis-job">Choose a job</label>
              <select
                id="analysis-job"
                value={selectedJob}
                onChange={(event) => setSelectedJob(event.target.value)}
                required
              >
                <option value="">Select a job</option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                    {job.company?.name ? ` - ${job.company.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={analyzing}>
              {analyzing ? "Analyzing..." : "Analyze Resume →"}
            </button>
          </form>
        )}
      </section>

      {error && (
        <div className="analysis-alert analysis-alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="analysis-alert analysis-alert-success">
          {message}
        </div>
      )}

      <section className="analysis-results-section">
        <div className="analysis-results-heading">
          <div>
            <h2>Your analysis history</h2>
            <p>Review the results of your previous resume analyses.</p>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="analysis-empty">
            <span>📊</span>
            <h3>No analyses yet</h3>
            <p>
              Choose a resume and job above to see your first match
              report.
            </p>
          </div>
        ) : (
          <div className="analysis-results-list">
            {analyses.map((analysis) => (
              <article className="analysis-result-card" key={analysis.id}>
                <div className="analysis-result-top">
                  <div>
                    <h3>{analysis.job_title}</h3>
                    <p>
                      {analysis.company_name || "Company not specified"}
                    </p>
                    <span className="analysis-resume-label">
                      Resume: {analysis.resume_title}
                    </span>
                  </div>

                  <div
                    className={`analysis-score ${getScoreClass(
                      Number(analysis.match_score)
                    )}`}
                  >
                    <strong>
                      {Number(analysis.match_score).toFixed(2)}%
                    </strong>
                    <small>Match score</small>
                  </div>
                </div>

                <div className="analysis-skills-grid">
                  <div className="analysis-skill-group matched-group">
                    <h4>✅ Matched skills</h4>

                    {analysis.matched_skills?.length ? (
                      <div className="analysis-skill-tags">
                        {analysis.matched_skills.map((skill, index) => (
                          <span key={`${skill}-${index}`}>{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <p>No matched skills were returned.</p>
                    )}
                  </div>

                  <div className="analysis-skill-group missing-group">
                    <h4>📌 Skills to develop</h4>

                    {analysis.missing_skills?.length ? (
                      <div className="analysis-skill-tags">
                        {analysis.missing_skills.map((skill, index) => (
                          <span key={`${skill}-${index}`}>{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <p>No missing skills were returned.</p>
                    )}
                  </div>
                </div>

                <div className="analysis-recommendations">
                  <h4>💡 Recommendations</h4>

                  {analysis.recommendations?.length ? (
                    <ul>
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No recommendations available.</p>
                  )}
                </div>

                <p className="analysis-date">
                  Analyzed{" "}
                  {analysis.created_at
                    ? new Date(analysis.created_at).toLocaleDateString()
                    : "date unavailable"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ResumeAnalysis;