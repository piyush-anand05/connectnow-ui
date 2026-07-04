import { apiRequest } from "./apiClient";

//
// POSTS
//

export function createPost(post) {
  return apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify(post)
  });
}

export function getPosts() {
  return apiRequest("/posts");
}

export function getMyPosts() {
  return apiRequest("/posts/me");
}

export function getPost(postId) {
  return apiRequest(`/posts/${postId}`);
}

export function updatePost(postId, post) {
  return apiRequest(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(post)
  });
}

export function deletePost(postId) {
  return apiRequest(`/posts/${postId}`, {
    method: "DELETE"
  });
}

//
// LIKES
//

export function likePost(postId) {
  return apiRequest(`/posts/${postId}/like`, {
    method: "POST"
  });
}

export function unlikePost(postId) {
  return apiRequest(`/posts/${postId}/like`, {
    method: "DELETE"
  });
}

//
// REPORT POST
//

export function reportPost(
  postId,
  reason,
  otherReason = ""
) {
  return apiRequest(`/posts/${postId}/report`, {
    method: "POST",
    body: JSON.stringify({
      reason,
      other_reason: otherReason
    })
  });
}