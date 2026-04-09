import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Briefcase, GraduationCap, Zap, Eye, EyeOff } from "lucide-react";

// ─── Defined OUTSIDE Register so its reference never changes ─────────────────
function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.4rem" }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                {Icon && (
                    <Icon size={15} color="#475569" style={{
                        position: "absolute", left: "0.8rem", top: "50%",
                        transform: "translateY(-50%)", zIndex: 1
                    }} />
                )}
                {children}
            </div>
        </div>
    );
}

export default function Register() {
    const [formData, setFormData] = useState({
        role: "student",
        name: "",
        email: "",
        password: "",
        department: "",
        graduationYear: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setRole = (role) => setFormData(prev => ({ ...prev, role }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            const user = await register({
                ...formData,
                graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
            });
            navigate(user.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at bottom right,rgba(168,85,247,0.12) 0%,#0f172a 50%,rgba(99,102,241,0.05) 100%)",
            padding: "2rem 1rem"
        }}>
            <div className="glass fade-in" style={{ width: "100%", maxWidth: "460px", padding: "2.5rem" }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "52px", height: "52px", borderRadius: "0.875rem", margin: "0 auto 1rem",
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Zap size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#f1f5f9" }}>Create Account</h1>
                    <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.4rem" }}>Join AlumniSphere today</p>
                </div>

                {error && (
                    <div style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem",
                        color: "#f87171", fontSize: "0.8rem"
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>

                    {/* Role selector — only updates formData.role, never remounts inputs */}
                    <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.5rem" }}>
                            I am a...
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            {["student", "alumni"].map(r => (
                                <button key={r} type="button" onClick={() => setRole(r)} style={{
                                    padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid",
                                    borderColor: formData.role === r ? "#6366f1" : "rgba(99,102,241,0.2)",
                                    background: formData.role === r ? "rgba(99,102,241,0.15)" : "rgba(15,23,42,0.6)",
                                    color: formData.role === r ? "#818cf8" : "#64748b",
                                    fontWeight: "600", fontSize: "0.8rem", cursor: "pointer",
                                    textTransform: "capitalize", transition: "all 0.2s"
                                }}>
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Field label="Full Name" icon={User}>
                        <input
                            type="text" name="name" required
                            placeholder="Your name"
                            className="input-field" style={{ paddingLeft: "2.25rem" }}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Field>

                    <Field label="Email" icon={Mail}>
                        <input
                            type="email" name="email" required
                            placeholder="you@example.com"
                            className="input-field" style={{ paddingLeft: "2.25rem" }}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Field>

                    <Field label="Password" icon={Lock}>
                        <input
                            type={showPw ? "text" : "password"} name="password" required
                            placeholder="Min 6 characters"
                            className="input-field" style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPw(p => !p)} style={{
                            position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer", color: "#475569"
                        }}>
                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </Field>

                    <Field label="Department" icon={Briefcase}>
                        <input
                            type="text" name="department"
                            placeholder="e.g. Computer Science"
                            className="input-field" style={{ paddingLeft: "2.25rem" }}
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </Field>

                    <Field label="Graduation Year" icon={GraduationCap}>
                        <input
                            type="number" name="graduationYear"
                            placeholder="e.g. 2024"
                            className="input-field" style={{ paddingLeft: "2.25rem" }}
                            value={formData.graduationYear}
                            onChange={handleChange}
                        />
                    </Field>

                    <button type="submit" className="btn-primary" disabled={loading}
                        style={{ justifyContent: "center", marginTop: "0.5rem" }}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#818cf8", fontWeight: "600", textDecoration: "none" }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
