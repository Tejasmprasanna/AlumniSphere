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
                background: "rgba(2,6,23,0.75)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1rem",
                animation: "fadeIn 0.15s ease",
            }}
        >
            {/* Card — stop click propagation so overlay click doesn't close from inside */}
            <div
                onClick={e => e.stopPropagation()}
                className="glass-card transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:scale-[1.02]"
                style={{
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "380px",
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
                        color: "#94a3b8", padding: "0.25rem", borderRadius: "0.375rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a5f3fc"}
                    onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div style={{
                    width: "52px", height: "52px", borderRadius: "0.875rem",
                    background: "rgba(248,113,113,0.12)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                }}>
                    <LogOut size={22} color="#ef4444" />
                </div>

                {/* Text */}
                <h3 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#e5e7eb", marginBottom: "0.5rem" }}>
                    Are you sure you want to log out?
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "1.75rem", lineHeight: 1.6 }}>
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
                            border: "1px solid rgba(34,211,238,0.2)",
                            background: "transparent",
                            color: "#9ca3af", fontWeight: "600", fontSize: "0.875rem",
                            cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            e.currentTarget.style.color = "#e5e7eb";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#9ca3af";
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
                            background: "linear-gradient(to right, #2dd4bf, #22d3ee)",
                            color: "white", fontWeight: "700", fontSize: "0.875rem",
                            cursor: "pointer", transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(34,211,238,0.6)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
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
