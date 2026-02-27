const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["newUser", "userApproved", "userRejected", "newOpportunity", "newReferral"],
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
