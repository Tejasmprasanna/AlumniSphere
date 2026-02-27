import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Trash2, Search, Send, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const categories = ["general", "career", "internship", "event", "referral"];

export default function Community() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostCategory, setNewPostCategory] = useState("general");
    const [expandedComments, setExpandedComments] = useState({}); // { postId: boolean }
    const [commentInputs, setCommentInputs] = useState({}); // { postId: string }
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await API.get("/community");
            setPosts(res.data.posts);
        } catch (error) {
            console.error("Failed to load community posts");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return toast.error("Post content cannot be empty.");

        try {
            const res = await API.post("/community", {
                content: newPostContent,
                category: newPostCategory
            });
            // Add new post with an empty comments array explicitly
            setPosts([{ ...res.data.post, comments: [] }, ...posts]);
            setNewPostContent("");
            toast.success("Post created successfully!");
        } catch (error) {
            console.error("Failed to create post");
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            const res = await API.post(`/community/${postId}/like`);
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, likes: res.data.likes };
                }
                return post;
            }));
        } catch (error) {
            console.error("Failed to toggle like");
        }
    };

    const handleAddComment = async (postId) => {
        const content = commentInputs[postId];
        if (!content || !content.trim()) return toast.error("Comment cannot be empty.");

        try {
            const res = await API.post(`/community/${postId}/comment`, { content });
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: [...post.comments, res.data.comment] };
                }
                return post;
            }));
            setCommentInputs({ ...commentInputs, [postId]: "" });
        } catch (error) {
            console.error("Failed to add comment");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/community/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success("Post deleted safely.");
        } catch (error) {
            console.error("Failed to delete post.");
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const getCategoryBadgeColor = (category) => {
        switch (category) {
            case "career": return { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.3)" };
            case "internship": return { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.3)" };
            case "event": return { bg: "rgba(168,85,247,0.1)", text: "#a855f7", border: "rgba(168,85,247,0.3)" };
            case "referral": return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" };
            default: return { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" };
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || post.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="fade-in" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <MessageSquare size={26} color="#6366f1" /> Community Chat
                </h1>
                <p style={{ margin: "0.5rem 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
                    Join the discussion, ask questions, and share opportunities with the AlumniSphere network.
                </p>
            </div>

            {/* Create Post Section */}
            <div className="glass" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <textarea
                        placeholder="What's on your mind? Share an opportunity or ask a question..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        style={{
                            width: "100%", minHeight: "100px", resize: "vertical",
                            background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: "0.75rem", padding: "1rem", color: "#f8fafc", fontSize: "0.95rem",
                            outline: "none", transition: "border-color 0.2s"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#818cf8"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>Category:</span>
                            <select
                                value={newPostCategory}
                                onChange={(e) => setNewPostCategory(e.target.value)}
                                style={{
                                    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#e2e8f0", padding: "0.4rem 0.75rem", borderRadius: "0.5rem",
                                    fontSize: "0.85rem", cursor: "pointer", outline: "none"
                                }}
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" style={{
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none",
                            color: "white", padding: "0.6rem 1.5rem", borderRadius: "0.5rem",
                            fontSize: "0.9rem", fontWeight: "600", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            boxShadow: "0 4px 14px rgba(99,102,241,0.3)", transition: "all 0.2s"
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.3)"; }}
                        >
                            <Send size={16} /> Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
                    <Search size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                            padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "0.5rem", color: "#f8fafc",
                            outline: "none", fontSize: "0.9rem"
                        }}
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                        background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "#e2e8f0", padding: "0.6rem 1rem", borderRadius: "0.5rem",
                        fontSize: "0.9rem", cursor: "pointer", outline: "none"
                    }}
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Feed */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    Loading discussions...
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                    <MessageSquare size={48} style={{ opacity: 0.3, margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "1.1rem", color: "#94a3b8", fontWeight: "500" }}>No discussions yet.</p>
                    <p style={{ fontSize: "0.9rem" }}>Be the first to start a conversation!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {filteredPosts.map(post => {
                        const style = getCategoryBadgeColor(post.category);
                        const isLiked = post.likes.includes(user?._id);

                        return (
                            <div key={post._id} className="glass" style={{ padding: "1.5rem" }}>

                                {/* Post Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: "42px", height: "42px", borderRadius: "50%",
                                            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#818cf8", fontWeight: "bold", fontSize: "1.1rem"
                                        }}>
                                            {post.author?.name?.[0] || "?"}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: "#f8fafc", fontWeight: "600", fontSize: "1rem", lineHeight: 1.2 }}>
                                                {post.author?.name || "Unknown User"}
                                                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "400", marginLeft: "0.5rem" }}>
                                                    • {post.author?.role}
                                                </span>
                                            </h4>
                                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                                {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <span style={{
                                            background: style.bg, color: style.text, border: `1px solid ${style.border}`,
                                            padding: "0.25rem 0.6rem", borderRadius: "1rem", fontSize: "0.7rem",
                                            fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em"
                                        }}>
                                            {post.category}
                                        </span>
                                        {user?.role === "admin" && (
                                            <button onClick={() => handleDeletePost(post._id)} style={{
                                                background: "none", border: "none", cursor: "pointer", color: "#ef4444",
                                                display: "flex", alignItems: "center", padding: "0.25rem"
                                            }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div style={{
                                    color: "#e2e8f0", fontSize: "0.95rem", lineHeight: 1.6,
                                    marginBottom: "1.5rem", whiteSpace: "pre-wrap"
                                }}>
                                    {post.content}
                                </div>

                                {/* Post Actions */}
                                <div style={{
                                    display: "flex", gap: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)",
                                    paddingTop: "1rem", marginTop: "1rem"
                                }}>
                                    <button
                                        onClick={() => handleToggleLike(post._id)}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            display: "flex", alignItems: "center", gap: "0.4rem",
                                            color: isLiked ? "#3b82f6" : "#94a3b8", fontSize: "0.85rem",
                                            fontWeight: "500", transition: "color 0.2s"
                                        }}
                                        onMouseEnter={e => !isLiked && (e.currentTarget.style.color = "#cbd5e1")}
                                        onMouseLeave={e => !isLiked && (e.currentTarget.style.color = "#94a3b8")}
                                    >
                                        <ThumbsUp size={16} fill={isLiked ? "#3b82f6" : "none"} />
                                        {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                                    </button>

                                    <button
                                        onClick={() => toggleComments(post._id)}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            display: "flex", alignItems: "center", gap: "0.4rem",
                                            color: "#94a3b8", fontSize: "0.85rem",
                                            fontWeight: "500", transition: "color 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#cbd5e1"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                    >
                                        <MessageSquare size={16} />
                                        {post.comments?.length || 0} {post.comments?.length === 1 ? "Comment" : "Comments"}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {expandedComments[post._id] && (
                                    <div style={{
                                        marginTop: "1.5rem", padding: "1.25rem", background: "rgba(15,23,42,0.4)",
                                        borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.05)"
                                    }}>
                                        {/* Add Comment Input */}
                                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%",
                                                background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                color: "#818cf8", fontWeight: "bold", fontSize: "0.85rem"
                                            }}>
                                                {user?.name?.[0] || "?"}
                                            </div>
                                            <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentInputs[post._id] || ""}
                                                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment(post._id);
                                                        }
                                                    }}
                                                    style={{
                                                        flex: 1, background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                                                        padding: "0.5rem 1rem", borderRadius: "9999px", color: "#f8fafc",
                                                        outline: "none", fontSize: "0.85rem"
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post._id)}
                                                    style={{
                                                        background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none",
                                                        color: "white", width: "36px", height: "36px", borderRadius: "50%",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        cursor: "pointer", transition: "transform 0.2s"
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                                >
                                                    <Send size={14} style={{ marginLeft: "-2px" }} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comment List */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                            {post.comments?.map(comment => (
                                                <div key={comment._id} style={{ display: "flex", gap: "0.75rem" }}>
                                                    <div style={{
                                                        width: "32px", height: "32px", borderRadius: "50%",
                                                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                        color: "#94a3b8", fontWeight: "bold", fontSize: "0.85rem"
                                                    }}>
                                                        {comment.author?.name?.[0] || "?"}
                                                    </div>
                                                    <div style={{ background: "rgba(30,41,59,0.4)", padding: "0.75rem 1rem", borderRadius: "0 0.75rem 0.75rem 0.75rem", flex: 1 }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                                            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#e2e8f0" }}>
                                                                {comment.author?.name || "Unknown User"}
                                                            </span>
                                                            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                                                                {new Date(comment.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                                                            {comment.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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
