import { useNavigate } from "react-router-dom";
import { Zap, Users, BookOpen, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

import LandingNavbar from "../components/LandingNavbar";
// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, color, bg, title, desc }) {
    return (
        <div className="glass card-hover" style={{ padding: "1.75rem", flex: "1 1 260px" }}>
            <div style={{
                width: "44px", height: "44px", borderRadius: "0.75rem",
                background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
            }}>
                <Icon size={22} color={color} />
            </div>
            <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#f1f5f9", marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.65 }}>{desc}</p>
        </div>
    );
}

// ─── Step ─────────────────────────────────────────────────────────────────────
function Step({ num, title, desc }) {
    return (
        <div style={{ flex: "1 1 200px", textAlign: "center", padding: "0 1rem" }}>
            <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", fontWeight: "800", fontSize: "1.1rem", color: "white",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            }}>{num}</div>
            <h4 style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "0.4rem", fontSize: "0.95rem" }}>{title}</h4>
            <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6 }}>{desc}</p>
        </div>
    );
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#111827 50%,#0b1120 100%)" }}>
            <LandingNavbar />

            {/* ── Hero ── */}
            <section style={{ position: "relative", overflow: "hidden" }}>
                {/* Glow blobs */}
                <div style={{
                    position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
                    width: "700px", height: "500px",
                    background: "radial-gradient(ellipse,rgba(99,102,241,0.18) 0%,transparent 70%)",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", top: "120px", right: "-100px",
                    width: "400px", height: "400px",
                    background: "radial-gradient(ellipse,rgba(168,85,247,0.1) 0%,transparent 70%)",
                    pointerEvents: "none",
                }} />

                <div style={{
                    maxWidth: "780px", margin: "0 auto", padding: "6rem 1.5rem 5rem",
                    textAlign: "center", position: "relative",
                }}>
                    {/* Badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: "9999px", padding: "0.3rem 0.9rem",
                        fontSize: "0.75rem", fontWeight: "700", color: "#818cf8",
                        marginBottom: "1.75rem", letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>
                        <Zap size={12} />
                        Empowering the Alumni Network
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: "900",
                        color: "#f1f5f9", lineHeight: 1.15, marginBottom: "1.25rem",
                        letterSpacing: "-0.02em",
                    }}>
                        Connect.{" "}
                        <span style={{
                            background: "linear-gradient(90deg,#818cf8,#a78bfa,#c084fc)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>Mentor.</span>
                        <br />Succeed Together.
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        fontSize: "1.05rem", color: "#64748b", lineHeight: 1.7,
                        maxWidth: "540px", margin: "0 auto 2.5rem",
                    }}>
                        AlumniSphere bridges your academic roots with your professional
                        future — connecting students and alumni for mentorship, referrals,
                        and career growth.
                    </p>

                    {/* CTA buttons */}
                    <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => navigate("/register")} style={{
                            background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                            border: "none", cursor: "pointer",
                            color: "white", fontSize: "0.95rem", fontWeight: "700",
                            padding: "0.8rem 1.75rem", borderRadius: "0.625rem",
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 32px rgba(99,102,241,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            Join the Network <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate("/login")} style={{
                            background: "transparent",
                            border: "1px solid rgba(99,102,241,0.4)", cursor: "pointer",
                            color: "#94a3b8", fontSize: "0.95rem", fontWeight: "600",
                            padding: "0.8rem 1.75rem", borderRadius: "0.625rem",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Social proof */}
                    <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                        {["Verified Alumni Network", "Mentorship Programs", "Career Opportunities"].map(t => (
                            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "#475569" }}>
                                <CheckCircle size={13} color="#6366f1" /> {t}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                        Platform Features
                    </p>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: "800", color: "#f1f5f9" }}>
                        Everything you need to grow
                    </h2>
                </div>

                <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                    <FeatureCard
                        icon={Users} color="#6366f1" bg="rgba(99,102,241,0.12)"
                        title="Professional Referrals"
                        desc="Alumni can refer top students directly to their companies. Students get insider access to opportunities that matter."
                    />
                    <FeatureCard
                        icon={BookOpen} color="#a78bfa" bg="rgba(167,139,250,0.12)"
                        title="Direct Mentorship"
                        desc="Connect one-on-one with verified alumni in your domain. Ask questions, get guidance, and accelerate your career."
                    />
                    <FeatureCard
                        icon={TrendingUp} color="#34d399" bg="rgba(52,211,153,0.12)"
                        title="Career Growth"
                        desc="Explore curated job and internship postings, interview experiences, and exclusive alumni insights."
                    />
                </div>
            </section>

            {/* ── How It Works ── */}
            <section style={{
                background: "rgba(99,102,241,0.04)",
                borderTop: "1px solid rgba(99,102,241,0.1)",
                borderBottom: "1px solid rgba(99,102,241,0.1)",
            }}>
                <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem" }}>
                    <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                            How It Works
                        </p>
                        <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: "800", color: "#f1f5f9" }}>
                            Get started in 3 steps
                        </h2>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
                        <Step num="1" title="Create Profile"
                            desc="Sign up as a student or alumnus and fill in your academic and professional details." />
                        <Step num="2" title="Connect & Engage"
                            desc="Request referrals, reach out to mentors, and explore opportunities posted by alumni." />
                        <Step num="3" title="Grow Professionally"
                            desc="Land interviews, gain mentorship, and contribute back to the community." />
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>
                <div className="glass" style={{
                    padding: "3rem 2rem", textAlign: "center",
                    background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(30,41,59,0.7))",
                }}>
                    <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: "800", color: "#f1f5f9", marginBottom: "0.75rem" }}>
                        Ready to join AlumniSphere?
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                        Join thousands of students and alumni already building their futures.
                    </p>
                    <button onClick={() => navigate("/register")} style={{
                        background: "linear-gradient(135deg,#6366f1,#7c3aed)",
                        border: "none", cursor: "pointer",
                        color: "white", fontSize: "0.95rem", fontWeight: "700",
                        padding: "0.8rem 2rem", borderRadius: "0.625rem",
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
                        transition: "all 0.2s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 32px rgba(99,102,241,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        Get Started Free <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{
                borderTop: "1px solid rgba(99,102,241,0.12)",
                background: "rgba(15,23,42,0.95)",
            }}>
                <div style={{
                    maxWidth: "1100px", margin: "0 auto",
                    padding: "2rem 1.5rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "1rem",
                }}>
                    {/* Brand */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                            borderRadius: "0.4rem", padding: "0.3rem", display: "flex",
                        }}>
                            <Zap size={15} color="white" />
                        </div>
                        <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#64748b" }}>
                            Alumni<span style={{ color: "#6366f1" }}>Sphere</span>
                        </span>
                    </div>

                    {/* Links */}
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                        {[
                            { label: "Login", path: "/login" },
                            { label: "Register", path: "/register" }
                        ].map(({ label, path }) => (
                            <button key={path} onClick={() => navigate(path)} style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "0.8rem", color: "#475569", fontWeight: "500",
                                padding: "0.35rem 0.625rem", borderRadius: "0.375rem",
                                transition: "color 0.15s",
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                                onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <p style={{ fontSize: "0.75rem", color: "#334155" }}>
                        © {new Date().getFullYear()} AlumniSphere. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
