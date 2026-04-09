import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, UserPlus, FileText, CheckCircle, Briefcase, Share2 } from "lucide-react";
import { io } from "socket.io-client";
import API from "../api/axios";

// Helper for relative time (e.g., "2m ago")
function timeAgo(dateString) {
    const timestamp = new Date(dateString).getTime();
    if (!timestamp) return "";
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
}

const getIconForType = (type) => {
    switch (type) {
        case "newUser": return <UserPlus size={14} color="#3b82f6" />;
        case "userApproved": return <CheckCircle size={14} color="#10b981" />;
        case "newOpportunity": return <Briefcase size={14} color="#8b5cf6" />;
        case "newReferral": return <Share2 size={14} color="#f59e0b" />;
        default: return <FileText size={14} color="#94a3b8" />;
    }
};

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await API.get("/admin/notifications");
                // Requirement: fetch latest 10 notifications
                setNotifications((res.data.notifications || []).slice(0, 10));
            } catch (err) {
                // handle silently
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        const socketURL = API.defaults.baseURL.replace("/api", "");
        const socket = io(socketURL);

        socket.on("connect", () => {
            socket.emit("joinAdmin");
        });

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev].slice(0, 10));
        };

        socket.on("newUser", handleNewNotification);
        socket.on("userApproved", handleNewNotification);
        socket.on("userRejected", handleNewNotification);
        socket.on("newOpportunity", handleNewNotification);
        socket.on("newReferral", handleNewNotification);

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const markAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await API.put(`/admin/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            // handle silently
        }
    };

    const markAllAsRead = async (e) => {
        e.stopPropagation();
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
        if (!unreadIds.length) return;

        try {
            await Promise.all(unreadIds.map(id => API.put(`/admin/notifications/${id}/read`)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            // handle silently
        }
    };

    const clearAll = async (e) => {
        e.stopPropagation();
        try {
            await API.delete("/admin/notifications");
            setNotifications([]);
        } catch (err) {
            // handle silently
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: "rgba(30,41,59,0.5)", border: "1px solid rgba(99,102,241,0.2)", cursor: "pointer", position: "relative",
                    color: isOpen ? "#818cf8" : "#cbd5e1", padding: "0.5rem", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.color = "#cbd5e1"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}
            >
                <Bell size={18} style={{ pointerEvents: "none" }} />
                {unreadCount > 0 && (
                    <span style={{
                        position: "absolute", top: -2, right: -2,
                        background: "#ef4444", color: "white", fontSize: "0.6rem", fontWeight: 800,
                        width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid #0f172a", pointerEvents: "none"
                    }}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute", top: "130%", right: 0, width: 340, zIndex: 50,
                    background: "rgba(15,23,42,0.98)", border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.7)", borderRadius: "0.75rem",
                    overflow: "hidden", animation: "fadeIn 0.2s ease-out"
                }}>
                    <div style={{
                        padding: "0.8rem 1rem", borderBottom: "1px solid rgba(99,102,241,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "rgba(30,41,59,0.8)"
                    }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>Notifications</h4>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} style={{
                                    background: "none", border: "none", fontSize: "0.75rem", color: "#6366f1",
                                    cursor: "pointer", fontWeight: 600, padding: 0, transition: "color 0.15s"
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#6366f1"}
                                >Mark all read</button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} style={{
                                    background: "none", border: "none", fontSize: "0.75rem", color: "#ef4444",
                                    cursor: "pointer", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", transition: "color 0.15s"
                                }} title="Clear all"
                                    onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#ef4444"}
                                ><Trash2 size={14} /></button>
                            )}
                        </div>
                    </div>

                    <div style={{ maxHeight: 360, overflowY: "auto", scrollbarWidth: "thin" }}>
                        {loading ? (
                            <div style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%",
                                    border: "2px solid rgba(99,102,241,0.2)",
                                    borderTopColor: "#6366f1", animation: "spin 1s linear infinite"
                                }} />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ background: "rgba(30,41,59,0.5)", padding: "1rem", borderRadius: "50%", marginBottom: "0.5rem" }}>
                                    <Bell size={24} style={{ opacity: 0.5, color: "#94a3b8" }} />
                                </div>
                                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>No notifications yet</span>
                                <span style={{ fontSize: "0.75rem", color: "#475569" }}>When you get notifications, they'll show up here</span>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} onClick={(e) => !n.isRead && markAsRead(n._id, e)} style={{
                                    padding: "0.8rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    background: n.isRead ? "transparent" : "rgba(99,102,241,0.08)",
                                    cursor: n.isRead ? "default" : "pointer", display: "flex", gap: "0.75rem",
                                    transition: "background 0.2s", alignItems: "flex-start"
                                }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%", background: "rgba(30,41,59,0.8)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        border: "1px solid rgba(255,255,255,0.05)"
                                    }}>
                                        {getIconForType(n.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            margin: "0 0 0.35rem 0", fontSize: "0.8rem", color: n.isRead ? "#94a3b8" : "#f1f5f9",
                                            fontWeight: n.isRead ? 400 : 500, lineHeight: 1.4
                                        }}>
                                            {n.message}
                                        </p>
                                        <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 500 }}>
                                            {timeAgo(n.createdAt)}
                                        </span>
                                    </div>
                                    {!n.isRead && (
                                        <button onClick={(e) => markAsRead(n._id, e)} style={{
                                            background: "rgba(99,102,241,0.1)", border: "none", color: "#6366f1", cursor: "pointer",
                                            padding: "0.3rem", borderRadius: "0.375rem", height: "fit-content",
                                            transition: "background 0.2s, color 0.2s"
                                        }} title="Mark as read"
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; e.currentTarget.style.color = "#818cf8"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "#6366f1"; }}
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            <style>
                {`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
        </div>
    );
}
