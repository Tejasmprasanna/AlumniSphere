import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                background: "#0f172a", flexDirection: "column", gap: "1rem"
            }}>
                <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1",
                    animation: "spin 0.8s linear infinite"
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading...</p>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        const redirect = user.role === "admin" ? "/admin/dashboard" : "/dashboard";
        return <Navigate to={redirect} replace />;
    }

    return children;
}
