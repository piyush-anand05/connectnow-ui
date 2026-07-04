import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

import {
  loginUser,
  registerUser
} from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleLogin() {
    try {
      setError("");
      setSuccess("");

      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!password) {
        setError("Password is required.");
        return;
      }

      setLoading(true);

      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      console.log(err);

      const msg = String(err);

      if (msg.includes("Incorrect") || msg.includes("401")) {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setError("");
      setSuccess("");

      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email.");
        return;
      }

      if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }

      if (!gender) {
        setError("Please select your gender.");
        return;
      }

      if (!city.trim()) {
        setError("Please enter your city.");
        return;
      }

      setLoading(true);

      const data = await registerUser(
        name,
        email,
        password,
        gender,
        city
      );

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      console.log(err);

      const msg = String(err);

      if (msg.includes("already registered") || msg.includes("409")) {
        setError("This email is already registered.");
      } else {
        setError("Unable to create account.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="bg-glow"></div>

      <div className="network network1"></div>
      <div className="network network2"></div>
      <div className="network network3"></div>

      <div className="hero-panel">
        <div className="logo-row">
          <div className="logo-circle">⬢</div>

          <div>
            <h2>ConnectNow</h2>
            <p>Local Opportunity Network</p>
          </div>
        </div>

        <h1 className="hero-title">
          Your neighborhood is full of
          <span> opportunities.</span>
        </h1>

        <p className="hero-subtitle">
          Tell us what you're looking for.
          We'll help you discover people,
          communities and opportunities nearby.
        </p>

        <div className="search-demo">
          <div className="search-bar">
            🔍 Looking for...
          </div>

          <div className="search-items">
            <span>A badminton partner</span>
            <span>Local events this weekend</span>
            <span>Startup founders nearby</span>
            <span>A photography community</span>
            <span>A tutor for your child</span>
            <span>Volunteers for a cause</span>
            <span>New friends nearby</span>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <h3>12,431</h3>
            <p>People Nearby</p>
          </div>

          <div className="stat-card">
            <h3>1,284</h3>
            <p>Opportunities</p>
          </div>

          <div className="stat-card">
            <h3>93</h3>
            <p>Communities</p>
          </div>
        </div>

        <div className="feed-section">
          <div className="feed-card">🎭 Community Theatre Workshop</div>
          <div className="feed-card">📸 Photography Walk This Sunday</div>
          <div className="feed-card">🚴 Weekend Cycling Group</div>
          <div className="feed-card">🍲 Local Food Festival</div>
          <div className="feed-card">🎤 Open Mic Night</div>
          <div className="feed-card">📚 Neighborhood Book Club</div>
          <div className="feed-card">🧠 AI & Startup Meetup</div>
          <div className="feed-card">🐶 Pet Parents Community</div>
        </div>
      </div>

      <div className="login-card">
        <div className="card-top">
          <h2>
            {mode === "login"
              ? "Welcome Back"
              : "Join ConnectNow"}
          </h2>

          <p className="subtitle">
            Discover people,
            opportunities and communities
            around you.
          </p>
        </div>

        <div className="mode-switch">
          <button
            className={mode === "login" ? "active-mode" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>

          <button
            className={mode === "register" ? "active-mode" : ""}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {mode === "register" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="show-pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "( ◉ ◉ )" : "( • • )"}
          </button>
        </div>

        {error && (
          <div className="error-box">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            ✅ {success}
          </div>
        )}

        <button
          className="login-btn"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
          type="button"
        >
          {loading
            ? "Please Wait..."
            : mode === "login"
            ? "Continue →"
            : "Create My Account →"}
        </button>

        <div className="bottom-text">
          Built for local communities 🇮🇳
        </div>
      </div>
    </div>
  );
}