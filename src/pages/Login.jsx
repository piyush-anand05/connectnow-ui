import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthCard from "../components/auth/AuthCard";
import LivingLocalityScene from "../components/auth/LivingLocalityScene";
import AnimatedNeedSearch from "../components/auth/AnimatedNeedSearch";
import { useAuth } from "../context/AuthContext";

import "../styles/login.css";
import "../styles/auth-living.css";

export default function Login({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const redirectTo = location.state?.from?.pathname || "/home";

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
      await login(email, password);
      setSuccess("Welcome in. Opening your locality...");
      setTimeout(() => navigate(redirectTo, { replace: true }), 500);
    } catch (err) {
      console.error(err);
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
        setError("Please enter your active city.");
        return;
      }

      setLoading(true);
      await register(name, email, password, gender, city);
      setSuccess("Your local identity is ready. Opening connectnowww...");
      setTimeout(() => navigate("/home", { replace: true }), 500);
    } catch (err) {
      console.error(err);
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
    <main className="living-auth-page">
      <div className="living-auth-bg" aria-hidden="true">
        <span className="living-auth-glow living-auth-glow-a" />
        <span className="living-auth-glow living-auth-glow-b" />
        <span className="living-auth-grid" />
      </div>

      <section className="living-auth-shell">
        <div className="living-auth-mobile-story">
          <p className="locality-kicker">ConnectNowww</p>
          <h1>Your locality is already alive.</h1>
          <AnimatedNeedSearch compact />
        </div>

        <LivingLocalityScene />

        <AuthCard
          mode={mode}
          onModeChange={setMode}
          name={name}
          onNameChange={setName}
          email={email}
          onEmailChange={setEmail}
          password={password}
          onPasswordChange={setPassword}
          gender={gender}
          onGenderChange={setGender}
          city={city}
          onCityChange={setCity}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          error={error}
          success={success}
          loading={loading}
          onSubmit={mode === "login" ? handleLogin : handleRegister}
        />
      </section>
    </main>
  );
}
