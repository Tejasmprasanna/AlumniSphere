import { useEffect, useState } from "react";
import API from "../api/axios";
import { Search, Trash2, ShieldCheck, ShieldOff, Users } from "lucide-react";

const ROLES = ["all", "student", "alumni", "admin"];

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });

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

    const filtered = users.filter(u => {
        const matchRole = role === "all" || u.role === role;
        const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase())
            || u.email?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user permanently?")) return;
        try {
            await API.delete(`/admin/users/${id}`);
            showToast("User deleted.");
            load();
        } catch (err) {
            showToast(err.response?.data?.message || "Delete failed", "error");
        }
    };

    const handleToggleVerify = async (u) => {
        const endpoint = u.verificationStatus === "approved"
            ? `/admin/unverify/${u._id}`
            : `/admin/verify/${u._id}`;
        try {
            await API.patch(endpoint);
            showToast(`User ${u.verificationStatus === "approved" ? "unverified" : "verified"}.`);
            load();
        } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
    };

    const roleBg = { student: "#3b82f6", alumni: "#a78bfa", admin: "#f59e0b", pending: "#64748b" };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Header */}
            <div className="glass" style={{
                padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(30,41,59,0.7))",
            }}>
                <Users size={20} color="#6366f1" />
                <div>
                    <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>User Management</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{users.length} total users</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 200px" }}>
                    <Search size={14} color="#475569" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input className="input-field" style={{ paddingLeft: "2.25rem", fontSize: "0.85rem" }}
                        placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                    {ROLES.map(r => (
                        <button key={r} onClick={() => setRole(r)} style={{
                            padding: "0.4rem 0.9rem", borderRadius: "9999px", border: "1px solid",
                            borderColor: role === r ? "#6366f1" : "rgba(99,102,241,0.2)",
                            background: role === r ? "rgba(99,102,241,0.15)" : "transparent",
                            color: role === r ? "#818cf8" : "#64748b",
                            fontSize: "0.78rem", fontWeight: "600", textTransform: "capitalize", cursor: "pointer",
                        }}>{r}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading users...</p>
            ) : (
                <div className="glass" style={{ overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
                                {["Name", "Email", "Role", "Status", "Actions"].map(h => (
                                    <th key={h} style={{
                                        padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.72rem",
                                        fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#475569", fontSize: "0.875rem" }}>
                                    No users found.</td></tr>
                            ) : filtered.map(u => (
                                <tr key={u._id} style={{ borderBottom: "1px solid rgba(99,102,241,0.06)" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", fontWeight: "600", color: "#e2e8f0" }}>{u.name}</td>
                                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#64748b" }}>{u.email}</td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{
                                            fontSize: "0.7rem", fontWeight: "700", textTransform: "capitalize",
                                            background: `${roleBg[u.role]}22`, color: roleBg[u.role],
                                            padding: "0.2rem 0.6rem", borderRadius: "9999px",
                                        }}>{u.role}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <span style={{
                                            fontSize: "0.7rem", fontWeight: "700", textTransform: "capitalize",
                                            background: u.verificationStatus === "approved" ? "rgba(16,185,129,0.12)" : u.verificationStatus === "rejected" ? "rgba(239,68,68,0.12)" : "rgba(234,179,8,0.12)",
                                            color: u.verificationStatus === "approved" ? "#10b981" : u.verificationStatus === "rejected" ? "#ef4444" : "#eab308",
                                            padding: "0.2rem 0.6rem", borderRadius: "9999px",
                                        }}>{u.verificationStatus || "pending"}</span>
                                    </td>
                                    <td style={{ padding: "0.75rem 1rem" }}>
                                        <div style={{ display: "flex", gap: "0.35rem" }}>
                                            {u.role === "alumni" && (
                                                <button onClick={() => handleToggleVerify(u)} title={u.verificationStatus === "approved" ? "Unverify" : "Verify"}
                                                    style={{
                                                        background: "none", border: "none", cursor: "pointer", padding: "0.25rem",
                                                        color: u.verificationStatus === "approved" ? "#10b981" : "#eab308"
                                                    }}>
                                                    {u.verificationStatus === "approved" ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                                                </button>
                                            )}
                                            {u.role !== "admin" && (
                                                <button onClick={() => handleDelete(u._id)} title="Delete user"
                                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "#ef4444" }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
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
