import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Send, CheckCircle, X, Lightbulb } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function Referrals() {
    const { user } = useAuth();
    const isStudent = user?.role === "student";
    const [referrals, setReferrals] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [form, setForm] = useState({ alumniId: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [updating, setUpdating] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isStudent) {
                const [refRes, alumniRes] = await Promise.all([
                    API.get("/referrals/outgoing"),
                    API.get("/users/alumni")
                ]);
                setReferrals(refRes.data.referrals);
                setAlumni(alumniRes.data.alumni);
            } else {
                const res = await API.get("/referrals/incoming");
                setReferrals(res.data.referrals);
            }
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!form.alumniId || !form.message.trim()) { showToast("Please fill all fields", "error"); return; }
        setSubmitting(true);
        try {
            await API.post("/referrals", form);
            showToast("Referral request sent!");
            setForm({ alumniId: "", message: "" });
            fetchData();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to send request", "error");
        } finally { setSubmitting(false); }
    };

    const handleStatus = async (id, status) => {
        setUpdating(id + status);
        try {
            await API.patch(`/referrals/${id}/status`, { status });
            showToast(`Marked as ${status}`);
            fetchData();
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed", "error");
        } finally { setUpdating(null); }
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Student: Send request */}
            {isStudent && (
                <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.75rem", maxWidth: "560px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.25rem" }}>
                        <Send size={18} color="#6366f1" />
                        <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#f1f5f9" }}>Request a Referral</h3>
                    </div>
                    <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                        <div>
                            <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                                Select Alumni
                            </label>
                            <select className="input-field" value={form.alumniId} onChange={e => setForm(f => ({ ...f, alumniId: e.target.value }))}>
                                <option value="">— Choose a verified alumni —</option>
                                {alumni.map(a => (
                                    <option key={a._id} value={a._id}>
                                        {a.name}{a.organization ? ` · ${a.organization}` : ""}{a.currentRole ? ` (${a.currentRole})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>
                                Your Message
                            </label>
                            <textarea rows={3} className="input-field" style={{ resize: "vertical" }}
                                placeholder="Briefly describe why you're reaching out and what you need..."
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>⚡ Limit: 3 requests per week</div>
                        <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: "flex-start" }}>
                            <Send size={14} /> {submitting ? "Sending..." : "Send Request"}
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#f1f5f9", marginBottom: "1rem" }}>
                {isStudent ? "My Referral Requests" : "Incoming Requests"}
            </h3>

            {loading ? (
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading...</div>
            ) : referrals.length === 0 ? (
                <div className="glass" style={{ padding: "2.5rem", textAlign: "center", color: "#64748b" }}>
                    <MessageSquare size={32} color="#334155" style={{ margin: "0 auto 0.75rem" }} />
                    <p>No referral requests yet.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {referrals.map(ref => (
                        <div key={ref._id} className="glass" style={{ padding: "1.25rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                                <div style={{ flex: 1 }}>
                                    {isStudent ? (
                                        <p style={{ fontWeight: "600", color: "#e2e8f0", marginBottom: "0.25rem" }}>
                                            To: {ref.alumni?.name}
                                            {ref.alumni?.organization && <span style={{ color: "#64748b", fontWeight: "400" }}> · {ref.alumni.organization}</span>}
                                        </p>
                                    ) : (
                                        <p style={{ fontWeight: "600", color: "#e2e8f0", marginBottom: "0.25rem" }}>
                                            From: {ref.student?.name}
                                            {ref.student?.department && <span style={{ color: "#64748b", fontWeight: "400" }}> · {ref.student.department}</span>}
                                        </p>
                                    )}
                                    <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.5rem" }}>{ref.message}</p>
                                    <p style={{ fontSize: "0.72rem", color: "#475569" }}>
                                        {new Date(ref.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                                <span className={`badge badge-${ref.status}`}>{ref.status}</span>
                            </div>

                            {/* Alumni action buttons */}
                            {!isStudent && ref.status === "pending" && (
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
                                    <button className="btn-success" onClick={() => handleStatus(ref._id, "approved")}
                                        disabled={updating === ref._id + "approved"}>
                                        <CheckCircle size={13} style={{ display: "inline", marginRight: "4px" }} />
                                        Approve
                                    </button>
                                    <button className="btn-danger" onClick={() => handleStatus(ref._id, "declined")}
                                        disabled={updating === ref._id + "declined"}>
                                        <X size={13} style={{ display: "inline", marginRight: "4px" }} />
                                        Decline
                                    </button>
                                    <button className="btn-outline" onClick={() => handleStatus(ref._id, "guidance")}
                                        disabled={updating === ref._id + "guidance"}>
                                        <Lightbulb size={13} style={{ display: "inline", marginRight: "4px" }} />
                                        Guidance
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
