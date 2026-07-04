const API_BASE = "https://tom-todd-shortcuts-berlin.trycloudflare.com/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setAuthData(data) {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.detail || "API error");
  }

  return data;
}