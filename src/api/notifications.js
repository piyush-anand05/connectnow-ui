import { apiRequest } from "./apiClient";

export function getMyNotifications() {
  return apiRequest("/notifications/me");
}

export function getUnreadNotificationCount() {
  return apiRequest("/notifications/unread-count");
}

export function markNotificationRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, {
    method: "PUT"
  });
}

export function markAllNotificationsRead() {
  return apiRequest("/notifications/mark-all-read", {
    method: "PUT"
  });
}