const mongoose = require("mongoose");

const interviewExperienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: [true, "Difficulty level is required"],
        },
        domain: {
            type: String,
            trim: true,
        },
        experience: {
            type: String,
            required: [true, "Experience details are required"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("InterviewExperience", interviewExperienceSchema);
