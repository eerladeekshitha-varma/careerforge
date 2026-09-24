import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Resumes.css";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchResumes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("resumes/");
      setResumes(response.data.results ?? response.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError("Could not load resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please choose a resume file.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    setUploading(true);
    setError("");
    setMessage("");

    try {
      await api.post("resumes/", formData);

      setMessage("Resume uploaded successfully!");
      setTitle("");
      setFile(null);
      event.target.reset();

      await fetchResumes();
    } catch (err) {
      console.error("Resume upload error:", err);

      const data = err.response?.data;

      if (data) {
        const details = Object.entries(data)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages);

            return `${field}: ${text}`;
          })
          .join(" ");

        setError(details || "Upload failed. Please try again.");
      } else {
        setError("Could not connect to the server.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`resumes/${resumeId}/`);
      setResumes((current) =>
        current.filter((resume) => resume.id !== resumeId)
      );
      setMessage("Resume deleted successfully.");
    } catch (err) {
      console.error("Resume deletion error:", err);
      setError("Could not delete this resume. Please try again.");
    }
  };

  return (
    <div className="resumes-page">
      <div className="resumes-header">
        <div>
          <p className="eyebrow">YOUR CAREER DOCUMENTS</p>
          <h1>My Resumes</h1>
          <p>Upload and manage the resumes you use for job applications.</p>
        </div>

        <div className="resume-count">
          <span>📄</span>
          <div>
            <strong>{resumes.length}</strong>
            <small>Resumes saved</small>
          </div>
        </div>
      </div>

      <section className="resume-upload-card">
        <div className="resume-section-title">
          <span className="resume-icon">📤</span>
          <div>
            <h2>Upload a new resume</h2>
            <p>Add a resume to your CareerForge profile.</p>
          </div>
        </div>

        <form onSubmit={handleUpload}>
          <div className="resume-form-field">
            <label htmlFor="resume-title">Resume title</label>
            <input
              id="resume-title"
              type="text"
              placeholder="e.g. Full Stack Python Resume"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="resume-form-field">
            <label htmlFor="resume-file">Choose resume file</label>
            <input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) =>
                setFile(event.target.files?.[0] ?? null)
              }
              required
            />
            <small>Choose a PDF, DOC, or DOCX file.</small>
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Resume ↑"}
          </button>
        </form>
      </section>

      {error && <div className="resume-alert resume-alert-error">{error}</div>}
      {message && (
        <div className="resume-alert resume-alert-success">{message}</div>
      )}

      <section className="resume-list-section">
        <div className="resume-list-heading">
          <div>
            <h2>Your uploaded resumes</h2>
            <p>Manage the documents saved to your account.</p>
          </div>
        </div>

        {loading ? (
          <p className="resume-state">Loading your resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="resume-empty">
            <span>📂</span>
            <h3>No resumes yet</h3>
            <p>Upload your first resume using the form above.</p>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.map((resume) => (
              <article className="resume-item" key={resume.id}>
                <div className="resume-file-icon">📄</div>

                <div className="resume-item-info">
                  <h3>{resume.title}</h3>
                  <p>
                    Uploaded{" "}
                    {resume.created_at
                      ? new Date(resume.created_at).toLocaleDateString()
                      : "date unavailable"}
                  </p>

                  {resume.file && (
                    <a
                      href={resume.file}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-file-link"
                    >
                      View file ↗
                    </a>
                  )}

                  {resume.is_primary && (
                    <span className="primary-resume-badge">
                      Primary resume
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="delete-resume-button"
                  onClick={() => handleDelete(resume.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Resumes;