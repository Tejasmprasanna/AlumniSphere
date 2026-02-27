const Referral = require("../models/Referral");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Create a referral request (student only)
// @route   POST /api/referrals
// @access  Private/Student
const createReferralRequest = async (req, res) => {
    try {
        const { alumniId, message } = req.body;

        // Check target alumni exists and is verified
        const alumni = await User.findById(alumniId);
        if (!alumni || alumni.role !== "alumni" || !alumni.isVerified) {
            return res.status(404).json({ success: false, message: "Verified alumni not found" });
        }

        const student = await User.findById(req.user._id);

        // Weekly limit logic: reset if 7 days passed
        const now = new Date();
        const lastReset = new Date(student.lastReferralReset);
        const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);

        if (daysSinceReset >= 7) {
            student.referralRequestsThisWeek = 0;
            student.lastReferralReset = now;
        }

        if (student.referralRequestsThisWeek >= 3) {
            return res.status(429).json({
                success: false,
                message: "You have reached the weekly limit of 3 referral requests. Please try again next week.",
            });
        }

        // Create referral
        const referral = await Referral.create({
            student: req.user._id,
            alumni: alumniId,
            message,
        });

        // Increment counter and save
        student.referralRequestsThisWeek += 1;
        await student.save();

        try {
            const msg = `New referral request from ${student.name} to ${alumni.name}`;
            const notification = await Notification.create({ type: "newReferral", message: msg });
            if (req.app.get("io")) {
                req.app.get("io").to("admin-room").emit("newReferral", notification);
            }
        } catch (err) { /* Notification Error handled silently */ }

        res.status(201).json({ success: true, message: "Referral request sent successfully", referral });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all referrals for logged-in alumni
// @route   GET /api/referrals/incoming
// @access  Private/Alumni
const getIncomingReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ alumni: req.user._id })
            .populate("student", "name email department graduationYear")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: referrals.length, referrals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all referrals sent by logged-in student
// @route   GET /api/referrals/outgoing
// @access  Private/Student
const getOutgoingReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ student: req.user._id })
            .populate("alumni", "name email organization currentRole")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: referrals.length, referrals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update referral status (alumni only)
// @route   PATCH /api/referrals/:id/status
// @access  Private/Alumni
const updateReferralStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["approved", "declined", "guidance"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const referral = await Referral.findById(req.params.id);

        if (!referral) {
            return res.status(404).json({ success: false, message: "Referral not found" });
        }

        // Ensure the logged-in alumni owns this referral
        if (referral.alumni.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this referral" });
        }

        referral.status = status;
        await referral.save();

        res.status(200).json({ success: true, message: `Referral marked as '${status}'`, referral });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all platform referrals (admin only)
// @route   GET /api/referrals/all
// @access  Private/Admin
const getAllReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find()
            .populate("student", "name email department")
            .populate("alumni", "name email organization")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: referrals.length, referrals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createReferralRequest, getIncomingReferrals, getOutgoingReferrals, updateReferralStatus, getAllReferrals };
