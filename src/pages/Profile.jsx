import { useEffect, useState } from "react";

import {
  getMyProfile,
  updateMyProfile
} from "../api/profile";

import "../styles/home.css";

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    city: ""
  });

  const [profile, setProfile] = useState({
    about_me: "",
    can_help_with: "",
    skills: "",
    experience: "",
    interests: "",
    availability: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getMyProfile();

      setUser({
        name: data.name || "",
        email: data.email || "",
        city: data.city || ""
      });

      setProfile({
        about_me: data.about_me || "",
        can_help_with: data.can_help_with || "",
        skills: data.skills || "",
        experience: data.experience || "",
        interests: data.interests || "",
        availability: data.availability || ""
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }

  async function saveProfile() {
    try {
      await updateMyProfile(profile);

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setMessage("Unable to save profile.");
    }
  }

  if (loading) {
    return (
      <div className="cn-page profile-v2-page">
        <div className="ai-card">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="cn-page profile-v2-page">
      {message && (
        <div
          className="success-box"
          style={{ marginBottom: 20 }}
        >
          ✅ {message}
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-preview-card">
          <div className="profile-avatar-large">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>{user.name}</h2>

          <p>{user.city || "Location not added"}</p>

          <div className="profile-pill-list">
            {(profile.skills || "")
              .split(",")
              .filter(Boolean)
              .slice(0, 6)
              .map((skill, index) => (
                <span key={index}>
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>

        <div className="modal-card profile-modal profile-page-card">
          <h2>What can you help people with?</h2>

          <p className="modal-subtitle">
            This helps nearby people discover you based on
            your expertise, interests and experience.
          </p>

          <label>About Me</label>

          <textarea
            name="about_me"
            value={profile.about_me}
            onChange={handleChange}
            placeholder="Tell people about yourself..."
          />

          <label>What Help I Can Do</label>

          <textarea
            name="can_help_with"
            value={profile.can_help_with}
            onChange={handleChange}
            placeholder="Insurance, Python, Photography..."
          />

          <label>Skills</label>

          <input
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Python, SQL, Excel..."
          />

          <label>Experience</label>

          <textarea
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            placeholder="Experience..."
          />

          <label>Interests</label>

          <input
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            placeholder="AI, Finance, Cricket..."
          />

          <label>Availability</label>

          <input
            name="availability"
            value={profile.availability}
            onChange={handleChange}
            placeholder="Weekends, Evenings..."
          />

          <button
            className="save-btn"
            onClick={saveProfile}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}