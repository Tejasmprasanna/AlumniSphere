import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, FileText, Tag, Globe, Briefcase, ShieldAlert } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function CreateOpportunity() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", type: "job", description: "", domain: "" });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/opportunities", form);
            showToast("Opportunity posted successfully! 🎉");
            setTimeout(() => navigate("/opportunities"), 1500);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to post opportunity", "error");
        } finally { setLoading(false); }
    };

    if (user?.verificationStatus !== "approved") {
        const isRejected = user?.verificationStatus === "rejected";
        return (
            <div className="fade-in" style={{ padding: "1.75rem" }}>
                <div className="glass" style={{ padding: "2.5rem", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{isRejected ? "🚫" : "⏳"}</div>
                    <h3 style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "0.5rem" }}>
                        {isRejected ? "Verification Rejected" : "Verification Required"}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        {isRejected
                            ? "Your verification request was rejected. Please contact an admin for assistance."
                            : "Your alumni profile needs to be approved by an admin before you can post opportunities."}
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            <div className="glass" style={{ maxWidth: "600px", padding: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                    <div style={{ background: "rgba(99,102,241,0.15)", borderRadius: "0.5rem", padding: "0.5rem", display: "flex" }}>
                        <PlusCircle size={20} color="#6366f1" />
                    </div>
                    <div>
                        <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>Post an Opportunity</h2>
                        <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Share jobs, internships, mentorship & events with students</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    {/* Title */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Title *</label>
                        <div style={{ position: "relative" }}>
                            <FileText size={15} color="#475569" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
                            <input required className="input-field" style={{ paddingLeft: "2.25rem" }}
                                placeholder="e.g. Frontend Engineer at Google" value={form.title}
                                onChange={e => set("title", e.target.value)} />
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.5rem" }}>Type *</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem" }}>
                            {["job", "internship", "mentorship", "event"].map(t => (
                                <button type="button" key={t} onClick={() => set("type", t)} style={{
                                    padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid",
                                    borderColor: form.type === t ? "#6366f1" : "rgba(99,102,241,0.2)",
                                    background: form.type === t ? "rgba(99,102,241,0.15)" : "rgba(15,23,42,0.6)",
                                    color: form.type === t ? "#818cf8" : "#64748b",
                                    fontWeight: "600", fontSize: "0.75rem", cursor: "pointer", textTransform: "capitalize",
                                    transition: "all 0.2s"
                                }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Domain */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Domain</label>
                        <div style={{ position: "relative" }}>
                            <Globe size={15} color="#475569" style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)" }} />
                            <input className="input-field" style={{ paddingLeft: "2.25rem" }}
                                placeholder="e.g. Web Development, AI/ML, Finance"
                                value={form.domain} onChange={e => set("domain", e.target.value)} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Description *</label>
                        <textarea required rows={5} className="input-field" style={{ resize: "vertical" }}
                            placeholder="Describe the opportunity in detail — responsibilities, requirements, how to connect..."
                            value={form.description} onChange={e => set("description", e.target.value)} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center" }}>
                        <PlusCircle size={16} />
                        {loading ? "Posting..." : "Post Opportunity"}
                    </button>
                </form>
            </div>
        </div>
    );
}
