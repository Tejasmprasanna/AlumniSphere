const Notification = require("../models/Notification");

// @desc    Get top 20 latest notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ success: true, count: notifications.length, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark a notification as read
// @route   PATCH /api/admin/notifications/:id/read
// @access  Private/Admin
const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({ success: true, message: "Marked as read", notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clear all notifications
// @route   DELETE /api/admin/notifications/clear
// @access  Private/Admin
const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getNotifications, markNotificationRead, clearNotifications };
