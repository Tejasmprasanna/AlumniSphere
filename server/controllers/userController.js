const User = require("../models/User");

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { name, department, graduationYear, currentRole, organization, industry, bio, profilePic } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, department, graduationYear, currentRole, organization, industry, bio, profilePic },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all verified alumni
// @route   GET /api/users/alumni
// @access  Private
const getVerifiedAlumni = async (req, res) => {
    try {
        const alumni = await User.find({ role: "alumni", isVerified: true }).select("-password");
        res.status(200).json({ success: true, count: alumni.length, alumni });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllUsers, getUserById, updateProfile, getVerifiedAlumni };
