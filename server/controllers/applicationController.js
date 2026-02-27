const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const Notification = require("../models/Notification");

// @desc    Submit an application for an opportunity
// @route   POST /api/applications
// @access  Private/Student
const createApplication = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({ success: false, message: "Only students can apply" });
        }

        const { opportunityId, resumeLink, coverLetter, phoneNumber, portfolioLink, linkedIn, github } = req.body;

        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        // Prevent duplicate applications
        const existingApplication = await Application.findOne({ student: req.user._id, opportunity: opportunityId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "Already applied" });
        }

        const application = await Application.create({
            student: req.user._id,
            opportunity: opportunityId,
            resumeLink,
            coverLetter,
            phoneNumber,
            portfolioLink,
            linkedIn,
            github,
        });

        // Add student ID to Opportunity.applicants to preserve existing front-end counting
        if (!opportunity.applicants.includes(req.user._id)) {
            opportunity.applicants.push(req.user._id);
            await opportunity.save();
        }

        // Send a notification if socket io is attached
        try {
            const message = `New application submitted by ${req.user.name} for ${opportunity.title}`;
            // Since this could be an alumni opportunity, we emit it to the admin room or a global room.
            // Following current pattern: create Notification and emit "newApplication".
            const notification = await Notification.create({ type: "newApplication", message });
            if (req.app.get("io")) {
                req.app.get("io").to("admin-room").emit("newApplication", notification);
            }
        } catch (err) {
            // handle silently
        }

        res.status(201).json({ success: true, message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get applications (Admin view)
// @route   GET /api/applications
// @access  Private/Admin
const getAdminApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("student", "name email department")
            .populate("opportunity", "title type")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["submitted", "reviewing", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ success: true, message: "Application status updated", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createApplication, getAdminApplications, updateApplicationStatus };
