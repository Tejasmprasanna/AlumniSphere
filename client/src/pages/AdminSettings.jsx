import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import {
    Settings, Save, ToggleLeft, ToggleRight, Shield,
    Users, Globe, Wrench, Palette, AlertTriangle, CheckCircle2,
    RefreshCw, Lock,
} from "lucide-react";

/* ── Toast ─────────────────────────────────────────────────────── */
function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`toast toast-${type}`}>{msg}</div>;
}

/* ── Section card wrapper ─────────────────────────────────────── */
function Section({ icon: Icon, iconColor = "#6366f1", title, subtitle, children }) {
    return (
        <div className="glass" style={{ padding: "1.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.35rem", paddingBottom: "0.9rem", borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
                <div style={{ width: 34, height: 34, borderRadius: "0.5rem", background: `${iconColor}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={iconColor} />
                </div>
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>{title}</p>
                    {subtitle && <p style={{ fontSize: "0.73rem", color: "#64748b" }}>{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

/* ── Toggle row ───────────────────────────────────────────────── */
function ToggleRow({ label, description, value, onChange, disabled }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: "1px solid rgba(99,102,241,0.07)" }}>
            <div>
                <p style={{ fontSize: "0.84rem", color: "#e2e8f0", fontWeight: 600 }}>{label}</p>
                {description && <p style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "0.15rem" }}>{description}</p>}
            </div>
            <button
                onClick={() => !disabled && onChange(!value)}
                style={{ background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer", color: value ? "#10b981" : "#475569", flexShrink: 0, marginLeft: "1rem", opacity: disabled ? 0.4 : 1 }}
                title={disabled ? "Saving…" : undefined}
            >
                {value ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
            </button>
        </div>
    );
}

/* ── Input row ────────────────────────────────────────────────── */
function InputRow({ label, description, type = "text", value, onChange, suffix }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.3rem" }}>{label}</label>
            {description && <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.45rem" }}>{description}</p>}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                    type={type}
                    className="input-field"
                    style={{ fontSize: "0.875rem" }}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                {suffix && <span style={{ fontSize: "0.75rem", color: "#64748b", flexShrink: 0 }}>{suffix}</span>}
            </div>
        </div>
    );
}

/* ── Select row ───────────────────────────────────────────────── */
function SelectRow({ label, description, value, options, onChange }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.3rem" }}>{label}</label>
            {description && <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.45rem" }}>{description}</p>}
            <select
                className="input-field"
                style={{ fontSize: "0.875rem", cursor: "pointer" }}
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

/* ── Save button ─────────────────────────────────────────────── */
function SaveBtn({ onClick, saving, label = "Save Changes" }) {
    return (
        <button
            onClick={onClick}
            disabled={saving}
            className="btn-primary"
            style={{ marginTop: "0.5rem", opacity: saving ? 0.7 : 1 }}
        >
            {saving ? <RefreshCw size={14} style={{ animation: "spin .8s linear infinite" }} /> : <Save size={14} />}
            {saving ? "Saving…" : label}
        </button>
    );
}

/* ── Main component ───────────────────────────────────────────── */
export default function AdminSettings() {
    const [cfg, setCfg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
    }, []);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get("/admin/settings");
            setCfg(res.data.settings);
        } catch {
            showToast("Failed to load settings.", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    const patch = (key, val) => setCfg(prev => ({ ...prev, [key]: val }));

    const save = async (keys) => {
        setSaving(true);
        try {
            const payload = {};
            keys.forEach(k => { payload[k] = cfg[k]; });
            const res = await API.put("/admin/settings", payload);
            setCfg(res.data.settings);
            showToast("Settings saved successfully ✓");
        } catch {
            showToast("Failed to save settings.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !cfg) {
        return (
            <div className="fade-in" style={{ padding: "1.75rem" }}>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div className="glass" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.5rem", background: "rgba(30,41,59,0.4)", animation: "pulse 1.5s ease-in-out infinite", height: 72 }} />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="glass" style={{ height: 180, marginBottom: "1.25rem", background: "rgba(30,41,59,0.4)", animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ padding: "1.75rem", maxWidth: 760 }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <Toast msg={toast.msg} type={toast.type} />

            {/* Header */}
            <div className="glass" style={{
                padding: "1.25rem 1.75rem", marginBottom: "1.75rem", display: "flex",
                alignItems: "center", gap: "0.875rem",
                background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(30,41,59,0.7))",
            }}>
                <div style={{ width: 40, height: 40, borderRadius: "0.6rem", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Settings size={20} color="#6366f1" />
                </div>
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: "1.15rem", color: "#f1f5f9" }}>System Settings</h2>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>Configure and manage the AlumniSphere platform</p>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* ── 1. Platform Settings ─────────────────── */}
                <Section icon={Globe} title="Platform Settings" subtitle="Core feature toggles for the platform">
                    <ToggleRow label="Require Student Approval" description="Students must be approved by admin before they can log in." value={cfg.requireStudentApproval} onChange={v => patch("requireStudentApproval", v)} disabled={saving} />
                    <ToggleRow label="Require Alumni Approval" description="Alumni must be approved by admin before they can log in." value={cfg.requireAlumniApproval} onChange={v => patch("requireAlumniApproval", v)} disabled={saving} />
                    <ToggleRow label="Allow Self Registration" description="Allow new users to register. Disable to block all new signups." value={cfg.allowRegistration} onChange={v => patch("allowRegistration", v)} disabled={saving} />
                    <ToggleRow label="Enable Referrals" description="Allow alumni to receive and submit referral requests." value={cfg.enableReferrals} onChange={v => patch("enableReferrals", v)} disabled={saving} />
                    <ToggleRow label="Enable Job Posting" description="Allow alumni to post job and internship opportunities." value={cfg.enableJobPosting} onChange={v => patch("enableJobPosting", v)} disabled={saving} />
                    <ToggleRow label="Enable Interview Sharing" description="Allow users to post and view interview experiences." value={cfg.enableInterviews} onChange={v => patch("enableInterviews", v)} disabled={saving} />
                    <SaveBtn onClick={() => save(["requireStudentApproval", "requireAlumniApproval", "allowRegistration", "enableReferrals", "enableJobPosting", "enableInterviews"])} saving={saving} />
                </Section>

                {/* ── 2. User Management ───────────────────── */}
                <Section icon={Users} iconColor="#38bdf8" title="User Management" subtitle="Default roles and auto-approval overrides">
                    <SelectRow
                        label="Default Role for New Users"
                        description="Role assigned when a user registers without specifying one."
                        value={cfg.defaultRole}
                        options={[{ value: "student", label: "Student" }, { value: "alumni", label: "Alumni" }]}
                        onChange={v => patch("defaultRole", v)}
                    />
                    <ToggleRow label="Auto-Approve Alumni" description="Bypass manual review and auto-approve alumni on registration." value={cfg.autoApproveAlumni} onChange={v => patch("autoApproveAlumni", v)} disabled={saving} />
                    <ToggleRow label="Auto-Approve Students" description="Bypass manual review and auto-approve students on registration." value={cfg.autoApproveStudents} onChange={v => patch("autoApproveStudents", v)} disabled={saving} />
                    <SaveBtn onClick={() => save(["defaultRole", "autoApproveAlumni", "autoApproveStudents"])} saving={saving} />
                </Section>

                {/* ── 3. Security ──────────────────────────── */}
                <Section icon={Lock} iconColor="#ef4444" title="Security Settings" subtitle="Authentication and access control configuration">
                    <InputRow label="JWT Expiry Time" description="Token lifetime before the user must log in again." value={cfg.jwtExpiry} onChange={v => patch("jwtExpiry", v)} suffix="e.g. 7d, 24h" />
                    <InputRow label="Max Login Attempts" description="Failed attempts before temporary account lockout." type="number" value={cfg.maxLoginAttempts} onChange={v => patch("maxLoginAttempts", Number(v))} />
                    <InputRow label="Password Minimum Length" description="Minimum character count required for new passwords." type="number" value={cfg.passwordMinLength} onChange={v => patch("passwordMinLength", Number(v))} />
                    <ToggleRow label="Enable Two-Factor Authentication" description="Require a second verification step on login (coming soon)." value={cfg.enable2FA} onChange={v => patch("enable2FA", v)} disabled={saving} />
                    <SaveBtn onClick={() => save(["jwtExpiry", "maxLoginAttempts", "passwordMinLength", "enable2FA"])} saving={saving} />
                </Section>

                {/* ── 4. Branding ──────────────────────────── */}
                <Section icon={Palette} iconColor="#a78bfa" title="Platform Branding" subtitle="Customize platform identity and contact information">
                    <InputRow label="Platform Name" description="Displayed in the app header and emails." value={cfg.platformName} onChange={v => patch("platformName", v)} />
                    <InputRow label="Support Email" description="Users will see this address for help requests." type="email" value={cfg.supportEmail} onChange={v => patch("supportEmail", v)} />
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.3rem" }}>Primary Accent Color</label>
                        <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.45rem" }}>Primary UI accent used for buttons and highlights.</p>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            <input type="color" value={cfg.accentColor} onChange={e => patch("accentColor", e.target.value)}
                                style={{ width: 44, height: 40, border: "1px solid rgba(99,102,241,0.3)", borderRadius: "0.4rem", background: "rgba(15,23,42,0.8)", cursor: "pointer", padding: 2 }} />
                            <input className="input-field" style={{ fontSize: "0.875rem", flex: 1 }} value={cfg.accentColor} onChange={e => patch("accentColor", e.target.value)} placeholder="#6366f1" />
                            <div style={{ width: 28, height: 28, borderRadius: "0.35rem", background: cfg.accentColor, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                        </div>
                    </div>
                    <SaveBtn onClick={() => save(["platformName", "supportEmail", "accentColor"])} saving={saving} />
                </Section>

                {/* ── 5. Maintenance ───────────────────────── */}
                <Section icon={Wrench} iconColor="#f59e0b" title="Maintenance Mode" subtitle="Temporarily restrict platform access">
                    <ToggleRow
                        label="Enable Maintenance Mode"
                        description="When ON, all non-admin users will see a maintenance page."
                        value={cfg.maintenanceMode}
                        onChange={v => patch("maintenanceMode", v)}
                        disabled={saving}
                    />
                    {cfg.maintenanceMode && (
                        <div style={{ marginTop: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "0.4rem", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)", fontSize: "0.78rem", color: "#eab308", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <AlertTriangle size={14} /> Maintenance mode is <strong>ON</strong> — users are blocked from the platform.
                        </div>
                    )}
                    <div style={{ marginTop: "0.6rem" }}>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.3rem" }}>Maintenance Message</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            style={{ fontSize: "0.875rem", resize: "vertical" }}
                            value={cfg.maintenanceMessage}
                            onChange={e => patch("maintenanceMessage", e.target.value)}
                        />
                    </div>
                    <SaveBtn onClick={() => save(["maintenanceMode", "maintenanceMessage"])} saving={saving} />
                </Section>

                {/* ── Danger Zone ──────────────────────────── */}
                <Section icon={Shield} iconColor="#ef4444" title="Danger Zone" subtitle="Irreversible platform actions — use with caution">
                    <div style={{ padding: "0.9rem 1rem", borderRadius: "0.5rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        <p style={{ fontSize: "0.8rem", color: "#fca5a5", fontWeight: 600, marginBottom: "0.25rem" }}>Reset All Settings to Defaults</p>
                        <p style={{ fontSize: "0.73rem", color: "#64748b", marginBottom: "0.75rem" }}>This will revert all configuration to factory defaults. Your user data will not be affected.</p>
                        <button
                            className="btn-danger"
                            style={{ fontSize: "0.78rem" }}
                            onClick={async () => {
                                if (!window.confirm("Are you sure you want to reset all settings? This cannot be undone.")) return;
                                setSaving(true);
                                try {
                                    await API.put("/admin/settings", {
                                        requireStudentApproval: true, requireAlumniApproval: true, allowRegistration: true,
                                        enableReferrals: true, enableJobPosting: true, enableInterviews: true,
                                        defaultRole: "student", autoApproveAlumni: false, autoApproveStudents: false,
                                        jwtExpiry: "7d", maxLoginAttempts: 5, passwordMinLength: 6, enable2FA: false,
                                        platformName: "AlumniSphere", supportEmail: "support@alumnisphere.com", accentColor: "#6366f1",
                                        maintenanceMode: false, maintenanceMessage: "We are performing scheduled maintenance. We'll be back shortly.",
                                    });
                                    await fetchSettings();
                                    showToast("Settings reset to defaults.");
                                } catch {
                                    showToast("Failed to reset settings.", "error");
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            <AlertTriangle size={13} /> Reset to Defaults
                        </button>
                    </div>
                </Section>

            </div>
        </div>
    );
}
