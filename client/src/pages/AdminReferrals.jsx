import { useEffect, useState } from "react";
import API from "../api/axios";
import { GitPullRequest, CheckCircle, XCircle } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

const statusColor = {
    pending: { bg: "rgba(234,179,8,0.12)", text: "#eab308" },
    approved: { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
    declined: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
};

export default function AdminReferrals() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [acting, setActing] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await API.get("/referrals/all");
            setReferrals(res.data.referrals || []);
        } catch (error) {
            console.error(error.response?.data || error.message);
            showToast("Failed to load referrals", "error");
        }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleAction = async (id, action) => {
        setActing(`${id}-${action}`);
        try {
            await API.patch(`/referrals/${id}`, { status: action });
            showToast(`Referral ${action}.`);
            load();
        } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
        finally { setActing(null); }
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            <div className="glass" style={{
                padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "linear-gradient(135deg,rgba(56,189,248,0.1),rgba(30,41,59,0.7))",
            }}>
                <GitPullRequest size={20} color="#38bdf8" />
                <div>
                    <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>Referrals Management</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{referrals.length} total referrals</p>
                </div>
            </div>

            {loading ? (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading referrals...</p>
            ) : referrals.length === 0 ? (
                <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#475569" }}>No referrals yet.</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {referrals.map(r => {
                        const s = statusColor[r.status] || statusColor.pending;
                        return (
                            <div key={r._id} className="glass" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                        <span style={{ fontWeight: "700", fontSize: "0.875rem", color: "#e2e8f0" }}>
                                            {r.student?.name || "Student"} → {r.alumni?.name || "Alumni"}
                                        </span>
                                        <span style={{
                                            fontSize: "0.68rem", fontWeight: "700", textTransform: "capitalize",
                                            background: s.bg, color: s.text, padding: "0.15rem 0.55rem", borderRadius: "9999px"
                                        }}>
                                            {r.status}
                                        </span>
                                    </div>
                                    {r.message && <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>{r.message}</p>}
                                </div>
                                {r.status === "pending" && (
                                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                                        <button onClick={() => handleAction(r._id, "approved")}
                                            disabled={acting !== null}
                                            style={{
                                                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                                                borderRadius: "0.375rem", padding: "0.4rem 0.75rem", cursor: "pointer",
                                                display: "flex", alignItems: "center", gap: "0.3rem",
                                                fontSize: "0.75rem", fontWeight: "600", color: "#10b981"
                                            }}>
                                            <CheckCircle size={13} /> Approve
                                        </button>
                                        <button onClick={() => handleAction(r._id, "declined")}
                                            disabled={acting !== null}
                                            style={{
                                                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                                                borderRadius: "0.375rem", padding: "0.4rem 0.75rem", cursor: "pointer",
                                                display: "flex", alignItems: "center", gap: "0.3rem",
                                                fontSize: "0.75rem", fontWeight: "600", color: "#ef4444"
                                            }}>
                                            <XCircle size={13} /> Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
