import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
    Users, Award, GraduationCap, Briefcase, MessageSquare,
    CheckCircle, Clock, TrendingUp, Shield, Database,
<<<<<<< HEAD
    Zap, Server, AlertCircle, BarChart as ChartIcon
=======
    Zap, Server, Activity, AlertCircle, BarChart as ChartIcon
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
} from "lucide-react";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ── tiny helpers ─────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, bg, badge }) {
    return (
        <div className="glass card-hover" style={{ padding: "1.4rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.9rem" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "0.6rem",
                    background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon size={18} color={color} />
                </div>
                {badge !== undefined && (
                    <span style={{
                        fontSize: "0.65rem", fontWeight: 700, padding: "0.18rem 0.55rem",
                        borderRadius: 9999, background: badge > 0 ? "rgba(234,179,8,0.15)" : "rgba(100,116,139,0.15)",
                        color: badge > 0 ? "#eab308" : "#64748b",
                        border: `1px solid ${badge > 0 ? "rgba(234,179,8,0.3)" : "rgba(100,116,139,0.2)"}`,
                    }}>
                        {badge > 0 ? `${badge} pending` : "all clear"}
                    </span>
                )}
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{value ?? "—"}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.35rem" }}>{label}</div>
        </div>
    );
}

function MetricBar({ label, value, max, color }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{label}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color }}>{pct}%</span>
            </div>
            <div style={{ height: 7, borderRadius: 9999, background: "rgba(15,23,42,0.7)", overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 9999,
                    width: `${pct}%`, background: color,
                    transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
                }} />
            </div>
        </div>
    );
}

function HealthBadge({ label, status, detail }) {
    const ok = status === "ok";
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.7rem 0", borderBottom: "1px solid rgba(99,102,241,0.08)",
        }}>
            <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {detail && <span style={{ fontSize: "0.75rem", color: "#475569" }}>{detail}</span>}
                <span style={{
                    fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.55rem",
                    borderRadius: 9999, textTransform: "uppercase",
                    background: ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    color: ok ? "#10b981" : "#ef4444",
                    border: `1px solid ${ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                }}>
                    {ok ? "online" : "error"}
                </span>
            </div>
        </div>
    );
}

/* ── Custom Chart Tooltip ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.2)",
                padding: "0.75rem", borderRadius: "0.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                color: "#f1f5f9", fontSize: "0.8rem"
            }}>
                <p style={{ fontWeight: 600, marginBottom: "0.25rem", color: "#94a3b8" }}>{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: entry.color }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }}></span>
                        {entry.name}: <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ── main component ───────────────────────────────────────────── */
export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [apiMs, setApiMs] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(false);
        const t0 = performance.now();
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                API.get("/admin/stats"),
                API.get("/admin/analytics")
            ]);
            setStats(statsRes.data.stats);
            setAnalytics(analyticsRes.data.analytics);
            setApiMs(Math.round(performance.now() - t0));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const primaryCards = stats ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
        { label: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "#38bdf8", bg: "rgba(56,189,248,0.12)", badge: stats.pendingStudents },
        { label: "Total Alumni", value: stats.totalAlumni, icon: Award, color: "#a78bfa", bg: "rgba(167,139,250,0.12)", badge: stats.pendingAlumni },
        { label: "Verified Alumni", value: stats.verifiedAlumni, icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
        { label: "Pending Approvals", value: (stats.pendingAlumni ?? 0) + (stats.pendingStudents ?? 0), icon: Clock, color: "#eab308", bg: "rgba(234,179,8,0.12)" },
        { label: "Open Opportunities", value: stats.totalOpportunities, icon: Briefcase, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
        { label: "Total Referrals", value: stats.totalReferrals, icon: MessageSquare, color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
        { label: "Approved Referrals", value: stats.approvedReferrals, icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    ] : [];

    const skeletonCard = (
        <div className="glass" style={{
            padding: "1.4rem 1.5rem", height: 110,
            background: "rgba(30,41,59,0.35)",
            animation: "pulse 1.5s ease-in-out infinite",
        }} />
    );

    const PIE_COLORS = ["#38bdf8", "#a78bfa", "#6366f1", "#f59e0b", "#10b981"];

    return (
        <div className="fade-in" style={{ padding: "1.75rem", maxWidth: 1200 }}>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

            {/* ── Hero banner ─────────────────────────────── */}
<<<<<<< HEAD
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(34,211,238,0.15)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_80px_rgba(34,211,238,0.25)]">
                <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] rounded-full bg-teal-500/20 blur-[120px]"></div>
                <div className="absolute right-[-100px] bottom-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-[120px]"></div>

                <div className="relative z-10">
                    <span className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
                        Admin Console
                    </span>
                    <h1 className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">
                        Welcome back, Super 👋
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Here's a summary of the AlumniSphere platform today.
                    </p>
                    {!loading && stats && (
                        <button onClick={load} className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)]">
                            ⚡ Refresh
                        </button>
                    )}
                </div>
=======
            <div className="glass" style={{
                padding: "1.75rem 2rem", marginBottom: "2rem",
                background: "linear-gradient(135deg,rgba(99,102,241,0.22),rgba(168,85,247,0.14),rgba(30,41,59,0.55))",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: -40, right: -40, width: 180, height: 180,
                    background: "radial-gradient(circle,rgba(99,102,241,0.28),transparent)",
                    borderRadius: "50%", pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", bottom: -30, left: "40%", width: 120, height: 120,
                    background: "radial-gradient(circle,rgba(168,85,247,0.18),transparent)",
                    borderRadius: "50%", pointerEvents: "none",
                }} />
                <p style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>
                    Admin Console
                </p>
                <h2 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.3rem" }}>
                    Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Here's a summary of the AlumniSphere platform today.
                </p>
                {!loading && stats && (
                    <button onClick={load} style={{
                        marginTop: "1rem", background: "rgba(99,102,241,0.18)",
                        border: "1px solid rgba(99,102,241,0.35)", borderRadius: "0.5rem",
                        color: "#818cf8", fontSize: "0.78rem", fontWeight: 600,
                        padding: "0.4rem 0.9rem", cursor: "pointer", display: "inline-flex",
                        alignItems: "center", gap: "0.35rem", transition: "all .2s",
                    }}>
                        <Activity size={13} /> Refresh
                    </button>
                )}
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
            </div>

            {/* ── Stats grid ────────────────────────────── */}
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.9rem" }}>
                Platform Statistics
            </h3>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {[...Array(8)].map((_, i) => <div key={i}>{skeletonCard}</div>)}
                </div>
            ) : error ? (
                <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#ef4444", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                    <AlertCircle size={18} /> Failed to load stats — <button onClick={load} style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>retry</button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    {primaryCards.map(c => <StatCard key={c.label} {...c} />)}
                </div>
            )}

            {/* ── Analytics Charts ──────────────────────── */}
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.9rem", marginTop: "1rem" }}>
                Advanced Analytics
            </h3>

            {loading || !analytics ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="glass" style={{ height: 320, animation: "pulse 1.5s ease-in-out infinite" }} />)}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {/* User Growth */}
                    <div className="glass" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                            <TrendingUp size={16} color="#38bdf8" />
                            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>User Growth (Registrations)</h3>
                        </div>
                        <div style={{ height: 260, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.userGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="users" name="New Users" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Role Distribution */}
                    <div className="glass" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                            <Users size={16} color="#a78bfa" />
                            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>Role Distribution</h3>
                        </div>
                        <div style={{ height: 260, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={analytics.roleDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                        {analytics.roleDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend for Pie Chart */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginTop: "-1rem" }}>
                            {analytics.roleDistribution.map((entry, index) => (
                                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#cbd5e1" }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[index % PIE_COLORS.length] }} />
                                    {entry.name} <span style={{ fontWeight: 700 }}>({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Opportunity Trends */}
                    <div className="glass" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                            <Briefcase size={16} color="#f59e0b" />
                            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>Opportunity Posting Trends</h3>
                        </div>
                        <div style={{ height: 260, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.opportunityTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                                    <Bar dataKey="opportunities" name="Opportunities" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Referral Activity */}
                    <div className="glass" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
                            <MessageSquare size={16} color="#10b981" />
                            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>Referral Activity (Last 8 Weeks)</h3>
                        </div>
                        <div style={{ height: 260, width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.referralActivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRef" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="referrals" name="Referral Requests" stroke="#10b981" fillOpacity={1} fill="url(#colorRef)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bottom two-column section ─────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", flexWrap: "wrap", marginTop: "1rem" }}>

                {/* Platform Metrics */}
                <div className="glass" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        <ChartIcon size={16} color="#6366f1" />
                        <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>Platform Metrics</h3>
                    </div>
                    {loading || !stats ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} style={{ height: 40, borderRadius: 6, background: "rgba(30,41,59,0.4)", marginBottom: "0.75rem", animation: "pulse 1.5s ease-in-out infinite" }} />
                        ))
                    ) : (
                        <>
                            <MetricBar label="Alumni Verification Rate"
                                value={stats.verifiedAlumni} max={stats.totalAlumni}
                                color="linear-gradient(90deg,#6366f1,#10b981)" />
                            <MetricBar label="Referral Approval Rate"
                                value={stats.approvedReferrals} max={stats.totalReferrals}
                                color="linear-gradient(90deg,#a78bfa,#c084fc)" />
                            <MetricBar label="Student to Alumni Ratio"
                                value={stats.totalAlumni} max={stats.totalUsers}
                                color="linear-gradient(90deg,#38bdf8,#6366f1)" />
                            <MetricBar label="Pending Resolution Rate"
                                value={(stats.totalAlumni + stats.totalStudents) - ((stats.pendingAlumni ?? 0) + (stats.pendingStudents ?? 0))}
                                max={stats.totalAlumni + stats.totalStudents}
                                color="linear-gradient(90deg,#10b981,#34d399)" />
                        </>
                    )}
                </div>

                {/* System Health */}
                <div className="glass" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        <Shield size={16} color="#10b981" />
                        <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>System Health</h3>
                    </div>
                    <HealthBadge label={<span style={{ display: "flex", alignItems: "center", gap: 6 }}><Database size={13} /> Database</span>} status={error ? "error" : "ok"} detail="MongoDB Atlas" />
                    <HealthBadge label={<span style={{ display: "flex", alignItems: "center", gap: 6 }}><Shield size={13} /> Auth System</span>} status="ok" detail="JWT / bcrypt" />
                    <HealthBadge label={<span style={{ display: "flex", alignItems: "center", gap: 6 }}><Zap size={13} /> API Response</span>} status="ok" detail={apiMs ? `${apiMs} ms` : "—"} />
                    <HealthBadge label={<span style={{ display: "flex", alignItems: "center", gap: 6 }}><Server size={13} /> Server</span>} status="ok" detail="Node / Express" />
                    <div style={{ marginTop: "1rem", padding: "0.65rem 0.875rem", borderRadius: "0.5rem", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", fontSize: "0.75rem", color: "#64748b" }}>
                        All systems operational · Last checked just now
                    </div>
                </div>
            </div>
        </div>
    );
}

