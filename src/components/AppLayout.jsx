import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

const pageMeta = {
  "/home": {
    title: "Local Pulse",
    subtitle: "What is being discovered around your active city",
  },
  "/create-post": {
    title: "Create Post",
    subtitle: "Share an event, help request, service, gig or local update",
  },
  "/my-posts": {
    title: "My Posts",
    subtitle: "Manage the local signals you have shared",
  },
  "/saved-posts": {
    title: "Saved Posts",
    subtitle: "Useful posts and events you bookmarked",
  },
  "/network": {
    title: "Discover People",
    subtitle: "Reveal useful people around your active city",
  },
  "/messages": {
    title: "Inbox",
    subtitle: "Connection-first local conversations",
  },
  "/post-replies": {
    title: "Post Replies",
    subtitle: "Private conversations linked to local posts",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Ripples from your local world",
  },
  "/gigs": {
    title: "Local Gigs",
    subtitle: "Micro opportunities around your locality",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Your local identity and trusted presence",
  },
  "/settings": {
    title: "Account Settings",
    subtitle: "Active city, privacy and account controls",
  },
};

function getPageMeta(pathname) {
  if (pageMeta[pathname]) return pageMeta[pathname];
  if (pathname.startsWith("/messages")) return pageMeta["/messages"];
  if (pathname.startsWith("/post-replies")) return pageMeta["/post-replies"];
  if (pathname.startsWith("/create-post")) return pageMeta["/create-post"];
  return {
    title: "ConnectNowww",
    subtitle: "Your living digital layer over every locality",
  };
}

function AppLayout({ children }) {
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  return (
    <div className="cn-app-shell cn-app-shell-living">
      <div className="cn-layout">
        <Sidebar />

        <main className="cn-main-area">
          <Topbar title={meta.title} subtitle={meta.subtitle} />

          <div className="cn-content">
            <div className="cn-content-inner">{children || <Outlet />}</div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default AppLayout;
