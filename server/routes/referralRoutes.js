const express = require("express");
const router = express.Router();
const {
    createReferralRequest,
    getIncomingReferrals,
    getOutgoingReferrals,
    updateReferralStatus,
    getAllReferrals,
} = require("../controllers/referralController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// POST /api/referrals - Students only
router.post("/", protect, authorizeRoles("student"), createReferralRequest);

// GET /api/referrals/incoming - Alumni only (referrals sent to them)
router.get("/incoming", protect, authorizeRoles("alumni"), getIncomingReferrals);

// GET /api/referrals/outgoing - Students only (referrals they sent)
router.get("/outgoing", protect, authorizeRoles("student"), getOutgoingReferrals);

// PATCH /api/referrals/:id/status - Alumni only
router.patch("/:id/status", protect, authorizeRoles("alumni"), updateReferralStatus);

// GET /api/referrals/all - Admin only
router.get("/all", protect, authorizeRoles("admin"), getAllReferrals);

module.exports = router;
