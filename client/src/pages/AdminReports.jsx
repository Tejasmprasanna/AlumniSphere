import { useEffect, useState } from "react";
import API from "../api/axios";
import { BarChart2, Users, Award, Briefcase, TrendingUp, Clock } from "lucide-react";
import StatsCard from "../components/StatsCard";

export default function AdminReports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await API.get("/admin/stats");
                setStats(res.data.stats);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const verificationRate = stats
        ? Math.round((stats.verifiedAlumni / Math.max(stats.totalAlumni, 1)) * 100)
        : 0;

    const approvalRate = stats
        ? Math.round((stats.approvedReferrals / Math.max(stats.totalReferrals, 1)) * 100)
        : 0;

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <div className="glass" style={{
                padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(30,41,59,0.7))",
            }}>
                <BarChart2 size={20} color="#f59e0b" />
                <div>
                    <h2 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9" }}>Reports & Analytics</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Platform-wide statistics</p>
                </div>
            </div>

            {loading ? (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading statistics...</p>
            ) : stats ? (
                <>
                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                        <StatsCard label="Total Users" value={stats.totalUsers} icon={Users} color="#6366f1" bg="rgba(99,102,241,0.1)" />
                        <StatsCard label="Total Alumni" value={stats.totalAlumni} icon={Award} color="#a78bfa" bg="rgba(167,139,250,0.1)" />
                        <StatsCard label="Verified Alumni" value={stats.verifiedAlumni} icon={Award} color="#10b981" bg="rgba(16,185,129,0.1)" />
                        <StatsCard label="Pending Alumni" value={stats.pendingAlumni} icon={Clock} color="#eab308" bg="rgba(234,179,8,0.1)" />
                        <StatsCard label="Students" value={stats.totalStudents} icon={Users} color="#38bdf8" bg="rgba(56,189,248,0.1)" />
                        <StatsCard label="Opportunities" value={stats.totalOpportunities} icon={Briefcase} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
                        <StatsCard label="Total Referrals" value={stats.totalReferrals} icon={TrendingUp} color="#34d399" bg="rgba(52,211,153,0.1)" />
                        <StatsCard label="Approved Referrals" value={stats.approvedReferrals} icon={TrendingUp} color="#10b981" bg="rgba(16,185,129,0.1)" />
                    </div>

                    {/* Progress bars */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
                        {/* Verification rate */}
                        <div className="glass" style={{ padding: "1.5rem" }}>
                            <p style={{ fontSize: "0.78rem", fontWeight: "700", color: "#94a3b8", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Alumni Verification Rate
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{stats.verifiedAlumni} verified</span>
                                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#10b981" }}>{verificationRate}%</span>
                            </div>
                            <div style={{ height: "8px", borderRadius: "9999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                <div style={{
                                    width: `${verificationRate}%`, height: "100%", borderRadius: "9999px",
                                    background: "linear-gradient(90deg,#10b981,#34d399)", transition: "width 0.6s ease"
                                }} />
                            </div>
                        </div>

                        {/* Referral approval rate */}
                        <div className="glass" style={{ padding: "1.5rem" }}>
                            <p style={{ fontSize: "0.78rem", fontWeight: "700", color: "#94a3b8", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                Referral Approval Rate
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{stats.approvedReferrals} approved</span>
                                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#6366f1" }}>{approvalRate}%</span>
                            </div>
                            <div style={{ height: "8px", borderRadius: "9999px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                <div style={{
                                    width: `${approvalRate}%`, height: "100%", borderRadius: "9999px",
                                    background: "linear-gradient(90deg,#6366f1,#a78bfa)", transition: "width 0.6s ease"
                                }} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#475569" }}>Could not load statistics.</div>
            )}
        </div>
    );
}
