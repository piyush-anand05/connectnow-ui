import { useState, useEffect, useMemo } from "react";

import { Sparkles } from "lucide-react";

import {
  getPosts,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  reportPost,
} from "../api/posts";

import { startPostChat } from "../api/postChat";
import { saveUserLocation } from "../api/location";

import HomeHero from "../components/home/HomeHero";
import AISearchCard from "../components/home/AISearchCard";
import HomeFilters from "../components/home/HomeFilters";
import DiscoveryChips from "../components/home/DiscoveryChips";
import PostCard from "../components/feed/PostCard";
import PostDetailModal from "../components/feed/PostDetailModal";
import ReplyModal from "../components/feed/ReplyModal";
import ReportModal from "../components/feed/ReportModal";

import {
  isToday,
  isTomorrow,
  isThisWeek,
} from "../components/feed/postUtils";

import "../styles/home.css";

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
  "Other",
];

const aiPrompts = [
  "Need a tutor nearby?",
  "Looking for homemade food?",
  "Need laptop repair?",
  "Want badminton partners?",
  "Need a blood donor?",
  "Looking for a weekend event?",
  "Need someone to water plants?",
  "Want spoken English practice?",
  "Need a CA nearby?",
  "Looking for a guitar teacher?",
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) {
      return {
        name: "Local explorer",
        city: "Pune",
        active_city: "Pune",
      };
    }

    return JSON.parse(raw);
  } catch {
    return {
      name: "Local explorer",
      city: "Pune",
      active_city: "Pune",
    };
  }
}

export default function Home() {
  const savedUser = getStoredUser();

  const [posts, setPosts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [visibleCount, setVisibleCount] = useState(16);

  const [selectedPost, setSelectedPost] = useState(null);
  const [reportingPost, setReportingPost] = useState(null);
  const [replyPost, setReplyPost] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [reportReason, setReportReason] = useState("Abuse");
  const [otherReason, setOtherReason] = useState("");

  const [promptIndex, setPromptIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
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
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setMessage("Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  async function activateLocalRadar() {
    if (!navigator.geolocation) {
      showMessage("Location is not supported in this browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const result = await saveUserLocation(lat, lng);

          const user = getStoredUser();

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              latitude: lat,
              longitude: lng,
              active_city:
                result?.data?.active_city || user.active_city || user.city,
              city: result?.data?.active_city || user.city,
              location_label: result?.data?.location_label,
            })
          );

          await loadPosts();

          showMessage("Local Radar activated. Showing nearby posts first.");
        } catch (err) {
          console.log(err);
          showMessage("Unable to save location.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        showMessage("Location permission denied.");
      }
    );
  }

  async function handleLike(post) {
    try {
      const result = post.is_liked_by_me
        ? await unlikePost(post.post_id)
        : await likePost(post.post_id);

      updatePostState(post.post_id, {
        like_count: result.like_count,
        is_liked_by_me: result.is_liked_by_me,
      });
    } catch (err) {
      console.log(err);
      showMessage("Unable to update like.");
    }
  }

  async function handleSave(post) {
    try {
      const result = post.is_saved_by_me
        ? await unsavePost(post.post_id)
        : await savePost(post.post_id);

      updatePostState(post.post_id, {
        save_count: result.save_count,
        is_saved_by_me: result.is_saved_by_me,
      });

      showMessage(result.is_saved_by_me ? "Saved." : "Removed from saved.");
    } catch (err) {
      console.log(err);
      showMessage("Unable to update saved post.");
    }
  }

  function updatePostState(postId, changes) {
    setPosts((prev) =>
      prev.map((post) =>
        post.post_id === postId
          ? {
              ...post,
              ...changes,
            }
          : post
      )
    );

    if (selectedPost?.post_id === postId) {
      setSelectedPost({
        ...selectedPost,
        ...changes,
      });
    }
  }

  async function handleShare(post) {
    const shareText = `${post.title} - ${post.location || ""}`;
    const shareUrl = `${window.location.origin}/home?post=${post.post_id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showMessage("Post link copied.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function openPrivateReply(post) {
    if (!post.allow_private_replies) {
      showMessage("Private replies are disabled for this post.");
      return;
    }

    setReplyPost(post);
    setReplyText("");
  }

  async function submitPrivateReply() {
    try {
      if (!replyPost) return;

      if (!replyText.trim()) {
        showMessage("Please write a message first.");
        return;
      }

      if (replyText.trim().length > 250) {
        showMessage("Private reply must be within 250 characters.");
        return;
      }

      await startPostChat(replyPost.post_id, replyText.trim());

      setReplyPost(null);
      setReplyText("");

      showMessage("Private reply sent successfully.");
    } catch (err) {
      console.log(err);
      showMessage("Unable to send private reply.");
    }
  }

  async function submitReport() {
    try {
      if (!reportingPost) return;

      if (reportReason === "Other") {
        const wordCount = otherReason.trim().split(/\s+/).filter(Boolean).length;

        if (wordCount === 0) {
          showMessage("Please specify the reason.");
          return;
        }

        if (wordCount > 15) {
          showMessage("Other reason must be within 15 words.");
          return;
        }
      }

      await reportPost(reportingPost.post_id, reportReason, otherReason);

      setReportingPost(null);
      setReportReason("Abuse");
      setOtherReason("");

      showMessage("Post reported successfully.");
    } catch (err) {
      console.log(err);
      showMessage("Unable to report post or already reported.");
    }
  }

  function handleCategoryChange(value) {
    setSelectedCategory(value);
    setVisibleCount(16);
  }

  function handleDateFilterChange(value) {
    setDateFilter(value);
    setVisibleCount(16);
  }

  function handleFeeFilterChange(value) {
    setFeeFilter(value);
    setVisibleCount(16);
  }

  const filteredPosts = useMemo(() => {
    let list = [...posts];

    if (selectedCategory !== "All") {
      list = list.filter((post) => post.category === selectedCategory);
    }

    if (dateFilter === "Today") {
      list = list.filter((post) => isToday(post.event_date));
    }

    if (dateFilter === "Tomorrow") {
      list = list.filter((post) => isTomorrow(post.event_date));
    }

    if (dateFilter === "This Week") {
      list = list.filter((post) => isThisWeek(post.event_date));
    }

    if (feeFilter !== "All") {
      list = list.filter((post) => post.event_fee_type === feeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter((post) => {
        const block = `
          ${post.title || ""}
          ${post.short_description || ""}
          ${post.category || ""}
          ${post.custom_category || ""}
          ${post.location || ""}
          ${post.area || ""}
          ${post.city || ""}
          ${post.event_purpose || ""}
          ${post.who_should_join || ""}
          ${post.what_will_happen || ""}
        `.toLowerCase();

        return block.includes(q);
      });
    }

    list.sort((a, b) => {
      const da = a.distance_km ?? 999999;
      const db = b.distance_km ?? 999999;

      if (da !== db) return da - db;

      const ad = `${a.event_date || ""} ${a.event_time || ""}`;
      const bd = `${b.event_date || ""} ${b.event_time || ""}`;

      return ad.localeCompare(bd);
    });

    return list;
  }, [posts, selectedCategory, dateFilter, feeFilter, search]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="cn-page home-v2-page">
      {message && <div className="cn-form-note home-toast">✅ {message}</div>}

      <HomeHero
        user={savedUser}
        locating={locating}
        onActivateLocalRadar={activateLocalRadar}
      />

      <AISearchCard
        value={search}
        onChange={setSearch}
        placeholder={aiPrompts[promptIndex]}
      />

      <DiscoveryChips />

      <HomeFilters
        categories={categories}
        selectedCategory={selectedCategory}
        dateFilter={dateFilter}
        feeFilter={feeFilter}
        onCategoryChange={handleCategoryChange}
        onDateFilterChange={handleDateFilterChange}
        onFeeFilterChange={handleFeeFilterChange}
      />

      <div className="home-section-row">
        <div>
          <p className="cn-page-kicker">Local Pulse</p>
          <h2 className="home-section-title">Happening Around Me</h2>
          <p className="home-section-subtitle">Fresh local signals from your active city.</p>
        </div>

        <span className="cn-badge cn-badge-blue">{filteredPosts.length} results</span>
      </div>

      {loading ? (
        <div className="cn-empty">
          <div className="cn-empty-icon">
            <Sparkles size={26} />
          </div>
          <h2 className="cn-empty-title">Loading local pulse...</h2>
          <p className="cn-empty-text">
            Fetching people, posts, events and opportunities around your active city.
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="cn-empty">
          <div className="cn-empty-icon">
            <Sparkles size={26} />
          </div>

          <h2 className="cn-empty-title">No local signals yet</h2>

          <p className="cn-empty-text">
            Your locality may not be quiet in real life. Be the first to reveal something useful — an event, help request, gig, service or community update.
          </p>
          <div className="home-empty-actions">
            <a className="cn-btn cn-btn-primary" href="/create-post">Create a Post</a>
            <a className="cn-btn cn-btn-secondary" href="/network">Discover People</a>
          </div>
        </div>
      ) : (
        <>
          <div className="cn-feed-grid home-post-grid">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onReply={openPrivateReply}
                onViewMore={setSelectedPost}
                onShare={handleShare}
                onReport={setReportingPost}
              />
            ))}
          </div>

          {visibleCount < filteredPosts.length && (
            <div className="home-load-more">
              <button
                className="cn-btn cn-btn-secondary"
                onClick={() => setVisibleCount((prev) => prev + 16)}
                type="button"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={handleLike}
        onSave={handleSave}
        onReply={openPrivateReply}
        onShare={handleShare}
        onReport={setReportingPost}
      />

      <ReplyModal
        post={replyPost}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        onClose={() => setReplyPost(null)}
        onSubmit={submitPrivateReply}
      />

      <ReportModal
        post={reportingPost}
        reportReason={reportReason}
        otherReason={otherReason}
        onReasonChange={setReportReason}
        onOtherReasonChange={setOtherReason}
        onClose={() => setReportingPost(null)}
        onSubmit={submitReport}
      />
    </div>
  );
}
