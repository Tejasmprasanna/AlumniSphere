const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "alumni", "admin"],
            default: "student",
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        graduationYear: {
            type: Number,
        },
        department: {
            type: String,
            trim: true,
        },
        currentRole: {
            type: String,
            trim: true,
        },
        organization: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        profilePic: {
            type: String,
            default: "",
        },
        referralRequestsThisWeek: {
            type: Number,
            default: 0,
        },
        lastReferralReset: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Keep isVerified in sync with verificationStatus before every save
userSchema.pre("save", async function (next) {
    // Auto-approve admins on creation or role change
    if ((this.isModified("role") || this.isNew) && this.role === "admin") {
        this.verificationStatus = "approved";
        this.isVerified = true;
    }

    // Sync the boolean with the status string whenever status changes
    if (this.isModified("verificationStatus")) {
        this.isVerified = this.verificationStatus === "approved";
    }

    // Hash password only when it has been changed
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
