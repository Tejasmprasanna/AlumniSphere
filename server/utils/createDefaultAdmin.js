const User = require("../models/User");

const createDefaultAdmin = async () => {
    try {
        // 1. Check if ANY admin already exists
        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log("✅ Default super admin already exists. Skipping creation.");
            return;
        }

        // 2. Define super admin details
        // Note: Password hashing is handled automatically by the User schema's pre('save') hook
        // Verification is also set to 'approved' and 'isVerified: true' automatically by the pre('save') hook for admins
        const adminData = {
            name: "Super Admin",
            email: "admin@alumnisphere.com",
            password: "Admin@123", // Will be hashed by bcryptjs in User.js pre-save middleware
            role: "admin"
        };

        // 3. Create the admin user
        const newAdmin = new User(adminData);
        await newAdmin.save();

        console.log("🚀 Default super admin created successfully!");
        console.log(`✉️  Email: ${adminData.email}`);
        console.log("🔑 Password: [Provided securely]");

    } catch (error) {
        // 4. Safely catch errors without crashing the server
        console.error("❌ Failed to create default super admin:");
        console.error(error.message);
    }
};

module.exports = createDefaultAdmin;
