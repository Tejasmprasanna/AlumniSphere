const SystemSettings = require("../models/SystemSettings");
const { logAction } = require("./auditController");

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();

        const allowedFields = [
            "requireStudentApproval", "requireAlumniApproval", "allowRegistration",
            "enableReferrals", "enableJobPosting", "enableInterviews",
            "defaultRole", "autoApproveAlumni", "autoApproveStudents",
            "jwtExpiry", "maxLoginAttempts", "passwordMinLength", "enable2FA",
            "platformName", "supportEmail", "accentColor",
            "maintenanceMode", "maintenanceMessage",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });

        await settings.save();

        await logAction({
            action: "Settings Updated",
            performedBy: req.user._id,
            details: "Updated platform configuration settings"
        });

        res.status(200).json({ success: true, message: "Settings saved successfully", settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getSettings, updateSettings };
