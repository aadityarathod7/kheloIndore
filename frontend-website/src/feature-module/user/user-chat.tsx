import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import { API_URL, IMG_URL } from "../../ApiUrl";
import { jwtDecode } from "jwt-decode";
import {
  startConversation,
  fetchConversations,
  fetchMessages,
  sendMessage as sendMsgApi,
  markConversationRead,
  refreshUnreadBadge,
} from "../../utils/chat";

interface Peer {
  name: string;
  avatar: string | null;
  role: string;
  type: string;
  ref: string;
}

interface Conversation {
  _id: string;
  peer: Peer;
  lastMessage: { text: string; senderRole?: string; sentAt?: string } | null;
  unread: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  _id: string;
  sender: { role: string; ref: string };
  text: string;
  read: boolean;
  createdAt: string;
  isMine?: boolean;
}

const formatTime = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  const time = `${hh}:${m} ${ampm}`;
  if (sameDay) return time;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const avatarSrc = (avatar: string | null) =>
  !avatar
    ? "/assets/img/profiles/avatar-01.jpg"
    : avatar.startsWith("http")
      ? avatar
      : `${IMG_URL}${avatar}`;

const UserChat = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [showThread, setShowThread] = useState(false); // mobile list <-> thread toggle
  const [errorMsg, setErrorMsg] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const myRole = useMemo(() => {
    try {
      return token ? (jwtDecode<any>(token).role || "User") : "User";
    } catch {
      return "User";
    }
  }, [token]);

  // ─── Load conversation list ───
  const loadConversations = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setLoadingList(false);
      return;
    }
    try {
      const data = await fetchConversations();
      setConversations(data?.conversations || []);
      refreshUnreadBadge();
    } catch (err) {
      setErrorMsg("Could not load conversations.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  // ─── Load a thread + mark read ───
  const openThread = useCallback(
    async (conversationId: string, markRead = true) => {
      setActiveId(conversationId);
      setLoadingThread(true);
      try {
        const data = await fetchMessages(conversationId);
        setMessages(data?.messages || []);
        if (markRead) {
          markConversationRead(conversationId).catch(() => undefined);
          setConversations((prev) =>
            prev.map((c) => (c._id === conversationId ? { ...c, unread: 0 } : c))
          );
          refreshUnreadBadge();
        }
      } catch (err) {
        setErrorMsg("Could not load messages.");
      } finally {
        setLoadingThread(false);
        setShowThread(true);
      }
    },
    []
  );

  // Deep link: ?peerType=Coach&peerId=... starts a conversation immediately
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const deepPeerType = params.get("peerType");
  const deepPeerId = params.get("peerId");

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!deepPeerType || !deepPeerId || !token) return;
    (async () => {
      try {
        const data = await startConversation(deepPeerType, deepPeerId);
        const convId = data?.conversation?._id;
        if (convId) {
          setActiveId(convId);
          await openThread(convId, false);
          // Rebuild the list so the new/updated conversation shows on top
          loadConversations();
        }
      } catch (err) {
        setErrorMsg("Could not open chat with this profile.");
      }
    })();
  }, [deepPeerType, deepPeerId, token]);

  // ─── Poll for new messages while on the page ───
  useEffect(() => {
    const timer = window.setInterval(() => {
      loadConversations();
      if (activeId) {
        fetchMessages(activeId)
          .then((data) => {
            const list = data?.messages || [];
            setMessages((prev) => {
              // merge without duplicates
              const seen = new Set(prev.map((m) => m._id));
              const fresh = list.filter((m: ChatMessage) => !seen.has(m._id));
              return fresh.length ? [...prev, ...fresh] : prev;
            });
            // auto-mark read when thread is open
            markConversationRead(activeId).catch(() => undefined);
          })
          .catch(() => undefined);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [activeId, loadConversations]);

  // Scroll thread to bottom when messages change
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, activeId, showThread]);

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        c.peer?.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [conversations, search]
  );

  const activeConversation = conversations.find((c) => c._id === activeId);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    const optimistic: ChatMessage = {
      _id: `tmp-${Date.now()}`,
      sender: { role: myRole, ref: "me" },
      text,
      read: false,
      createdAt: new Date().toISOString(),
      isMine: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    try {
      const data = await sendMsgApi(activeId, text);
      // Drop the optimistic bubble AND any copy the poll already appended
      // (same server _id), then put the canonical message at the end.
      setMessages((prev) =>
        prev
          .filter((m) => m._id !== optimistic._id && m._id !== data.message._id)
          .concat(data.message)
      );
      loadConversations();
    } catch (err) {
      // keep the optimistic message; surface a toast-ish inline note
      setErrorMsg("Message failed to send. Try again.");
      setDraft(text);
    } finally {
      setSending(false);
    }
  };

  // ─── Render helpers ───
  const contactRow = (c: Conversation) => (
    <Link
      to="#"
      key={c._id}
      className={`media ${c._id === activeId ? "active" : ""} ${c.unread === 0 ? "read-chat" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        openThread(c._id);
      }}
    >
      <div className="media-img-wrap">
        <div className="avatar avatar-online">
          <img src={avatarSrc(c.peer?.avatar)} alt={c.peer?.name || "User"} className="avatar-img" />
          <span className="green-active" />
        </div>
      </div>
      <div className="media-body">
        <div>
          <div className="user-name">{c.peer?.name || "User"}</div>
          <div className="user-last-chat">
            <i className="fa-solid fa-check-double" /> {c.lastMessage?.text || "No messages yet"}
          </div>
        </div>
        <div>
          <div className="last-chat-time block">
            {formatTime(c.lastMessage?.sentAt || c.updatedAt)}
          </div>
          {c.unread > 0 && (
            <div className="badge badge-success badge-pill">{c.unread}</div>
          )}
        </div>
      </div>
    </Link>
  );

  const bubble = (m: ChatMessage) =>
    m.isMine ? (
      <li className="media sent" key={m._id}>
        <div className="media-body">
          <div className="msg-box">
            <div>
              <p>{m.text}</p>
              <ul className="chat-msg-info">
                <li>
                  <div className="chat-time">
                    <span>{formatTime(m.createdAt)}</span>
                    <span className="msg-seen">
                      <i className="fa-solid fa-check-double" />
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    ) : (
      <li className="media received" key={m._id}>
        <div className="avatar">
          <img
            src={avatarSrc(activeConversation?.peer?.avatar)}
            alt="User"
            className="avatar-img rounded-circle"
          />
        </div>
        <div className="media-body">
          <div className="msg-box">
            <div>
              <p>{m.text}</p>
              <ul className="chat-msg-info">
                <li>
                  <div className="chat-time">
                    <span>{formatTime(m.createdAt)}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    );

  const emptyState = !token ? (
    <div className="text-center py-5 my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center mb-3"
        style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
      >
        <i className="fas fa-comments fs-3" />
      </div>
      <h5 className="font-weight-bold text-dark mb-1">Login to view your chats</h5>
      <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
        Sign in to chat with coaches, trainers &amp; venue owners.
      </p>
      <Link
        to="/login"
        className="btn text-white px-4 py-2"
        style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", borderRadius: "50px", fontSize: "14px", fontWeight: "600" }}
      >
        <i className="fas fa-sign-in-alt me-2" /> Login
      </Link>
    </div>
  ) : loadingList ? (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border spinner-border-sm text-success" role="status" />
      <p className="mt-2 mb-0" style={{ fontSize: "13px" }}>Loading conversations…</p>
    </div>
  ) : conversations.length === 0 ? (
    <div className="text-center py-5 my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center mb-3"
        style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
      >
        <i className="fas fa-comment-dots fs-3" />
      </div>
      <h5 className="font-weight-bold text-dark mb-1">No conversations yet</h5>
      <p className="text-muted mb-4" style={{ fontSize: "14px", maxWidth: "340px", margin: "0 auto" }}>
        Visit any venue, coach or trainer profile and hit &ldquo;Message&rdquo; to start chatting.
      </p>
      <Link
        to={routes.coachesGrid}
        className="btn text-white px-4 py-2"
        style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", borderRadius: "50px", fontSize: "14px", fontWeight: "600" }}
      >
        <i className="fas fa-user-plus me-2" /> Find a Coach
      </Link>
    </div>
  ) : filtered.length === 0 ? (
    <div className="text-center py-5 text-muted">
      <p className="mb-0" style={{ fontSize: "13px" }}>No conversations match &ldquo;{search}&rdquo;</p>
    </div>
  ) : (
    filtered.map(contactRow)
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-booking-section" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", paddingTop: "175px", paddingBottom: "40px", position: "relative", overflow: "hidden", borderBottom: "1px solid #E5E7EB" }}>
        <div className="hero-artwork-blend" style={{ position: "absolute", right: "-60px", top: 0, bottom: 0, width: "55%", backgroundImage: "url('/assets/img/bg/banner-illustration.png')", backgroundSize: "cover", backgroundPosition: "left center", backgroundRepeat: "no-repeat", maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)", opacity: 0.9 }}></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <span className="font-weight-bold" style={{ fontSize: "13px", letterSpacing: "1.5px", display: "block", marginBottom: "12px", color: "#22C55E", fontWeight: "700" }}>USER MESSAGES</span>
              <h1 className="d-flex align-items-center flex-wrap" style={{ fontSize: "48px", fontWeight: "800", color: "#0F172A", lineHeight: "1.1", marginBottom: "16px" }}>
                My <span style={{ color: "#22C55E", marginLeft: "12px" }}>Chats</span>
              </h1>
              <p style={{ color: "#64748B", fontSize: "18px", marginBottom: "20px", fontWeight: "500", maxWidth: "480px" }}>
                Connect with coaches &amp; trainers and keep all your conversations in one place
              </p>

              <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                <div className="d-inline-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: "13px", border: "1px solid #E5E7EB" }}>
                  <Link to="/" style={{ color: "#64748B", textDecoration: "none", fontWeight: "500" }}><i className="fas fa-home me-1" style={{ color: "#64748B" }} /> Home</Link>
                  <span style={{ margin: "0 10px", color: "#64748B" }}><i className="fas fa-chevron-right" style={{ fontSize: "10px", color: "#64748B" }} /></span>
                  <span style={{ color: "#22C55E", fontWeight: "600" }}>Chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dashboard Menu */}
      <div className="dashboard-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-menu">
                <ul>
                  <li>
                    <Link to={routes.userDashboard}>
                      <ImageWithBasePath src="/assets/img/icons/dashboard-icon.svg" alt="Icon" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userBookings}>
                      <ImageWithBasePath src="/assets/img/icons/booking-icon.svg" alt="Icon" />
                      <span>My Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userChat} className="active">
                      <ImageWithBasePath src="assets/img/icons/chat-icon.svg" alt="Icon" />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userInvoice}>
                      <ImageWithBasePath src="/assets/img/icons/invoice-icon.svg" alt="Icon" />
                      <span>Invoices</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userWallet}>
                      <ImageWithBasePath src="/assets/img/icons/wallet-icon.svg" alt="Icon" />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.userProfile}>
                      <ImageWithBasePath src="/assets/img/icons/profile-icon.svg" alt="Icon" />
                      <span>Profile Setting</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Content */}
      <div className="content court-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="chat-window">
                {/* Chat Left */}
                <div className="chat-cont-left" style={showThread ? { display: "none" } : undefined}>
                  <form className="chat-search" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-custom">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </form>
                  <div className="chat-users-list">
                    <h3>Contacts</h3>
                    <div className="chat-scroll">{emptyState}</div>
                  </div>
                </div>
                {/* /Chat Left */}
                {/* Chat Right */}
                <div className="chat-cont-right" style={!showThread && conversations.length ? { display: "none" } : undefined}>
                  {activeConversation ? (
                    <>
                      <div className="chat-header">
                        <Link to="#" className="back-user-list" onClick={(e) => { e.preventDefault(); setShowThread(false); }}>
                          <i className="feather-chevrons-left" />
                        </Link>
                        <div className="media">
                          <div className="media-img-wrap">
                            <div className="avatar avatar-online">
                              <img src={avatarSrc(activeConversation.peer?.avatar)} alt="User" className="avatar-img rounded-circle" />
                              <span className="green-active" />
                            </div>
                          </div>
                          <div className="media-body">
                            <div className="user-name">{activeConversation.peer?.name || "User"}</div>
                            <small style={{ color: "#9CA3AF", fontSize: "12px" }}>
                              {activeConversation.peer?.role || "Member"}
                            </small>
                          </div>
                        </div>
                        <div className="chat-options">
                          <div className="dropdown dropdown-action table-drop-action">
                            <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              <Link className="dropdown-item" to="#" onClick={(e) => e.preventDefault()}>
                                <i className="feather feather-trash" /> Delete
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat-body">
                        <div className="chat-scroll" ref={threadRef}>
                          <ul className="list-unstyled">
                            {loadingThread ? (
                              <li className="text-center text-muted py-4">
                                <div className="spinner-border spinner-border-sm text-success" role="status" />
                              </li>
                            ) : messages.length === 0 ? (
                              <li className="text-center text-muted py-4">
                                <p className="mb-0" style={{ fontSize: "13px" }}>
                                  Say hello to start the conversation 👋
                                </p>
                              </li>
                            ) : (
                              messages.map(bubble)
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="chat-footer">
                        <div className="form-custom">
                          <div className="input-group-prepend">
                            <i className="feather-paperclip" />
                          </div>
                          <div className="send-blk">
                            <input
                              type="text"
                              className="input-msg-send form-control"
                              placeholder="Type a message…"
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSend();
                                }
                              }}
                            />
                            <div className="input-group-append">
                              <button type="button" className="btn msg-send-btn" onClick={handleSend} disabled={sending || !draft.trim()}>
                                <i className="feather-send" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: "480px", textAlign: "center" }}>
                      <div>
                        <div
                          className="d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
                        >
                          <i className="fas fa-comment-dots fs-3" />
                        </div>
                        <h5 className="font-weight-bold text-dark mb-1">Select a conversation</h5>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Choose a contact from the list to start chatting
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* /Chat Right */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default UserChat;
