import { useEffect, useMemo, useRef, useState } from "react";

import {
  Send,
  Search,
  MessageCircle,
  Circle,
  Check,
  CheckCheck,
  UserCircle2,
  ShieldOff
} from "lucide-react";

import {
  markOnline,
  markOffline,
  getMyConversations,
  getMessages,
  sendMessage,
  markConversationRead
} from "../api/messages";

import { blockUser } from "../api/network";

import "../styles/home.css";

export default function Messages() {
  const currentUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const bottomRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function formatTime(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatDateLabel(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function shouldShowDate(index) {
    if (index === 0) return true;

    const currentDate = new Date(messages[index].created_at).toDateString();
    const previousDate = new Date(messages[index - 1].created_at).toDateString();

    return currentDate !== previousDate;
  }

  async function loadConversations() {
    try {
      const data = await getMyConversations();

      setConversations(data);

      if (!activeConv && data.length > 0) {
        setActiveConv(data[0]);
      }
    } catch (err) {
      console.log(err);
      setError("Unable to load conversations.");
    }
  }

  async function loadMessages(conversation) {
    if (!conversation) return;

    try {
      const data = await getMessages(conversation.conversation_id);

      setMessages(data);

      await markConversationRead(conversation.conversation_id);
    } catch (err) {
      console.log(err);
      setError("Unable to load messages.");
    }
  }

  async function handleSend() {
    if (!text.trim() || !activeConv) return;

    try {
      await sendMessage(activeConv.conversation_id, text.trim());

      setText("");

      await loadMessages(activeConv);
      await loadConversations();
    } catch (err) {
      console.log(err);
      setError("Message not sent. You may not be connected anymore.");
    }
  }

  async function handleBlockUser() {
    if (!activeConv?.participant?.unique_user_id) return;

    const confirmed = window.confirm(
      `Block ${activeConv.participant.name}? They will not be able to discover or message you.`
    );

    if (!confirmed) return;

    try {
      await blockUser(activeConv.participant.unique_user_id);

      setNotice("User blocked successfully.");
      setActiveConv(null);
      setMessages([]);

      await loadConversations();

      setTimeout(() => {
        setNotice("");
      }, 2500);
    } catch (err) {
      console.log(err);
      setError("Unable to block user.");
    }
  }

  useEffect(() => {
    markOnline().catch(console.log);
    loadConversations();

    return () => {
      markOffline().catch(console.log);
    };
  }, []);

  useEffect(() => {
    loadMessages(activeConv);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations();

      if (activeConv) {
        loadMessages(activeConv);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeConv]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const name = conv.participant?.name || "";
      const help = conv.participant?.can_help_with || "";
      const last = conv.last_message || "";

      return `${name} ${help} ${last}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [conversations, search]);

  return (
    <div className="cn-page messages-v2-page">
      {notice && (
        <div className="success-box" style={{ marginBottom: "20px" }}>
          ✅ {notice}
        </div>
      )}

      {error && (
        <div className="error-box" style={{ marginBottom: "20px" }}>
          ❌ {error}
        </div>
      )}

      <div className="messages-layout">
        <aside className="conversation-panel">
          <div className="conversation-search">
            <Search size={18} />

            <input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredConversations.length === 0 ? (
            <div className="empty-chat">
              <MessageCircle size={34} />
              <p>No conversations yet.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.conversation_id}
                className={
                  activeConv?.conversation_id === conv.conversation_id
                    ? "conversation-item active-conversation"
                    : "conversation-item"
                }
                onClick={() => setActiveConv(conv)}
              >
                <div className="conversation-avatar">
                  {conv.participant?.name?.charAt(0) || "U"}
                </div>

                <div className="conversation-info">
                  <div className="conversation-name-row">
                    <h3>{conv.participant?.name}</h3>

                    <span
                      className={
                        conv.participant?.is_online
                          ? "online-dot"
                          : "offline-dot"
                      }
                    />
                  </div>

                  <p>{conv.last_message || "No messages yet"}</p>

                  {conv.last_message_at && (
                    <small>
                      {formatDateLabel(conv.last_message_at)} ·{" "}
                      {formatTime(conv.last_message_at)}
                    </small>
                  )}
                </div>

                {conv.unread_count > 0 && (
                  <span className="unread-badge">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </aside>

        <section className="chat-panel">
          {!activeConv ? (
            <div className="empty-chat large">
              <MessageCircle size={42} />
              <h2>Select a conversation</h2>
              <p>You can message only accepted connections.</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <div className="conversation-avatar big">
                    {activeConv.participant?.name?.charAt(0)}
                  </div>

                  <div>
                    <h2>{activeConv.participant?.name}</h2>

                    <p>
                      <Circle
                        size={10}
                        fill={
                          activeConv.participant?.is_online
                            ? "#B8FF4F"
                            : "#ef4444"
                        }
                        color={
                          activeConv.participant?.is_online
                            ? "#B8FF4F"
                            : "#ef4444"
                        }
                      />

                      {activeConv.participant?.is_online
                        ? "Online"
                        : activeConv.participant?.last_seen_at
                        ? `Last seen ${formatDateLabel(
                            activeConv.participant.last_seen_at
                          )} ${formatTime(
                            activeConv.participant.last_seen_at
                          )}`
                        : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="message-list">
                {messages.map((msg, index) => {
                  const mine =
                    msg.sender_user_id === currentUser.unique_user_id;

                  return (
                    <div key={msg.message_id}>
                      {shouldShowDate(index) && (
                        <div className="date-separator">
                          <span>{formatDateLabel(msg.created_at)}</span>
                        </div>
                      )}

                      <div className={mine ? "msg-row mine" : "msg-row"}>
                        <div
                          className={
                            mine ? "msg-bubble mine" : "msg-bubble"
                          }
                        >
                          <p>{msg.message_text}</p>

                          <div className="msg-meta">
                            <span>{formatTime(msg.created_at)}</span>

                            {mine && (
                              <span className="tick">
                                {msg.is_read ? (
                                  <CheckCheck size={15} />
                                ) : (
                                  <Check size={15} />
                                )}
                              </span>
                            )}
                          </div>
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
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Write a message..."
                />

                <button onClick={handleSend}>
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="message-context">
          {activeConv ? (
            <>
              <UserCircle2 size={58} />

              <h3>{activeConv.participant?.name}</h3>

              <p>{activeConv.participant?.city}</p>

              <div className="context-box">
                <span>Can help with</span>

                <p>
                  {activeConv.participant?.can_help_with ||
                    "Not added yet"}
                </p>
              </div>

              <div className="context-box">
                <span>Status</span>

                <p>
                  {activeConv.participant?.is_online
                    ? "Online now"
                    : activeConv.participant?.last_seen_at
                    ? `Last seen ${formatDateLabel(
                        activeConv.participant.last_seen_at
                      )} at ${formatTime(
                        activeConv.participant.last_seen_at
                      )}`
                    : "Offline"}
                </p>
              </div>

              <button
                className="block-user-btn"
                onClick={handleBlockUser}
              >
                <ShieldOff size={16} />
                Block User
              </button>
            </>
          ) : (
            <p>Select a chat to see context.</p>
          )}
        </aside>
      </div>
    </div>
  );
}