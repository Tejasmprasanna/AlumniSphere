const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");

/** One-time shape fix: legacy posts stored author instead of user */
async function migrateCommunityPostAuthorToUser() {
    try {
        await CommunityPost.collection.updateMany(
            { author: { $exists: true }, user: { $exists: false } },
            [{ $set: { user: "$author" } }, { $unset: ["author"] }]
        );
    } catch {
        // ignore if DB does not support pipeline updates or collection missing
    }
}

// @desc    Get all community posts with comments
// @route   GET /api/community
// @access  Public (or authenticated depending on setup - prompt said "shared discussion feed accessible by Students, Alumni, Admin")
exports.getPosts = async (req, res, next) => {
    try {
        await migrateCommunityPostAuthorToUser();

        const posts = await CommunityPost.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .lean();

        // Fetch comments for these posts
        const postIds = posts.map(p => p._id);
        const comments = await CommunityComment.find({ post: { $in: postIds } })
            .populate("user", "name role")
            .sort({ createdAt: 1 })
            .lean();

        // Attach comments to their respective posts
        const postsWithComments = posts.map(post => {
            return {
                ...post,
                comments: comments.filter(c => c.post.toString() === post._id.toString())
            };
        });

        res.status(200).json({ success: true, posts: postsWithComments });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new community post
// @route   POST /api/community
// @access  Private (Logged in users)
exports.createPost = async (req, res, next) => {
    try {
        const { content, category } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Post content cannot be empty" });
        }

        const post = await CommunityPost.create({
            user: req.user._id,
            content: content.trim(),
            category: category || "general"
        });

        const populatedPost = await post.populate("user", "name email role");

        res.status(201).json({ success: true, message: "Post created successfully", post: populatedPost });
    } catch (error) {
        next(error);
    }
};

// @desc    Like or unlike a post
// @route   POST /api/community/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const userIdStr = req.user._id.toString();
        const likeIndex = post.likes.findIndex(id => id.toString() === userIdStr);

        if (likeIndex !== -1) {
            // User already liked, remove like
            post.likes.splice(likeIndex, 1);
        } else {
            // Add new like
            post.likes.push(req.user._id);
        }

        await post.save();

        res.status(200).json({ success: true, message: likeIndex !== -1 ? "Post unliked" : "Post liked", likes: post.likes });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a comment to a post
// @route   POST /api/community/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Comment content cannot be empty" });
        }

        const post = await CommunityPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = await CommunityComment.create({
            post: post._id,
            user: req.user._id,
            content: content.trim()
        });

        const populatedComment = await comment.populate("user", "name role");

        res.status(201).json({ success: true, message: "Comment added successfully", comment: populatedComment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a post (Admin only)
// @route   DELETE /api/community/:id
// @access  Private/Admin
exports.deletePost = async (req, res, next) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Must be admin to delete, enforced by middleware, but check here just in case
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete posts" });
        }

        await CommunityPost.findByIdAndDelete(req.params.id);
        await CommunityComment.deleteMany({ post: req.params.id });

        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
};
