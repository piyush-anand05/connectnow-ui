import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  X,
  PlusSquare,
  Layers,
  CalendarDays,
  Sparkles
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getMyPosts,
  deletePost
} from "../api/posts";

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

  async function handleDelete(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await deletePost(postId);

      setPosts(posts.filter((post) => post.post_id !== postId));

      setMessage("Post deleted successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setMessage("Unable to delete post.");
    }
  }

  function handleEdit(post) {
    localStorage.setItem(
      "editing_post",
      JSON.stringify(post)
    );

    navigate("/create-post");
  }

  return (
    <div className="home-page">
      <div className="animated-bg"></div>

      <Sidebar active="my-posts" />

      <main className="main-content">
        <Topbar
          title="My Posts"
          subtitle="Manage your community updates, events and announcements"
        />

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
              Track everything you have shared with your locality — events,
              workshops, activities, recommendations and community updates.
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

            <p>
              Start by sharing something useful happening around your locality.
              Your post can help people discover events, activities and local opportunities.
            </p>

            <button
              className="save-btn"
              onClick={() => navigate("/create-post")}
            >
              <PlusSquare size={18} />
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="premium-post-grid">
            {posts.map((post) => (
              <div className="premium-post-card" key={post.post_id}>
                <div className="premium-post-top">
                  <div className="premium-post-icon">
                    <Layers size={20} />
                  </div>

                  <div>
                    <h3>{post.title}</h3>

                    <p>
                      {post.category === "Other"
                        ? post.custom_category || "Other"
                        : post.category}
                    </p>
                  </div>

                  <span
                    className={
                      post.post_type === "sponsored"
                        ? "premium-tag sponsored"
                        : "premium-tag community"
                    }
                  >
                    {post.post_type || "community"}
                  </span>
                </div>

                <p className="premium-post-desc">
                  {post.short_description}
                </p>

                <div className="premium-post-meta">
                  <span>
                    <MapPin size={14} />
                    {post.location || "Nearby"}
                  </span>

                  <span>
                    <CalendarDays size={14} />
                    {post.event_date || "No date"}
                  </span>

                  <span>
                    <Clock size={14} />
                    {post.event_time || "No time"}
                  </span>
                </div>

                <div className="premium-post-actions">
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
      </main>

      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="modal-card premium-post-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedPost(null)}
            >
              <X />
            </button>

            <div className="my-posts-badge">
              <Sparkles size={16} />
              Post Details
            </div>

            <h2>{selectedPost.title}</h2>

            <p className="modal-subtitle">
              @{selectedPost.user_name || "You"} ·{" "}
              {selectedPost.category === "Other"
                ? selectedPost.custom_category || "Other"
                : selectedPost.category}
            </p>

            <p>
              {selectedPost.detailed_description ||
                selectedPost.short_description}
            </p>

            <div className="modal-info">
              <span>
                <MapPin size={16} />
                {selectedPost.location || "Nearby"}
              </span>

              <span>
                <Clock size={16} />
                {selectedPost.event_date || "Date not added"} ·{" "}
                {selectedPost.event_time || "Time not added"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
