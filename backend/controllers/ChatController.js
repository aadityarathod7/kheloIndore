const Conversation = require("../models/ChatModel");
const Message = require("../models/ChatMessageModel");
const User = require("../models/UserModel");
const Coach = require("../models/CoachModel");
const PersonalTrainer = require("../models/PersonalTrainingModel");
const Venue1 = require("../models/Venue1");
const Venue = require("../models/VenueModel");
const mongoose = require("mongoose");

/**
 * Resolve a provider's chat identity to a User account when one exists
 * (matched by mobile number), so chats started against the provider's
 * collection record (Coach / PersonalTrainer / Venue1) are visible when the
 * provider logs in with their User account.
 *
 * Falls back to the raw collection identity when no User link exists.
 */
async function resolvePeerIdentity(peerRole, peerRef) {
  let mobile = null;
  try {
    if (peerRole === "Coach") {
      const c = await Coach.findById(peerRef);
      mobile = c?.mobile;
    } else if (peerRole === "Personal Trainer" || peerRole === "PersonalTrainer") {
      const t = await PersonalTrainer.findById(peerRef);
      mobile = t?.mobile;
    } else if (peerRole === "Venue Admin" || peerRole === "Venue") {
      const v = await Venue1.findById(peerRef);
      mobile = v?.contact_number || v?.other_contact_number || null;
      if (!mobile) {
        const v2 = await Venue.findById(peerRef);
        mobile = v2?.contact_number || null;
      }
    }
  } catch (e) {
    mobile = null;
  }

  if (mobile) {
    const user = await User.findOne({ mobile: Number(mobile) });
    if (user) {
      return { role: user.role || "User", ref: user._id, mobile: user.mobile };
    }
  }
  return { role: peerRole, ref: peerRef, mobile: mobile || null };
}

/** Build the current user's identity from the JWT (req.user). */
async function selfIdentity(req) {
  const identity = {
    role: req.user?.role || "User",
    ref: req.user?.userID || null,
    mobile: req.user?.mobile || null,
  };
  // Some login flows (OTP / approval) sign tokens with only `mobile` + `role`.
  // Resolve the User account from the mobile number so chat still works.
  if (!identity.ref && identity.mobile) {
    try {
      const user = await User.findOne({ mobile: Number(identity.mobile) }).lean();
      if (user) {
        identity.ref = user._id;
        identity.role = user.role || identity.role;
      }
    } catch (e) {
      /* keep null ref */
    }
  }
  return identity;
}

/** Does this participant represent the same person as `self`? */
function participantMatches(participant, self) {
  if (!participant || !self?.ref) return false;
  if (
    participant.role === self.role &&
    participant.ref.toString() === self.ref.toString()
  ) {
    return true;
  }
  // Mobile bridge: a provider's collection record shares the User's number.
  if (participant.mobile && self.mobile) {
    return Number(participant.mobile) === Number(self.mobile);
  }
  return false;
}

/** Fetch display info (name + avatar) for any participant. */
async function resolveParticipantInfo(participant) {
  const name = (first, last) =>
    [first, last].filter(Boolean).join(" ").trim() || "User";
  try {
    if (participant.role === "Coach") {
      const c = await Coach.findById(participant.ref);
      if (c) {
        return {
          name: name(c.first_name, c.last_name),
          avatar: c.profile_picture?.[0]?.src || null,
          role: "Coach",
          type: "coach",
          ref: c._id,
        };
      }
    } else if (participant.role === "Personal Trainer" || participant.role === "PersonalTrainer") {
      const t = await PersonalTrainer.findById(participant.ref);
      if (t) {
        return {
          name: name(t.first_name, t.last_name),
          avatar: t.profile_picture?.[0]?.src || null,
          role: "Personal Trainer",
          type: "trainer",
          ref: t._id,
        };
      }
    } else if (participant.role === "Venue Admin" || participant.role === "Venue") {
      let v = await Venue1.findById(participant.ref);
      let images = Array.isArray(v?.images) ? v.images : null;
      if (!v) {
        v = await Venue.findById(participant.ref);
        images = Array.isArray(v?.images) ? v.images : null;
      }
      if (v) {
        return {
          name: v.name || "Venue Owner",
          avatar: images && images.length ? images[0] : null,
          role: "Venue Admin",
          type: "venue",
          ref: v._id,
        };
      }
    }
    const u = await User.findById(participant.ref);
    if (u) {
      return {
        name: name(u.first_name, u.last_name),
        avatar: u.profile_image?.[0]?.src || null,
        role: u.role || "User",
        type: "user",
        ref: u._id,
      };
    }
  } catch (e) {
    /* fall through to generic */
  }
  return {
    name: participant.role === "Venue Admin" ? "Venue Owner" : "User",
    avatar: null,
    role: participant.role,
    type: "user",
    ref: participant.ref,
  };
}

// ─── Start (find-or-create) a conversation ───
exports.startConversation = async (req, res) => {
  try {
    const { peerRole, peerRef } = req.body;
    if (!peerRole || !peerRef) {
      return res
        .status(400)
        .json({ success: false, message: "peerRole and peerRef are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(peerRef)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid peer id" });
    }

    const self = await selfIdentity(req);
    if (!self.ref) {
      return res
        .status(400)
        .json({ success: false, message: "User identity missing from token" });
    }

    const me = await User.findById(self.ref).select("mobile role").lean();
    self.mobile = me?.mobile || null;
    const peer = await resolvePeerIdentity(peerRole, peerRef);

    // Find existing conversation for the unordered pair
    const keys = [self, peer]
      .map((p) => `${p.role}:${p.ref.toString()}`)
      .sort();
    const key = keys.join("|");

    let conversation = await Conversation.findOne({ key });
    let isNew = false;
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { role: self.role, ref: self.ref, mobile: self.mobile },
          { role: peer.role, ref: peer.ref, mobile: peer.mobile },
        ],
      });
      isNew = true;
    }

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(100);

    return res.json({
      success: true,
      isNew,
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
        lastMessage: conversation.lastMessage,
        createdAt: conversation.createdAt,
      },
      messages,
    });
  } catch (error) {
    console.error("Error starting conversation:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to start conversation" });
  }
};

// ─── List my conversations ───
exports.getConversations = async (req, res) => {
  try {
    const self = await selfIdentity(req);
    if (!self.ref) {
      return res
        .status(400)
        .json({ success: false, message: "User identity missing from token" });
    }
    const me = await User.findById(self.ref).select("mobile role").lean();
    self.mobile = me?.mobile || null;

    // Scope query to conversations the caller belongs to. The mobile branch is
    // only added when the caller HAS a mobile — otherwise `mobile: null` would
    // match any conversation containing a mobile-less participant (privacy leak).
    const participantConditions = [{ ref: self.ref }];
    if (self.mobile) {
      participantConditions.push({ mobile: Number(self.mobile) });
    }
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: {
          $or: participantConditions,
        },
      },
    })
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean();

    const result = [];
    for (const conv of conversations) {
      const peerPart = conv.participants.find(
        (p) => !participantMatches(p, self)
      );
      const peer = peerPart ? await resolveParticipantInfo(peerPart) : null;

      // Unread count: messages from the peer that I haven't read
      const unread = peer
        ? await Message.countDocuments({
            conversation: conv._id,
            read: false,
            "sender.ref": peer.ref,
          })
        : 0;

      result.push({
        _id: conv._id,
        peer,
        lastMessage: conv.lastMessage || null,
        unread,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      });
    }

    return res.json({ success: true, conversations: result });
  } catch (error) {
    console.error("Error fetching conversations:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch conversations" });
  }
};

// ─── Get messages for a conversation ───
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid conversation id" });
    }
    const self = await selfIdentity(req);
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
    // Authorization: only participants may read the thread.
    if (!conversation.participants.some((p) => participantMatches(p, self))) {
      return res
        .status(403)
        .json({ success: false, message: "You are not part of this conversation" });
    }

    const limit = Math.min(parseInt(req.query.limit) || 100, 200);
    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    messages.reverse();

    return res.json({
      success: true,
      messages: messages.map((m) => ({
        _id: m._id,
        sender: m.sender,
        text: m.text,
        read: m.read,
        createdAt: m.createdAt,
        isMine: m.sender.role === self.role && m.sender.ref.toString() === self.ref.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

// ─── Send a message ───
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message text is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid conversation id" });
    }
    const self = await selfIdentity(req);
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
    // Authorization: only participants may send into the thread.
    if (!conversation.participants.some((p) => participantMatches(p, self))) {
      return res
        .status(403)
        .json({ success: false, message: "You are not part of this conversation" });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: { role: self.role, ref: self.ref },
      text: String(text).trim().slice(0, 2000),
    });

    // Denormalise into the conversation for the contact list
    conversation.lastMessage = {
      text: message.text,
      senderRole: self.role,
      senderRef: self.ref,
      sentAt: message.createdAt,
    };
    await conversation.save();

    return res.json({
      success: true,
      message: {
        _id: message._id,
        sender: message.sender,
        text: message.text,
        read: false,
        createdAt: message.createdAt,
        isMine: true,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
};

// ─── Mark incoming messages as read ───
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid conversation id" });
    }
    const self = await selfIdentity(req);
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
    // Authorization: only participants may mark the thread read.
    if (!conversation.participants.some((p) => participantMatches(p, self))) {
      return res
        .status(403)
        .json({ success: false, message: "You are not part of this conversation" });
    }

    // Mark read all messages NOT sent by me in this conversation
    await Message.updateMany(
      {
        conversation: id,
        read: false,
        "sender.ref": { $ne: self.ref },
      },
      { $set: { read: true } }
    );

    return res.json({ success: true, message: "Conversation marked as read" });
  } catch (error) {
    console.error("Error marking read:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark conversation as read" });
  }
};

// ─── Total unread count (for notification badges) ───
exports.getUnreadCount = async (req, res) => {
  try {
    const self = await selfIdentity(req);
    if (!self.ref) {
      return res.json({ success: true, total: 0 });
    }
    const me = await User.findById(self.ref).select("mobile").lean();
    self.mobile = me?.mobile || null;

    const participantConditions = [{ ref: self.ref }];
    if (self.mobile) {
      participantConditions.push({ mobile: Number(self.mobile) });
    }
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: {
          $or: participantConditions,
        },
      },
    })
      .select("_id participants")
      .lean();

    let total = 0;
    for (const conv of conversations) {
      const peerPart = conv.participants.find((p) => !participantMatches(p, self));
      if (!peerPart) continue;
      total += await Message.countDocuments({
        conversation: conv._id,
        read: false,
        "sender.ref": peerPart.ref,
      });
    }

    return res.json({ success: true, total });
  } catch (error) {
    console.error("Error fetching unread count:", error.message);
    return res.json({ success: true, total: 0 });
  }
};
