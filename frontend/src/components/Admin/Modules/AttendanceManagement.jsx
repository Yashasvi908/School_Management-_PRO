import React, { useState } from 'react';
import { 
    Calendar, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Search, 
    Plus, 
    Layers, 
    Activity, 
    Download,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', 'staff'

    const trendData = [
        { day: 'Mon', active: 92, leaf: 5, absent: 3 },
        { day: 'Tue', active: 94, leaf: 4, absent: 2 },
        { day: 'Wed', active: 88, leaf: 8, absent: 4 },
        { day: 'Thu', active: 95, leaf: 3, absent: 2 },
        { day: 'Fri', active: 91, leaf: 6, absent: 3 },
        { day: 'Sat', active: 85, leaf: 10, absent: 5 },
        { day: 'Sun', active: 80, leaf: 15, absent: 5 },
    ];

    const attendanceStats = [
        { label: 'Present Today', val: '942', total: '1240', color: 'text-emerald-500' },
        { label: 'On Leave', val: '45', total: '1240', color: 'text-amber-500' },
        { label: 'Absent', val: '12', total: '1240', color: 'text-rose-500' },
        { label: 'Average %', val: '92.4%', total: 'Target 95%', color: 'text-primary' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-500" /> Attendance Ledger
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Presence Monitoring</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('student')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'student' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Students</button>
                    <button onClick={() => setActiveTab('teacher')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'teacher' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Teachers</button>
                    <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Staff</button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {attendanceStats.map((s, i) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base border-b-4 border-b-emerald-500/50">
                        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{s.label}</p>
                        <h4 className={`text-2xl font-black mt-2 ${s.color}`}>{s.val}</h4>
                        <p className="text-[9px] font-bold text-text-dim/50 uppercase tracking-widest mt-1">{s.total}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-emerald-500/5">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-sm font-black text-text-main uppercase tracking-widest">Attendance Velocity (Last 7 Days)</h4>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[9px] font-black text-text-dim uppercase">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present %
                        </div>
                    </div>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                            <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card p-8 rounded-[3rem] border-border-base">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                        <input type="text" placeholder="Search by name or ID..." className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-xs font-bold text-text-main" />
                    </div>
                    <div className="flex gap-2">
                         <button className="px-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">Grade <Layers className="w-4 h-4" /></button>
                         <button className="px-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">Jan 22, 2024 <Calendar className="w-4 h-4" /></button>
                         <button className="px-6 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">Mark Today</button>
                    </div>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="border-b border-border-base">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Entity Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">ID Number</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Check-In</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Aryan Verma', id: 'ID-4501', status: 'Present', time: '07:45 AM' },
                                { name: 'Isha Patel', id: 'ID-4502', status: 'Absent', time: '-' },
                                { name: 'Kabir Singh', id: 'ID-4503', status: 'Late', time: '08:15 AM' },
                            ].map((a, i) => (
                                <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5 text-sm font-bold text-text-main">{a.name}</td>
                                    <td className="px-6 py-5 text-xs font-black text-text-dim uppercase tracking-widest">{a.id}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-2">
                                            <CheckCircle className={`w-5 h-5 cursor-pointer transition-colors ${a.status === 'Present' ? 'text-emerald-500' : 'text-text-dim hover:text-emerald-500/50'}`} />
                                            <XCircle className={`w-5 h-5 cursor-pointer transition-colors ${a.status === 'Absent' ? 'text-rose-500' : 'text-text-dim hover:text-rose-500/50'}`} />
                                            <Clock className={`w-5 h-5 cursor-pointer transition-colors ${a.status === 'Late' ? 'text-amber-500' : 'text-text-dim hover:text-amber-500/50'}`} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-text-dim">{a.time}</td>
                                    <td className="px-6 py-5 text-right"><MoreVertical className="w-4 h-4 text-text-dim" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button className="px-8 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Monthly Report
                </button>
            </div>
        </motion.div>
    );
};

export default AttendanceManagement;
