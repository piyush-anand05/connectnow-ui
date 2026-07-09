const API_BASE = "https://connectnow-40rl.onrender.com/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setAuthData(data) {
  if (data?.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("connectnow_token");
  localStorage.removeItem("connectnow_user");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401 || res.status === 403) {
    logout();
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
    throw new Error(data?.detail || "Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data?.detail || "API error");
  }

  return data;
}
