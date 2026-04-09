import { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, UserX, Trash2, Settings, UserPlus, FileMinus, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../api/axios";

export default function AdminAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("All");

    const actions = [
        "All",
        "User Approved",
        "User Rejected",
        "User Deleted",
        "Role Updated",
        "Settings Updated",
        "Opportunity Deleted",
    ];

    const getActionIcon = (action) => {
        switch (action) {
            case "User Approved": return <ShieldCheck size={16} className="text-emerald-400" />;
            case "User Rejected": return <UserX size={16} className="text-amber-400" />;
            case "User Deleted": return <Trash2 size={16} className="text-red-400" />;
            case "Role Updated": return <UserPlus size={16} className="text-indigo-400" />;
            case "Settings Updated": return <Settings size={16} className="text-blue-400" />;
            case "Opportunity Deleted": return <FileMinus size={16} className="text-rose-400" />;
            default: return <ShieldCheck size={16} className="text-slate-400" />;
        }
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/audit-logs", {
                params: { page, limit: 10, action: actionFilter, search }
            });
            setLogs(res.data.logs);
            setTotalPages(res.data.pages);
        } catch (error) {
            // Error handled silently
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 300); // debounce search
        return () => clearTimeout(timer);
    }, [page, actionFilter, search]);

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="mb-2 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">Audit Logs</h1>
                    <p className="text-sm text-gray-400">Monitor platform activities and administrative actions.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="icon-glow absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <input
                            type="text"
                            placeholder="Search user or details..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-gray-200 transition-all focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="icon-glow absolute left-3 top-1/2 -translate-y-1/2" size={18} />
                        <select
                            value={actionFilter}
                            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                            className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pr-8 pl-10 text-sm text-gray-200 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                        >
                            {actions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">Action</th>
                                <th className="p-4 font-semibold">Performed By</th>
                                <th className="p-4 font-semibold">Target / Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">
                                        Loading audit logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">
                                        No audit logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="transition-colors hover:bg-white/10">
                                        <td className="p-4 text-sm text-gray-300">
                                            {new Date(log.createdAt).toLocaleString([], {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className="font-medium text-gray-200">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {log.performedBy ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/20 text-xs font-semibold text-cyan-300">
                                                        {log.performedBy.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-300">{log.performedBy.name}</span>
                                                </div>
                                            ) : <span className="text-gray-500">System</span>}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <p className="text-gray-300">{log.details}</p>
                                            {log.targetUser && (
                                                <p className="mt-1 text-xs text-gray-500">Target: {log.targetUser.email}</p>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 bg-white/5 p-4">
                        <span className="text-sm text-gray-400">
                            Page <span className="font-semibold text-gray-200">{page}</span> of <span className="font-semibold text-gray-200">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 font-semibold text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
