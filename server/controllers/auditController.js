const AuditLog = require("../models/AuditLog");

// ── Internal Helper ──────────────────────────────────────────────
// Call this from other controllers to log an action
const logAction = async ({ action, performedBy, targetUser = null, details }) => {
    try {
        await AuditLog.create({
            action,
            performedBy,
            targetUser,
            details,
        });
    } catch (error) {
        // Error handled silently
    }
};

// ── Route Handlers ─────────────────────────────────────────────
// @desc    Get audit logs with pagination and filters
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const { action, search } = req.query;
        let query = {};

        // Filter by specific action
        if (action && action !== "All") {
            query.action = action;
        }

        // If search is provided, we need to find the user IDs matching the name
        // because performedBy and targetUser are ObjectIds
        if (search) {
            const User = require("../models/User"); // require here to avoid circular dependencies if any
            const matchingUsers = await User.find({ name: { $regex: search, $options: "i" } }).select("_id");
            const userIds = matchingUsers.map(u => u._id);

            query.$or = [
                { performedBy: { $in: userIds } },
                { targetUser: { $in: userIds } },
                { details: { $regex: search, $options: "i" } }
            ];
        }

        const total = await AuditLog.countDocuments(query);
        const logs = await AuditLog.find(query)
            .populate("performedBy", "name email role")
            .populate("targetUser", "name email role")
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            logs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { logAction, getAuditLogs };
