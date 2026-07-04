import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  UserCircle2,
  User,
  Settings,
  LogOut,
  CheckCheck
} from "lucide-react";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead
} from "../api/notifications";

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 8000);

    return () => clearInterval(interval);
  }, []);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  function formatTime(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  async function loadNotifications() {
    try {
      const [list, countData] = await Promise.all([
        getMyNotifications(),
        getUnreadNotificationCount()
      ]);

      setNotifications(list);
      setUnreadCount(countData.unread_count || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleNotificationClick(notification) {
    try {
      if (!notification.is_read) {
        await markNotificationRead(notification.notification_id);
      }

      await loadNotifications();

      if (notification.notification_type === "connection_request") {
        navigate("/network");
      } else if (notification.notification_type === "connection_accepted") {
        navigate("/network");
      } else if (notification.notification_type === "message") {
        navigate("/messages");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="top-icons">
        <div className="notification-area">
          <button
            className="icon-btn notif-icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notification-dropdown">
              <div className="notification-head">
                <h3>Notifications</h3>

                <button onClick={handleMarkAllRead}>
                  <CheckCheck size={15} />
                  Mark all read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="notification-empty">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 8).map((notif) => (
                  <button
                    key={notif.notification_id}
                    className={
                      notif.is_read
                        ? "notification-item"
                        : "notification-item unread"
                    }
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <strong>{notif.title}</strong>
                    <p>{notif.message}</p>
                    <span>{formatTime(notif.created_dt)}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-area">
          <button
            className="icon-btn"
            onClick={() => setOpen(!open)}
          >
            <UserCircle2 size={28} />
          </button>

          {open && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/profile")}>
                <User size={16} />
                My Profile
              </button>

              <button onClick={() => navigate("/settings")}>
                <Settings size={16} />
                Account Settings
              </button>

              <button onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}