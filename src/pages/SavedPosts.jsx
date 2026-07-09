import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bookmark,
  MapPin,
  Clock3,
  CalendarDays,
  ArrowRight,
  X,
  IndianRupee,
  Sparkles
} from "lucide-react";

import {
  getSavedPosts,
  unsavePost
} from "../api/posts";

import "../styles/home.css";

export default function SavedPosts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSavedPosts();
  }, []);

  async function loadSavedPosts() {
    try {
      setLoading(true);
      const data = await getSavedPosts();
      setPosts(data);
    } catch (err) {
      console.log(err);
      setMessage("Unable to load saved posts.");
    } finally {
      setLoading(false);
    }
  }

  function getDayName(dateString) {
    if (!dateString) return "Day";

    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long"
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "Date not added";

    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatTime12(timeValue) {
    if (!timeValue) return "Time not added";

    if (timeValue.includes("AM") || timeValue.includes("PM")) {
      return timeValue;
    }

    const [hourRaw, minute] = timeValue.split(":");
    let hour = Number(hourRaw);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  }

  function distanceText(post) {
    if (post.distance_km === null || post.distance_km === undefined) {
      return "Nearby";
    }

    if (Number(post.distance_km) < 1) {
      return `${Math.round(Number(post.distance_km) * 1000)} m away`;
    }

    return `${Number(post.distance_km).toFixed(1)} km away`;
  }

  async function handleUnsave(postId) {
    try {
      await unsavePost(postId);

      setPosts((prev) =>
        prev.filter((post) => post.post_id !== postId)
      );

      if (selectedPost?.post_id === postId) {
        setSelectedPost(null);
      }

      setMessage("Removed from saved.");
      setTimeout(() => setMessage(""), 2200);
    } catch (err) {
      console.log(err);
      setMessage("Unable to remove saved post.");
    }
  }

  return (
    <div className="cn-page saved-posts-v2-page">
      {message && (
        <div
          className="success-box"
          style={{ marginBottom: 20 }}
        >
          ✅ {message}
        </div>
      )}

      <div className="my-posts-hero">
        <div>
          <div className="my-posts-badge">
            <Bookmark size={16} />
            Saved Collection
          </div>

          <h2>Your saved local opportunities</h2>

          <p>
            Revisit useful posts, events and opportunities you saved from the
            Local Pulse feed.
          </p>
        </div>

        <button
          className="my-posts-create-btn"
          onClick={() => navigate("/home")}
        >
          <Sparkles size={18} />
          Explore More
        </button>
      </div>

      {loading ? (
        <div className="ai-card">
          <h2>Loading saved posts...</h2>
        </div>
      ) : posts.length === 0 ? (
        <div className="premium-empty-state">
          <div className="empty-glow-icon">
            <Bookmark size={42} />
          </div>

          <h2>No saved posts yet</h2>

          <p>
            Save useful posts from Home so you can revisit them later.
          </p>

          <button
            className="save-btn"
            onClick={() => navigate("/home")}
          >
            Explore Local Pulse
          </button>
        </div>
      ) : (
        <div className="premium-home-feed">
          {posts.map((post) => (
            <div
              className="premium-feed-card local-event-card"
              key={post.post_id}
            >
              <div className="floating-category-chip">
                {post.category === "Other"
                  ? post.custom_category || "Other"
                  : post.category}
              </div>

              <div className="event-card-date">
                <span>{getDayName(post.event_date).slice(0, 3)}</span>
                <strong>
                  {post.event_date
                    ? new Date(post.event_date).getDate()
                    : "--"}
                </strong>
              </div>

              <div className="event-badge-pill">
                {post.event_fee_type === "Paid" ? "Paid" : "Free"}
              </div>

              <h3>{post.title}</h3>

              <p className="premium-feed-desc">
                {post.short_description || "No summary added."}
              </p>

              <div className="premium-feed-meta">
                <span>
                  <MapPin size={14} />
                  {post.area || post.location || "Nearby"}
                </span>

                <span>
                  <Clock3 size={14} />
                  {formatTime12(post.event_time)}
                </span>

                <span>
                  <MapPin size={14} />
                  {distanceText(post)}
                </span>

                <span>
                  {post.event_fee_type === "Paid" ? (
                    <>
                      <IndianRupee size={14} />
                      {post.price_inr || 0}
                    </>
                  ) : (
                    "Free"
                  )}
                </span>
              </div>

              <div className="premium-feed-actions local-card-actions">
                <button
                  className="save-mini-btn saved"
                  onClick={() => handleUnsave(post.post_id)}
                >
                  <Bookmark size={17} fill="currentColor" />
                  Saved
                </button>

                <button
                  onClick={() => setSelectedPost(post)}
                >
                  Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-card premium-post-detail-modal local-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedPost(null)}
            >
              <X />
            </button>

            <span className="premium-category-chip modal-chip">
              {selectedPost.category === "Other"
                ? selectedPost.custom_category || "Other"
                : selectedPost.category}
            </span>

            <h2>{selectedPost.title}</h2>

            <p className="modal-subtitle">
              Hosted by {selectedPost.user_name || "ConnectNowww user"}
            </p>

            <div className="detail-invite-grid">
              <div>
                <CalendarDays size={20} />
                <strong>{getDayName(selectedPost.event_date)}</strong>
                <span>{formatDate(selectedPost.event_date)}</span>
              </div>

              <div>
                <Clock3 size={20} />
                <strong>{formatTime12(selectedPost.event_time)}</strong>
                <span>
                  {selectedPost.event_status || "Upcoming"}
                </span>
              </div>

              <div>
                <MapPin size={20} />
                <strong>{selectedPost.area || "Location"}</strong>
                <span>{distanceText(selectedPost)}</span>
              </div>

              <div>
                <IndianRupee size={20} />
                <strong>
                  {selectedPost.event_fee_type === "Paid"
                    ? `₹${selectedPost.price_inr || 0}`
                    : "Free"}
                </strong>
                <span>Entry</span>
              </div>
            </div>

            {selectedPost.event_purpose && (
              <div className="detail-section">
                <h3>Purpose</h3>
                <p>{selectedPost.event_purpose}</p>
              </div>
            )}

            {selectedPost.detailed_description && (
              <div className="detail-section">
                <h3>Details</h3>
                <p>{selectedPost.detailed_description}</p>
              </div>
            )}

            <div className="premium-feed-actions modal-actions">
              <button
                className="save-mini-btn saved"
                onClick={() =>
                  handleUnsave(selectedPost.post_id)
                }
              >
                <Bookmark size={17} fill="currentColor" />
                Remove Saved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}