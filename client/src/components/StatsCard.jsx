export default function StatsCard({ label, value, icon: Icon, color = "#6366f1", bg = "rgba(99,102,241,0.1)" }) {
    return (
        <div className="glass card-hover" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
                width: "48px", height: "48px", borderRadius: "0.75rem",
                background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
                {Icon && <Icon size={22} color={color} />}
            </div>
            <div>
                <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#f1f5f9", lineHeight: 1.1 }}>{value ?? "—"}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem", fontWeight: "500" }}>{label}</div>
            </div>
        </div>
    );
}
