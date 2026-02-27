import { LogOut, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return createPortal(
        /* Overlay */
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1rem",
                animation: "fadeIn 0.15s ease",
            }}
        >
            {/* Card — stop click propagation so overlay click doesn't close from inside */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#0f172a",
                    border: "1px solid rgba(51,65,85,1)", // border-slate-700
                    borderRadius: "0.75rem", // xl
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "380px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    animation: "scaleIn 0.18s ease",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: "1rem", right: "1rem",
                        background: "none", border: "none", cursor: "pointer",
                        color: "#475569", padding: "0.25rem", borderRadius: "0.375rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div style={{
                    width: "52px", height: "52px", borderRadius: "0.875rem",
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                }}>
                    <LogOut size={22} color="#ef4444" />
                </div>

                {/* Text */}
                <h3 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#f1f5f9", marginBottom: "0.5rem" }}>
                    Are you sure you want to log out?
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                    You will need to sign in again to access your dashboard.
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    {/* Cancel */}
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: "0.65rem 1rem",
                            borderRadius: "0.5rem",
                            border: "1px solid rgba(51,65,85,1)",
                            background: "transparent",
                            color: "#94a3b8", fontWeight: "600", fontSize: "0.875rem",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(51,65,85,1)";
                            e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#94a3b8";
                        }}
                    >
                        Cancel
                    </button>

                    {/* Confirm */}
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1, padding: "0.65rem 1rem",
                            borderRadius: "0.5rem", border: "none",
                            background: "#ef4444",
                            color: "white", fontWeight: "700", fontSize: "0.875rem",
                            cursor: "pointer", transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
                        onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}
                    >
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Keyframe animations injected once */}
            <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
            `}</style>
        </div>,
        document.body
    );
}
