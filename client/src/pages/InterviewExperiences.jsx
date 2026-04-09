import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Search, PlusCircle, X } from "lucide-react";

function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

export default function InterviewExperiences() {
    const { user } = useAuth();
    const canPost = user?.role === "alumni" && user?.isVerified;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ company: "", difficulty: "", domain: "" });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ company: "", role: "", difficulty: "medium", domain: "", experience: "" });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter.company) params.company = filter.company;
            if (filter.difficulty) params.difficulty = filter.difficulty;
            if (filter.domain) params.domain = filter.domain;
            const res = await API.get("/interviews", { params });
            setPosts(res.data.posts);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, [filter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post("/interviews", form);
            showToast("Experience posted!");
            setForm({ company: "", role: "", difficulty: "medium", domain: "", experience: "" });
            setShowForm(false);
            fetchPosts();
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to post", "error");
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fade-in" style={{ padding: "1.75rem" }}>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Interview Experiences</h2>
                {canPost && (
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? <X size={15} /> : <PlusCircle size={15} />}
                        {showForm ? "Cancel" : "Share Experience"}
                    </button>
                )}
            </div>

            {/* Post form */}
            {showForm && (
                <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#f1f5f9", marginBottom: "1.25rem" }}>Share Your Experience</h3>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                            <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Company *</label>
                                <input required className="input-field" placeholder="e.g. Google" value={form.company} onChange={e => set("company", e.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Role *</label>
                                <input required className="input-field" placeholder="e.g. SDE-2" value={form.role} onChange={e => set("role", e.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Difficulty *</label>
                                <select className="input-field" value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Domain</label>
                                <input className="input-field" placeholder="e.g. Backend, DSA" value={form.domain} onChange={e => set("domain", e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.78rem", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.4rem" }}>Experience *</label>
                            <textarea required rows={5} className="input-field" style={{ resize: "vertical" }}
                                placeholder="Describe the interview process, rounds, questions asked, tips for future candidates..."
                                value={form.experience} onChange={e => set("experience", e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: "flex-start" }}>
                            {submitting ? "Posting..." : "Post Experience"}
                        </button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="glass" style={{ padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flex: 1, minWidth: "130px" }}>
                    <Search size={14} color="#475569" />
                    <input className="input-field" style={{ flex: 1 }} placeholder="Company..."
                        value={filter.company} onChange={e => setFilter(f => ({ ...f, company: e.target.value }))} />
                </div>
                <input className="input-field" style={{ width: "140px" }} placeholder="Domain..."
                    value={filter.domain} onChange={e => setFilter(f => ({ ...f, domain: e.target.value }))} />
                <select className="input-field" style={{ width: "150px" }}
                    value={filter.difficulty} onChange={e => setFilter(f => ({ ...f, difficulty: e.target.value }))}>
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                {(filter.company || filter.domain || filter.difficulty) && (
                    <button className="btn-outline" onClick={() => setFilter({ company: "", difficulty: "", domain: "" })}>Clear</button>
                )}
            </div>

            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
                {loading ? "Loading..." : `${posts.length} experience${posts.length !== 1 ? "s" : ""} found`}
            </div>

            {!loading && posts.length === 0 && (
                <div className="glass" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    <BookOpen size={36} color="#334155" style={{ margin: "0 auto 1rem" }} />
                    <p>No experiences found.</p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {posts.map(post => (
                    <div key={post._id} className="glass card-hover" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div>
                                <h3 style={{ fontWeight: "700", fontSize: "1rem", color: "#e2e8f0" }}>{post.company}</h3>
                                <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{post.role}</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                <span className={`badge badge-${post.difficulty}`}>{post.difficulty}</span>
                                {post.domain && <span className="badge badge-job">{post.domain}</span>}
                            </div>
                        </div>
                        <p style={{ fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.65, marginBottom: "0.75rem" }}>
                            {post.experience?.slice(0, 200)}{post.experience?.length > 200 ? "..." : ""}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "#475569" }}>
                            By <strong style={{ color: "#64748b" }}>{post.author?.name}</strong>
                            {post.author?.organization && ` · ${post.author.organization}`}
                            {" · "}{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
