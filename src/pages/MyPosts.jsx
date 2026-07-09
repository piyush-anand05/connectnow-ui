import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Clock3,
  X,
  PlusSquare,
  Layers,
  CalendarDays,
  Sparkles,
  Heart,
  Bookmark,
  IndianRupee,
  Users
} from "lucide-react";

import { getMyPosts, deletePost } from "../api/posts";

import "../styles/home.css";

export default function MyPosts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  async function loadMyPosts() {
    try {
      setLoading(true);
      const data = await getMyPosts();
      setPosts(data);
    } catch (err) {
      console.log(err);
      setMessage("Unable to load posts.");
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

  async function handleDelete(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await deletePost(postId);

      setPosts(posts.filter((post) => post.post_id !== postId));
      setMessage("Post deleted successfully.");

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.log(err);
      setMessage("Unable to delete post.");
    }
  }

  function handleEdit(post) {
    localStorage.setItem("editing_post", JSON.stringify(post));
    navigate("/create-post");
  }

  return (
    <div className="cn-page my-posts-v2-page">
      {message && (
        <div className="success-box" style={{ marginBottom: "20px" }}>
          ✅ {message}
        </div>
      )}

      <div className="my-posts-hero">
        <div>
          <div className="my-posts-badge">
            <Sparkles size={16} />
            Creator Dashboard
          </div>

          <h2>Your Local Voice</h2>

          <p>
            Track everything you have shared with your city — events, workshops,
            activities, recommendations and community updates.
          </p>
        </div>

        <button
          className="my-posts-create-btn"
          onClick={() => navigate("/create-post")}
        >
          <PlusSquare size={18} />
          Create New Post
        </button>
      </div>

      {loading ? (
        <div className="ai-card">
          <h2>Loading your posts...</h2>
        </div>
      ) : posts.length === 0 ? (
        <div className="my-posts-empty-premium">
          <div className="empty-glow-icon">
            <Layers size={40} />
          </div>

          <h2>No posts created yet</h2>

          <p>Start by sharing something useful happening around your locality.</p>

          <button className="save-btn" onClick={() => navigate("/create-post")}>
            <PlusSquare size={18} />
            Create Your First Post
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
                  {post.event_date ? new Date(post.event_date).getDate() : "--"}
                </strong>
              </div>

              <div className="event-badge-pill">
                {post.event_status || "Upcoming"}
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
                  <CalendarDays size={14} />
                  {formatDate(post.event_date)}
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

              <div className="creator-card-stats">
                <span>
                  <Heart size={14} />
                  {post.like_count || 0} Likes
                </span>

                <span>
                  <Bookmark size={14} />
                  {post.save_count || 0} Saved
                </span>

                {post.event_capacity && (
                  <span>
                    <Users size={14} />
                    {post.event_capacity} Capacity
                  </span>
                )}
              </div>

              <div className="premium-post-actions creator-actions">
                <button onClick={() => setSelectedPost(post)}>
                  <Eye size={16} />
                  View
                </button>

                <button onClick={() => handleEdit(post)}>
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  className="danger-action"
                  onClick={() => handleDelete(post.post_id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-card premium-post-detail-modal local-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedPost(null)}>
              <X />
            </button>

            <span className="premium-category-chip modal-chip">
              {selectedPost.category === "Other"
                ? selectedPost.custom_category || "Other"
                : selectedPost.category}
            </span>

            <h2>{selectedPost.title}</h2>

            <p className="modal-subtitle">
              Hosted by {selectedPost.user_name || "You"}
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
                <span>{selectedPost.event_status || "Upcoming"}</span>
              </div>

              <div>
                <MapPin size={20} />
                <strong>{selectedPost.area || "Location"}</strong>
                <span>{selectedPost.city || "City"}</span>
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

            <div className="detail-section">
              <h3>Location</h3>
              <p>
                {selectedPost.venue || selectedPost.location || "Not added"}
              </p>
            </div>

            {selectedPost.event_capacity && (
              <div className="detail-section">
                <h3>Capacity</h3>
                <p>{selectedPost.event_capacity} people</p>
              </div>
            )}

            {selectedPost.event_purpose && (
              <div className="detail-section">
                <h3>Purpose</h3>
                <p>{selectedPost.event_purpose}</p>
              </div>
            )}

            {selectedPost.who_should_join && (
              <div className="detail-section">
                <h3>Who should join</h3>
                <p>{selectedPost.who_should_join}</p>
              </div>
            )}

            {selectedPost.what_will_happen && (
              <div className="detail-section">
                <h3>What will happen</h3>
                <p>{selectedPost.what_will_happen}</p>
              </div>
            )}

            {(selectedPost.detailed_description ||
              selectedPost.short_description) && (
              <div className="detail-section">
                <h3>Details</h3>
                <p>
                  {selectedPost.detailed_description ||
                    selectedPost.short_description}
                </p>
              </div>
            )}

            {selectedPost.additional_notes && (
              <div className="detail-section">
                <h3>Additional Notes</h3>
                <p>{selectedPost.additional_notes}</p>
              </div>
            )}

            {selectedPost.external_link && (
              <div className="detail-section">
                <h3>External Link</h3>
                <a
                  href={selectedPost.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="external-link-btn"
                >
                  Open Link
                </a>
              </div>
            )}

            <div className="premium-post-actions creator-actions modal-actions">
              <button onClick={() => handleEdit(selectedPost)}>
                <Pencil size={16} />
                Edit
              </button>

              <button
                className="danger-action"
                onClick={() => handleDelete(selectedPost.post_id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}