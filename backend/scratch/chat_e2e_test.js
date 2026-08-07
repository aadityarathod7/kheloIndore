/**
 * Throwaway E2E test for the chat feature against a LOCAL throwaway database.
 * Creates a test user + coach, then drives the real ChatController handlers
 * with mock req/res objects. Drops the test DB when done.
 *
 * Usage: node scratch/chat_e2e_test.js
 */
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Coach = require("../models/CoachModel");
const Conversation = require("../models/ChatModel");
const Message = require("../models/ChatMessageModel");
const chat = require("../controllers/ChatController");

const DB = "mongodb://127.0.0.1:27017/kheloindore_chat_test";
const JWT_ID = "000000000000000000000001"; // test ObjectIds

function mockRes() {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

function reqFor(userId, role, body = {}, params = {}, query = {}) {
  return {
    user: { userID: userId, role, mobile: null },
    body,
    params,
    query,
  };
}

let passed = 0;
let failed = 0;
function assert(name, cond) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${name}`);
  }
}

async function main() {
  await mongoose.connect(DB);
  await Promise.all([
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    User.deleteMany({}),
    Coach.deleteMany({}),
  ]);

  // Create a test user + coach
  const user = await User.create({
    first_name: "Test",
    last_name: "User",
    mobile: 9999000011,
    email: "chat-user@test.local",
    password: "Test@1234",
    role: "User",
  });
  const coach = await Coach.create({
    first_name: "Coach",
    last_name: "One",
    mobile: 9999000022,
    email: "coach@test.local",
    role: "Coach",
  });

  // 1. Start a conversation (user -> coach)
  console.log("\n[startConversation]");
  const res1 = mockRes();
  await chat.startConversation(
    reqFor(user._id, "User", { peerRole: "Coach", peerRef: coach._id.toString() }),
    res1
  );
  assert("starts conversation", res1.body.success === true && res1.body.conversation);
  const convId = res1.body.conversation._id;
  assert("conversation has 2 participants", res1.body.conversation.participants.length === 2);

  // 2. Start again -> should reuse (find-or-create) not duplicate
  const res2 = mockRes();
  await chat.startConversation(
    reqFor(user._id, "User", { peerRole: "Coach", peerRef: coach._id.toString() }),
    res2
  );
  assert("find-or-create reuses same conversation", String(res2.body.conversation._id) === String(convId));
  const dupCount = await Conversation.countDocuments({});
  assert("no duplicate conversation rows", dupCount === 1);

  // 3. Send messages from both sides
  console.log("\n[sendMessage]");
  const res3 = mockRes();
  await chat.sendMessage(reqFor(user._id, "User", { text: "Hello coach!" }, { id: convId }), res3);
  assert("user message sent", res3.body.success === true && res3.body.message.text === "Hello coach!");

  const res4 = mockRes();
  await chat.sendMessage(
    reqFor(coach._id, "Coach", { text: "Hi there!" }, { id: convId }),
    res4
  );
  assert("coach message sent", res4.body.success === true && res4.body.message.text === "Hi there!");

  // 4. Coach lists conversations -> should see the thread with unread = 1 (his own read=false doesn't count)
  console.log("\n[getConversations as coach]");
  const res5 = mockRes();
  await chat.getConversations(reqFor(coach._id, "Coach"), res5);
  assert("coach sees 1 conversation", res5.body.conversations.length === 1);
  const convForCoach = res5.body.conversations[0];
  assert("peer resolves to user", convForCoach.peer && convForCoach.peer.name === "Test User");

  // 5. Unread count for coach (1 unread: the user's message)
  console.log("\n[getUnreadCount]");
  const res6 = mockRes();
  await chat.getUnreadCount(reqFor(coach._id, "Coach"), res6);
  assert("coach unread count = 1", res6.body.total === 1);

  // 6. Coach marks read
  const res7 = mockRes();
  await chat.markRead(reqFor(coach._id, "Coach", {}, { id: convId }), res7);
  assert("markRead succeeds", res7.body.success === true);

  const res8 = mockRes();
  await chat.getUnreadCount(reqFor(coach._id, "Coach"), res8);
  assert("unread count = 0 after read", res8.body.total === 0);

  // 7. Get messages with isMine flags
  console.log("\n[getMessages]");
  const res9 = mockRes();
  await chat.getMessages(reqFor(coach._id, "Coach", {}, { id: convId }), res9);
  const msgs = res9.body.messages;
  assert("2 messages returned", msgs.length === 2);
  assert(
    "first is from user (not mine for coach)",
    msgs[0].text === "Hello coach!" && msgs[0].isMine === false
  );
  assert(
    "second is mine for coach",
    msgs[1].text === "Hi there!" && msgs[1].isMine === true
  );

  // 8. User lists conversations -> peer is the coach
  console.log("\n[getConversations as user]");
  const res10 = mockRes();
  await chat.getConversations(reqFor(user._id, "User"), res10);
  assert("user sees 1 conversation", res10.body.conversations.length === 1);
  const peer = res10.body.conversations[0].peer;
  assert("peer resolves to coach", peer && peer.name === "Coach One" && peer.type === "coach");

  // 9. Validation: missing peer -> 400
  const res11 = mockRes();
  await chat.startConversation(reqFor(user._id, "User", {}), res11);
  assert("missing peer rejected (400)", res11.statusCode === 400);

  // 10. Authorization: an unrelated user cannot read/send to this conversation
  console.log("\n[authorization]");
  const stranger = await User.create({
    first_name: "Evil",
    last_name: "Stranger",
    mobile: 9999000033,
    email: "evil@test.local",
    password: "Test@1234",
    role: "User",
  });
  const res12 = mockRes();
  await chat.getMessages(reqFor(stranger._id, "User", {}, { id: convId }), res12);
  assert("stranger cannot read messages (403)", res12.statusCode === 403);

  const res13 = mockRes();
  await chat.sendMessage(
    reqFor(stranger._id, "User", { text: "sneaky" }, { id: convId }),
    res13
  );
  assert("stranger cannot send (403)", res13.statusCode === 403);

  const res14 = mockRes();
  await chat.markRead(reqFor(stranger._id, "User", {}, { id: convId }), res14);
  assert("stranger cannot mark read (403)", res14.statusCode === 403);

  const msgCount = await Message.countDocuments({ conversation: convId });
  assert("no message leaked to stranger", msgCount === 2);

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  process.exit(failed ? 1 : 0);
}

main().catch(async (e) => {
  console.error("E2E error:", e);
  try {
    await mongoose.connection.dropDatabase();
  } catch (_) {}
  await mongoose.disconnect();
  process.exit(1);
});
