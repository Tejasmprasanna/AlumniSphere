const Opportunity = require("../models/Opportunity");
const Notification = require("../models/Notification");
const { logAction } = require("./auditController");

// @desc    Create an opportunity (verified alumni only)
// @route   POST /api/opportunities
// @access  Private/Alumni
const createOpportunity = async (req, res) => {
    try {
        // Only approved alumni can post opportunities
        if (req.user.verificationStatus !== "approved") {
            return res.status(403).json({ success: false, message: "Only approved alumni can post opportunities" });
        }

        const { title, type, description, domain } = req.body;

        const opportunity = await Opportunity.create({
            title,
            type,
            description,
            domain,
            postedBy: req.user._id,
        });

        try {
            const message = `New opportunity posted: ${title}`;
            const notification = await Notification.create({ type: "newOpportunity", message });
            if (req.app.get("io")) {
                req.app.get("io").to("admin-room").emit("newOpportunity", notification);
            }
        } catch (err) { /* handle silently */ }

        res.status(201).json({ success: true, message: "Opportunity posted successfully", opportunity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all opportunities with optional filters
// @route   GET /api/opportunities
// @access  Private
const getAllOpportunities = async (req, res) => {
    try {
        const { type, domain } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (domain) filter.domain = { $regex: domain, $options: "i" };

        const opportunities = await Opportunity.find(filter)
            .populate("postedBy", "name email organization department")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: opportunities.length, opportunities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id)
            .populate("postedBy", "name email organization department")
            .populate("applicants", "name email department");

        if (!opportunity) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        res.status(200).json({ success: true, opportunity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Apply to an opportunity (students only)
// @route   POST /api/opportunities/:id/apply
// @access  Private/Student
const applyToOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        // Prevent duplicate applications
        if (opportunity.applicants.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: "You have already applied to this opportunity" });
        }

        opportunity.applicants.push(req.user._id);
        await opportunity.save();

        res.status(200).json({ success: true, message: "Applied successfully", opportunity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an opportunity (owner or admin)
// @route   DELETE /api/opportunities/:id
// @access  Private/Alumni
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        const isOwner = opportunity.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this opportunity" });
        }

        const opportunityTitle = opportunity.title;
        await opportunity.deleteOne();

        if (req.user.role === "admin") {
            await logAction({
                action: "Opportunity Deleted",
                performedBy: req.user._id,
                details: `Deleted opportunity '${opportunityTitle}'`
            });
        }

        res.status(200).json({ success: true, message: "Opportunity deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createOpportunity, getAllOpportunities, getOpportunityById, applyToOpportunity, deleteOpportunity };
