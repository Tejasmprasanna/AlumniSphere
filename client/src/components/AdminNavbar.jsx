import { Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function AdminNavbar() {
    const { user } = useAuth();

    // Only show the badge securely if the user in context is actually an admin
    const isAdmin = user?.role === "admin";

    return (
        <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center justify-between border-b border-cyan-400/20 bg-[#0a0a0f]/90 px-6 backdrop-blur-xl">
            {/* Left Section - Context Badges */}
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/15 px-3 py-1 text-[0.7rem] font-bold tracking-[0.05em] text-cyan-300 uppercase shadow-[0_0_10px_rgba(34,211,238,0.18)]">
                        <Shield size={14} className="icon-glow" />
                        Admin Mode
                    </div>
                )}
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-5">
                {/* Security measure: only render notification bell for admins */}
                {isAdmin && <NotificationDropdown />}

                <div className="h-8 w-px bg-cyan-400/20"></div>

                <ProfileDropdown />
            </div>
        </header>
    );
}
