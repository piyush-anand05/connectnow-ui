import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMe,
  updateMe,
  changePassword,
  deleteMyAccount
} from "../api/auth";

import "../styles/home.css";

export default function AccountSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    city: ""
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      setLoading(true);

      const data = await getMe();

      setUser({
        name: data.name || "",
        email: data.email || "",
        gender: data.gender || "",
        city: data.city || ""
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.log(err);
      setError("Unable to load account details.");
    } finally {
      setLoading(false);
    }
  }

  function handleUserChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  function handlePasswordChange(e) {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  }

  async function saveSettings() {
    try {
      setError("");
      setMessage("");

      if (!user.name.trim()) {
        setError("Name cannot be empty.");
        return;
      }

      const updated = await updateMe({
        name: user.name,
        city: user.city,
        gender: user.gender
      });

      setUser({
        name: updated.name || "",
        email: updated.email || "",
        gender: updated.gender || "",
        city: updated.city || ""
      });

      localStorage.setItem("user", JSON.stringify(updated));

      setMessage("Account settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setError("Unable to save account settings.");
    }
  }

  async function handleChangePassword() {
    try {
      setError("");
      setMessage("");

      if (
        !passwords.currentPassword ||
        !passwords.newPassword ||
        !passwords.confirmPassword
      ) {
        setError("Please fill all password fields.");
        return;
      }

      if (passwords.newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      await changePassword(passwords.currentPassword, passwords.newPassword);

      setMessage("Password changed successfully.");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);

      const msg = String(err);

      if (msg.includes("Current password")) {
        setError("Current password is incorrect.");
      } else {
        setError("Unable to change password.");
      }
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    );

    if (!confirmed) return;

    try {
      await deleteMyAccount();

      localStorage.clear();

      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Unable to deactivate account.");
    }
  }

  if (loading) {
    return (
      <div className="cn-page account-settings-v2-page">
        <div className="ai-card">
          <h2>Loading account details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="cn-page account-settings-v2-page">
      {message && (
        <div className="success-box" style={{ marginBottom: "20px" }}>
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="error-box" style={{ marginBottom: "20px" }}>
          ❌ {error}
        </div>
      )}

      <div className="settings-premium-layout">
        <div className="settings-profile-card">
          <div className="settings-avatar">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <h2>{user.name || "ConnectNowww user"}</h2>

          <p>{user.email}</p>

          <span>{user.city || "Location not added"}</span>
        </div>

        <div className="settings-main-card">
          <h2>Basic Information</h2>

          <p className="modal-subtitle">
            This information personalizes your local experience and helps people
            identify you across ConnectNowww.
          </p>

          <label>Name</label>
          <input
            name="name"
            value={user.name}
            onChange={handleUserChange}
            placeholder="Your full name"
          />

          <label>Email</label>
          <input
            name="email"
            value={user.email}
            disabled
            placeholder="amit@example.com"
          />

          <label>Gender</label>
          <select
            name="gender"
            value={user.gender || ""}
            onChange={handleUserChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <label>City</label>
          <input
            name="city"
            value={user.city || ""}
            onChange={handleUserChange}
            placeholder="Pune"
          />

          <button className="save-btn" onClick={saveSettings}>
            Save Account Settings
          </button>
        </div>

        <div className="settings-main-card">
          <h2>Change Password</h2>

          <p className="modal-subtitle">
            Keep your account secure with a strong password.
          </p>

          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current password"
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New password"
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
          />

          <button className="save-btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        <div className="settings-danger-card">
          <h2>Danger Zone</h2>

          <p>
            Deactivating your account will prevent login from this account. Your
            historical content may remain for audit and product integrity.
          </p>

          <button onClick={handleDeleteAccount}>Deactivate Account</button>
        </div>
      </div>
    </div>
  );
}