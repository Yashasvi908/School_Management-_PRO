import React, { useState } from 'react';
import { 
    ShieldCheck, 
    Users, 
    Database, 
    Lock, 
    Eye, 
    MoreVertical, 
    Search, 
    Activity, 
    ArrowUpRight, 
    Cloud, 
    Download,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const SystemSecurity = () => {
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'security', 'backup'

    const securityData = [
        { name: '00:00', threats: 12 }, { name: '04:00', threats: 8 }, { name: '08:00', threats: 15 },
        { name: '12:00', threats: 45 }, { name: '16:00', threats: 28 }, { name: '20:00', threats: 18 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-rose-500" /> System Citadel
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Users, Security Monitoring & Disaster Recovery</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-rose-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>User Access</button>
                    <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-rose-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Security Logs</button>
                    <button onClick={() => setActiveTab('backup')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'backup' ? 'bg-rose-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Backup & Cloud</button>
                </div>
            </div>

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-bg-base/30 p-4 rounded-2xl border border-border-base/50">
                        <div className="flex-1 max-w-sm relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                            <input type="text" placeholder="Search system users..." className="w-full pl-11 pr-6 py-3 bg-transparent text-xs font-bold text-text-main focus:outline-none" />
                        </div>
                        <button className="px-6 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/20">+ Invite Admin</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">User Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Role / Permissions</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Last Login</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Compliance</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Sameer Verma', role: 'Super Admin', last: '2 mins ago', status: '2FA-Secured', color: 'text-emerald-500' },
                                    { name: 'Dr. Rajesh Kumar', role: 'Principle Admin', last: '4h ago', status: '2FA-Secured', color: 'text-emerald-500' },
                                    { name: 'Accounts Dept.', role: 'Finance Admin', last: '1d ago', status: 'Unsecured', color: 'text-rose-500' },
                                ].map((u, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-bg-base flex items-center justify-center text-text-dim"><Users className="w-5 h-5" /></div>
                                                <span className="text-sm font-bold text-text-main">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest">{u.role}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase tracking-tighter">{u.last}</td>
                                        <td className="px-6 py-5 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${u.color === 'text-emerald-500' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${u.color}`}>{u.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right"><Lock className="w-4 h-4 text-text-dim cursor-pointer hover:text-rose-500 transition-colors" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="space-y-6">
                    {/* Security Vector Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[3rem] border border-border-base bg-rose-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
                                <Activity className="w-4 h-4 text-rose-500" /> Security Threat Lifecycle
                            </h4>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded-full">Live Monitor</span>
                            </div>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={securityData}>
                                    <defs>
                                        <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(244,63,94,0.1)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 9 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 9 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                    <Area type="monotone" dataKey="threats" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-10 rounded-[3rem] border border-border-base relative overflow-hidden bg-rose-500/5">
                            <AlertTriangle className="absolute top-0 right-0 w-32 h-32 text-rose-500 opacity-5 -mr-10 -mt-10" />
                            <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Threat Monitoring</h4>
                            <div className="space-y-4">
                                {[
                                    { msg: 'Unauthorized IP Login Attempt', ip: '192.164.1.2', time: '1h ago', type: 'Critical' },
                                    { msg: 'Suspicious Password Resets', ip: 'Unknown', time: '5h ago', type: 'Warning' },
                                ].map((log, i) => (
                                    <div key={i} className="p-4 bg-bg-base/50 rounded-2xl border border-rose-500/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[11px] font-black text-text-main uppercase">{log.msg}</p>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${log.type === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'}`}>{log.type}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{log.ip} • {log.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-10 rounded-[3rem] border border-border-base">
                             <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-6">Compliance Checklist</h4>
                             <div className="space-y-5">
                                {[
                                    { label: 'Cloud DB Backup Sync', val: 'Operational', status: true },
                                    { label: 'SSL Certificate Expiry', val: '320 Days', status: true },
                                    { label: 'System Firmware Patch', val: 'Outdated', status: false },
                                    { label: 'Admin Activity Logging', val: 'Operational', status: true },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-bg-base/30 rounded-2xl border border-border-base/50">
                                        <div className="flex items-center gap-3">
                                            {c.status ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-rose-500" />}
                                            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{c.label}</span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${c.status ? 'text-emerald-500' : 'text-rose-500'}`}>{c.val}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'backup' && (
                <div className="glass-card p-20 rounded-[3rem] border-border-base text-center animate-in scale-in duration-500">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-500/20 shadow-2xl">
                        <Database className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter">Automated Database Vault</h4>
                    <p className="text-sm font-bold text-text-dim mt-2 max-w-sm mx-auto uppercase tracking-widest opacity-60">Your data is being backed up to AES-256 encrypted cloud servers every 6 hours.</p>
                    <div className="flex justify-center gap-4 mt-12">
                        <button className="px-10 py-5 bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-500/30 flex items-center gap-3">
                             <Cloud className="w-5 h-5" /> Sync Now
                        </button>
                        <button className="px-10 py-5 bg-bg-base border border-border-base text-text-dim text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3">
                             <Download className="w-5 h-5" /> Export Local SQL
                        </button>
                    </div>
                    <p className="text-[9px] font-black text-text-dim/50 uppercase tracking-widest mt-10">Last Successful Backup: Jan 22, 2024 - 04:00 PM (1.4 GB)</p>
                </div>
            )}
        </motion.div>
    );
};

export default SystemSecurity;
