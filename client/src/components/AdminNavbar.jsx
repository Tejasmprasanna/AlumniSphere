import { Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function AdminNavbar() {
    const { user } = useAuth();

    // Only show the badge securely if the user in context is actually an admin
    const isAdmin = user?.role === "admin";

    return (
        <header style={{
            height: "64px", background: "rgba(15,23,42,0.95)",
            borderBottom: "1px solid rgba(99,102,241,0.12)",
            backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem", flexShrink: 0,
            position: "sticky", top: 0, zIndex: 40,
        }}>
            {/* Left Section - Context Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {isAdmin && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        fontSize: "0.7rem", fontWeight: "700", color: "#818cf8",
                        background: "rgba(99,102,241,0.1)", padding: "0.3rem 0.8rem",
                        borderRadius: "2rem", border: "1px solid rgba(99,102,241,0.25)",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        boxShadow: "0 0 10px rgba(99,102,241,0.1)"
                    }}>
                        <Shield size={14} />
                        Admin Mode
                    </div>
                )}
            </div>

            {/* Right Section - User Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                {/* Security measure: only render notification bell for admins */}
                {isAdmin && <NotificationDropdown />}

                <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.1)" }}></div>

                <ProfileDropdown />
            </div>
        </header>
    );
}
