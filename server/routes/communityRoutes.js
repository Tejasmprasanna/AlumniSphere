const express = require("express");
const router = express.Router();
const { getPosts, createPost, toggleLike, addComment, deletePost } = require("../controllers/communityController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

router.get("/", getPosts);
router.post("/", createPost);
router.post("/:id/like", toggleLike);
router.post("/:id/comment", addComment);

// Admin only can delete
router.delete("/:id", protect, deletePost);

module.exports = router;
