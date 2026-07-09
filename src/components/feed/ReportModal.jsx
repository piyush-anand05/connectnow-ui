import { X } from "lucide-react";

export default function ReportModal({
  post,
  reportReason,
  otherReason,
  onReasonChange,
  onOtherReasonChange,
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
            <h2 className="home-detail-title">Report Post</h2>
            <p className="home-detail-subtitle">
              Tell us why you are reporting this post.
            </p>
          </div>

          <button className="cn-icon-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="cn-modal-body">
          <div className="cn-field">
            <label className="cn-label">Reason</label>

            <select
              className="cn-select"
              value={reportReason}
              onChange={(event) => onReasonChange(event.target.value)}
            >
              <option value="Abuse">Abuse</option>
              <option value="Sexual">Sexual</option>
              <option value="Fraud">Fraud</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {reportReason === "Other" && (
            <div className="cn-field">
              <label className="cn-label">Specify reason</label>

              <textarea
                className="cn-textarea"
                value={otherReason}
                onChange={(event) => onOtherReasonChange(event.target.value)}
                placeholder="Write within 15 words..."
              />
            </div>
          )}

          <button className="cn-btn cn-btn-danger cn-btn-full" onClick={onSubmit} type="button">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
