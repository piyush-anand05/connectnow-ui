import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home as HomeIcon,
  PlusSquare,
  MessageCircle,
  Users,
  Briefcase,
  FileText,
  Inbox
} from "lucide-react";

import { getMyConversations } from "../api/messages";
import { getPostChatThreads } from "../api/postChat";

export default function Sidebar({ active = "home" }) {
  const navigate = useNavigate();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadPostReplies, setUnreadPostReplies] = useState(0);

  useEffect(() => {
    loadCounts();

    const interval = setInterval(loadCounts, 8000);

    return () => clearInterval(interval);
  }, []);

  async function loadCounts() {
    try {
      const conversations = await getMyConversations();

      const msgCount = conversations.reduce(
        (sum, conv) => sum + (conv.unread_count || 0),
        0
      );

      setUnreadMessages(msgCount);
    } catch {
      setUnreadMessages(0);
    }

    try {
      const threads = await getPostChatThreads();

      const replyCount = threads.reduce(
        (sum, thread) => sum + (thread.unread_count || 0),
        0
      );

      setUnreadPostReplies(replyCount);
    } catch {
      setUnreadPostReplies(0);
    }
  }

  return (
    <aside className="sidebar premium-sidebar">
      <div className="brand">
        <div className="brand-logo">CN</div>

        <div>
          <h2>ConnectNow</h2>
          <p>Community Network</p>
        </div>
      </div>

      <nav>
        <button
          className={`menu-item ${active === "home" ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <HomeIcon size={20} />
          Home
        </button>

        <button
          className={`menu-item ${active === "create" ? "active" : ""}`}
          onClick={() => navigate("/create-post")}
        >
          <PlusSquare size={20} />
          Create Post
        </button>

        <button
          className={`menu-item ${active === "my-posts" ? "active" : ""}`}
          onClick={() => navigate("/my-posts")}
        >
          <FileText size={20} />
          My Posts
        </button>

        <button
          className={`menu-item ${active === "messages" ? "active" : ""}`}
          onClick={() => navigate("/messages")}
        >
          <MessageCircle size={20} />
          Messages
          {unreadMessages > 0 && (
            <span className="sidebar-badge">{unreadMessages}</span>
          )}
        </button>

        <button
          className={`menu-item ${
            active === "post-replies" ? "active" : ""
          }`}
          onClick={() => navigate("/post-replies")}
        >
          <Inbox size={20} />
          Post Replies
          {unreadPostReplies > 0 && (
            <span className="sidebar-badge">{unreadPostReplies}</span>
          )}
        </button>

        <button
          className={`menu-item ${active === "network" ? "active" : ""}`}
          onClick={() => navigate("/network")}
        >
          <Users size={20} />
          My Network
        </button>

        <button
          className={`menu-item ${active === "gigs" ? "active" : ""}`}
          onClick={() => navigate("/gigs")}
        >
          <Briefcase size={20} />
          Gig Marketplace
        </button>
      </nav>
    </aside>
  );
}