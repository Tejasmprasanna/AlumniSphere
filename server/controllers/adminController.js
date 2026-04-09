const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Referral = require("../models/Referral");
const Notification = require("../models/Notification");
const { logAction } = require("./auditController");

// @desc    Approve a user account (student or alumni)
// @route   PATCH /api/admin/verify/:id
// @access  Private/Admin
const verifyAlumni = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ success: false, message: "Admin accounts are already approved" });
        }

        user.verificationStatus = "approved";
        user.isVerified = true;
        await user.save();

        try {
            const message = `User '${user.name}' has been approved (${user.role})`;
            const notification = await Notification.create({ type: "userApproved", message });
            if (req.app.get("io")) {
                req.app.get("io").to("admin-room").emit("userApproved", notification);
            }
        } catch (err) { /* handle silently */ }

        const saved = await User.findById(user._id).select("-password");

        await logAction({
            action: "User Approved",
            performedBy: req.user._id,
            targetUser: user._id,
            details: `Approved user '${user.name}' (${user.role})`
        });

        res.status(200).json({
            success: true,
            message: `'${user.name}' has been approved successfully`,
            user: saved,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reject a user account (student or alumni)
// @route   PATCH /api/admin/reject/:id
// @access  Private/Admin
const rejectAlumni = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ success: false, message: "Cannot reject an admin account" });
        }

        user.verificationStatus = "rejected";
        user.isVerified = false;
        await user.save();

        try {
            const message = `User '${user.name}' has been rejected (${user.role})`;
            const notification = await Notification.create({ type: "userRejected", message });
            if (req.app.get("io")) {
                req.app.get("io").to("admin-room").emit("userRejected", notification);
            }
        } catch (err) { /* handle silently */ }

        const saved = await User.findById(user._id).select("-password");

        await logAction({
            action: "User Rejected",
            performedBy: req.user._id,
            targetUser: user._id,
            details: `Rejected user '${user.name}' (${user.role})`
        });

        res.status(200).json({
            success: true,
            message: `'${user.name}' has been rejected`,
            user: saved,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Revert a user account back to pending
// @route   PATCH /api/admin/unverify/:id
// @access  Private/Admin
const unverifyAlumni = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ success: false, message: "Cannot revert an admin account" });
        }

        user.verificationStatus = "pending";
        user.isVerified = false;
        await user.save();

        const saved = await User.findById(user._id).select("-password");
        res.status(200).json({ success: true, message: `'${user.name}' reverted to pending`, user: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalAlumni,
            verifiedAlumni,
            pendingAlumni,
            rejectedAlumni,
            totalStudents,
            pendingStudents,
            totalOpportunities,
            totalReferrals,
            approvedReferrals,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "alumni" }),
            User.countDocuments({ role: "alumni", verificationStatus: "approved" }),
            User.countDocuments({ role: "alumni", verificationStatus: "pending" }),
            User.countDocuments({ role: "alumni", verificationStatus: "rejected" }),
            User.countDocuments({ role: "student" }),
            User.countDocuments({ role: "student", verificationStatus: "pending" }),
            Opportunity.countDocuments(),
            Referral.countDocuments(),
            Referral.countDocuments({ status: "approved" }),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAlumni,
                verifiedAlumni,
                pendingAlumni,
                rejectedAlumni,
                totalStudents,
                pendingStudents,
                totalOpportunities,
                totalReferrals,
                approvedReferrals,
                pendingReferrals: totalReferrals - approvedReferrals,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get ALL pending users awaiting verification (students + alumni, not admins)
// @route   GET /api/admin/unverified-alumni
// @access  Private/Admin
const getUnverifiedAlumni = async (req, res) => {
    try {
        const users = await User.find({
            verificationStatus: "pending",
            role: { $ne: "admin" },
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: users.length, alumni: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ success: false, message: "Cannot delete an admin account" });
        }

        const userName = user.name;
        await user.deleteOne();

        await logAction({
            action: "User Deleted",
            performedBy: req.user._id,
            details: `Deleted user '${userName}'`
        });

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a user's role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["student", "alumni", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const isAdmin = role === "admin";
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                role,
                verificationStatus: isAdmin ? "approved" : "pending",
                isVerified: isAdmin,
            },
            { new: true, runValidators: false }
        ).select("-password");

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await logAction({
            action: "Role Updated",
            performedBy: req.user._id,
            targetUser: user._id,
            details: `Changed role to ${role}`
        });

        res.status(200).json({ success: true, message: "Role updated", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    verifyAlumni,
    rejectAlumni,
    unverifyAlumni,
    getDashboardStats,
    getUnverifiedAlumni,
    deleteUser,
    getAllUsers,
    updateUserRole,
};
