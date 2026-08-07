import axios from "axios";
import { API_URL } from "../ApiUrl";

/** Auth header used by every authenticated chat call. */
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/** Start (find-or-create) a conversation with a provider. */
export const startConversation = async (peerRole: string, peerRef: string) => {
  const res = await axios.post(
    `${API_URL}/chat/start`,
    { peerRole, peerRef },
    { headers: authHeader() }
  );
  return res.data;
};

/** List my conversations with peer info + unread counts. */
export const fetchConversations = async () => {
  const res = await axios.get(`${API_URL}/chat/conversations`, {
    headers: authHeader(),
  });
  return res.data;
};

/** Fetch messages for one conversation. */
export const fetchMessages = async (conversationId: string) => {
  const res = await axios.get(
    `${API_URL}/chat/conversation/${conversationId}/messages`,
    { headers: authHeader() }
  );
  return res.data;
};

/** Send a message. */
export const sendMessage = async (conversationId: string, text: string) => {
  const res = await axios.post(
    `${API_URL}/chat/conversation/${conversationId}/message`,
    { text },
    { headers: authHeader() }
  );
  return res.data;
};

/** Mark a conversation read. */
export const markConversationRead = async (conversationId: string) => {
  const res = await axios.post(
    `${API_URL}/chat/conversation/${conversationId}/read`,
    {},
    { headers: authHeader() }
  );
  return res.data;
};

/** Total unread count across all conversations. */
export const fetchUnreadCount = async (): Promise<number> => {
  try {
    if (!localStorage.getItem("token")) return 0;
    const res = await axios.get(`${API_URL}/chat/unread-count`, {
      headers: authHeader(),
    });
    return res.data?.total || 0;
  } catch (err) {
    return 0;
  }
};

/**
 * Polls the unread count every `intervalMs` and dispatches a
 * `ki-chat-unread` CustomEvent so headers / bottom bars can badge updates.
 * Returns the stop function.
 */
export const startUnreadPoller = (intervalMs = 15000) => {
  let stop = false;
  let last = -1;

  const tick = async () => {
    if (stop) return;
    const total = await fetchUnreadCount();
    if (total !== last) {
      last = total;
      window.dispatchEvent(new CustomEvent("ki-chat-unread", { detail: total }));
    }
  };

  tick();
  const timer = window.setInterval(tick, intervalMs);
  return () => {
    stop = true;
    window.clearInterval(timer);
  };
};

/** One-shot unread fetch + event dispatch (e.g. after opening chat). */
export const refreshUnreadBadge = async () => {
  const total = await fetchUnreadCount();
  window.dispatchEvent(new CustomEvent("ki-chat-unread", { detail: total }));
  return total;
};
