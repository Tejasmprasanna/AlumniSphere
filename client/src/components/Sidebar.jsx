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
            <aside className="page-shell sticky top-0 flex h-screen w-[230px] min-w-[230px] flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Logo */}
                <div className="border-b border-cyan-400/15 px-5 py-5">
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 p-2 text-black shadow-[0_0_20px_rgba(34,211,238,0.35)]">
                            <Zap size={18} color="white" />
                        </div>
                        <div>
                            <div className="text-base leading-tight font-extrabold text-gray-200">
                                Alumni<span className="text-cyan-300">Sphere</span>
                            </div>
                            <div className="text-[0.65rem] uppercase tracking-[0.08em] text-gray-400">
                                {user?.role || "Platform"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    {links.map(({ to, icon: IconComponent, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                            style={{ marginBottom: "0.2rem", display: "flex" }}
                        >
                            <IconComponent size={16} className="icon-glow" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

            </aside>
        </>
    );
}
