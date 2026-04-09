const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");

// @desc    Get all community posts with comments
// @route   GET /api/community
// @access  Public (or authenticated depending on setup - prompt said "shared discussion feed accessible by Students, Alumni, Admin")
exports.getPosts = async (req, res, next) => {
    try {
        const posts = await CommunityPost.find()
            .populate("author", "name email role")
            .sort({ createdAt: -1 })
            .lean();

        // Fetch comments for these posts
        const postIds = posts.map(p => p._id);
        const comments = await CommunityComment.find({ post: { $in: postIds } })
<<<<<<< HEAD
            .populate("user", "name email role profilePhoto")
            .populate("author", "name email role profilePhoto")
=======
            .populate("author", "name email role")
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
            author: req.user._id,
            content: content.trim(),
            category: category || "general"
        });

        const populatedPost = await post.populate("author", "name email role");

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
<<<<<<< HEAD
            user: req.user.id,
            content: content.trim()
        });

        const populatedComment = await comment.populate("user", "name email role profilePhoto");
=======
            author: req.user._id,
            content: content.trim()
        });

        const populatedComment = await comment.populate("author", "name email role");
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1

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
