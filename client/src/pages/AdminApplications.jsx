import { useState, useEffect } from "react";
import API from "../api/axios";
import { Search, FileText, Globe, Linkedin, Github, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, User } from "lucide-react";

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedApp, setExpandedApp] = useState(null);
    const [updatingParams, setUpdatingParams] = useState(null); // track loading per application

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await API.get("/applications");
            setApplications(res.data.applications);
        } catch (err) {
            // handle error silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (targetId, newStatus) => {
        setUpdatingParams(targetId);
        try {
            await API.patch(`/applications/${targetId}/status`, { status: newStatus });
            setApplications(prev => prev.map(app => app._id === targetId ? { ...app, status: newStatus } : app));
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setUpdatingParams(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "accepted": return { bg: "rgba(16,185,129,0.1)", color: "#10b981", icon: <CheckCircle size={14} /> };
            case "rejected": return { bg: "rgba(239,68,68,0.1)", color: "#ef4444", icon: <XCircle size={14} /> };
            case "reviewing": return { bg: "rgba(99,102,241,0.1)", color: "#818cf8", icon: <Search size={14} /> };
            default: return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", icon: <Clock size={14} /> };
        }
    };

    const filteredApps = applications.filter(app =>
        app.opportunity?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FileText size={22} color="#6366f1" /> Applications
                    </h1>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>Review and manage job and internship applications</p>
                </div>
            </div>

            <div className="glass" style={{ padding: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Search size={16} color="#64748b" />
                <input type="text" placeholder="Search by applicant or opportunity..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", color: "#f8fafc", width: "100%", fontSize: "0.9rem" }} />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Loading applications...</div>
            ) : filteredApps.length === 0 ? (
                <div className="glass" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    <FileText size={48} style={{ opacity: 0.3, margin: "0 auto 1rem" }} />
                    <p>No applications found.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {filteredApps.map(app => {
                        const isExpanded = expandedApp === app._id;
                        const statusStyle = getStatusStyle(app.status);
                        return (
                            <div key={app._id} className="glass" style={{ overflow: "hidden", transition: "all 0.3s" }}>
                                {/* Header Toggle */}
                                <div onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                                    style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: isExpanded ? "rgba(30,41,59,0.5)" : "transparent" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: "50%", background: "rgba(99,102,241,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", fontWeight: "bold"
                                        }}>
                                            {app.student?.name?.[0]}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#f8fafc" }}>
                                                {app.student?.name} <span style={{ color: "#64748b", fontWeight: "400", fontSize: "0.85rem" }}>applied for</span> {app.opportunity?.title}
                                            </h3>
                                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", fontSize: "0.8rem", color: "#94a3b8" }}>
                                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}><User size={12} /> {app.student?.department}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                        <span style={{
                                            padding: "0.25rem 0.6rem", borderRadius: "1rem", fontSize: "0.75rem", fontWeight: "600",
                                            display: "flex", alignItems: "center", gap: "0.3rem", background: statusStyle.bg, color: statusStyle.color
                                        }}>
                                            {statusStyle.icon} {app.status.toUpperCase()}
                                        </span>
                                        {isExpanded ? <ChevronDown size={18} color="#64748b" /> : <ChevronRight size={18} color="#64748b" />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(15,23,42,0.3)" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

                                            {/* Left Col: Cover Letter & Phone */}
                                            <div>
                                                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600" }}>Cover Letter</h4>
                                                <div style={{
                                                    padding: "1rem", background: "rgba(15,23,42,0.6)", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.05)",
                                                    fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.6, whiteSpace: "pre-wrap"
                                                }}>
                                                    {app.coverLetter}
                                                </div>
                                            </div>

                                            {/* Right Col: Links & Actions */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                                <div>
                                                    <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600" }}>Applicant Details</h4>
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                        <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#818cf8", fontSize: "0.85rem", textDecoration: "none" }}>
                                                            <FileText size={14} /> View Resume
                                                        </a>
                                                        {app.phoneNumber && (
                                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.85rem" }}>
                                                                <Phone size={14} color="#64748b" /> {app.phoneNumber}
                                                            </div>
                                                        )}
                                                        {app.linkedIn && (
                                                            <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.85rem", textDecoration: "none" }}>
                                                                <Linkedin size={14} color="#64748b" /> LinkedIn Profile
                                                            </a>
                                                        )}
                                                        {app.github && (
                                                            <a href={app.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.85rem", textDecoration: "none" }}>
                                                                <Github size={14} color="#64748b" /> GitHub Profile
                                                            </a>
                                                        )}
                                                        {app.portfolioLink && (
                                                            <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1", fontSize: "0.85rem", textDecoration: "none" }}>
                                                                <Globe size={14} color="#64748b" /> Portfolio Website
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600" }}>Update Status</h4>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                                        {app.status !== "reviewing" && (
                                                            <button
                                                                onClick={() => handleStatusChange(app._id, "reviewing")}
                                                                disabled={updatingParams === app._id}
                                                                style={{ padding: "0.4rem", background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "0.375rem", fontSize: "0.8rem", cursor: "pointer" }}
                                                            >
                                                                Mark Reviewing
                                                            </button>
                                                        )}
                                                        {app.status !== "accepted" && (
                                                            <button
                                                                onClick={() => handleStatusChange(app._id, "accepted")}
                                                                disabled={updatingParams === app._id}
                                                                style={{ padding: "0.4rem", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "0.375rem", fontSize: "0.8rem", cursor: "pointer" }}
                                                            >
                                                                Accept
                                                            </button>
                                                        )}
                                                        {app.status !== "rejected" && (
                                                            <button
                                                                onClick={() => handleStatusChange(app._id, "rejected")}
                                                                disabled={updatingParams === app._id}
                                                                style={{ padding: "0.4rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.375rem", fontSize: "0.8rem", cursor: "pointer" }}
                                                            >
                                                                Reject
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
