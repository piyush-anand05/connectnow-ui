import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  MessageCircle,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  UserMinus,
  ShieldOff,
  Users,
  Mail,
  Ban,
  Compass,
  Sparkles,
  SlidersHorizontal,
  Crown,
  MoreVertical
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  discoverPeople,
  getMyConnections,
  getConnectionRequests,
  getBlockedUsers,
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  cancelConnectionRequest,
  removeConnection,
  blockUser,
  unblockUser,
  getNetworkProfile
} from "../api/network";

import { startConversation } from "../api/messages";

import "../styles/home.css";

export default function MyNetwork() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");

  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const [selectedProfile, setSelectedProfile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    try {
      setLoading(true);

      if (activeTab === "connections") {
        setConnections(await getMyConnections());
      } else if (activeTab === "requests") {
        setRequests(await getConnectionRequests());
      } else if (activeTab === "blocked") {
        setBlocked(await getBlockedUsers());
      } else {
        setPeople(
          await discoverPeople({
            city: city === "All" ? "" : city,
            search
          })
        );
      }
    } catch (err) {
      console.log(err);
      setMessage("Unable to load network.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    await loadData();
  }

  async function showProfile(userId) {
    try {
      const data = await getNetworkProfile(userId);
      setSelectedProfile(data);
    } catch (err) {
      console.log(err);
      setMessage("Unable to load profile.");
    }
  }

  async function handleConnect(userId) {
    try {
      await sendConnectionRequest(userId);

      setPeople((prev) =>
        prev.map((p) =>
          p.unique_user_id === userId
            ? { ...p, connection_status: "pending" }
            : p
        )
      );

      setMessage("Connection request sent.");
      setTimeout(() => setMessage(""), 2200);
    } catch (err) {
      console.log(err);
      setMessage("Unable to send request.");
    }
  }

  async function handleCancel(userId) {
    try {
      await cancelConnectionRequest(userId);

      setPeople((prev) =>
        prev.map((p) =>
          p.unique_user_id === userId
            ? { ...p, connection_status: null, connection_id: null }
            : p
        )
      );

      setMessage("Connection request cancelled.");
      setTimeout(() => setMessage(""), 2200);
    } catch (err) {
      console.log(err);
      setMessage("Unable to cancel request.");
    }
  }

  async function handleAccept(connectionId) {
    try {
      await acceptConnection(connectionId);
      setMessage("Connection accepted.");
      await loadData();
    } catch (err) {
      console.log(err);
      setMessage("Unable to accept request.");
    }
  }

  async function handleReject(connectionId) {
    try {
      await rejectConnection(connectionId);
      setMessage("Connection rejected.");
      await loadData();
    } catch (err) {
      console.log(err);
      setMessage("Unable to reject request.");
    }
  }

  async function handleRemove(userId) {
    if (!window.confirm("Remove this connection?")) return;

    try {
      await removeConnection(userId);
      setMessage("Connection removed.");
      await loadData();
    } catch (err) {
      console.log(err);
      setMessage("Unable to remove connection.");
    }
  }

  async function handleBlock(userId) {
    if (
      !window.confirm(
        "Block this user? They will not be able to discover or message you."
      )
    ) {
      return;
    }

    try {
      await blockUser(userId);
      setMessage("User blocked.");
      await loadData();
    } catch (err) {
      console.log(err);
      setMessage("Unable to block user.");
    }
  }

  async function handleUnblock(userId) {
    try {
      await unblockUser(userId);
      setMessage("User unblocked.");
      await loadData();
    } catch (err) {
      console.log(err);
      setMessage("Unable to unblock user.");
    }
  }

  async function handleMessage(person) {
    if (person.connection_status !== "accepted") return;

    try {
      await startConversation(person.unique_user_id);
      navigate("/messages");
    } catch (err) {
      console.log(err);
      setMessage("Unable to start conversation.");
    }
  }

  const visiblePeople =
    activeTab === "connections"
      ? connections
      : activeTab === "requests"
      ? requests
      : activeTab === "blocked"
      ? blocked
      : people;

  const statCards = [
    {
      key: "discover",
      title: "Discover",
      subtitle: "Find useful people",
      icon: <Compass size={22} />,
      count: people.length
    },
    {
      key: "connections",
      title: "Connections",
      subtitle: "Your trusted network",
      icon: <Users size={22} />,
      count: connections.length
    },
    {
      key: "requests",
      title: "Requests",
      subtitle: "Pending invites",
      icon: <Mail size={22} />,
      count: requests.length
    },
    {
      key: "blocked",
      title: "Blocked",
      subtitle: "Manage safety",
      icon: <Ban size={22} />,
      count: blocked.length
    }
  ];

  return (
    <div className="home-page">
      <div className="animated-bg"></div>

      <Sidebar active="network" />

      <main className="main-content">
        <Topbar
          title="My Network"
          subtitle="Connect, collaborate and grow with people nearby"
        />

        {message && (
          <div className="success-box" style={{ marginBottom: "20px" }}>
            ✅ {message}
          </div>
        )}

        <div className="network-premium-hero">
          <div className="network-hero-copy">
            <div className="network-hero-badge">
              <Sparkles size={16} />
              Smart Local Discovery
            </div>

            <h2>
              Find the <span>right people</span> around you
            </h2>

            <p>
              Discover neighbours, professionals, creators, mentors and local
              experts who can help you with real needs.
            </p>

            <div className="network-premium-search">
              <Search size={20} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Try: Python mentor, insurance help, photographer..."
              />

              <button onClick={handleSearch}>Search</button>
            </div>
          </div>

          <div className="network-orbit-card">
            <div className="orbit-ring ring-one"></div>
            <div className="orbit-ring ring-two"></div>
            <div className="orbit-ring ring-three"></div>

            <div className="orbit-center">
              <Users size={42} />
            </div>

            <div className="orbit-bubble bubble-one">AI</div>
            <div className="orbit-bubble bubble-two">Gig</div>
            <div className="orbit-bubble bubble-three">Help</div>
            <div className="orbit-bubble bubble-four">Local</div>
          </div>
        </div>

        <div className="network-switch-board">
          {statCards.map((item) => (
            <button
              key={item.key}
              className={
                activeTab === item.key
                  ? "network-switch-card active-switch"
                  : "network-switch-card"
              }
              onClick={() => setActiveTab(item.key)}
            >
              <div className="switch-icon">{item.icon}</div>

              <div>
                <h3>
                  {item.title}
                  {item.key === "requests" && item.count > 0 && (
                    <span className="request-mini-badge">{item.count}</span>
                  )}
                </h3>

                <p>{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="network-premium-toolbar">
          <div className="toolbar-select">
            <MapPin size={17} />

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={activeTab !== "discover"}
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <div className="toolbar-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={activeTab !== "discover"}
              placeholder="Search by skills, interests, help..."
            />
          </div>

          <button
            className="toolbar-filter-btn"
            onClick={handleSearch}
            disabled={activeTab !== "discover"}
          >
            <SlidersHorizontal size={17} />
            Apply
          </button>
        </div>

        {loading ? (
          <div className="ai-card">
            <h2>Loading network...</h2>
          </div>
        ) : visiblePeople.length === 0 ? (
          <div className="my-posts-empty-premium">
            <div className="empty-glow-icon">
              <Users size={40} />
            </div>

            <h2>No people found</h2>

            <p>
              Try another filter, search term, or switch to a different network
              section.
            </p>
          </div>
        ) : (
          <section className="premium-network-grid">
            {visiblePeople.map((person) => (
              <div
                className="premium-person-card"
                key={person.unique_user_id}
              >
                <button className="person-more-btn">
                  <MoreVertical size={18} />
                </button>

                <div className="premium-person-top">
                  <div className="premium-person-avatar">
                    {person.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <h3>{person.name}</h3>

                    <p>
                      <MapPin size={13} />
                      {person.city || "Location not added"}
                    </p>
                  </div>
                </div>

                <div className="premium-help-box">
                  <span>Can help with</span>
                  <p>{person.can_help_with || "Not added yet"}</p>
                </div>

                <div className="premium-skill-row">
                  {(person.skills || "No skills added")
                    .split(",")
                    .slice(0, 4)
                    .map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                </div>

                <div className="premium-availability">
                  <Sparkles size={15} />
                  Available: {person.availability || "Not specified"}
                </div>

                <div className="premium-person-actions">
                  {activeTab === "requests" ? (
                    <>
                      <button onClick={() => handleAccept(person.connection_id)}>
                        <CheckCircle size={16} />
                        Accept
                      </button>

                      <button onClick={() => handleReject(person.connection_id)}>
                        <XCircle size={16} />
                        Reject
                      </button>

                      <button onClick={() => showProfile(person.unique_user_id)}>
                        <Eye size={16} />
                        View
                      </button>

                      <button onClick={() => handleBlock(person.unique_user_id)}>
                        <ShieldOff size={16} />
                        Block
                      </button>
                    </>
                  ) : activeTab === "connections" ? (
                    <>
                      <button onClick={() => handleMessage(person)}>
                        <MessageCircle size={16} />
                        Message
                      </button>

                      <button onClick={() => showProfile(person.unique_user_id)}>
                        <Eye size={16} />
                        View
                      </button>

                      <button onClick={() => handleRemove(person.unique_user_id)}>
                        <UserMinus size={16} />
                        Remove
                      </button>

                      <button onClick={() => handleBlock(person.unique_user_id)}>
                        <ShieldOff size={16} />
                        Block
                      </button>
                    </>
                  ) : activeTab === "blocked" ? (
                    <>
                      <button onClick={() => showProfile(person.unique_user_id)}>
                        <Eye size={16} />
                        View
                      </button>

                      <button onClick={() => handleUnblock(person.unique_user_id)}>
                        <CheckCircle size={16} />
                        Unblock
                      </button>
                    </>
                  ) : (
                    <>
                      {person.connection_status === "accepted" ? (
                        <button className="connected-btn">
                          <CheckCircle size={16} />
                          Connected
                        </button>
                      ) : person.connection_status === "pending" ? (
                        <button
                          className="requested-btn"
                          onClick={() => handleCancel(person.unique_user_id)}
                        >
                          Request Sent
                        </button>
                      ) : (
                        <button onClick={() => handleConnect(person.unique_user_id)}>
                          <UserPlus size={16} />
                          Connect
                        </button>
                      )}

                      <button
                        disabled={person.connection_status !== "accepted"}
                        className={
                          person.connection_status !== "accepted"
                            ? "disabled-action-btn"
                            : ""
                        }
                        onClick={() => handleMessage(person)}
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>

                      <button onClick={() => showProfile(person.unique_user_id)}>
                        <Eye size={16} />
                        View
                      </button>

                      <button onClick={() => handleBlock(person.unique_user_id)}>
                        <ShieldOff size={16} />
                        Block
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="network-premium-footer">
          <div className="footer-diamond">
            <Crown size={34} />
          </div>

          <div>
            <h3>Grow your network faster</h3>
            <p>
              ConnectNow will soon recommend people based on your skills,
              location, interests and needs.
            </p>
          </div>
        </div>
      </main>

      {selectedProfile && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="modal-card network-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedProfile(null)}
            >
              ×
            </button>

            <div className="premium-person-avatar profile-modal-avatar">
              {selectedProfile.name?.charAt(0) || "U"}
            </div>

            <h2>{selectedProfile.name}</h2>

            <p className="modal-subtitle">
              {selectedProfile.city || "Location not added"} ·{" "}
              {selectedProfile.connection_status || "Not connected"}
            </p>

            <div className="context-box">
              <span>About</span>
              <p>{selectedProfile.about_me || "Not added yet"}</p>
            </div>

            <div className="context-box">
              <span>Can help with</span>
              <p>{selectedProfile.can_help_with || "Not added yet"}</p>
            </div>

            <div className="context-box">
              <span>Skills</span>
              <p>{selectedProfile.skills || "Not added yet"}</p>
            </div>

            <div className="context-box">
              <span>Experience</span>
              <p>{selectedProfile.experience || "Not added yet"}</p>
            </div>

            <div className="context-box">
              <span>Availability</span>
              <p>{selectedProfile.availability || "Not specified"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}