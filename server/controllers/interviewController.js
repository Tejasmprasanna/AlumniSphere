const InterviewExperience = require("../models/InterviewExperience");

// @desc    Post an interview experience (verified alumni only)
// @route   POST /api/interviews
// @access  Private/Alumni
const createInterviewExperience = async (req, res) => {
    try {
        if (!req.user.isVerified) {
            return res.status(403).json({ success: false, message: "Only verified alumni can post interview experiences" });
        }

        const { company, role, difficulty, domain, experience } = req.body;

        const post = await InterviewExperience.create({
            company,
            role,
            difficulty,
            domain,
            experience,
            author: req.user._id,
        });

        res.status(201).json({ success: true, message: "Interview experience posted successfully", post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all interview experiences with filters
// @route   GET /api/interviews
// @access  Private
const getAllInterviewExperiences = async (req, res) => {
    try {
        const { company, difficulty, domain } = req.query;
        const filter = {};
        if (company) filter.company = { $regex: company, $options: "i" };
        if (difficulty) filter.difficulty = difficulty;
        if (domain) filter.domain = { $regex: domain, $options: "i" };

        const posts = await InterviewExperience.find(filter)
            .populate("author", "name email organization department")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: posts.length, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single interview experience
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewExperienceById = async (req, res) => {
    try {
        const post = await InterviewExperience.findById(req.params.id).populate("author", "name email organization department");

        if (!post) {
            return res.status(404).json({ success: false, message: "Interview experience not found" });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an interview experience (owner or admin)
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterviewExperience = async (req, res) => {
    try {
        const post = await InterviewExperience.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Interview experience not found" });
        }

        const isOwner = post.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: "Interview experience deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createInterviewExperience, getAllInterviewExperiences, getInterviewExperienceById, deleteInterviewExperience };
