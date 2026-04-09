const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role, graduationYear, department } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const assignedRole = role || "student";
        const isAdmin = assignedRole === "admin";

        // Create user — admins are auto-approved; students and alumni start as pending
        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole,
            graduationYear,
            department,
            verificationStatus: isAdmin ? "approved" : "pending",
            isVerified: isAdmin,
        });

        // Notifications
        if (!isAdmin) {
            try {
                const message = `New ${assignedRole} registration: ${name}`;
                const notification = await Notification.create({ type: "newUser", message });
                if (req.app.get("io")) {
                    req.app.get("io").to("admin-room").emit("newUser", notification);
                }
            } catch (err) {
                // handle silently
            }
        }

        res.status(201).json({
            success: true,
            message: isAdmin
                ? "Admin account created successfully."
                : "Registration successful. Your account is pending admin approval.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verificationStatus: user.verificationStatus,
                isVerified: user.isVerified,
                department: user.department,
                graduationYear: user.graduationYear,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        // Normalise email to lowercase before lookup
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare plain-text password against the stored bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Only admins bypass the approval gate
        if (user.role !== "admin" && user.verificationStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Your account is pending admin approval.",
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verificationStatus: user.verificationStatus,
                isVerified: user.isVerified,
                department: user.department,
                graduationYear: user.graduationYear,
                organization: user.organization,
                currentRole: user.currentRole,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, getMe };
