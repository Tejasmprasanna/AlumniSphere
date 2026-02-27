import { useState, useEffect } from "react";
import API from "../api/axios";
import { X, CheckCircle, FileText, Phone, Link as LinkIcon, Github, Linkedin, AlertCircle } from "lucide-react";

export default function ApplyModal({ opportunity, isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        resumeLink: "",
        coverLetter: "",
        phoneNumber: "",
        portfolioLink: "",
        linkedIn: "",
        github: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                resumeLink: "",
                coverLetter: "",
                phoneNumber: "",
                portfolioLink: "",
                linkedIn: "",
                github: ""
            });
            setError("");
            setSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen || !opportunity) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(""); // clear error on type
    };

    const validate = () => {
        if (!formData.resumeLink.trim()) return "Resume Link is required.";
        if (!formData.coverLetter.trim() || formData.coverLetter.length < 100) return "Cover Letter must be at least 100 characters.";
        if (!formData.phoneNumber.trim()) return "Phone Number is required.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const valError = validate();
        if (valError) {
            setError(valError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            await API.post("/applications", {
                opportunityId: opportunity._id,
                ...formData
            });
            setSuccess(true);
            setTimeout(() => {
                onSuccess(); // Triggers parent toast & state update
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            padding: "1rem"
        }}>
            <div style={{
                background: "#0f172a", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "1rem", width: "100%", maxWidth: "600px",
                maxHeight: "90vh", display: "flex", flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)", animation: "fadeInUp 0.3s ease-out"
            }}>
                {/* Header */}
                <div style={{
                    padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                    <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#f8fafc", margin: 0 }}>Apply to {opportunity.title}</h2>
                        {opportunity.postedBy?.organization && (
                            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>{opportunity.postedBy.organization}</p>
                        )}
                    </div>
                    <button onClick={onClose} disabled={loading || success} style={{
                        background: "rgba(30,41,59,0.5)", border: "none", color: "#94a3b8", cursor: "pointer",
                        padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                {success ? (
                    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#10b981", flex: 1 }}>
                        <CheckCircle size={64} style={{ margin: "0 auto 1.5rem" }} />
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#f8fafc" }}>Application Submitted!</h3>
                        <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>Your application has been successfully sent to the alumni.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ padding: "1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        {error && (
                            <div style={{
                                padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.5rem",
                                color: "#fca5a5", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem"
                            }}>
                                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                {error}
                            </div>
                        )}

                        {/* Resume & Phone */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>
                                    Resume Link (Drive/Dropbox) <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <div style={{ position: "relative" }}>
                                    <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                                        <FileText size={16} />
                                    </div>
                                    <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange}
                                        placeholder="https://..." required
                                        style={{
                                            width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.25rem", background: "rgba(15,23,42,0.6)",
                                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.9rem"
                                        }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "0.4rem" }}>
                                    Phone Number <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <div style={{ position: "relative" }}>
                                    <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                                        <Phone size={16} />
                                    </div>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                                        placeholder="+1 234..." required
                                        style={{
                                            width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.25rem", background: "rgba(15,23,42,0.6)",
                                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.9rem"
                                        }} />
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>
                                    Cover Letter <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <span style={{ fontSize: "0.7rem", color: formData.coverLetter.length < 100 ? "#ef4444" : "#10b981" }}>
                                    {formData.coverLetter.length} / 100+ chars
                                </span>
                            </div>
                            <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange}
                                placeholder="Why are you a good fit for this role?" required
                                style={{
                                    width: "100%", padding: "0.75rem", background: "rgba(15,23,42,0.6)",
                                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.9rem",
                                    minHeight: "150px", resize: "vertical", fontFamily: "inherit"
                                }} />
                        </div>

                        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}></div>

                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8" }}>
                            Additional Links (Optional)
                        </label>

                        {/* Social Links */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                                    <Linkedin size={16} />
                                </div>
                                <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange}
                                    placeholder="LinkedIn URL"
                                    style={{
                                        width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.25rem", background: "rgba(15,23,42,0.6)",
                                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.85rem"
                                    }} />
                            </div>

                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                                    <Github size={16} />
                                </div>
                                <input type="url" name="github" value={formData.github} onChange={handleChange}
                                    placeholder="GitHub URL"
                                    style={{
                                        width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.25rem", background: "rgba(15,23,42,0.6)",
                                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.85rem"
                                    }} />
                            </div>

                            <div style={{ position: "relative", gridColumn: "1 / -1" }}>
                                <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                                    <LinkIcon size={16} />
                                </div>
                                <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange}
                                    placeholder="Portfolio URL"
                                    style={{
                                        width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.25rem", background: "rgba(15,23,42,0.6)",
                                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "#f8fafc", fontSize: "0.85rem"
                                    }} />
                            </div>
                        </div>
                    </form>
                )}

                {/* Footer Controls */}
                {!success && (
                    <div style={{
                        padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)",
                        display: "flex", justifyContent: "flex-end", gap: "1rem", background: "rgba(15,23,42,0.5)"
                    }}>
                        <button onClick={onClose} disabled={loading} style={{
                            padding: "0.6rem 1.25rem", background: "transparent", color: "#cbd5e1",
                            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.5rem",
                            fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                        }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading} style={{
                            padding: "0.6rem 1.25rem", background: "#6366f1", color: "white",
                            border: "none", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
                            fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.2s"
                        }}>
                            {loading ? (
                                <>
                                    <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 1s linear infinite" }} />
                                    Submitting...
                                </>
                            ) : "Submit Application"}
                        </button>
                    </div>
                )}

                <style>
                    {`
                        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}
                </style>
            </div>
        </div>
    );
}
