const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "declined", "guidance"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Referral", referralSchema);
