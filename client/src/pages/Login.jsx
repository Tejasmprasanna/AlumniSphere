import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Zap, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at top left,rgba(99,102,241,0.15) 0%,#0f172a 50%,rgba(99,102,241,0.05) 100%)",
            padding: "1rem"
        }}>
            {/* Background blobs */}
            <div style={{
                position: "fixed", top: "-100px", left: "-100px", width: "400px", height: "400px",
                background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", bottom: "-100px", right: "-100px", width: "400px", height: "400px",
                background: "radial-gradient(circle,rgba(168,85,247,0.08) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none"
            }} />

            <div className="glass fade-in" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "52px", height: "52px", borderRadius: "0.875rem", margin: "0 auto 1rem",
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Zap size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#f1f5f9" }}>
                        Alumni<span style={{ color: "#6366f1" }}>Sphere</span>
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.4rem" }}>Welcome back — sign in to continue</p>
                </div>

                {error && (
                    <div style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem",
                        color: "#f87171", fontSize: "0.8rem"
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.4rem" }}>Email</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={15} color="#475569" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
                            <input type="email" required placeholder="you@example.com"
                                className="input-field" style={{ paddingLeft: "2.25rem" }}
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.4rem" }}>Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={15} color="#475569" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
                            <input type={showPw ? "text" : "password"} required placeholder="••••••••"
                                className="input-field" style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{
                                position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer", color: "#475569"
                            }}>
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: "0.5rem" }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#818cf8", fontWeight: "600", textDecoration: "none" }}>Create account</Link>
                </p>
            </div>
        </div>
    );
}
