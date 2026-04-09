const mongoose = require("mongoose");

const communityCommentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommunityPost",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Keep legacy field optional so older records remain readable.
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        content: {
            type: String,
            required: [true, "Comment content is required"],
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CommunityComment", communityCommentSchema);
