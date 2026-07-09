import {
  X,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Flag,
  CalendarDays,
  Clock3,
  MapPin,
  IndianRupee,
  Link as LinkIcon,
} from "lucide-react";

import {
  getDayName,
  formatDate,
  formatTime12,
  distanceText,
  postCategory,
} from "./postUtils";

export default function PostDetailModal({
  post,
  onClose,
  onLike,
  onSave,
  onReply,
  onShare,
  onReport,
}) {
  if (!post) return null;

  return (
    <div className="cn-modal-backdrop" onClick={onClose}>
      <div
        className="cn-modal home-detail-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cn-modal-header">
          <div>
            <span className="cn-badge cn-badge-primary">{postCategory(post)}</span>

            <h2 className="home-detail-title">{post.title}</h2>

            <p className="home-detail-subtitle">
              Hosted by {post.user_name || "ConnectNowww user"}
            </p>
          </div>

          <button className="cn-icon-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="cn-modal-body">
          <div className="home-detail-grid">
            <div className="home-detail-info-card">
              <CalendarDays size={20} />
              <strong>{getDayName(post.event_date)}</strong>
              <span>{formatDate(post.event_date)}</span>
            </div>

            <div className="home-detail-info-card">
              <Clock3 size={20} />
              <strong>{formatTime12(post.event_time)}</strong>
              <span>{post.event_status || "Upcoming"}</span>
            </div>

            <div className="home-detail-info-card">
              <MapPin size={20} />
              <strong>{post.area || "Location"}</strong>
              <span>{distanceText(post)}</span>
            </div>

            <div className="home-detail-info-card">
              <IndianRupee size={20} />
              <strong>
                {post.event_fee_type === "Paid" ? `₹${post.price_inr || 0}` : "Free"}
              </strong>
              <span>Entry</span>
            </div>
          </div>

          <div className="home-detail-section">
            <h3>Location</h3>
            <p>{post.venue || post.location || "Not added"}</p>
          </div>

          {post.event_capacity && (
            <div className="home-detail-section">
              <h3>Capacity</h3>
              <p>{post.event_capacity} people</p>
            </div>
          )}

          {post.event_purpose && (
            <div className="home-detail-section">
              <h3>Purpose</h3>
              <p>{post.event_purpose}</p>
            </div>
          )}

          {post.who_should_join && (
            <div className="home-detail-section">
              <h3>Who should join</h3>
              <p>{post.who_should_join}</p>
            </div>
          )}

          {post.what_will_happen && (
            <div className="home-detail-section">
              <h3>What will happen</h3>
              <p>{post.what_will_happen}</p>
            </div>
          )}

          {post.detailed_description && (
            <div className="home-detail-section">
              <h3>Details</h3>
              <p>{post.detailed_description}</p>
            </div>
          )}

          {post.additional_notes && (
            <div className="home-detail-section">
              <h3>Additional notes</h3>
              <p>{post.additional_notes}</p>
            </div>
          )}

          {post.external_link && (
            <div className="home-detail-section">
              <h3>External link</h3>

              <a
                href={post.external_link}
                target="_blank"
                rel="noreferrer"
                className="home-external-link"
              >
                <LinkIcon size={16} />
                Open Link
              </a>
            </div>
          )}

          <div className="home-detail-actions">
            <button
              className={
                post.is_liked_by_me
                  ? "cn-btn cn-btn-ghost home-action-liked"
                  : "cn-btn cn-btn-ghost"
              }
              onClick={() => onLike(post)}
              type="button"
            >
              <Heart size={17} fill={post.is_liked_by_me ? "currentColor" : "none"} />
              {post.like_count || 0}
            </button>

            <button
              className={
                post.is_saved_by_me
                  ? "cn-btn cn-btn-ghost home-action-saved"
                  : "cn-btn cn-btn-ghost"
              }
              onClick={() => onSave(post)}
              type="button"
            >
              <Bookmark size={17} fill={post.is_saved_by_me ? "currentColor" : "none"} />
              Save
            </button>

            <button
              className="cn-btn cn-btn-secondary"
              onClick={() => onReply(post)}
              disabled={!post.allow_private_replies}
              type="button"
            >
              <MessageCircle size={16} />
              Private Reply
            </button>

            <button className="cn-btn cn-btn-secondary" onClick={() => onShare(post)} type="button">
              <Share2 size={16} />
              Share
            </button>

            <button className="cn-btn cn-btn-danger" onClick={() => onReport(post)} type="button">
              <Flag size={16} />
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
