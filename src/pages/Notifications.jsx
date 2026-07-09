import { useEffect, useState } from "react";
import { Bell, CheckCheck, MessageSquareText, UsersRound, Heart, Sparkles } from "lucide-react";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications";

function notificationIcon(type = "") {
  const lower = String(type).toLowerCase();
  if (lower.includes("request") || lower.includes("connection")) return UsersRound;
  if (lower.includes("message") || lower.includes("reply")) return MessageSquareText;
  if (lower.includes("like") || lower.includes("save")) return Heart;
  return Bell;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(Array.isArray(data) ? data : data?.notifications || []);
    } catch (error) {
      console.warn(error);
      setMessage("Unable to load notifications right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: 1 })));
    } catch (error) {
      console.warn(error);
      setMessage("Unable to mark all as read.");
    }
  }

  async function handleMarkRead(item) {
    if (item.is_read) return;
    try {
      await markNotificationRead(item.notification_id || item.id);
      setNotifications((prev) =>
        prev.map((notice) =>
          (notice.notification_id || notice.id) === (item.notification_id || item.id)
            ? { ...notice, is_read: 1 }
            : notice
        )
      );
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <div className="cn-page notifications-page-living">
      {message && <div className="cn-form-note">{message}</div>}

      <section className="notifications-hero">
        <div>
          <p className="cn-page-kicker">Local ripples</p>
          <h1>Notifications</h1>
          <p>
            When someone connects, replies, likes, saves or messages, it creates a small ripple in your local world.
          </p>
        </div>
        <button className="cn-btn cn-btn-secondary" type="button" onClick={handleMarkAllRead}>
          <CheckCheck size={17} />
          Mark all read
        </button>
      </section>

      {loading ? (
        <div className="cn-empty">
          <div className="cn-empty-icon"><Sparkles size={24} /></div>
          <h2 className="cn-empty-title">Listening for local ripples...</h2>
          <p className="cn-empty-text">Loading your notifications.</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty-street">
          <div className="notifications-street-scene" aria-hidden="true">
            <span /> <span /> <span /> <span />
          </div>
          <h2>No notifications yet</h2>
          <p>When someone replies, connects, likes or messages you, it will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((item, index) => {
            const Icon = notificationIcon(item.type || item.notification_type);
            return (
              <button
                key={item.notification_id || item.id || index}
                type="button"
                className={item.is_read ? "notification-row" : "notification-row notification-row-unread"}
                onClick={() => handleMarkRead(item)}
              >
                <span className="notification-icon"><Icon size={18} /></span>
                <span className="notification-copy">
                  <strong>{item.title || item.message || item.notification_text || "New local activity"}</strong>
                  <small>{item.body || item.description || item.created_dt || "Just now"}</small>
                </span>
                {!item.is_read && <span className="notification-unread-dot" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
