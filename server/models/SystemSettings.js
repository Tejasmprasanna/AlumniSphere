const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
    {
        // Platform Settings
        requireStudentApproval: { type: Boolean, default: true },
        requireAlumniApproval: { type: Boolean, default: true },
        allowRegistration: { type: Boolean, default: true },
        enableReferrals: { type: Boolean, default: true },
        enableJobPosting: { type: Boolean, default: true },
        enableInterviews: { type: Boolean, default: true },

        // User Management
        defaultRole: { type: String, enum: ["student", "alumni"], default: "student" },
        autoApproveAlumni: { type: Boolean, default: false },
        autoApproveStudents: { type: Boolean, default: false },

        // Security
        jwtExpiry: { type: String, default: "7d" },
        maxLoginAttempts: { type: Number, default: 5 },
        passwordMinLength: { type: Number, default: 6 },
        enable2FA: { type: Boolean, default: false },

        // Branding
        platformName: { type: String, default: "AlumniSphere" },
        supportEmail: { type: String, default: "support@alumnisphere.com" },
        accentColor: { type: String, default: "#6366f1" },

        // Maintenance
        maintenanceMode: { type: Boolean, default: false },
        maintenanceMessage: { type: String, default: "We are performing scheduled maintenance. We'll be back shortly." },
    },
    { timestamps: true }
);

// Singleton pattern – only one settings document ever exists
systemSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
