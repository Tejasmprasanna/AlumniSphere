const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Load environment variables first
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow front-ends
    methods: ["GET", "POST"]
  }
});

// Expose io to controllers
app.set("io", io);

io.on("connection", (socket) => {
  // Admin clients join this room
  socket.on("joinAdmin", () => {
    socket.join("admin-room");
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));
app.use("/api/referrals", require("./routes/referralRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/community", require("./routes/communityRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AlumniSphere API is running 🚀", status: "OK" });
});

const { errorHandler } = require("./middleware/errorHandler");

// Global error handler
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();            // 1. Connect to MongoDB

  // 2. Seed default admin if missing
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      // We use User.create() to ensure Mongoose validation runs.
      // The Mongoose pre('save') hook in User.js will automatically hash the password.
      // However, to satisfy the requirement if the hook was ever removed,
      // we can conditionally hash it, or simply rely on the reliable pre('save').
      // Mongoose pre('save') hashes IF isModified("password").
      await User.create({
        name: "Super Admin",
        email: "admin@alumnisphere.com",
        password: "Admin@123", // Automatically secured via bcryptjs in User pre-save
        role: "admin"
      });
      console.log("🚀 Default super admin created successfully!");
    } else {
      console.log("✅ Default super admin already exists. Skipping creation.");
    }
  } catch (error) {
    console.error("❌ Failed to create default super admin:", error.message);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
