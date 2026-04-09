import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { User, Briefcase, Building2, Globe, BookOpen, Save, CheckCircle } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function Profile() {
    const { user, login } = useAuth();
    const [form, setForm] = useState({
        name: "", department: "", graduationYear: "",
        currentRole: "", organization: "", industry: "", bio: ""
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                department: user.department || "",
                graduationYear: user.graduationYear || "",
                currentRole: user.currentRole || "",
                organization: user.organization || "",
                industry: user.industry || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put("/users/profile", { ...form, graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined });
            showToast("Profile updated successfully!");
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed", "error");
        } finally { setLoading(false); }
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const F = ({ label, value, onChange, type = "text", placeholder, icon: Icon, textarea }) => (
        <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.4rem" }}>{label}</label>
            <div style={{ position: "relative" }}>
                {Icon && <Icon size={15} color="#475569" style={{
                    position: "absolute", left: "0.8rem", top: textarea ? "0.75rem" : "50%",
                    transform: textarea ? "none" : "translateY(-50%)"
                }} />}
                {textarea ? (
                    <textarea rows={3} placeholder={placeholder} className="input-field" style={{ paddingLeft: "2.25rem", resize: "vertical" }}
                        value={value} onChange={e => onChange(e.target.value)} />
                ) : (
                    <input type={type} placeholder={placeholder} className="input-field" style={{ paddingLeft: "2.25rem" }}
                        value={value} onChange={e => onChange(e.target.value)} />
                )}
            </div>
        </div>
    );

    return (
<<<<<<< HEAD
        <div className="fade-in min-h-screen bg-[#020617] p-6 text-gray-200">
            <Toast msg={toast.msg} type={toast.type} />
            <div className="mx-auto max-w-[700px]">
=======
        <div className="fade-in" style={{ padding: "1.75rem", maxWidth: "700px" }}>
            <Toast msg={toast.msg} type={toast.type} />
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1

            {/* Profile header */}
            <div className="glass" style={{ padding: "1.75rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{
                    width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", fontWeight: "800", color: "white"
                }}>
                    {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
<<<<<<< HEAD
                    <h2 className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-5xl font-bold text-transparent">{user?.name}</h2>
=======
                    <h2 style={{ fontWeight: "800", fontSize: "1.2rem", color: "#f1f5f9" }}>{user?.name}</h2>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.4rem" }}>{user?.email}</p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span className={`badge ${user?.role === "alumni" ? "badge-mentorship" : "badge-job"}`} style={{ textTransform: "capitalize" }}>
                            {user?.role}
                        </span>
                        {user?.isVerified && <span className="badge badge-approved">Verified ✓</span>}
                    </div>
                </div>
            </div>

            {/* Edit form */}
            <div className="glass" style={{ padding: "1.75rem" }}>
                <h3 className="section-title" style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>Edit Profile</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <F label="Full Name" icon={User} value={form.name} onChange={v => set("name", v)} placeholder="Your name" />
                        <F label="Department" icon={BookOpen} value={form.department} onChange={v => set("department", v)} placeholder="e.g. Computer Science" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <F label="Graduation Year" type="number" icon={BookOpen} value={form.graduationYear} onChange={v => set("graduationYear", v)} placeholder="e.g. 2024" />
                        <F label="Industry" icon={Globe} value={form.industry} onChange={v => set("industry", v)} placeholder="e.g. Technology" />
                    </div>
                    {user?.role === "alumni" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <F label="Current Role" icon={Briefcase} value={form.currentRole} onChange={v => set("currentRole", v)} placeholder="e.g. Senior Engineer" />
                            <F label="Organization" icon={Building2} value={form.organization} onChange={v => set("organization", v)} placeholder="e.g. Google" />
                        </div>
                    )}
                    <F label="Bio" icon={User} textarea value={form.bio} onChange={v => set("bio", v)} placeholder="Tell us about yourself..." />

                    <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", gap: "0.5rem" }}>
                        <Save size={15} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
<<<<<<< HEAD
            </div>
=======
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
        </div>
    );
}
