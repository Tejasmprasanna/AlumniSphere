const User = require("../models/User");

const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("ℹ️  Admin already exists — skipping creation.");
            return;
        }

        // Pass the plain-text password — the User model's pre-save
        // hook (bcrypt, salt 10) handles hashing automatically.
        await User.create({
            name: process.env.DEFAULT_ADMIN_NAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: process.env.DEFAULT_ADMIN_PASSWORD,
            role: "admin",
            isVerified: true,
        });

        console.log(`✅ Default admin created: ${process.env.DEFAULT_ADMIN_EMAIL}`);
    } catch (error) {
        console.error(`❌ Failed to create default admin: ${error.message}`);
    }
};

module.exports = createDefaultAdmin;
