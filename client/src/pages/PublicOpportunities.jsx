import { useState, useEffect } from "react";
import API from "../api/axios";
import { Briefcase, Search, Users, Globe } from "lucide-react";
import LandingNavbar from "../components/LandingNavbar";
import { useNavigate } from "react-router-dom";

export default function PublicOpportunities() {
    const [opps, setOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: "", domain: "" });
    const navigate = useNavigate();

    const fetchOpps = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.type) params.type = filter.type;
            if (filter.domain) params.domain = filter.domain;
            const res = await API.get("/opportunities/public", { params });
            setOpps(res.data.opportunities);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOpps(); }, [filter]);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#111827 50%,#0b1120 100%)", display: "flex", flexDirection: "column" }}>
            <LandingNavbar />
            <div className="fade-in" style={{ padding: "1.75rem", maxWidth: "1100px", margin: "0 auto", color: "white", width: "100%", flex: 1 }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f1f5f9", margin: "1.5rem 0" }}>Explore Opportunities</h2>

                {/* Filters */}
                <div className="glass" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "160px" }}>
                        <Search size={15} color="#cbd5e1" />
                        <input className="input-field" placeholder="Filter by domain..."
                            value={filter.domain} onChange={e => setFilter(f => ({ ...f, domain: e.target.value }))}
                            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                    </div>
                    <select className="input-field" style={{ width: "160px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                        value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
                        <option value="" style={{ color: "black" }}>All Types</option>
                        <option value="job" style={{ color: "black" }}>Job</option>
                        <option value="internship" style={{ color: "black" }}>Internship</option>
                        <option value="mentorship" style={{ color: "black" }}>Mentorship</option>
                        <option value="event" style={{ color: "black" }}>Event</option>
                    </select>
                    {(filter.type || filter.domain) && (
                        <button className="btn-outline" onClick={() => setFilter({ type: "", domain: "" })}>Clear</button>
                    )}
                </div>

                {/* Results count */}
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem" }}>
                    {loading ? "Loading..." : `${opps.length} opportunit${opps.length === 1 ? "y" : "ies"} found`}
                </div>

                {!loading && opps.length === 0 && (
                    <div className="glass" style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                        <Briefcase size={36} color="#475569" style={{ margin: "0 auto 1rem" }} />
                        <p>No public opportunities found.</p>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
                    {opps.map(op => (
                        <div key={op._id} className="glass card-hover" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h3 style={{ fontWeight: "700", color: "#f8fafc", fontSize: "1rem", flex: 1 }}>{op.title}</h3>
                                <span className={`badge badge-${op.type}`} style={{ marginLeft: "0.5rem", flexShrink: 0 }}>{op.type}</span>
                            </div>

                            <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                                {op.description?.slice(0, 120)}{op.description?.length > 120 ? "..." : ""}
                            </p>

                            {/* Meta */}
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "auto" }}>
                                {op.domain && (
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                                        <Globe size={12} /> {op.domain}
                                    </span>
                                )}
                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                                    <Users size={12} /> {op.applicants?.length || 0} applicant{op.applicants?.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                                Posted by <strong style={{ color: "#e2e8f0" }}>{op.postedBy?.name}</strong>
                                {op.postedBy?.organization && ` · ${op.postedBy.organization}`}
                            </div>

                            <button className="btn-primary" onClick={() => navigate("/login")}
                                style={{ alignSelf: "flex-start", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                                Log in to Apply
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                borderTop: "1px solid rgba(99,102,241,0.12)",
                background: "rgba(15,23,42,0.95)",
                marginTop: "auto"
            }}>
                <div style={{
                    maxWidth: "1100px", margin: "0 auto",
                    padding: "2rem 1.5rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "1rem",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                            borderRadius: "0.4rem", padding: "0.3rem", display: "flex",
                        }}>
                            <Zap size={15} color="white" />
                        </div>
                        <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#64748b" }}>
                            Alumni<span style={{ color: "#6366f1" }}>Sphere</span>
                        </span>
                    </div>

                    <p style={{ fontSize: "0.75rem", color: "#334155" }}>
                        © {new Date().getFullYear()} AlumniSphere. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
