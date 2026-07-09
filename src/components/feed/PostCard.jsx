import {
  MapPin,
  Clock3,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Flag,
  ArrowRight,
  LocateFixed,
  IndianRupee,
} from "lucide-react";

function clampText(value, maxLength) {
  if (!value) return "";

  const text = String(value).trim();

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
}

function getDayName(dateString) {
  if (!dateString) return "Day";

  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function formatTime12(timeValue) {
  if (!timeValue) return "Time not added";

  if (timeValue.includes("AM") || timeValue.includes("PM")) {
    return timeValue;
  }

  const [hourRaw, minute = "00"] = timeValue.split(":");
  let hour = Number(hourRaw);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

function isTomorrow(dateString) {
  if (!dateString) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateString === tomorrow.toISOString().split("T")[0];
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

function eventBadge(post) {
  if (post.event_status === "Live") return "Live Now";
  if (post.event_status === "Today") return "Today";
  if (isTomorrow(post.event_date)) return "Tomorrow";
  return post.event_fee_type === "Paid" ? "Paid" : "Free";
}

function postCategory(post) {
  if (post.category === "Other") {
    return post.custom_category || "Other";
  }

  return post.category || "Community";
}

export default function PostCard({
  post,
  onLike,
  onSave,
  onReply,
  onViewMore,
  onShare,
  onReport,
}) {
  return (
    <article className="cn-card cn-post-card home-post-card">
      <div className="cn-card-inner home-post-card-inner">
        <div className="cn-post-top">
          <span className="cn-badge cn-badge-primary">
            {postCategory(post)}
          </span>

          <span
            className={
              post.event_fee_type === "Paid"
                ? "cn-badge cn-badge-honey"
                : "cn-badge cn-badge-mint"
            }
          >
            {eventBadge(post)}
          </span>
        </div>

        <div className="home-post-date-row">
          <div className="home-post-date-box">
            <span>{getDayName(post.event_date).slice(0, 3)}</span>
            <strong>
              {post.event_date ? new Date(post.event_date).getDate() : "--"}
            </strong>
          </div>

          <div className="home-post-main-copy">
            <h3 className="cn-post-title" title={post.title || "Untitled post"}>
              {clampText(post.title || "Untitled post", 100)}
            </h3>

            <p className="cn-post-desc">
              {clampText(post.short_description || "No summary added.", 150)}
            </p>
          </div>
        </div>

        <div className="cn-post-meta">
          <span className="cn-post-meta-item">
            <MapPin size={14} />
            <span className="cn-post-location">
              {clampText(post.area || post.location || "Nearby", 60)}
            </span>
          </span>

          <span className="cn-post-meta-item">
            <Clock3 size={14} />
            {formatTime12(post.event_time)}
          </span>

          <span className="cn-post-meta-item">
            <LocateFixed size={14} />
            {distanceText(post)}
          </span>

          <span className="cn-post-meta-item">
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

        <div className="cn-post-actions home-post-actions">
          <div className="cn-post-actions-left">
            <button
              className={
                post.is_liked_by_me
                  ? "cn-btn cn-btn-ghost home-action-liked"
                  : "cn-btn cn-btn-ghost"
              }
              onClick={() => onLike(post)}
            >
              <Heart
                size={17}
                fill={post.is_liked_by_me ? "currentColor" : "none"}
              />
              {post.like_count || 0}
            </button>

            <button
              className={
                post.is_saved_by_me
                  ? "cn-btn cn-btn-ghost home-action-saved"
                  : "cn-btn cn-btn-ghost"
              }
              onClick={() => onSave(post)}
            >
              <Bookmark
                size={17}
                fill={post.is_saved_by_me ? "currentColor" : "none"}
              />
              {post.save_count || 0}
            </button>
          </div>

          <div className="cn-post-actions-right">
            <button
              className="cn-btn cn-btn-secondary"
              onClick={() => onReply(post)}
              disabled={!post.allow_private_replies}
            >
              <MessageCircle size={16} />
              Reply
            </button>

            <button
              className="cn-btn cn-btn-primary"
              onClick={() => onViewMore(post)}
            >
              View More
              <ArrowRight size={16} />
            </button>

            <button
              className="cn-icon-btn"
              onClick={() => onShare(post)}
              title="Share"
            >
              <Share2 size={16} />
            </button>

            <button
              className="cn-icon-btn"
              onClick={() => onReport(post)}
              title="Report"
            >
              <Flag size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}