import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import {
    LayoutDashboard, Users, ShieldCheck, KeyRound,
    Briefcase, GitPullRequest, BarChart2, Settings,
    FileText, MessageSquare,
    Zap, ChevronLeft
} from "lucide-react";

const adminNav = [
    { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Alumni Verification", to: "/admin/verify-alumni", icon: ShieldCheck },
    { label: "Roles", to: "/admin/roles", icon: KeyRound },
    { label: "Opportunities", to: "/admin/opportunities", icon: Briefcase },
    { label: "Referrals", to: "/admin/referrals", icon: GitPullRequest },
    { label: "Applications", to: "/admin/applications", icon: FileText },
    { label: "Reports", to: "/admin/reports", icon: BarChart2 },
    { label: "Settings", to: "/admin/settings", icon: Settings },
    { label: "Community", to: "/community", icon: MessageSquare },
    { label: "Audit Logs", to: "/admin/audit-logs", icon: FileText },
];

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const sideW = collapsed ? "64px" : "220px";

    return (
        <div className="relative z-10 flex min-h-screen bg-[#020617] text-gray-200">

            {/* ── Sidebar ── */}
            <aside style={{ width: sideW, minWidth: sideW, transition: "width 0.25s ease" }} className="sticky top-0 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Logo row */}
                <div style={{ padding: collapsed ? "1.25rem 0" : "1.25rem 1rem" }} className="flex items-center justify-between gap-2 border-b border-cyan-400/15">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-shrink-0 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 p-1.5 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                                <Zap size={16} color="white" />
                            </div>
                            <span className="text-sm font-extrabold whitespace-nowrap text-gray-200">
                                Admin<span className="text-cyan-300">Panel</span>
                            </span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(c => !c)} className="icon-glow flex cursor-pointer rounded-md border-none bg-transparent p-1 transition-colors">
                        <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-2">
                    {adminNav.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined}
                                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                                style={{ marginBottom: "0.15rem", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}
                            >
                                <IconComponent size={16} className="icon-glow" style={{ flexShrink: 0 }} />
                                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

            </aside>

            {/* ── Main area ── */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top bar */}
                <AdminNavbar />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#020617]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
