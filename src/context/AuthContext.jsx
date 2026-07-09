import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser, logout as apiLogout } from "../api/auth";

const AuthContext = createContext(null);

function readCachedUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser());
  const [status, setStatus] = useState(() => (localStorage.getItem("token") ? "checking" : "guest"));

  const clearSession = useCallback(() => {
    apiLogout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("connectnow_token");
    localStorage.removeItem("connectnow_user");
    setUser(null);
    setStatus("guest");
  }, []);

  const verifySession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setStatus("guest");
      return null;
    }

    try {
      setStatus("checking");
      const currentUser = await getMe();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
      setStatus("authenticated");
      return currentUser;
    } catch (error) {
      console.warn("Session verification failed", error);
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    const nextUser = data?.user || readCachedUser();
    setUser(nextUser);
    setStatus("authenticated");
    return data;
  }, []);

  const register = useCallback(async (name, email, password, gender, city) => {
    const data = await registerUser(name, email, password, gender, city);
    const nextUser = data?.user || readCachedUser();
    setUser(nextUser);
    setStatus("authenticated");
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      status,
      isChecking: status === "checking",
      isAuthenticated: status === "authenticated",
      verifySession,
      login,
      register,
      logout,
    }),
    [user, status, verifySession, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
