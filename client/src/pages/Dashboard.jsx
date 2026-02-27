import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";
import API from "../api/axios";
import {
    Users, Award, Briefcase, MessageSquare,
    TrendingUp, Star, Clock, XCircle, CheckCircle
} from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [oppRes] = await Promise.all([
                    API.get("/opportunities"),
                ]);
                setOpportunities(oppRes.data.opportunities.slice(0, 3));
                // Fetch admin stats if admin
                if (user?.role === "admin") {
                    const statsRes = await API.get("/admin/stats");
                    setStats(statsRes.data.stats);
                }
            } catch (e) { /* ignore */ }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const timeOfDay = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            {/* Welcome banner */}
            <div className="glass" style={{
                padding: "1.75rem 2rem", marginBottom: "1.75rem",
                background: "linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(30,41,59,0.7) 100%)",
                position: "relative", overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px",
                    background: "radial-gradient(circle,rgba(99,102,241,0.3),transparent)", borderRadius: "50%"
                }} />
                <p style={{ fontSize: "0.875rem", color: "#818cf8", fontWeight: "500", marginBottom: "0.3rem" }}>
                    {timeOfDay()}, 👋
                </p>
                <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#f1f5f9", marginBottom: "0.5rem" }}>
                    {user?.name}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    {user?.role === "student" && "Explore opportunities and connect with mentors"}
                    {user?.role === "alumni" && `${user?.organization ? user.organization + " · " : ""}Share your experiences and guide students`}
                    {user?.role === "admin" && "Manage the AlumniSphere platform"}
                </p>
                {(user?.department || user?.graduationYear) && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                        {user.department && (
                            <span style={{
                                fontSize: "0.75rem", color: "#94a3b8", background: "rgba(99,102,241,0.12)",
                                padding: "0.2rem 0.65rem", borderRadius: "9999px", border: "1px solid rgba(99,102,241,0.2)"
                            }}>
                                {user.department}
                            </span>
                        )}
                        {user.graduationYear && (
                            <span style={{
                                fontSize: "0.75rem", color: "#94a3b8", background: "rgba(99,102,241,0.12)",
                                padding: "0.2rem 0.65rem", borderRadius: "9999px", border: "1px solid rgba(99,102,241,0.2)"
                            }}>
                                Class of {user.graduationYear}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Alumni verification status banner */}
            {user?.role === "alumni" && (() => {
                const vs = user?.verificationStatus;
                const isPending = !vs || vs === "pending";
                const isRejected = vs === "rejected";
                const isApproved = vs === "approved";
                return (
                    <div className="glass" style={{
                        padding: "1rem 1.5rem", marginBottom: "1.5rem",
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        background: isApproved
                            ? "rgba(16,185,129,0.08)"
                            : isRejected
                                ? "rgba(239,68,68,0.08)"
                                : "rgba(234,179,8,0.08)",
                        borderColor: isApproved ? "rgba(16,185,129,0.3)" : isRejected ? "rgba(239,68,68,0.3)" : "rgba(234,179,8,0.3)"
                    }}>
                        {isApproved && <CheckCircle size={18} color="#10b981" />}
                        {isRejected && <XCircle size={18} color="#ef4444" />}
                        {isPending && <Clock size={18} color="#eab308" />}
                        <div>
                            <p style={{
                                fontWeight: "700", fontSize: "0.875rem",
                                color: isApproved ? "#10b981" : isRejected ? "#ef4444" : "#eab308"
                            }}>
                                {isApproved && "Profile Verified ✓"}
                                {isRejected && "Verification Rejected"}
                                {isPending && "Verification Pending"}
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                {isApproved && "You can post opportunities and share interview experiences."}
                                {isRejected && "Your verification was rejected. Please contact the admin for more information."}
                                {isPending && "An admin will review your profile shortly."}
                            </p>
                        </div>
                    </div>
                );
            })()}

            {/* Stats grid */}
            {user?.role === "admin" && stats && (
                <>
                    <h3 style={{
                        fontSize: "0.85rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase",
                        letterSpacing: "0.08em", marginBottom: "1rem"
                    }}>Platform Overview</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                        <StatsCard label="Total Users" value={stats.totalUsers} icon={Users} color="#6366f1" bg="rgba(99,102,241,0.1)" />
                        <StatsCard label="Verified Alumni" value={stats.verifiedAlumni} icon={Award} color="#10b981" bg="rgba(16,185,129,0.1)" />
                        <StatsCard label="Students" value={stats.totalStudents} icon={Star} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
                        <StatsCard label="Opportunities" value={stats.totalOpportunities} icon={Briefcase} color="#a78bfa" bg="rgba(167,139,250,0.1)" />
                        <StatsCard label="Referrals" value={stats.totalReferrals} icon={MessageSquare} color="#38bdf8" bg="rgba(56,189,248,0.1)" />
                        <StatsCard label="Approved" value={stats.approvedReferrals} icon={TrendingUp} color="#34d399" bg="rgba(52,211,153,0.1)" />
                    </div>
                </>
            )}

            {/* Quick stats for student/alumni */}
            {user?.role !== "admin" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                    <StatsCard label="Open Opportunities" value={opportunities.length} icon={Briefcase} color="#6366f1" bg="rgba(99,102,241,0.1)" />
                    <StatsCard label="Your Role" value={user?.role === "alumni" ? "Alumni" : "Student"} icon={Award}
                        color={user?.role === "alumni" ? "#a78bfa" : "#38bdf8"} bg={user?.role === "alumni" ? "rgba(167,139,250,0.1)" : "rgba(56,189,248,0.1)"} />
                    {user?.role === "alumni" && (() => {
                        const vs = user?.verificationStatus;
                        const isApproved = vs === "approved";
                        const isRejected = vs === "rejected";
                        return (
                            <StatsCard
                                label="Verification"
                                value={isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
                                icon={isApproved ? CheckCircle : isRejected ? XCircle : Clock}
                                color={isApproved ? "#10b981" : isRejected ? "#ef4444" : "#eab308"}
                                bg={isApproved ? "rgba(16,185,129,0.1)" : isRejected ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)"}
                            />
                        );
                    })()}
                </div>
            )}

            {/* Recent Opportunities */}
            <div className="divider" />
            <h3 style={{
                fontSize: "0.85rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase",
                letterSpacing: "0.08em", margin: "1rem 0"
            }}>Recent Opportunities</h3>

            {loading ? (
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading...</div>
            ) : opportunities.length === 0 ? (
                <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>No opportunities yet.</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
                    {opportunities.map(op => (
                        <div key={op._id} className="glass card-hover" style={{ padding: "1.25rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                <h4 style={{ fontWeight: "700", color: "#e2e8f0", fontSize: "0.9rem" }}>{op.title}</h4>
                                <span className={`badge badge-${op.type}`}>{op.type}</span>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "0.5rem" }}>
                                {op.description?.slice(0, 80)}...
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "#475569" }}>
                                By {op.postedBy?.name} · {op.postedBy?.organization || op.domain}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
