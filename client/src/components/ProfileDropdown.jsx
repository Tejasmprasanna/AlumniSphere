import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Settings, FileText, LogOut, ChevronDown } from "lucide-react";
import LogoutConfirmModal from "./LogoutConfirmModal";

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        logout();
        navigate("/login");
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        setShowLogoutModal(true);
    };

    const initial = user?.name?.[0]?.toUpperCase() || "U";

    // Fallback if not logged in
    if (!user) return null;

    return (
        <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.05)",
                    padding: "0.25rem 0.5rem 0.25rem 0.25rem", borderRadius: "2rem",
                    cursor: "pointer", transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(40,53,75,0.6)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(30,41,59,0.5)"}
            >
                <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: "800", color: "white",
                    boxShadow: "0 0 10px rgba(99,102,241,0.3)"
                }}>
                    {initial}
                </div>
                <ChevronDown size={14} color="#94a3b8" style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute", top: "130%", right: 0, width: 220, zIndex: 50,
                    background: "rgba(15,23,42,0.98)", border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.7)", borderRadius: "0.75rem",
                    overflow: "hidden", animation: "slideDown 0.2s ease-out"
                }}>
                    <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(30,41,59,0.5)" }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
                        <p style={{ margin: "0.15rem 0 0.5rem 0", fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                        <span style={{
                            fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase",
                            letterSpacing: "0.05em", padding: "0.2rem 0.5rem", borderRadius: "0.25rem",
                            background: user.role === "admin" ? "rgba(239,68,68,0.15)" :
                                user.role === "alumni" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)",
                            color: user.role === "admin" ? "#f87171" :
                                user.role === "alumni" ? "#c084fc" : "#60a5fa",
                            border: `1px solid ${user.role === "admin" ? "rgba(239,68,68,0.3)" :
                                user.role === "alumni" ? "rgba(168,85,247,0.3)" : "rgba(59,130,246,0.3)"}`,
                            display: "inline-block"
                        }}>
                            {user.role}
                        </span>
                    </div>

                    <div style={{ padding: "0.5rem" }}>
                        <Link
                            to="/profile"
                            style={{ textDecoration: "none" }}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="dropdown-item" style={{
                                padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem",
                                fontSize: "0.85rem", color: "#e2e8f0", borderRadius: "0.375rem", cursor: "pointer", transition: "background 0.15s"
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <User size={16} color="#94a3b8" />
                                <span>View Profile</span>
                            </div>
                        </Link>

                        {user.role === "admin" && (
                            <>
                                <Link
                                    to="/admin/settings"
                                    style={{ textDecoration: "none" }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="dropdown-item" style={{
                                        padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem",
                                        fontSize: "0.85rem", color: "#e2e8f0", borderRadius: "0.375rem", cursor: "pointer", transition: "background 0.15s"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <Settings size={16} color="#94a3b8" />
                                        <span>Admin Settings</span>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/audit-logs"
                                    style={{ textDecoration: "none" }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="dropdown-item" style={{
                                        padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem",
                                        fontSize: "0.85rem", color: "#e2e8f0", borderRadius: "0.375rem", cursor: "pointer", transition: "background 0.15s"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <FileText size={16} color="#94a3b8" />
                                        <span>Audit Logs</span>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>

                    <div style={{ padding: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <div
                            onClick={handleLogoutClick}
                            style={{
                                padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem",
                                fontSize: "0.85rem", color: "#ef4444", borderRadius: "0.375rem", cursor: "pointer", transition: "background 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            <LogOut size={16} />
                            <span style={{ fontWeight: 500 }}>Logout</span>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
}
