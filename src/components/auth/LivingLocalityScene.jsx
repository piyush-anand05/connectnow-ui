import AnimatedNeedSearch from "./AnimatedNeedSearch";
import LocalStoryTicker from "./LocalStoryTicker";

const windows = Array.from({ length: 28 }, (_, index) => index);

export default function LivingLocalityScene() {
  return (
    <section className="living-locality-scene" aria-label="Animated living locality preview">
      <div className="locality-sky">
        <span className="locality-cloud locality-cloud-one" />
        <span className="locality-cloud locality-cloud-two" />
        <span className="locality-bird locality-bird-one" />
        <span className="locality-bird locality-bird-two" />
      </div>

      <div className="locality-story-copy">
        <p className="locality-kicker">Living Locality Layer</p>
        <h1>Your locality is already alive. ConnectNowww helps you discover it.</h1>
        <p>
          Reveal useful people, local help, events, gigs, skills and communities around your active city — before they disappear into WhatsApp groups and word of mouth.
        </p>
      </div>

      <AnimatedNeedSearch />

      <div className="locality-map-stage">
        <div className="locality-radar-wave locality-radar-wave-one" />
        <div className="locality-radar-wave locality-radar-wave-two" />
        <svg className="locality-lines" viewBox="0 0 720 360" aria-hidden="true">
          <path d="M140 250 C220 130 340 135 420 190 S560 250 625 95" />
          <path d="M92 190 C210 220 260 75 370 105 S545 210 640 205" />
        </svg>

        <div className="locality-building building-a">
          {windows.slice(0, 10).map((item) => (
            <span key={item} className={`locality-window window-${item % 5}`} />
          ))}
        </div>
        <div className="locality-building building-b">
          {windows.slice(10, 22).map((item) => (
            <span key={item} className={`locality-window window-${item % 6}`} />
          ))}
        </div>
        <div className="locality-building building-c">
          {windows.slice(22).map((item) => (
            <span key={item} className={`locality-window window-${item % 4}`} />
          ))}
        </div>

        <div className="locality-park">
          <span className="locality-tree" />
          <span className="locality-tree locality-tree-two" />
        </div>
        <span className="locality-road" />
        <span className="locality-person locality-person-one" />
        <span className="locality-person locality-person-two" />
        <span className="locality-cyclist" />
        <span className="locality-dog" />

        <div className="floating-discovery floating-discovery-one">
          <strong>Fresh cakes today</strong>
          <span>Home baker · 120m away</span>
        </div>
        <div className="floating-discovery floating-discovery-two">
          <strong>Math tutor available</strong>
          <span>Tower B · Floor 7</span>
        </div>
        <div className="floating-discovery floating-discovery-three">
          <strong>Cricket tonight</strong>
          <span>2 players needed</span>
        </div>
      </div>

      <LocalStoryTicker />
    </section>
  );
}
