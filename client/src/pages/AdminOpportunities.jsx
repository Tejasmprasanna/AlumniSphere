import { useEffect, useState } from "react";
import API from "../api/axios";
import { Briefcase, Trash2, Search } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function AdminOpportunities() {
    const [opps, setOpps] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await API.get("/opportunities");
            setOpps(res.data.opportunities || []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this opportunity?")) return;
        try {
            await API.delete(`/opportunities/${id}`);
            showToast("Opportunity deleted.");
            load();
        } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
    };

    const typeColor = { job: "#6366f1", internship: "#10b981", mentorship: "#a78bfa", event: "#f59e0b" };

    const filtered = opps.filter(o =>
        !search || o.title?.toLowerCase().includes(search.toLowerCase())
        || o.postedBy?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            <div className="glass" style={{
                padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(30,41,59,0.7))",
            }}>
                <Briefcase size={20} color="#10b981" />
                <div>
                    <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>Opportunities Management</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{opps.length} total posts</p>
                </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1.25rem", maxWidth: "360px" }}>
                <Search size={14} color="#475569" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                <input className="input-field" style={{ paddingLeft: "2.25rem", fontSize: "0.85rem" }}
                    placeholder="Search by title or poster..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading opportunities...</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {filtered.length === 0 ? (
                        <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#475569" }}>No opportunities found.</div>
                    ) : filtered.map(o => (
                        <div key={o._id} className="glass" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem" }}>
                                    <span style={{ fontWeight: "700", fontSize: "0.875rem", color: "#e2e8f0" }}>{o.title}</span>
                                    <span style={{
                                        fontSize: "0.68rem", fontWeight: "700", textTransform: "capitalize",
                                        background: `${typeColor[o.type] || "#6366f1"}20`, color: typeColor[o.type] || "#6366f1",
                                        padding: "0.15rem 0.55rem", borderRadius: "9999px",
                                    }}>{o.type}</span>
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                    By {o.postedBy?.name} · {o.applicants?.length || 0} applicants · {o.domain || "—"}
                                </p>
                            </div>
                            <button onClick={() => handleDelete(o._id)}
                                style={{
                                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                                    borderRadius: "0.375rem", padding: "0.4rem 0.75rem",
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem",
                                    fontSize: "0.75rem", fontWeight: "600", color: "#ef4444"
                                }}>
                                <Trash2 size={13} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
