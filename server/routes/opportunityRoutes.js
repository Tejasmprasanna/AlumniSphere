const express = require("express");
const router = express.Router();
const {
    createOpportunity,
    getAllOpportunities,
    getOpportunityById,
    applyToOpportunity,
    deleteOpportunity,
} = require("../controllers/opportunityController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// GET /api/opportunities/public - All public users
router.get("/public", getAllOpportunities);

// GET /api/opportunities - All authenticated users
router.get("/", protect, getAllOpportunities);

// GET /api/opportunities/:id
router.get("/:id", protect, getOpportunityById);

// POST /api/opportunities - Alumni only (isVerified checked in controller)
router.post("/", protect, authorizeRoles("alumni", "admin"), createOpportunity);

// POST /api/opportunities/:id/apply - Students only
router.post("/:id/apply", protect, authorizeRoles("student"), applyToOpportunity);

// DELETE /api/opportunities/:id - Alumni/Admin (ownership checked in controller)
router.delete("/:id", protect, authorizeRoles("alumni", "admin"), deleteOpportunity);

module.exports = router;
