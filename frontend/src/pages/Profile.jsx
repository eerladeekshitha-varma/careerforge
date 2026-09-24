import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    college: "",
    degree: "",
    graduation_year: "",
    github_url: "",
    linkedin_url: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profile/");
        setProfile(response.data);

        setFormData({
          phone: response.data.phone || "",
          location: response.data.location || "",
          college: response.data.college || "",
          degree: response.data.degree || "",
          graduation_year: response.data.graduation_year || "",
          github_url: response.data.github_url || "",
          linkedin_url: response.data.linkedin_url || "",
          bio: response.data.bio || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.patch("profile/", formData);

      setProfile(response.data);
      setMessage("Your profile has been updated successfully! 🎉");
    } catch (err) {
      console.error("Error updating profile:", err);

      const data = err.response?.data;

      if (data?.detail) {
        setError(data.detail);
      } else if (data && typeof data === "object") {
        const messages = Object.values(data).flat().join(" ");
        setError(messages || "Unable to update your profile.");
      } else {
        setError("Unable to update your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-message">Loading your profile...</div>;
  }

  if (error && !profile) {
    return (
      <div className="profile-message">
        <h2>Profile unavailable</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <div>
          <p className="profile-eyebrow">CAREERFORGE ACCOUNT</p>
          <h1>My Profile</h1>
          <p>Manage your personal and professional information.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar">
            {profile?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2>{profile?.username}</h2>
            <p>{profile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-form-section">
            <h3>Personal Information</h3>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3>Education</h3>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="college">College</label>
                <input
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter your college"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="degree">Degree</label>
                <input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Enter your degree"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="graduation_year">Graduation Year</label>
                <input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3>Professional Links</h3>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="github_url">GitHub URL</label>
                <input
                  id="github_url"
                  name="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="profile-field">
                <label htmlFor="linkedin_url">LinkedIn URL</label>
                <input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <h3>About Me</h3>

            <div className="profile-field">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows="5"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short introduction about yourself..."
              />
            </div>
          </div>

          {message && (
            <div className="profile-feedback profile-success">
              {message}
            </div>
          )}

          {error && (
            <div className="profile-feedback profile-error">
              {error}
            </div>
          )}

          <div className="profile-form-footer">
            <button type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Profile;