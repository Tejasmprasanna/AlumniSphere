import { useState, useEffect } from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Trash2, Search, Send } from "lucide-react";
=======
import { MessageSquare, ThumbsUp, Trash2, Search, Send, FileText } from "lucide-react";
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
            console.error("Failed to toggle like");
        }
    };

    const handleAddComment = async (postId) => {
        const content = commentInputs[postId];
        if (!content || !content.trim()) return toast.error("Comment cannot be empty.");

        try {
            const res = await API.post(`/community/${postId}/comment`, { content });
<<<<<<< HEAD
            console.log("Community comment payload:", res.data.comment);
=======
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: [...post.comments, res.data.comment] };
                }
                return post;
            }));
            setCommentInputs({ ...commentInputs, [postId]: "" });
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
            console.error("Failed to add comment");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/community/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success("Post deleted safely.");
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
            console.error("Failed to delete post.");
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const getCategoryBadgeColor = (category) => {
        switch (category) {
<<<<<<< HEAD
            case "career": return "bg-blue-400/20 text-blue-300 border border-blue-400/30";
            case "internship": return "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30";
            case "event": return "bg-violet-400/20 text-violet-300 border border-violet-400/30";
            case "referral": return "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30";
            default: return "bg-slate-400/20 text-slate-300 border border-slate-400/30";
        }
    };

    const getRoleBadgeClasses = (role) => {
        if (role === "alumni") return "bg-yellow-400/20 text-yellow-300";
        if (role === "admin") return "bg-red-400/20 text-red-300";
        return "bg-cyan-400/20 text-cyan-300";
    };

=======
            case "career": return { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.3)" };
            case "internship": return { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.3)" };
            case "event": return { bg: "rgba(168,85,247,0.1)", text: "#a855f7", border: "rgba(168,85,247,0.3)" };
            case "referral": return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" };
            default: return { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" };
        }
    };

>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || post.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
<<<<<<< HEAD
        <motion.div
            className="page-shell min-h-screen bg-[#020617] p-6 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mx-auto mb-8 max-w-5xl">
                <h1 className="m-0 flex items-center gap-2 text-5xl font-bold text-transparent bg-gradient-to-r from-white to-cyan-300 bg-clip-text">
                    <MessageSquare size={28} className="icon-glow" /> Community Chat
                </h1>
                <p className="mt-2 text-sm text-gray-400">
=======
        <div className="fade-in" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f8fafc", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <MessageSquare size={26} color="#6366f1" /> Community Chat
                </h1>
                <p style={{ margin: "0.5rem 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    Join the discussion, ask questions, and share opportunities with the AlumniSphere network.
                </p>
            </div>

            {/* Create Post Section */}
<<<<<<< HEAD
            <div className="glass-card card-hover mx-auto mb-8 max-w-5xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-[1.02]">
                <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
=======
            <div className="glass" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
                <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    <textarea
                        placeholder="What's on your mind? Share an opportunity or ask a question..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
<<<<<<< HEAD
                        className="min-h-[100px] w-full resize-y rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-3 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-400">Category:</span>
                            <select
                                value={newPostCategory}
                                onChange={(e) => setNewPostCategory(e.target.value)}
                                className="cursor-pointer rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
<<<<<<< HEAD
                        <button type="submit" className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-4 py-2 font-semibold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                            <Send size={16} /> Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Filters */}
<<<<<<< HEAD
            <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center gap-4">
                <div className="relative min-w-[250px] flex-1">
                    <Search size={18} className="icon-glow absolute left-4 top-1/2 -translate-y-1/2" />
=======
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
                    <Search size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                        className="w-full rounded-xl border border-cyan-400/20 bg-white/5 py-2 pr-4 pl-10 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
=======
                        style={{
                            width: "100%", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                            padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "0.5rem", color: "#f8fafc",
                            outline: "none", fontSize: "0.9rem"
                        }}
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
<<<<<<< HEAD
                    className="cursor-pointer rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
=======
                    style={{
                        background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "#e2e8f0", padding: "0.6rem 1rem", borderRadius: "0.5rem",
                        fontSize: "0.9rem", cursor: "pointer", outline: "none"
                    }}
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Feed */}
            {loading ? (
<<<<<<< HEAD
                <div className="py-12 text-center text-gray-400">
                    Loading discussions...
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="glass-card p-16 text-center text-gray-400">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold text-gray-300">No discussions yet.</p>
                    <p className="text-sm">Be the first to start a conversation!</p>
                </div>
            ) : (
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    {filteredPosts.map(post => {
                        const isLiked = post.likes.includes(user?._id);

                        return (
                            <motion.div
                                key={post._id}
                                className="glass-card p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-[1.02]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >

                                {/* Post Header */}
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/15 text-lg font-bold text-cyan-300">
                                            {post.author?.name?.[0] || "?"}
                                        </div>
                                        <div>
                                            <h4 className="m-0 text-base leading-tight font-semibold text-gray-200">
                                                {post.author?.name || "Unknown User"}
                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getRoleBadgeClasses(post.author?.role)}`}>
                                                    {post.author?.role || "student"}
                                                </span>
                                            </h4>
                                            <span className="text-xs text-gray-400">
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                                {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>

<<<<<<< HEAD
                                    <div className="flex items-center gap-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryBadgeColor(post.category)}`}>
                                            {post.category}
                                        </span>
                                        {user?.role === "admin" && (
                                            <button onClick={() => handleDeletePost(post._id)} className="icon-glow cursor-pointer rounded p-1 text-red-300 hover:text-red-200">
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
<<<<<<< HEAD
                                <div className="mb-6 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-gray-200">
=======
                                <div style={{
                                    color: "#e2e8f0", fontSize: "0.95rem", lineHeight: 1.6,
                                    marginBottom: "1.5rem", whiteSpace: "pre-wrap"
                                }}>
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                    {post.content}
                                </div>

                                {/* Post Actions */}
<<<<<<< HEAD
                                <div className="mt-4 flex gap-6 border-t border-cyan-400/15 pt-4">
                                    <button
                                        onClick={() => handleToggleLike(post._id)}
                                        className={`flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm font-medium transition-colors ${isLiked ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                    >
                                        <ThumbsUp size={16} fill={isLiked ? "#3b82f6" : "none"} />
                                        {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                                    </button>

                                    <button
                                        onClick={() => toggleComments(post._id)}
<<<<<<< HEAD
                                        className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
=======
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            display: "flex", alignItems: "center", gap: "0.4rem",
                                            color: "#94a3b8", fontSize: "0.85rem",
                                            fontWeight: "500", transition: "color 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#cbd5e1"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                    >
                                        <MessageSquare size={16} />
                                        {post.comments?.length || 0} {post.comments?.length === 1 ? "Comment" : "Comments"}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {expandedComments[post._id] && (
<<<<<<< HEAD
                                    <div className="glass-card mt-6 p-5">
                                        {/* Add Comment Input */}
                                        <div className="mb-6 flex gap-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/15 text-sm font-bold text-cyan-300">
                                                {user?.name?.[0] || "?"}
                                            </div>
                                            <div className="flex flex-1 gap-2">
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
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
<<<<<<< HEAD
                                                    className="flex-1 rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post._id)}
                                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-r from-teal-400 to-cyan-400 text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
                                                >
                                                    <Send size={14} style={{ marginLeft: "-2px" }} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comment List */}
<<<<<<< HEAD
                                        <div className="flex flex-col gap-4">
                                            {post.comments?.map(comment => (
                                                <div key={comment._id} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                                                    {(() => {
                                                        const commentUser = comment?.user || comment?.author || {};
                                                        return (
                                                            <>
                                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-white/5 text-sm font-bold text-gray-300">
                                                                    {commentUser?.name?.[0] || "?"}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="mb-1 flex items-center justify-between gap-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-semibold text-gray-200">
                                                                                {commentUser?.name || "Anonymous"}
                                                                            </span>
                                                                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClasses(comment?.user?.role)}`}>
                                                                                {comment?.user?.role || "student"}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-xs text-gray-400">
                                                                {new Date(comment.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm leading-relaxed text-gray-300">
                                                                        {comment.content}
                                                                    </div>
                                                        </div>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
=======
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
>>>>>>> 13c4e9c02bbe6cdf54d9b40eab0a14efa9a005a1
    );
}
