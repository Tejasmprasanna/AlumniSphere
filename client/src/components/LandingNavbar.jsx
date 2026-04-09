import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

export default function LandingNavbar() {
    const navigate = useNavigate();
    return (
        <header style={{
            position: "sticky", top: 0, zIndex: 100,
            background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(99,102,241,0.15)",
        }}>
            <div style={{
                maxWidth: "1100px", margin: "0 auto",
                padding: "0 1.5rem", height: "64px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                {/* Logo */}
                <button onClick={() => navigate("/")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                    <div style={{
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                        borderRadius: "0.5rem", padding: "0.35rem", display: "flex",
                    }}>
                        <Zap size={18} color="white" />
                    </div>
                    <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#f1f5f9" }}>
                        Alumni<span style={{ color: "#6366f1" }}>Sphere</span>
                    </span>
                </button>

                {/* Nav links */}
                <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {[
                        { label: "Login", path: "/login" },
                    ].map(({ label, path }) => (
                        <button key={path} onClick={() => navigate(path)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#94a3b8", fontSize: "0.875rem", fontWeight: "600",
                            padding: "0.5rem 0.875rem", borderRadius: "0.5rem",
                            transition: "color 0.15s, background 0.15s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "none"; }}
                        >
                            {label}
                        </button>
                    ))}
                    <button onClick={() => navigate("/register")} style={{
                        marginLeft: "0.25rem",
                        background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                        border: "none", cursor: "pointer",
                        color: "white", fontSize: "0.875rem", fontWeight: "700",
                        padding: "0.5rem 1.1rem", borderRadius: "0.5rem",
                        boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                        transition: "all 0.15s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Register
                    </button>
                </nav>
            </div>
        </header>
    );
}
