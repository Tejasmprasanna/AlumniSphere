<<<<<<< HEAD
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
=======
import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
import AdminNavbar from "./AdminNavbar";
import {
    LayoutDashboard, Users, ShieldCheck, KeyRound,
    Briefcase, GitPullRequest, BarChart2, Settings,
    FileText, MessageSquare,
<<<<<<< HEAD
    Zap, ChevronLeft
=======
    LogOut, Zap, ChevronLeft, Bell
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
<<<<<<< HEAD
=======
    const { user } = useAuth();
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
    const [collapsed, setCollapsed] = useState(false);

    const sideW = collapsed ? "64px" : "220px";

    return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                        <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                </div>

                {/* Nav */}
<<<<<<< HEAD
                <nav className="flex-1 overflow-y-auto p-2">
=======
                <nav style={{ flex: 1, padding: "0.625rem 0.5rem", overflowY: "auto" }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    {adminNav.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : undefined}
                                className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                                style={{ marginBottom: "0.15rem", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}
                            >
<<<<<<< HEAD
                                <IconComponent size={16} className="icon-glow" style={{ flexShrink: 0 }} />
=======
                                <IconComponent size={16} style={{ flexShrink: 0 }} />
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

            </aside>

            {/* ── Main area ── */}
<<<<<<< HEAD
            <div className="flex min-w-0 flex-1 flex-col">
=======
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                {/* Top bar */}
                <AdminNavbar />

                {/* Page content */}
<<<<<<< HEAD
                <main className="flex-1 overflow-y-auto bg-[#020617]">
=======
                <main style={{ flex: 1, overflowY: "auto" }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
