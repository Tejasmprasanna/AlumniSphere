import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard, Briefcase, Users, MessageSquare,
    BookOpen, User, PlusCircle, ShieldCheck, Zap
} from "lucide-react";

const studentLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/opportunities", icon: Briefcase, label: "Opportunities" },
    { to: "/referrals", icon: MessageSquare, label: "Referrals" },
    { to: "/interviews", icon: BookOpen, label: "Interviews" },
    { to: "/community", icon: MessageSquare, label: "Community" },
    { to: "/profile", icon: User, label: "Profile" },
];

const alumniLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/create-opportunity", icon: PlusCircle, label: "Post Opportunity" },
    { to: "/opportunities", icon: Briefcase, label: "Opportunities" },
    { to: "/referrals", icon: MessageSquare, label: "Referrals" },
    { to: "/interviews", icon: BookOpen, label: "Interviews" },
    { to: "/community", icon: MessageSquare, label: "Community" },
    { to: "/profile", icon: User, label: "Profile" },
];

const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/verify-alumni", icon: ShieldCheck, label: "Verify Alumni" },
    { to: "/opportunities", icon: Briefcase, label: "Opportunities" },
    { to: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
    const { user } = useAuth();

    const links =
        user?.role === "admin" ? adminLinks :
            user?.role === "alumni" ? alumniLinks : studentLinks;

    return (
        <>
            <aside style={{
                width: "230px", minWidth: "230px",
                background: "rgba(15,23,42,0.95)",
                borderRight: "1px solid rgba(99,102,241,0.15)",
                display: "flex", flexDirection: "column",
                height: "100vh", position: "sticky", top: 0,
                backdropFilter: "blur(20px)"
            }}>
                {/* Logo */}
                <div style={{ padding: "1.5rem 1.2rem 1rem", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                            borderRadius: "0.5rem", padding: "0.4rem", display: "flex"
                        }}>
                            <Zap size={18} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: "1rem", fontWeight: "800", color: "#f1f5f9", lineHeight: 1.1 }}>
                                Alumni<span style={{ color: "#6366f1" }}>Sphere</span>
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                {user?.role || "Platform"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "0.75rem 0.75rem", overflowY: "auto" }}>
                    {links.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                            style={{ marginBottom: "0.2rem", display: "flex" }}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

            </aside>
        </>
    );
}
