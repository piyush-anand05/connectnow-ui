import { apiRequest } from "./apiClient";

export function startPostChat(postId, messageText) {
  return apiRequest("/post-chat/start", {
    method: "POST",
    body: JSON.stringify({
      post_id: postId,
      message_text: messageText
    })
  });
}

export function getPostChatThreads() {
  return apiRequest("/post-chat/threads");
}

export function getPostChatMessages(threadId) {
  return apiRequest(`/post-chat/thread/${threadId}`);
}

export function sendPostChatMessage(threadId, messageText) {
  return apiRequest(`/post-chat/thread/${threadId}`, {
    method: "POST",
    body: JSON.stringify({
      message_text: messageText
    })
  });
}

export function markPostChatThreadRead(threadId) {
  return apiRequest(`/post-chat/thread/${threadId}/read`, {
    method: "PUT"
  });
}