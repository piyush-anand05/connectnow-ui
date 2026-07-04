import { useState, useEffect } from "react";

import {
  Sparkles,
  MapPin,
  Clock,
  Search,
  X,
  ArrowRight,
  Heart,
  Flag,
  MessageCircle,
  CalendarDays,
  Send
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  getPosts,
  likePost,
  unlikePost,
  reportPost
} from "../api/posts";

import { startPostChat } from "../api/postChat";

import "../styles/home.css";

export default function Home() {
  const savedUser =
    JSON.parse(localStorage.getItem("user")) || {
      name: "Amit",
      city: "Pune"
    };

  const categories = [
    "All",
    "Technology",
    "Education",
    "Sports",
    "Business",
    "Health",
    "Food",
    "Events",
    "Community",
    "Arts",
    "Other"
  ];

  const aiPrompts = [
    "Need help filing insurance claim?",
    "Looking for a wedding photographer?",
    "Need a Python mentor nearby?",
    "Looking for startup co-founder?",
    "Need CA recommendation?",
    "Want to join a cricket group?"
  ];

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [reportingPost, setReportingPost] = useState(null);
  const [replyPost, setReplyPost] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [reportReason, setReportReason] = useState("Abuse");
  const [otherReason, setOtherReason] = useState("");

  const [promptIndex, setPromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPosts();

    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % aiPrompts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function getDayName(dateString) {
    if (!dateString) return "Day not added";

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

  async function handleLike(post) {
    try {
      let result;

      if (post.is_liked_by_me) {
        result = await unlikePost(post.post_id);
      } else {
        result = await likePost(post.post_id);
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === post.post_id
            ? {
                ...p,
                like_count: result.like_count,
                is_liked_by_me: result.is_liked_by_me
              }
            : p
        )
      );

      if (selectedPost?.post_id === post.post_id) {
        setSelectedPost({
          ...selectedPost,
          like_count: result.like_count,
          is_liked_by_me: result.is_liked_by_me
        });
      }
    } catch (err) {
      console.log(err);
      setMessage("Unable to update like.");
    }
  }

  function openPrivateReply(post) {
    if (!post.allow_private_replies) {
      setMessage("Private replies are disabled for this post.");
      return;
    }

    setReplyPost(post);
    setReplyText("");
  }

  async function submitPrivateReply() {
    try {
      if (!replyPost) return;

      if (!replyText.trim()) {
        setMessage("Please write a message first.");
        return;
      }

      await startPostChat(replyPost.post_id, replyText.trim());

      setReplyPost(null);
      setReplyText("");

      setMessage("Private reply sent successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setMessage("Unable to send private reply.");
    }
  }

  async function submitReport() {
    try {
      if (!reportingPost) return;

      if (reportReason === "Other") {
        const wordCount = otherReason.trim().split(/\s+/).filter(Boolean).length;

        if (wordCount === 0) {
          setMessage("Please specify the reason.");
          return;
        }

        if (wordCount > 15) {
          setMessage("Other reason must be within 15 words.");
          return;
        }
      }

      await reportPost(reportingPost.post_id, reportReason, otherReason);

      setReportingPost(null);
      setReportReason("Abuse");
      setOtherReason("");

      setMessage("Post reported successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setMessage("Unable to report post or already reported.");
    }
  }

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="home-page">
      <div className="animated-bg"></div>

      <Sidebar active="home" />

      <main className="main-content">
        <Topbar
          title={`Welcome Back, ${savedUser.name} 👋`}
          subtitle="Discover people, opportunities and events around you"
        />

        {message && (
          <div className="success-box" style={{ marginBottom: 20 }}>
            ✅ {message}
          </div>
        )}

        <div className="ai-card">
          <div className="ai-header">
            <Sparkles size={24} />
            <h2>Need Help?</h2>
          </div>

          <p className="ai-line">
            Tell us what you need. We will help connect you with people nearby.
          </p>

          <div className="ai-search">
            <Search size={20} />
            <input placeholder={aiPrompts[promptIndex]} />
          </div>
        </div>

        <div className="category-section">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "chip active-chip" : "chip"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="section-title">Happening Around Me</h2>

        {loading ? (
          <div className="ai-card">
            <h2>Loading posts...</h2>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="ai-card">
            <h2>No posts yet</h2>
            <p className="ai-line">
              Create the first community post around your locality.
            </p>
          </div>
        ) : (
          <div className="premium-home-feed">
            {filteredPosts.map((post) => (
              <div className="premium-feed-card" key={post.post_id}>
                <div className="premium-feed-top">
                  <div className="premium-feed-avatar">
                    {post.user_name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <h3>{post.title}</h3>

                    <p>
                      @{post.user_name || "ConnectNow User"} ·{" "}
                      {post.location || "Nearby"}
                    </p>
                  </div>

                  <span className="premium-category-chip">
                    {post.category === "Other"
                      ? post.custom_category || "Other"
                      : post.category}
                  </span>
                </div>

                <p className="premium-feed-desc">{post.short_description}</p>

                <div className="premium-feed-meta">
                  <span>
                    <MapPin size={14} />
                    {post.location || "Nearby"}
                  </span>

                  <span>
                    <CalendarDays size={14} />
                    {getDayName(post.event_date)}
                  </span>

                  <span>
                    <Clock size={14} />
                    {formatDate(post.event_date)} ·{" "}
                    {post.event_time || "Time not added"}
                  </span>
                </div>

                <div className="premium-feed-actions">
                  <button
                    className={post.is_liked_by_me ? "heart-btn liked" : "heart-btn"}
                    onClick={() => handleLike(post)}
                  >
                    <Heart
                      size={17}
                      fill={post.is_liked_by_me ? "currentColor" : "none"}
                    />
                    {post.like_count || 0}
                  </button>

                  <button
                    onClick={() => openPrivateReply(post)}
                    disabled={!post.allow_private_replies}
                    className={!post.allow_private_replies ? "disabled-action-btn" : ""}
                  >
                    <MessageCircle size={16} />
                    Private Reply
                  </button>

                  <button onClick={() => setSelectedPost(post)}>
                    View Details
                    <ArrowRight size={16} />
                  </button>

                  <button onClick={() => setReportingPost(post)}>
                    <Flag size={16} />
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-card premium-post-detail-modal"
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
              @{selectedPost.user_name || "ConnectNow User"} ·{" "}
              {selectedPost.location || "Nearby"}
            </p>

            <p>{selectedPost.detailed_description}</p>

            <div className="modal-info">
              <span>
                <MapPin size={16} />
                {selectedPost.location || "Nearby"}
              </span>

              <span>
                <CalendarDays size={16} />
                {getDayName(selectedPost.event_date)}
              </span>

              <span>
                <Clock size={16} />
                {formatDate(selectedPost.event_date)} ·{" "}
                {selectedPost.event_time || "Time not added"}
              </span>
            </div>

            <div className="premium-feed-actions modal-actions">
              <button
                className={
                  selectedPost.is_liked_by_me ? "heart-btn liked" : "heart-btn"
                }
                onClick={() => handleLike(selectedPost)}
              >
                <Heart
                  size={17}
                  fill={selectedPost.is_liked_by_me ? "currentColor" : "none"}
                />
                {selectedPost.like_count || 0}
              </button>

              <button
                onClick={() => openPrivateReply(selectedPost)}
                disabled={!selectedPost.allow_private_replies}
                className={
                  !selectedPost.allow_private_replies
                    ? "disabled-action-btn"
                    : ""
                }
              >
                <MessageCircle size={16} />
                Private Reply
              </button>

              <button onClick={() => setReportingPost(selectedPost)}>
                <Flag size={16} />
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {replyPost && (
        <div className="modal-overlay" onClick={() => setReplyPost(null)}>
          <div
            className="modal-card private-reply-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setReplyPost(null)}>
              <X />
            </button>

            <h2>Private Reply</h2>

            <p className="modal-subtitle">
              Reply privately to @{replyPost.user_name || "ConnectNow User"} about this post.
            </p>

            <div className="private-reply-post-preview">
              <span>
                {replyPost.category === "Other"
                  ? replyPost.custom_category || "Other"
                  : replyPost.category}
              </span>

              <h3>{replyPost.title}</h3>

              <p>{replyPost.short_description}</p>
            </div>

            <label>Your Message</label>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your private message..."
            />

            <button className="save-btn" onClick={submitPrivateReply}>
              <Send size={16} />
              Send Private Reply
            </button>
          </div>
        </div>
      )}

      {reportingPost && (
        <div className="modal-overlay" onClick={() => setReportingPost(null)}>
          <div
            className="modal-card report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setReportingPost(null)}>
              <X />
            </button>

            <h2>Report Post</h2>

            <p className="modal-subtitle">
              Tell us why you are reporting this post.
            </p>

            <label>Reason</label>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="Abuse">Abuse</option>
              <option value="Sexual">Sexual</option>
              <option value="Fraud">Fraud</option>
              <option value="Other">Other</option>
            </select>

            {reportReason === "Other" && (
              <>
                <label>Specify reason</label>

                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Write within 15 words..."
                />
              </>
            )}

            <button className="save-btn" onClick={submitReport}>
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}