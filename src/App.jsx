import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import MyNetwork from "./pages/MyNetwork";
import Messages from "./pages/Messages";
import PostReplies from "./pages/PostReplies";
import Gigs from "./pages/Gigs";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import SavedPosts from "./pages/SavedPosts";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login initialMode="register" />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/saved-posts" element={<SavedPosts />} />
            <Route path="/network" element={<MyNetwork />} />
            <Route path="/my-network" element={<Navigate to="/network" replace />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/post-replies" element={<PostReplies />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
