const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateProfile, getVerifiedAlumni, getRecommendedAlumni } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /api/users - Admin only
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// GET /api/users/alumni - All authenticated users can see verified alumni list
router.get("/alumni", protect, getVerifiedAlumni);

// GET /api/users/recommended - Student recommendations
router.get("/recommended", protect, getRecommendedAlumni);

// GET /api/users/:id
router.get("/:id", protect, getUserById);

// PUT /api/users/profile - Update own profile
router.put("/profile", protect, updateProfile);

module.exports = router;
