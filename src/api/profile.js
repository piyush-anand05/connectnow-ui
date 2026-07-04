import { apiRequest } from "./apiClient";

export function getMyProfile() {
  return apiRequest("/profile/me");
}

export function updateMyProfile(profile) {
  return apiRequest("/profile/me", {
    method: "PUT",
    body: JSON.stringify(profile)
  });
}