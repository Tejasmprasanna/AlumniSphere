import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicOpportunities from "./pages/PublicOpportunities";

// Shared app pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Opportunities from "./pages/Opportunities";
import CreateOpportunity from "./pages/CreateOpportunity";
import Referrals from "./pages/Referrals";
import InterviewExperiences from "./pages/InterviewExperiences";
import Community from "./pages/Community";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import VerifyAlumni from "./pages/VerifyAlumni";
import AdminUsers from "./pages/AdminUsers";
import AdminRoles from "./pages/AdminRoles";
import AdminOpportunities from "./pages/AdminOpportunities";
import AdminReferrals from "./pages/AdminReferrals";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminApplications from "./pages/AdminApplications";

// Shared layout (Sidebar + Navbar) for non-admin users
function AppLayout() {
  return (
    <div className="relative z-10 flex min-h-screen bg-[#020617] text-gray-200">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden bg-[#020617] text-gray-200">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-[#020617]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[150px]"></div>
      <div className="absolute right-[-200px] bottom-[-200px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]"></div>

      <div className="relative z-10">
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public/opportunities" element={<PublicOpportunities />} />

          {/* ── Admin (own layout) ── */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="verify-alumni" element={<VerifyAlumni />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="opportunities" element={<AdminOpportunities />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="applications" element={<AdminApplications />} />
          </Route>

          {/* Legacy redirect: /verify-alumni → /admin/verify-alumni */}
          <Route path="/verify-alumni" element={<Navigate to="/admin/verify-alumni" replace />} />

          {/* ── Student / Alumni (shared layout) ── */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/interviews" element={<InterviewExperiences />} />
            <Route path="/community" element={<Community />} />
            <Route path="/create-opportunity" element={
              <ProtectedRoute allowedRoles={["alumni", "admin"]}>
                <CreateOpportunity />
              </ProtectedRoute>
            } />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </div>
  );
}
