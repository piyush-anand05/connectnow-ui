import { Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/home" element={<Home />} />

      <Route path="/create-post" element={<CreatePost />} />

      <Route path="/my-posts" element={<MyPosts />} />

      <Route path="/messages" element={<Messages />} />

      <Route path="/post-replies" element={<PostReplies />} />

      <Route path="/network" element={<MyNetwork />} />

      <Route path="/gigs" element={<Gigs />} />

      <Route path="/profile" element={<Profile />} />

      <Route
        path="/settings"
        element={<AccountSettings />}
      />
    </Routes>
  );
}

export default App;