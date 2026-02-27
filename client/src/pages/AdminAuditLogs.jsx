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
                    <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
                    <p className="text-slate-400 text-sm">Monitor platform activities and administrative actions.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search user or details..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <select
                            value={actionFilter}
                            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                            className="bg-slate-900/50 border border-slate-700/50 text-slate-200 text-sm rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                        >
                            {actions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">Action</th>
                                <th className="p-4 font-semibold">Performed By</th>
                                <th className="p-4 font-semibold">Target / Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">
                                        Loading audit logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400">
                                        No audit logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-sm text-slate-300">
                                            {new Date(log.createdAt).toLocaleString([], {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className="text-slate-200 font-medium">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {log.performedBy ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-xs border border-indigo-500/30">
                                                        {log.performedBy.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-slate-300">{log.performedBy.name}</span>
                                                </div>
                                            ) : <span className="text-slate-500">System</span>}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <p className="text-slate-300">{log.details}</p>
                                            {log.targetUser && (
                                                <p className="text-xs text-slate-500 mt-1">Target: {log.targetUser.email}</p>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-slate-700/50 flex items-center justify-between bg-slate-800/20">
                        <span className="text-sm text-slate-400">
                            Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
