import { apiRequest } from "./apiClient";

/* =========================
   DISCOVER
========================= */

export function discoverPeople(params = {}) {
  const query = new URLSearchParams(params).toString();

  return apiRequest(
    `/network/discover${query ? `?${query}` : ""}`
  );
}

/* =========================
   PROFILE
========================= */

export function getNetworkProfile(userId) {
  return apiRequest(`/network/profile/${userId}`);
}

/* =========================
   CONNECTIONS
========================= */

export function getMyConnections() {
  return apiRequest("/network/connections");
}

export function getConnectionRequests() {
  return apiRequest("/network/requests");
}

export function sendConnectionRequest(receiverUserId) {
  return apiRequest(`/network/request/${receiverUserId}`, {
    method: "POST"
  });
}

export function acceptConnection(connectionId) {
  return apiRequest(`/network/accept/${connectionId}`, {
    method: "PUT"
  });
}

export function rejectConnection(connectionId) {
  return apiRequest(`/network/reject/${connectionId}`, {
    method: "PUT"
  });
}

export function cancelConnectionRequest(otherUserId) {
  return apiRequest(`/network/cancel-request/${otherUserId}`, {
    method: "DELETE"
  });
}

export function removeConnection(otherUserId) {
  return apiRequest(`/network/remove-user/${otherUserId}`, {
    method: "DELETE"
  });
}

/* =========================
   BLOCKS
========================= */

export function blockUser(userId) {
  return apiRequest(`/network/block/${userId}`, {
    method: "POST"
  });
}

export function unblockUser(userId) {
  return apiRequest(`/network/unblock/${userId}`, {
    method: "DELETE"
  });
}

export function getBlockedUsers() {
  return apiRequest("/network/blocked");
}