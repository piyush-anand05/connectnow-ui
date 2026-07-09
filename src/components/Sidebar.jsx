import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Compass,
  LogOut,
  MessageSquareText,
  PenLine,
  Radar,
  Settings,
  UserRound,
  UsersRound,
  Newspaper,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandMark from "./common/BrandMark";

const mainNav = [
  { label: "Local Pulse", path: "/home", icon: Radar },
  { label: "Discover People", path: "/network", icon: UsersRound },
  { label: "Create Post", path: "/create-post", icon: PenLine },
  { label: "Local Gigs", path: "/gigs", icon: BriefcaseBusiness },
  { label: "Inbox", path: "/messages", icon: MessageSquareText },
];

const manageNav = [
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Post Replies", path: "/post-replies", icon: Newspaper },
  { label: "My Posts", path: "/my-posts", icon: Compass },
  { label: "Saved", path: "/saved-posts", icon: Bookmark },
];

const accountNav = [
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        ["cn-sidebar-link", isActive ? "cn-sidebar-link-active" : ""].filter(Boolean).join(" ")
      }
    >
      <span className="cn-sidebar-link-icon"><Icon size={19} /></span>
      <span className="cn-sidebar-link-text text-one-line">{item.label}</span>
    </NavLink>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="cn-sidebar cn-sidebar-living">
      <div className="cn-sidebar-brand cn-sidebar-brand-living">
        <BrandMark />
      </div>

      <div className="cn-sidebar-section">
        <p className="cn-sidebar-section-label">Discover</p>
        <nav className="cn-sidebar-nav" aria-label="Main navigation">
          {mainNav.map((item) => <SidebarLink key={item.path} item={item} />)}
        </nav>
      </div>

      <div className="cn-sidebar-section">
        <p className="cn-sidebar-section-label">Your Local Layer</p>
        <nav className="cn-sidebar-nav" aria-label="Manage navigation">
          {manageNav.map((item) => <SidebarLink key={item.path} item={item} />)}
        </nav>
      </div>

      <div className="cn-sidebar-section">
        <p className="cn-sidebar-section-label">Account</p>
        <nav className="cn-sidebar-nav" aria-label="Account navigation">
          {accountNav.map((item) => <SidebarLink key={item.path} item={item} />)}
        </nav>
      </div>

      <div className="cn-sidebar-footer-note">
        <strong>Living Locality</strong>
        <span>People, help, gigs and events around your active city.</span>
      </div>

      <button type="button" className="cn-sidebar-link cn-sidebar-logout" onClick={handleLogout}>
        <span className="cn-sidebar-link-icon"><LogOut size={19} /></span>
        <span className="cn-sidebar-link-text">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
