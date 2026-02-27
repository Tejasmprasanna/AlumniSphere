import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage token on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("alumniToken");
            if (!token) { setLoading(false); return; }
            try {
                const res = await API.get("/auth/me");
                setUser(res.data.user);
            } catch {
                localStorage.removeItem("alumniToken");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("alumniToken", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (data) => {
        const res = await API.post("/auth/register", data);
        localStorage.setItem("alumniToken", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem("alumniToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
