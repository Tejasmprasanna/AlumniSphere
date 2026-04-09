const express = require("express");
const router = express.Router();
const {
    verifyAlumni,
    rejectAlumni,
    unverifyAlumni,
    getDashboardStats,
    getUnverifiedAlumni,
    deleteUser,
    getAllUsers,
    updateUserRole,
} = require("../controllers/adminController");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { getAnalytics } = require("../controllers/analyticsController");
const { getNotifications, markNotificationRead, clearNotifications } = require("../controllers/notificationController");
const { getAuditLogs } = require("../controllers/auditController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All admin routes are protected and admin-only
router.use(protect, authorizeRoles("admin"));

// ── Stats & Analytics ──────────────────────────────
router.get("/stats", getDashboardStats);
router.get("/analytics", getAnalytics);

// ── User Management ────────────────────────────────
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

// ── Pending queue ──────────────────────────────────
router.get("/unverified-alumni", getUnverifiedAlumni);

// ── Approve / Reject / Revert ──────────────────────
router.patch("/verify/:id", verifyAlumni);
router.patch("/reject/:id", rejectAlumni);
router.patch("/unverify/:id", unverifyAlumni);

// ── Settings ───────────────────────────────────────
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// ── Notifications ──────────────────────────────────
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);
router.delete("/notifications", clearNotifications);

// ── Audit Logs ─────────────────────────────────────
router.get("/audit-logs", getAuditLogs);

module.exports = router;
