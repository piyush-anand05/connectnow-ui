import { useEffect, useState } from "react";

const storyGroups = [
  {
    label: "Discover People",
    tone: "people",
    stories: [
      "Retired IIT professor in Tower B",
      "Home baker 120m away",
      "Guitar teacher nearby",
      "Blood donor available",
      "Terrace gardening expert",
      "Startup mentor 500m away",
    ],
  },
  {
    label: "Discover Opportunities",
    tone: "opportunity",
    stories: [
      "Cricket team needs 2 players",
      "Café looking for a weekend singer",
      "Share Uber tomorrow morning",
      "Old DSLR available nearby",
      "Spoken English practice partner",
      "Water plants for 3 days",
    ],
  },
  {
    label: "Discover Communities",
    tone: "community",
    stories: [
      "Photography walk this Sunday",
      "Book club this Saturday",
      "Dog walking group every evening",
      "Morning yoga in the park",
      "Board game night nearby",
      "Language exchange nearby",
    ],
  },
];

export default function LocalStoryTicker() {
  const [groupIndex, setGroupIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const group = storyGroups[groupIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setStoryIndex((prev) => {
        const nextStory = (prev + 1) % storyGroups[groupIndex].stories.length;
        if (nextStory === 0) {
          setGroupIndex((current) => (current + 1) % storyGroups.length);
        }
        return nextStory;
      });
    }, 2600);

    return () => clearInterval(timer);
  }, [groupIndex]);

  return (
    <div className="local-story-ticker">
      <div className={`local-story-pill local-story-pill-${group.tone}`}>{group.label}</div>
      <div className="local-story-card" key={`${groupIndex}-${storyIndex}`}>
        <span>{group.stories[storyIndex]}</span>
        <small>Found around your locality</small>
      </div>
    </div>
  );
}
