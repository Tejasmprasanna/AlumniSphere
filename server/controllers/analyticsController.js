const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Referral = require("../models/Referral");

// @desc    Get analytics data for admin dashboard
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

        // 1. User Growth (users created per month for the last 12 months)
        const userGrowthRaw = await User.aggregate([
            { $match: { createdAt: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const userGrowth = userGrowthRaw.map(data => ({
            month: `${months[data._id.month - 1]} ${data._id.year.toString().slice(-2)}`,
            users: data.count,
        }));

        // 2. Role Distribution
        const roleDistributionRaw = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
        ]);

        const roleDistribution = roleDistributionRaw.map(data => ({
            name: data._id.charAt(0).toUpperCase() + data._id.slice(1),
            value: data.count,
        }));

        // 3. Opportunity Trends (opportunities created per month for the last 12 months)
        const opportunityTrendsRaw = await Opportunity.aggregate([
            { $match: { createdAt: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const opportunityTrends = opportunityTrendsRaw.map(data => ({
            month: `${months[data._id.month - 1]} ${data._id.year.toString().slice(-2)}`,
            opportunities: data.count,
        }));

        // 4. Referral Activity (referrals per week over last 8 weeks)
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(now.getDate() - 56);

        const referralActivityRaw = await Referral.aggregate([
            { $match: { createdAt: { $gte: eightWeeksAgo } } },
            {
                $group: {
                    _id: { year: { $isoWeekYear: "$createdAt" }, week: { $isoWeek: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
        ]);

        const referralActivity = referralActivityRaw.map(data => ({
            week: `W${data._id.week}`,
            referrals: data.count,
        }));

        res.status(200).json({
            success: true,
            analytics: {
                userGrowth,
                roleDistribution,
                opportunityTrends,
                referralActivity,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAnalytics };
