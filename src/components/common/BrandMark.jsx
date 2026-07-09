export default function BrandMark({ compact = false, className = "" }) {
  return (
    <div className={["cn-brand-mark", compact ? "cn-brand-mark-compact" : "", className].filter(Boolean).join(" ")}>
      <div className="cn-brand-icon" aria-hidden="true">
        <span className="cn-brand-node cn-brand-node-a" />
        <span className="cn-brand-node cn-brand-node-b" />
        <span className="cn-brand-node cn-brand-node-c" />
        <span className="cn-brand-line cn-brand-line-a" />
        <span className="cn-brand-line cn-brand-line-b" />
      </div>
      {!compact && (
        <div className="cn-brand-copy">
          <strong>connectnowww</strong>
          <span>Your local world, connected.</span>
        </div>
      )}
    </div>
  );
}
