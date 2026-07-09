export function clampText(value, maxLength) {
  if (!value) return "";

  const text = String(value).trim();

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
}

export function getDayName(dateString) {
  if (!dateString) return "Day";

  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function formatDate(dateString) {
  if (!dateString) return "Date not added";

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime12(timeValue) {
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

export function isToday(dateString) {
  if (!dateString) return false;

  const today = new Date().toISOString().split("T")[0];

  return dateString === today;
}

export function isTomorrow(dateString) {
  if (!dateString) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateString === tomorrow.toISOString().split("T")[0];
}

export function isThisWeek(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const now = new Date();

  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(now.getDate() + 7);

  return date >= new Date(now.toDateString()) && date <= sevenDaysLater;
}

export function distanceText(post) {
  if (post.distance_km === null || post.distance_km === undefined) {
    return "Nearby";
  }

  if (Number(post.distance_km) < 1) {
    return `${Math.round(Number(post.distance_km) * 1000)} m away`;
  }

  return `${Number(post.distance_km).toFixed(1)} km away`;
}

export function eventBadge(post) {
  if (post.event_status === "Live") return "Live Now";
  if (post.event_status === "Today") return "Today";
  if (isTomorrow(post.event_date)) return "Tomorrow";
  return post.event_fee_type === "Paid" ? "Paid" : "Free";
}

export function postCategory(post) {
  if (post.category === "Other") {
    return post.custom_category || "Other";
  }

  return post.category || "Community";
}
