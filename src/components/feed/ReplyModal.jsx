import { X, Send } from "lucide-react";
import { clampText, postCategory } from "./postUtils";

export default function ReplyModal({
  post,
  replyText,
  onReplyTextChange,
  onClose,
  onSubmit,
}) {
  if (!post) return null;

  return (
    <div className="cn-modal-backdrop" onClick={onClose}>
      <div
        className="cn-modal home-small-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cn-modal-header">
          <div>
            <h2 className="home-detail-title">Private Reply</h2>
            <p className="home-detail-subtitle">Reply privately about this post.</p>
          </div>

          <button className="cn-icon-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="cn-modal-body">
          <div className="cn-card home-reply-preview">
            <div className="cn-card-inner">
              <span className="cn-badge cn-badge-primary">{postCategory(post)}</span>

              <h3>{post.title}</h3>

              <p>{clampText(post.short_description, 150)}</p>
            </div>
          </div>

          <div className="cn-field">
            <div className="cn-label-row">
              <label className="cn-label">Your Message</label>
              <span
                className={
                  replyText.length > 230
                    ? "cn-counter cn-counter-warning"
                    : "cn-counter"
                }
              >
                {replyText.length}/250
              </span>
            </div>

            <textarea
              className="cn-textarea"
              value={replyText}
              maxLength={250}
              onChange={(event) => onReplyTextChange(event.target.value)}
              placeholder="Write your private message..."
            />
          </div>

          <button className="cn-btn cn-btn-primary cn-btn-full" onClick={onSubmit} type="button">
            <Send size={16} />
            Send Private Reply
          </button>
        </div>
      </div>
    </div>
  );
}
