const mongoose = require("mongoose");

const communityCommentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommunityPost",
            required: true,
        },
<<<<<<< HEAD
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
=======
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
