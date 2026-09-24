import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "./api/axios";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Resumes from "./pages/Resumes";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";

import "./App.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getInterviewDateValue = (interview) =>
    interview?.scheduled_at ??
    interview?.date ??
    interview?.datetime ??
    interview?.starts_at ??
    interview?.start_time ??
    null;

  const formatInterviewDate = (interview) => {
    const value = getInterviewDateValue(interview);

    if (!value) return "Date unavailable";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleString();
  };

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [
        jobsResponse,
        resumesResponse,
        applicationsResponse,
        analysesResponse,
        interviewsResponse,
      ] = await Promise.all([
        api.get("jobs/"),
        api.get("resumes/"),
        api.get("applications/"),
        api.get("resume-analysis/"),
        api.get("interviews/"),
      ]);

      setJobs(jobsResponse.data.results ?? jobsResponse.data);
      setResumes(resumesResponse.data.results ?? resumesResponse.data);
      setApplications(
        applicationsResponse.data.results ?? applicationsResponse.data
      );
      setAnalyses(analysesResponse.data.results ?? analysesResponse.data);
      setInterviews(interviewsResponse.data.results ?? interviewsResponse.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Could not load dashboard data. Please check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const applicationStatuses = [
    "SAVED",
    "APPLIED",
    "ASSESSMENT",
    "INTERVIEW",
    "SELECTED",
    "REJECTED",
  ];

  const applicationStatusCounts = applicationStatuses.map((status) => ({
    status,
    count: applications.filter(
      (application) => application.status === status
    ).length,
  }));

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">YOUR CAREER, YOUR JOURNEY</p>
          <h1>Welcome to CareerForge 👋</h1>
          <p className="subtitle">
            Your personal space to discover jobs and manage your career.
          </p>
        </div>

        <div className="profile">
          <div className="avatar">D</div>
          <span>Deekshitha</span>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">💼</span>
          <p>Jobs Available</p>

          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>Unavailable</h2>
          ) : (
            <h2>{jobs.length} Jobs</h2>
          )}

          <span className="stat-note">
            {error || "Explore opportunities"}
          </span>
        </div>

        <div className="stat-card">
  <span className="stat-icon">📄</span>
  <p>My Resumes</p>

  <h2>{loading ? "Loading..." : `${resumes.length} Resumes`}</h2>

  <span className="stat-note">Keep your profile ready</span>
</div>

        <div className="stat-card">
  <span className="stat-icon">📌</span>
  <p>Applications</p>

  <h2>
    {loading ? "Loading..." : `${applications.length} Applications`}
  </h2>

  <span className="stat-note">Stay on top of your progress</span>
</div>

        <div className="stat-card">
  <span className="stat-icon">🎯</span>
  <p>Resume Match</p>

  <h2>
    {loading
      ? "Loading..."
      : analyses.length > 0
      ? `${analyses[analyses.length - 1].match_score}%`
      : "Not analyzed yet"}
  </h2>

  <span className="stat-note">Your latest resume match score</span>
</div>
      </section>

      <section className="application-status-section">
        <div className="section-heading">
          <div>
            <h2>Application Overview</h2>
            <p>Track the progress of your job applications.</p>
          </div>
        </div>

        <div className="status-chart">
          {applicationStatusCounts.map(({ status, count }) => {
            const percentage =
              applications.length > 0
                ? (count / applications.length) * 100
                : 0;

            return (
              <div className="status-chart-row" key={status}>
                <div className="status-chart-label">
                  <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                  <strong>{count}</strong>
                </div>

                <div className="status-chart-track">
                  <div
                    className={`status-chart-bar status-${status.toLowerCase()}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="welcome-card">
        <div>
          <p className="eyebrow">READY FOR YOUR NEXT CHAPTER?</p>
          <h2>Your next opportunity starts here.</h2>
          <p>
            Explore job openings, compare your skills with job requirements,
            and keep your applications organized in one place.
          </p>

          <NavLink to="/jobs" className="dashboard-jobs-link">
            Explore Jobs →
          </NavLink>
        </div>

        <div className="welcome-illustration">🚀</div>
      </section>

      <section className="section-heading">
        <div>
          <h2>Quick actions</h2>
          <p>Pick up where your career journey needs you.</p>
        </div>
      </section>

      <section className="actions-grid">
        <NavLink to="/jobs" className="action-card">
          <span>🔎</span>
          <h3>Find a job</h3>
          <p>Search opportunities that match your interests.</p>
        </NavLink>

        <NavLink to="/resumes" className="action-card">
          <span>📤</span>
          <h3>Upload a resume</h3>
          <p>Keep your resume ready for your next application.</p>
        </NavLink>

        <NavLink to="/resume-analysis" className="action-card">
          <span>🧠</span>
          <h3>Analyze your resume</h3>
          <p>Understand matched skills and areas to improve.</p>
        </NavLink>
      </section>

      <section className="recent-applications">
        <div className="section-heading">
          <div>
            <h2>Recent Applications</h2>
            <p>Keep track of your latest job applications.</p>
          </div>

          <NavLink to="/applications" className="view-all-link">
            View all →
          </NavLink>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <h3>No applications yet</h3>
            <p>Explore jobs and submit your first application!</p>

            <NavLink to="/jobs" className="dashboard-jobs-link">
              Explore Jobs →
            </NavLink>
          </div>
        ) : (
          <div className="recent-applications-list">
            {applications.slice(-5).reverse().map((application) => (
              <div className="recent-application-card" key={application.id}>
                <div className="application-info">
                  <h3>
                    {application.job_title || application.job_details?.title || `Job #${application.job}`}
                  </h3>

                  <p>
                    {application.company_name ||
                      application.job_details?.company?.name ||
                      "Company"}
                  </p>
                </div>

                <div className="application-meta">
                  <span className={`status-badge status-${application.status?.toLowerCase()}`}>
                    {application.status}
                  </span>

                  <span className="application-date">
                    {application.applied_date
                      ? new Date(application.applied_date).toLocaleDateString()
                      : "Date unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="upcoming-interviews">
        <div className="section-heading">
          <div>
            <h2>Upcoming Interviews</h2>
            <p>Get ready for the next step in your career journey.</p>
          </div>

          <NavLink to="/interviews" className="view-all-link">
            View all →
          </NavLink>
        </div>

        {loading ? (
          <p>Loading interviews...</p>
        ) : interviews.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            <h3>No interviews scheduled yet</h3>
            <p>Your scheduled interviews will appear here.</p>
          </div>
        ) : (
          <div className="upcoming-interviews-list">
            {interviews
              .filter((interview) => {
                const interviewDate = new Date(getInterviewDateValue(interview));
                return (
                  !Number.isNaN(interviewDate.getTime()) &&
                  interviewDate >= new Date()
                );
              })
              .sort(
                (a, b) =>
                  new Date(getInterviewDateValue(a)) -
                  new Date(getInterviewDateValue(b))
              )
              .slice(0, 5)
              .map((interview) => (
                <div className="interview-card" key={interview.id}>
                  <div>
                    <h3>
                      {interview.job_title ||
                        interview.job_details?.title ||
                        `Job #${interview.job}`}
                    </h3>

                    <p>
                      {interview.company_name ||
                        interview.job_details?.company?.name ||
                        "Company"}
                    </p>
                  </div>

                  <div className="interview-meta">
                    <span>
                      📅 {formatInterviewDate(interview)}
                    </span>

                    <span>
                      💻 {interview.mode || "Mode not specified"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <footer>
        CareerForge · Shape your future with confidence.
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <h2 className="logo">CareerForge</h2>

          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/jobs">
              Find Jobs
            </NavLink>

            <NavLink to="/resumes">
              My Resumes
            </NavLink>

            <NavLink to="/resume-analysis">
            Resume Analysis
            </NavLink>
            <NavLink to="/applications">Applications</NavLink>
            <NavLink to="/interviews">Interviews</NavLink>
            <NavLink to="/profile" className="sidebar-link">
              <span>👤</span>
              <span>My Profile</span>
            </NavLink>
          </nav>
            
          <div className="sidebar-bottom">
            <p>Build your future,</p>
            <strong>one opportunity at a time.</strong>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />
  <Route path="/register" element={<Register />} />
  <Route
  path="/resumes"
  element={
    <ProtectedRoute>
      <Resumes />
    </ProtectedRoute>
  }
/>
  <Route
  path="/resume-analysis"
  element={
    <ProtectedRoute>
      <ResumeAnalysis />
    </ProtectedRoute>
  }
/>

  <Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  {/* Protected routes */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
  path="/interviews"
  element={
    <ProtectedRoute>
      <Interviews />
    </ProtectedRoute>
  }
/>
</Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;