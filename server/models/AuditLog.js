const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: [
                "User Approved",
                "User Rejected",
                "User Deleted",
                "Role Updated",
                "Settings Updated",
                "Opportunity Deleted",
            ],
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        details: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// We index createdAt for sorting descending efficiently (paginated latest first)
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
