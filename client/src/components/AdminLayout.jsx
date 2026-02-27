import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "./AdminNavbar";
import {
    LayoutDashboard, Users, ShieldCheck, KeyRound,
    Briefcase, GitPullRequest, BarChart2, Settings,
    FileText, MessageSquare,
    LogOut, Zap, ChevronLeft, Bell
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
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const sideW = collapsed ? "64px" : "220px";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: sideW, minWidth: sideW, transition: "width 0.25s ease",
                background: "rgba(15,23,42,0.97)",
                borderRight: "1px solid rgba(99,102,241,0.15)",
                display: "flex", flexDirection: "column",
                height: "100vh", position: "sticky", top: 0,
                backdropFilter: "blur(20px)", overflow: "hidden",
            }}>
                {/* Logo row */}
                <div style={{
                    padding: collapsed ? "1.25rem 0" : "1.25rem 1rem",
                    borderBottom: "1px solid rgba(99,102,241,0.12)",
                    display: "flex", alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    gap: "0.5rem",
                }}>
                    {!collapsed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{
                                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                                borderRadius: "0.5rem", padding: "0.35rem", display: "flex", flexShrink: 0,
                            }}>
                                <Zap size={16} color="white" />
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: "800", color: "#f1f5f9", whiteSpace: "nowrap" }}>
                                Admin<span style={{ color: "#6366f1" }}>Panel</span>
                            </span>
                        </div>
                    )}
                    <button onClick={() => setCollapsed(c => !c)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#475569", padding: "0.25rem", borderRadius: "0.375rem",
                        display: "flex", transition: "color 0.15s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                        onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                    >
                        <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "0.625rem 0.5rem", overflowY: "auto" }}>
                    {adminNav.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined}
                                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                                style={{ marginBottom: "0.15rem", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}
                            >
                                <IconComponent size={16} style={{ flexShrink: 0 }} />
                                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Top bar */}
                <AdminNavbar />

                {/* Page content */}
                <main style={{ flex: 1, overflowY: "auto" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
