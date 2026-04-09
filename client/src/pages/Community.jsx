import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Trash2, Search, Send } from "lucide-react";
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
        } catch {
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
        } catch {
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
        } catch {
            console.error("Failed to toggle like");
        }
    };

    const handleAddComment = async (postId) => {
        const content = commentInputs[postId];
        if (!content || !content.trim()) return toast.error("Comment cannot be empty.");

        try {
            const res = await API.post(`/community/${postId}/comment`, { content });
            console.log("Community comment payload:", res.data.comment);
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    return { ...post, comments: [...post.comments, res.data.comment] };
                }
                return post;
            }));
            setCommentInputs({ ...commentInputs, [postId]: "" });
        } catch {
            console.error("Failed to add comment");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/community/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success("Post deleted safely.");
        } catch {
            console.error("Failed to delete post.");
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const getCategoryBadgeColor = (category) => {
        switch (category) {
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

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || post.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
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
                    Join the discussion, ask questions, and share opportunities with the AlumniSphere network.
                </p>
            </div>

            {/* Create Post Section */}
            <div className="glass-card card-hover mx-auto mb-8 max-w-5xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-[1.02]">
                <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                    <textarea
                        placeholder="What's on your mind? Share an opportunity or ask a question..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[100px] w-full resize-y rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-3 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-400">Category:</span>
                            <select
                                value={newPostCategory}
                                onChange={(e) => setNewPostCategory(e.target.value)}
                                className="cursor-pointer rounded-xl border border-cyan-400/20 bg-white/5 px-3 py-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-4 py-2 font-semibold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                            <Send size={16} /> Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center gap-4">
                <div className="relative min-w-[250px] flex-1">
                    <Search size={18} className="icon-glow absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-cyan-400/20 bg-white/5 py-2 pr-4 pl-10 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="cursor-pointer rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-2 text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Feed */}
            {loading ? (
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
                                                {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryBadgeColor(post.category)}`}>
                                            {post.category}
                                        </span>
                                        {user?.role === "admin" && (
                                            <button onClick={() => handleDeletePost(post._id)} className="icon-glow cursor-pointer rounded p-1 text-red-300 hover:text-red-200">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mb-6 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-gray-200">
                                    {post.content}
                                </div>

                                {/* Post Actions */}
                                <div className="mt-4 flex gap-6 border-t border-cyan-400/15 pt-4">
                                    <button
                                        onClick={() => handleToggleLike(post._id)}
                                        className={`flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm font-medium transition-colors ${isLiked ? "text-blue-400" : "text-gray-400 hover:text-gray-200"}`}
                                    >
                                        <ThumbsUp size={16} fill={isLiked ? "#3b82f6" : "none"} />
                                        {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                                    </button>

                                    <button
                                        onClick={() => toggleComments(post._id)}
                                        className="flex cursor-pointer items-center gap-2 border-none bg-transparent text-sm font-medium text-gray-400 transition-colors hover:text-gray-200"
                                    >
                                        <MessageSquare size={16} />
                                        {post.comments?.length || 0} {post.comments?.length === 1 ? "Comment" : "Comments"}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {expandedComments[post._id] && (
                                    <div className="glass-card mt-6 p-5">
                                        {/* Add Comment Input */}
                                        <div className="mb-6 flex gap-3">
                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/15 text-sm font-bold text-cyan-300">
                                                {user?.name?.[0] || "?"}
                                            </div>
                                            <div className="flex flex-1 gap-2">
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
                                                    className="flex-1 rounded-xl border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-cyan-400"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post._id)}
                                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-r from-teal-400 to-cyan-400 text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                                                >
                                                    <Send size={14} style={{ marginLeft: "-2px" }} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comment List */}
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
    );
}
