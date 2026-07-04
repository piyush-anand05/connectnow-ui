import { apiRequest, setAuthData, logout } from "./apiClient";


export async function registerUser(name, email, password, gender, city) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      gender,
      city
    })
  });

  setAuthData(data);
  return data;
}

export async function loginUser(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });

  setAuthData(data);
  return data;
}

export function getMe() {
  return apiRequest("/auth/me");
}

export function updateMe(data) {
  return apiRequest("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function changePassword(currentPassword, newPassword) {
  return apiRequest("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword
    })
  });
}

export function deleteMyAccount() {
  return apiRequest("/auth/me", {
    method: "DELETE"
  });
}

export { logout };