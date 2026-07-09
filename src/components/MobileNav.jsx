import { NavLink } from "react-router-dom";
import { MessageSquareText, PenLine, Radar, UserRound, UsersRound } from "lucide-react";

const mobileNavItems = [
  { label: "Pulse", path: "/home", icon: Radar },
  { label: "Discover", path: "/network", icon: UsersRound },
  { label: "Create", path: "/create-post", icon: PenLine, isCreate: true },
  { label: "Inbox", path: "/messages", icon: MessageSquareText },
  { label: "Me", path: "/profile", icon: UserRound },
];

function MobileNav() {
  return (
    <nav className="cn-mobile-nav" aria-label="Mobile navigation">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "cn-mobile-nav-link",
                item.isCreate ? "cn-mobile-nav-create" : "",
                isActive ? "cn-mobile-nav-link-active" : "",
              ].filter(Boolean).join(" ")
            }
          >
            <span className="cn-mobile-nav-icon"><Icon size={19} /></span>
            <span className="cn-mobile-nav-text">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;
