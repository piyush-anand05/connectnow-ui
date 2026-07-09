import { MapPinned, PenLine, Radar, UsersRound } from "lucide-react";

const signalCards = [
  { label: "Fresh cakes today", meta: "Home baker · 120m", className: "signal-card-one" },
  { label: "Math tutor available", meta: "Tower B · Floor 7", className: "signal-card-two" },
  { label: "Cricket needs 2 players", meta: "Tonight · Nearby ground", className: "signal-card-three" },
  { label: "Blood donor nearby", meta: "Urgent help · 0.8km", className: "signal-card-four" },
];

export default function HomeHero({ user, locating, onActivateLocalRadar }) {
  const city = user?.active_city || user?.city || "your city";

  return (
    <section className={["home-living-hero", locating ? "home-living-hero-scanning" : ""].join(" ")}>
      <div className="home-living-copy">
        <div className="home-city-pill-living">
          <MapPinned size={16} />
          Exploring {city}
        </div>

        <h1>
          <span>Your neighbourhood is</span>
          <span className="home-morph-words" aria-label="helping learning celebrating creating hiring growing">
            <b>helping.</b>
            <b>learning.</b>
            <b>celebrating.</b>
            <b>creating.</b>
            <b>hiring.</b>
            <b>waiting for you.</b>
          </span>
        </h1>

        <p>
          See useful people, local help, events, gigs, businesses and communities around your active city — as fresh local signals, not endless scrolling.
        </p>

        <div className="home-hero-actions-living">
          <button className="cn-btn cn-btn-primary home-radar-action" onClick={onActivateLocalRadar} disabled={locating} type="button">
            <Radar size={18} />
            {locating ? "Scanning nearby signals..." : "Activate Local Radar"}
          </button>
          <a className="cn-btn cn-btn-secondary" href="/create-post">
            <PenLine size={18} />
            Create a Post
          </a>
          <a className="cn-btn cn-btn-ghost" href="/network">
            <UsersRound size={18} />
            Discover People
          </a>
        </div>
      </div>

      <div className="home-locality-stage" aria-hidden="true">
        <div className="home-radar-scan" />
        <svg className="home-hero-lines" viewBox="0 0 560 330">
          <path d="M75 225 C160 90 260 120 330 190 S455 240 508 72" />
          <path d="M52 155 C145 210 220 70 315 98 S430 218 515 205" />
        </svg>
        <div className="home-building home-building-left">
          {Array.from({ length: 9 }).map((_, index) => <span key={index} className={`home-window home-window-${index % 4}`} />)}
        </div>
        <div className="home-building home-building-main">
          {Array.from({ length: 16 }).map((_, index) => <span key={index} className={`home-window home-window-${index % 6}`} />)}
        </div>
        <div className="home-building home-building-right">
          {Array.from({ length: 8 }).map((_, index) => <span key={index} className={`home-window home-window-${index % 3}`} />)}
        </div>
        <span className="home-park" />
        <span className="home-road" />
        <span className="home-person home-person-one" />
        <span className="home-person home-person-two" />
        <span className="home-cycle" />
        <span className="home-dog" />
        {signalCards.map((card) => (
          <div key={card.label} className={`home-signal-card ${card.className}`}>
            <strong>{card.label}</strong>
            <span>{card.meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
