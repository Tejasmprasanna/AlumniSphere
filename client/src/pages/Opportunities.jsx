import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Search, Users, Globe, CheckCircle } from "lucide-react";
import ApplyModal from "../components/ApplyModal";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function Opportunities() {
    const { user } = useAuth();
    const [opps, setOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: "", domain: "" });
    const [toast, setToast] = useState({ msg: "", type: "success" });
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const fetchOpps = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.type) params.type = filter.type;
            if (filter.domain) params.domain = filter.domain;
            const res = await API.get("/opportunities", { params });
            setOpps(res.data.opportunities);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOpps(); }, [filter]);

    const handleApplyClick = (opportunity) => {
        setSelectedOpportunity(opportunity);
    };

    const handleApplySuccess = () => {
        showToast("Application submitted successfully!", "success");
        fetchOpps();
    };

    const hasApplied = (op) => op.applicants?.some(a => (a._id || a) === user?._id);

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Filters */}
            <div className="glass" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "160px" }}>
                    <Search size={15} color="#475569" />
                    <input className="input-field" placeholder="Filter by domain..."
                        value={filter.domain} onChange={e => setFilter(f => ({ ...f, domain: e.target.value }))}
                        style={{ flex: 1 }} />
                </div>
                <select className="input-field" style={{ width: "160px" }}
                    value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All Types</option>
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="event">Event</option>
                </select>
                {(filter.type || filter.domain) && (
                    <button className="btn-outline" onClick={() => setFilter({ type: "", domain: "" })}>Clear</button>
                )}
            </div>

            {/* Results count */}
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
                {loading ? "Loading..." : `${opps.length} opportunit${opps.length === 1 ? "y" : "ies"} found`}
            </div>

            {!loading && opps.length === 0 && (
                <div className="glass" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    <Briefcase size={36} color="#334155" style={{ margin: "0 auto 1rem" }} />
                    <p>No opportunities found.</p>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
                {opps.map(op => (
                    <div key={op._id} className="glass card-hover" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h3 style={{ fontWeight: "700", color: "#e2e8f0", fontSize: "1rem", flex: 1 }}>{op.title}</h3>
                            <span className={`badge badge-${op.type}`} style={{ marginLeft: "0.5rem", flexShrink: 0 }}>{op.type}</span>
                        </div>

                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6 }}>
                            {op.description?.slice(0, 120)}{op.description?.length > 120 ? "..." : ""}
                        </p>

                        {/* Meta */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            {op.domain && (
                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>
                                    <Globe size={12} /> {op.domain}
                                </span>
                            )}
                            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>
                                <Users size={12} /> {op.applicants?.length || 0} applicant{op.applicants?.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div style={{ fontSize: "0.75rem", color: "#475569" }}>
                            Posted by <strong style={{ color: "#94a3b8" }}>{op.postedBy?.name}</strong>
                            {op.postedBy?.organization && ` · ${op.postedBy.organization}`}
                        </div>

                        {/* Action */}
                        {user?.role === "student" && (
                            hasApplied(op) ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "#10b981", fontWeight: "600" }}>
                                    <CheckCircle size={14} /> Applied
                                </div>
                            ) : (
                                <button className="btn-primary" onClick={() => handleApplyClick(op)}
                                    style={{ alignSelf: "flex-start" }}>
                                    Apply Now
                                </button>
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Apply Modal */}
            <ApplyModal
                isOpen={!!selectedOpportunity}
                onClose={() => setSelectedOpportunity(null)}
                opportunity={selectedOpportunity}
                onSuccess={handleApplySuccess}
            />
        </div>
    );
}
