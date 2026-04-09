import { useLocation } from "react-router-dom";
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
    const title = routeTitles[pathname] || "AlumniSphere";

    return (
        <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-cyan-400/20 bg-[#0a0a0f]/80 px-6 backdrop-blur-xl">
            <h1 className="text-base font-bold text-gray-200">{title}</h1>

            <div className="flex items-center gap-4">
                <ProfileDropdown />
            </div>
        </header>
    );
}
