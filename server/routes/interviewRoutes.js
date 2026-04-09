const express = require("express");
const router = express.Router();
const {
    createInterviewExperience,
    getAllInterviewExperiences,
    getInterviewExperienceById,
    deleteInterviewExperience,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /api/interviews - All authenticated users (supports ?company= &difficulty= &domain=)
router.get("/", protect, getAllInterviewExperiences);

// GET /api/interviews/:id
router.get("/:id", protect, getInterviewExperienceById);

// POST /api/interviews - Alumni only (isVerified checked in controller)
router.post("/", protect, authorizeRoles("alumni", "admin"), createInterviewExperience);

// DELETE /api/interviews/:id - Alumni/Admin (ownership checked in controller)
router.delete("/:id", protect, authorizeRoles("alumni", "admin"), deleteInterviewExperience);

module.exports = router;
