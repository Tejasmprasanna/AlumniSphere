import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, Search } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const routeTitles = {
    "/dashboard": "Dashboard",
    "/admin": "Admin Dashboard",
    "/opportunities": "Opportunities",
    "/create-opportunity": "Post Opportunity",
    "/referrals": "Referrals",
    "/interviews": "Interview Experiences",
    "/profile": "My Profile",
    "/verify-alumni": "Verify Alumni",
};

export default function Navbar() {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const title = routeTitles[pathname] || "AlumniSphere";

    return (
        <header style={{
            height: "60px",
            background: "rgba(15,23,42,0.8)",
            borderBottom: "1px solid rgba(99,102,241,0.15)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0, zIndex: 50
        }}>
            <h1 style={{ fontSize: "1rem", fontWeight: "700", color: "#f1f5f9" }}>{title}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <ProfileDropdown />
            </div>
        </header>
    );
}
