import { apiRequest } from "./apiClient";

export function createGig(gig) {
  return apiRequest("/gigs", {
    method: "POST",
    body: JSON.stringify(gig)
  });
}

export function getGigs() {
  return apiRequest("/gigs");
}

export function getMyGigs() {
  return apiRequest("/gigs/me");
}

export function updateGig(gigId, gig) {
  return apiRequest(`/gigs/${gigId}`, {
    method: "PUT",
    body: JSON.stringify(gig)
  });
}

export function deleteGig(gigId) {
  return apiRequest(`/gigs/${gigId}`, {
    method: "DELETE"
  });
}

export function applyToGig(gigId, message) {
  return apiRequest(`/gigs/${gigId}/apply`, {
    method: "POST",
    body: JSON.stringify({ message })
  });
}

export function getGigApplications(gigId) {
  return apiRequest(`/gigs/${gigId}/applications`);
}

export function getMyApplications() {
  return apiRequest("/gigs/applications/me");
}