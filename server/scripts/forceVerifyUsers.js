require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

const EMAILS = ["alumni1@test.com", "student1@test.com"];

const forceVerify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        for (const email of EMAILS) {
            const user = await User.findOneAndUpdate(
                { email },
                { isVerified: true, verificationStatus: "approved" },
                { new: true, runValidators: false }
            ).select("name email role isVerified verificationStatus");

            if (!user) {
                console.log(`⚠️  User not found: ${email}`);
            } else {
                console.log(`✅ User verified: ${user.email} (${user.role})`);
            }
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};

forceVerify();
