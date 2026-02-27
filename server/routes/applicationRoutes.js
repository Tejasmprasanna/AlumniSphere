const express = require("express");
const router = express.Router();
const {
    createApplication,
    getAdminApplications,
    updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// POST /api/applications - Students only
router.post("/", protect, authorizeRoles("student"), createApplication);

// GET /api/applications - Admins only
router.get("/", protect, authorizeRoles("admin"), getAdminApplications);

// PATCH /api/applications/:id/status - Admins only
router.patch("/:id/status", protect, authorizeRoles("admin"), updateApplicationStatus);

module.exports = router;
