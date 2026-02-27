import { useState, useEffect } from "react";
import API from "../api/axios";
import { ShieldCheck, ShieldX, User, GraduationCap, Building2, CheckCircle, Clock, XCircle } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function VerifyAlumni() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null); // stores "<id>-approve" or "<id>-reject"
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const res = await API.get("/admin/unverified-alumni");
            setAlumni(res.data.alumni);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAlumni(); }, []);

    const handleAction = async (id, action) => {
        const key = `${id}-${action}`;
        setActing(key);
        try {
            const endpoint = action === "approve" ? `/admin/verify/${id}` : `/admin/reject/${id}`;
            await API.patch(endpoint);
            showToast(
                action === "approve" ? "Alumni approved successfully! ✓" : "Alumni rejected.",
                action === "approve" ? "success" : "error"
            );
            fetchAlumni();
        } catch (err) {
            showToast(err.response?.data?.message || "Action failed", "error");
        } finally { setActing(null); }
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Header */}
            <div className="glass" style={{
                padding: "1.5rem 2rem", marginBottom: "1.75rem",
                background: "linear-gradient(135deg,rgba(234,179,8,0.15),rgba(30,41,59,0.7))"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ShieldCheck size={24} color="#eab308" />
                    <div>
                        <h2 style={{ fontWeight: "800", fontSize: "1.2rem", color: "#f1f5f9" }}>Alumni Verification Queue</h2>
                        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {loading ? "Loading..." : `${alumni.length} pending verification${alumni.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading pending alumni...</div>
            ) : alumni.length === 0 ? (
                <div className="glass" style={{ padding: "3rem", textAlign: "center" }}>
                    <CheckCircle size={40} color="#10b981" style={{ margin: "0 auto 1rem" }} />
                    <h3 style={{ fontWeight: "700", color: "#f1f5f9", marginBottom: "0.4rem" }}>All caught up!</h3>
                    <p style={{ color: "#64748b", fontSize: "0.875rem" }}>No alumni pending verification.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
                    {alumni.map(a => (
                        <div key={a._id} className="glass card-hover" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Avatar + name */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "46px", height: "46px", borderRadius: "50%", flexShrink: 0,
                                    background: "linear-gradient(135deg,#a78bfa,#6366f1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.1rem", fontWeight: "800", color: "white"
                                }}>
                                    {a.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: "700", color: "#e2e8f0", fontSize: "0.9rem" }}>{a.name}</p>
                                    <p style={{ fontSize: "0.73rem", color: "#64748b" }}>{a.email}</p>
                                </div>
                                {/* Pending badge */}
                                <span className="badge badge-pending" style={{ marginLeft: "auto", flexShrink: 0 }}>
                                    <Clock size={10} style={{ marginRight: "3px" }} />Pending
                                </span>
                            </div>

                            {/* Details */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                {a.department && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "#94a3b8" }}>
                                        <User size={12} color="#475569" /> {a.department}
                                    </div>
                                )}
                                {a.graduationYear && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "#94a3b8" }}>
                                        <GraduationCap size={12} color="#475569" /> Class of {a.graduationYear}
                                    </div>
                                )}
                                {a.organization && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "#94a3b8" }}>
                                        <Building2 size={12} color="#475569" /> {a.organization}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                    className="btn-success"
                                    onClick={() => handleAction(a._id, "approve")}
                                    disabled={acting !== null}
                                    style={{ flex: 1, justifyContent: "center" }}
                                >
                                    <ShieldCheck size={14} />
                                    {acting === `${a._id}-approve` ? "Approving..." : "Approve"}
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleAction(a._id, "reject")}
                                    disabled={acting !== null}
                                    style={{ flex: 1, justifyContent: "center" }}
                                >
                                    <ShieldX size={14} />
                                    {acting === `${a._id}-reject` ? "Rejecting..." : "Reject"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
