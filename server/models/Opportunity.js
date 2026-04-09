const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["job", "internship", "mentorship", "event"],
            required: [true, "Opportunity type is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        domain: {
            type: String,
            trim: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
