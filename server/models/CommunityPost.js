const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: [true, "Post content is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["career", "internship", "general", "event", "referral"],
            default: "general",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
