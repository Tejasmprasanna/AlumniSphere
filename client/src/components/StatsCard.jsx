export default function StatsCard({ label, value, icon: Icon, color = "#6366f1", bg = "rgba(99,102,241,0.1)" }) {
    return (
        <div className="glass card-hover rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_rgba(34,211,238,0.1)] backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)]" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
                width: "48px", height: "48px", borderRadius: "0.75rem",
                background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                boxShadow: "0 0 18px rgba(34,211,238,0.25)"
            }}>
                {Icon && <Icon size={22} color={color} />}
            </div>
            <div>
                <div className="text-3xl font-bold leading-tight text-gray-200">{value ?? "—"}</div>
                <div className="mt-1 text-sm font-medium text-gray-400">{label}</div>
            </div>
        </div>
    );
}
