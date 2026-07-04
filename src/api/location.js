import { apiRequest } from "./apiClient";

export function searchLocation(query) {
  return apiRequest("/location", {
    method: "POST",
    body: JSON.stringify({
      action: "search",
      query
    })
  });
}

export function reverseLocation(latitude, longitude) {
  return apiRequest("/location", {
    method: "POST",
    body: JSON.stringify({
      action: "reverse",
      latitude,
      longitude
    })
  });
}

export function saveUserLocation(
  latitude,
  longitude,
  city = "",
  locationLabel = ""
) {
  return apiRequest("/location", {
    method: "POST",
    body: JSON.stringify({
      action: "save_user_location",
      latitude,
      longitude,
      city,
      location_label: locationLabel
    })
  });
}