import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Jobs.css";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    company: "",
    skill: "",
    employment_type: "",
    experience_level: "",
  });

  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("jobs/", {
          params: searchParams,
        });

        setJobs(response.data.results ?? response.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to load jobs. Please check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const activeFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== "") {
        activeFilters[key] = value.trim();
      }
    });

    setSearchParams(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      location: "",
      company: "",
      skill: "",
      employment_type: "",
      experience_level: "",
    });

    setSearchParams({});
  };

  return (
    <div className="jobs-page">
      <header className="jobs-header">
        <div>
          <p className="eyebrow">YOUR NEXT OPPORTUNITY</p>
          <h1>Find Jobs</h1>
          <p className="jobs-subtitle">
            Discover opportunities and find a role that matches your skills.
          </p>
        </div>
      </header>

      <section className="job-search-panel">
        <form onSubmit={handleSearch}>
          <div className="filters-grid">
            <div className="filter-field">
              <label htmlFor="title">Job title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Python Developer"
                value={filters.title}
                onChange={handleChange}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Hyderabad"
                value={filters.location}
                onChange={handleChange}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Company name"
                value={filters.company}
                onChange={handleChange}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="skill">Skill</label>
              <input
                id="skill"
                name="skill"
                type="text"
                placeholder="e.g. Django"
                value={filters.skill}
                onChange={handleChange}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="employment_type">Employment type</label>
              <select
                id="employment_type"
                name="employment_type"
                value={filters.employment_type}
                onChange={handleChange}
              >
                <option value="">All types</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="experience_level">Experience level</label>
              <select
                id="experience_level"
                name="experience_level"
                value={filters.experience_level}
                onChange={handleChange}
              >
                <option value="">All levels</option>
                <option value="ENTRY">Entry level</option>
                <option value="MID">Mid level</option>
                <option value="SENIOR">Senior level</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="search-button">
              Search Jobs
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </form>
      </section>

      <section className="jobs-results">
        <div className="results-heading">
          <div>
            <h2>Available opportunities</h2>
            <p>
              {loading
                ? "Searching for jobs..."
                : `${jobs.length} job${jobs.length === 1 ? "" : "s"} found on this page`}
            </p>
          </div>
        </div>

        {loading && <div className="jobs-message">Loading jobs...</div>}

        {!loading && error && (
          <div className="jobs-message error-message">{error}</div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="jobs-message">
            <h3>No jobs found</h3>
            <p>Try changing your search terms or clearing the filters.</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="company-avatar">
                    {job.company_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <span className="job-type">
                    {job.employment_type?.replace("_", " ") || "Opportunity"}
                  </span>
                </div>

                <h3>{job.title}</h3>

                <p className="job-company">
                  {job.company_name || "Company not specified"}
                </p>

                <div className="job-details">
                  <span>📍 {job.location || "Location not specified"}</span>
                  <span>
                    🎯{" "}
                    {job.experience_level?.replace("_", " ") ||
                      "Experience not specified"}
                  </span>
                </div>

                {(job.salary_min || job.salary_max) && (
                  <p className="job-salary">
                    Salary: {job.salary_min ?? "—"} – {job.salary_max ?? "—"}
                  </p>
                )}

                <div className="job-card-footer">
                  <span>
                    {job.required_skills?.length ?? 0} required skill
                    {(job.required_skills?.length ?? 0) === 1 ? "" : "s"}
                  </span>

                  <Link to={`/jobs/${job.id}`} className="view-job-button">
  View Details →
</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Jobs;
