import { useEffect, useState } from "react";
import API from "../api/axios";
import { KeyRound, ChevronDown } from "lucide-react";

const ROLES = ["student", "alumni", "admin"];

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function AdminRoles() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [saving, setSaving] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await API.get("/admin/users");
            setUsers(res.data.users);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleRoleChange = async (userId, newRole) => {
        setSaving(userId);
        try {
            await API.patch(`/admin/users/${userId}/role`, { role: newRole });
            showToast("Role updated successfully.");
            load();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update role", "error");
        } finally { setSaving(null); }
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            <div className="glass" style={{
                padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "linear-gradient(135deg,rgba(167,139,250,0.12),rgba(30,41,59,0.7))",
            }}>
                <KeyRound size={20} color="#a78bfa" />
                <div>
                    <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>Roles Management</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Assign and change user roles</p>
                </div>
            </div>

            {loading ? (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading users...</p>
            ) : (
                <div className="glass" style={{ overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
                                {["Name", "Email", "Current Role", "Change Role"].map(h => (
                                    <th key={h} style={{
                                        padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem",
                                        fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", fontWeight: "600", color: "#e2e8f0" }}>{u.name}</td>
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#64748b" }}>{u.email}</td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{
                                            fontSize: "0.72rem", fontWeight: "700", textTransform: "capitalize",
                                            background: "rgba(99,102,241,0.12)", color: "#818cf8",
                                            padding: "0.2rem 0.65rem", borderRadius: "9999px",
                                        }}>{u.role}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <div style={{ position: "relative", display: "inline-block" }}>
                                            <select
                                                disabled={saving === u._id || u.role === "admin"}
                                                value={u.role}
                                                onChange={e => handleRoleChange(u._id, e.target.value)}
                                                style={{
                                                    background: "rgba(15,23,42,0.8)", border: "1px solid rgba(99,102,241,0.25)",
                                                    color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600",
                                                    padding: "0.35rem 2rem 0.35rem 0.75rem", borderRadius: "0.375rem",
                                                    cursor: u.role === "admin" ? "not-allowed" : "pointer",
                                                    appearance: "none", outline: "none",
                                                    opacity: u.role === "admin" ? 0.5 : 1,
                                                }}
                                            >
                                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <ChevronDown size={12} color="#475569" style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
