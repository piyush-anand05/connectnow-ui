import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

const defaultStories = [
  {
    query: "I need a math tutor...",
    searching: "Searching your locality...",
    result: "Retired professor found on Floor 7.",
  },
  {
    query: "Need homemade food today...",
    searching: "Checking nearby kitchens...",
    result: "Home chef 300m away.",
  },
  {
    query: "Looking for badminton doubles...",
    searching: "Scanning evening players...",
    result: "3 players nearby.",
  },
  {
    query: "Need O-negative donor...",
    searching: "Finding urgent local help...",
    result: "Available donor 0.8 km away.",
  },
  {
    query: "My AC stopped working...",
    searching: "Looking for trusted repair help...",
    result: "Technician nearby.",
  },
  {
    query: "Anything happening this weekend?",
    searching: "Reading local signals...",
    result: "Photography walk this Sunday.",
  },
];

export default function AnimatedNeedSearch({ stories = defaultStories, compact = false }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const story = useMemo(() => stories[storyIndex % stories.length], [stories, storyIndex]);
  const text = phase === 0 ? story.query : phase === 1 ? story.searching : story.result;

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1800),
      setTimeout(() => setPhase(2), 3300),
      setTimeout(() => {
        setPhase(0);
        setStoryIndex((prev) => (prev + 1) % stories.length);
      }, 5200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [storyIndex, stories.length]);

  return (
    <div className={["animated-need-search", compact ? "animated-need-search-compact" : ""].filter(Boolean).join(" ")}>
      <div className="animated-search-shell">
        <Search size={18} />
        <span key={`${storyIndex}-${phase}`} className="animated-search-text">
          {text}
        </span>
        <Sparkles size={16} className="animated-search-spark" />
      </div>
      <div className="animated-search-progress">
        <span className="animated-search-progress-bar" key={storyIndex} />
      </div>
    </div>
  );
}
