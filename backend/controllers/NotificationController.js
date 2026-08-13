const Notification = require("../models/NotificationModel");
exports.myNotifications = async (req, res) => { const notifications = await Notification.find({ user_id: req.user.userID }).sort({ createdAt: -1 }).limit(100); res.json({ success: true, notifications, unread: notifications.filter(n => !n.is_read).length }); };
exports.markNotificationsRead = async (req, res) => { await Notification.updateMany({ user_id: req.user.userID, _id: { $in: req.body.ids || [] } }, { is_read: true }); res.json({ success: true }); };
