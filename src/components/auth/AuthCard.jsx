import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import AuthBrandMark from "./AuthBrandMark";
import AuthTrustStrip from "./AuthTrustStrip";

export default function AuthCard({
  mode,
  onModeChange,
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  gender,
  onGenderChange,
  city,
  onCityChange,
  showPassword,
  onTogglePassword,
  error,
  success,
  loading,
  onSubmit,
}) {
  const isLogin = mode === "login";

  return (
    <section className="auth-card-v2">
      <AuthBrandMark />

      <div className="auth-card-heading">
        <p className="auth-card-kicker">Living locality access</p>
        <h2>{isLogin ? "Enter your local world" : "Create your local identity"}</h2>
        <p>
          {isLogin
            ? "Sign in to discover what is happening around you."
            : "Join to reveal people, help, events and opportunities around your active city."}
        </p>
      </div>

      <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
        <button
          type="button"
          className={isLogin ? "auth-mode-active" : ""}
          onClick={() => onModeChange("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={!isLogin ? "auth-mode-active" : ""}
          onClick={() => onModeChange("register")}
        >
          Register
        </button>
      </div>

      <form className="auth-form-v2" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        {!isLogin && (
          <>
            <label className="auth-field">
              <span>Full name</span>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                autoComplete="name"
              />
            </label>

            <div className="auth-form-grid-two">
              <label className="auth-field">
                <span>Gender</span>
                <select value={gender} onChange={(event) => onGenderChange(event.target.value)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>

              <label className="auth-field">
                <span>Active city</span>
                <input
                  type="text"
                  placeholder="Pune"
                  value={city}
                  onChange={(event) => onCityChange(event.target.value)}
                  autoComplete="address-level2"
                />
              </label>
            </div>
          </>
        )}

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button type="button" onClick={onTogglePassword} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {success && <div className="auth-alert auth-alert-success">{success}</div>}

        <button className="auth-submit-btn" type="submit" disabled={loading}>
          {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
          {loading ? "Please wait..." : isLogin ? "Continue to ConnectNowww" : "Create my local identity"}
        </button>
      </form>

      <p className="auth-switch-copy">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <button type="button" onClick={() => onModeChange(isLogin ? "register" : "login")}>
          {isLogin ? "Create your local identity" : "Login instead"}
        </button>
      </p>

      <AuthTrustStrip />
    </section>
  );
}
