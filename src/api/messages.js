import { apiRequest } from "./apiClient";

export function markOnline() {
  return apiRequest("/presence/online", {
    method: "POST"
  });
}

export function markOffline() {
  return apiRequest("/presence/offline", {
    method: "POST"
  });
}

export function getMyConversations() {
  return apiRequest("/conversations/me");
}

export function startConversation(receiverUserId) {
  return apiRequest("/conversations/start", {
    method: "POST",
    body: JSON.stringify({
      receiver_user_id: receiverUserId
    })
  });
}

export async function getMessages(conversationId) {
  const data = await apiRequest(`/conversations/${conversationId}/messages`);

  return data.map((msg) => ({
    ...msg,
    created_at: msg.created_dt
  }));
}

export function sendMessage(conversationId, messageText) {
  return apiRequest(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      message_text: messageText
    })
  });
}

export function markConversationRead(conversationId) {
  return apiRequest(`/conversations/${conversationId}/read`, {
    method: "PUT"
  });
}