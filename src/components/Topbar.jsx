import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  ChevronDown,
  LogOut,
  MapPinned,
  Newspaper,
  Settings,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "CW";
  const text = String(nameOrEmail).trim();
  if (!text) return "CW";
  const parts = text.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return text.slice(0, 2).toUpperCase();
}

function Topbar({ title = "Local Pulse", subtitle = "Fresh local signals around your active city" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.name || user?.full_name || user?.username || user?.email || "Local explorer";
  const initials = getInitials(displayName);
  const activeCity = user?.active_city || user?.city || localStorage.getItem("active_city") || "Set city";

  const accountActions = useMemo(
    () => [
      { label: "View Profile", path: "/profile", icon: UserRound },
      { label: "My Posts", path: "/my-posts", icon: Newspaper },
      { label: "Saved Posts", path: "/saved-posts", icon: Bookmark },
      { label: "Account Settings", path: "/settings", icon: Settings },
    ],
    []
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="cn-topbar cn-topbar-living">
      <div className="cn-topbar-left">
        <div className="cn-topbar-title-block">
          <h2 className="cn-topbar-title text-one-line">{title}</h2>
          <p className="cn-topbar-subtitle text-one-line">{subtitle}</p>
        </div>
      </div>

      <div className="cn-topbar-right">
        <button
          type="button"
          className="cn-location-pill cn-location-pill-living"
          onClick={() => navigate("/settings")}
          title="Update active city"
        >
          <MapPinned size={16} />
          <span>{activeCity}</span>
        </button>

        <button
          type="button"
          className="cn-icon-btn cn-topbar-bell"
          onClick={() => navigate("/notifications")}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="cn-topbar-bell-dot" />
        </button>

        <div className="cn-account-menu" ref={dropdownRef}>
          <button
            type="button"
            className="cn-profile-pill cn-profile-pill-living"
            onClick={() => setAccountOpen((value) => !value)}
            title="Open account menu"
            aria-label="Open account menu"
          >
            <span className="cn-profile-avatar">{initials}</span>
            <span className="cn-profile-name">{displayName}</span>
            <ChevronDown size={15} className={accountOpen ? "cn-account-chevron-open" : ""} />
          </button>

          {accountOpen && (
            <div className="cn-account-dropdown">
              <div className="cn-account-dropdown-head">
                <span className="cn-profile-avatar cn-account-dropdown-avatar">{initials}</span>
                <div>
                  <strong>{displayName}</strong>
                  <small>{user?.email || "Your local identity"}</small>
                </div>
              </div>

              <div className="cn-account-dropdown-actions">
                {accountActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.path}
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        navigate(action.path);
                      }}
                    >
                      <Icon size={16} />
                      {action.label}
                    </button>
                  );
                })}
              </div>

              <button type="button" className="cn-account-logout" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
