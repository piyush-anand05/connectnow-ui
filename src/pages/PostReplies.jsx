import { useEffect, useMemo, useRef, useState } from "react";

import {
  Send,
  Search,
  MessageCircle,
  Clock,
  FileText
} from "lucide-react";

import {
  getPostChatThreads,
  getPostChatMessages,
  sendPostChatMessage,
  markPostChatThreadRead
} from "../api/postChat";

import "../styles/home.css";

export default function PostReplies() {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const bottomRef = useRef(null);

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
    }
  }, [activeThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadThreads() {
    try {
      const data = await getPostChatThreads();
      setThreads(data);

      if (!activeThread && data.length > 0) {
        setActiveThread(data[0]);
      }
    } catch (err) {
      console.log(err);
      setNotice("Unable to load post replies.");
    }
  }

  async function loadMessages(thread) {
    try {
      const data = await getPostChatMessages(thread.thread_id);
      setMessages(data);
      await markPostChatThreadRead(thread.thread_id);
      await loadThreads();
    } catch (err) {
      console.log(err);
      setNotice("Unable to load messages.");
    }
  }

  async function handleSend() {
    if (!text.trim() || !activeThread) return;

    try {
      await sendPostChatMessage(activeThread.thread_id, text.trim());
      setText("");
      await loadMessages(activeThread);
      await loadThreads();
    } catch (err) {
      console.log(err);
      setNotice("Unable to send reply.");
    }
  }

  function formatTime(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const block = `
        ${thread.post_title || ""}
        ${thread.other_user_name || ""}
        ${thread.last_message || ""}
      `.toLowerCase();

      return block.includes(search.toLowerCase());
    });
  }, [threads, search]);

  return (
    <div className="cn-page post-replies-v2-page">
      {notice && (
        <div className="success-box" style={{ marginBottom: 20 }}>
          ✅ {notice}
        </div>
      )}

      <div className="post-replies-layout">
        <aside className="post-replies-list">
          <div className="conversation-search">
            <Search size={18} />

            <input
              placeholder="Search post replies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredThreads.length === 0 ? (
            <div className="empty-chat">
              <MessageCircle size={34} />
              <p>No private post replies yet.</p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <button
                key={thread.thread_id}
                className={
                  activeThread?.thread_id === thread.thread_id
                    ? "post-reply-thread active-post-reply-thread"
                    : "post-reply-thread"
                }
                onClick={() => setActiveThread(thread)}
              >
                <div className="post-reply-avatar">
                  {thread.other_user_name?.charAt(0) || "U"}
                </div>

                <div className="post-reply-info">
                  <h3>{thread.other_user_name}</h3>

                  <p className="post-title-line">
                    <FileText size={13} />
                    {thread.post_title || "Post unavailable"}
                  </p>

                  <p className="last-message-line">
                    {thread.last_message || "No messages yet"}
                  </p>

                  {thread.last_message_dt && (
                    <small>{formatTime(thread.last_message_dt)}</small>
                  )}
                </div>

                {thread.unread_count > 0 && (
                  <span className="unread-badge">
                    {thread.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </aside>

        <section className="post-reply-chat-panel">
          {!activeThread ? (
            <div className="empty-chat large">
              <MessageCircle size={42} />
              <h2>Select a post reply</h2>
              <p>Private replies will appear here.</p>
            </div>
          ) : (
            <>
              <div className="post-reply-chat-header">
                <div>
                  <h2>{activeThread.other_user_name}</h2>

                  <p>
                    <FileText size={15} />
                    {activeThread.post_title || "Post unavailable"}
                  </p>
                </div>

                <span
                  className={
                    activeThread.status === "active"
                      ? "thread-status-active"
                      : "thread-status-closed"
                  }
                >
                  {activeThread.status}
                </span>
              </div>

              {activeThread.post_status === "deleted" && (
                <div className="error-box" style={{ margin: 16 }}>
                  This post is no longer available.
                </div>
              )}

              <div className="post-reply-message-list">
                {messages.map((msg) => {
                  const mine =
                    msg.sender_user_id === currentUser.unique_user_id;

                  return (
                    <div
                      key={msg.message_id}
                      className={mine ? "msg-row mine" : "msg-row"}
                    >
                      <div
                        className={
                          mine ? "msg-bubble mine" : "msg-bubble"
                        }
                      >
                        <p>{msg.message_text}</p>

                        <div className="msg-meta">
                          <span>
                            <Clock size={12} />
                            {formatTime(msg.created_dt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={bottomRef}></div>
              </div>

              <div className="chat-input">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Write a private reply..."
                  disabled={activeThread.status !== "active"}
                />

                <button
                  onClick={handleSend}
                  disabled={activeThread.status !== "active"}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}