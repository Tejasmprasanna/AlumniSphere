const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        opportunity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Opportunity",
            required: true,
        },
        resumeLink: {
            type: String,
            required: true,
        },
        coverLetter: {
            type: String,
            required: true,
            minlength: 100,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        portfolioLink: {
            type: String,
            default: "",
        },
        linkedIn: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["submitted", "reviewing", "accepted", "rejected"],
            default: "submitted",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
