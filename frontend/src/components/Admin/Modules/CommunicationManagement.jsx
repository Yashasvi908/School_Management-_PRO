import React, { useState } from 'react';
import { 
    Bell, 
    Calendar, 
    Plus, 
    MoreVertical, 
    Megaphone, 
    Trash2, 
    Edit3, 
    User, 
    Clock, 
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const CommunicationManagement = () => {
    const [activeTab, setActiveTab] = useState('notices'); // 'notices', 'events'

    const engagementData = [
        { day: 'Mon', reach: 450, opens: 320 },
        { day: 'Tue', reach: 520, opens: 410 },
        { day: 'Wed', reach: 380, opens: 290 },
        { day: 'Thu', reach: 610, opens: 480 },
        { day: 'Fri', reach: 590, opens: 450 },
        { day: 'Sat', reach: 300, opens: 150 },
        { day: 'Sun', reach: 250, opens: 120 },
    ];

    const notices = [
        { title: 'Annual Sports Meet 2024', date: 'Jan 20, 2024', audience: 'All Parents', priority: 'High', status: 'Published' },
        { title: 'Revised Exam Timetable', date: 'Jan 18, 2024', audience: 'Grade 9-12', priority: 'Critical', status: 'Scheduled' },
        { title: 'Parent-Teacher Meeting', date: 'Jan 15, 2024', audience: 'Primary Wing', priority: 'Medium', status: 'Draft' },
    ];

    const events = [
        { title: 'Science Exhibition', date: 'Feb 05, 2024', location: 'Main Hall', attendees: '850 Registered' },
        { title: 'Inter-School Debate', date: 'Feb 12, 2024', location: 'Seminar Room', attendees: '15 Schools' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Megaphone className="w-6 h-6 text-purple-500" /> Communication Hub
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Broadcast Announcements & Manage Events</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('notices')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'notices' ? 'bg-purple-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Notice Board</button>
                    <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-purple-500 text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>School Events</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-purple-500/5">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest">Broadcast Engagement</h4>
                        <div className="flex gap-4 text-[10px] font-bold uppercase">
                            <span className="text-purple-500">Reach</span>
                            <span className="text-pink-500">Opens</span>
                        </div>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                <Area type="monotone" dataKey="reach" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                                <Area type="monotone" dataKey="opens" stroke="#ec4899" strokeWidth={3} fill="none" dasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Unread Notices', val: '12', sub: 'High Priority: 4', color: 'text-rose-500' },
                        { label: 'Upcoming Events', val: '08', sub: 'Next 30 Days', color: 'text-purple-500' },
                        { label: 'Email Delivery', val: '98.2%', sub: 'Real-time Sync', color: 'text-emerald-500' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-bg-base/30">
                            <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className={`text-xl font-black ${stat.color} tracking-tighter`}>{stat.val}</h4>
                            <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {activeTab === 'notices' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button className="px-6 py-3 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20">+ Post New Notice</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Announcement Title</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Audience</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Priority</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {notices.map((n, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Bell className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main uppercase tracking-tight">{n.title}</p>
                                                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{n.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-main uppercase tracking-widest">{n.audience}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${n.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>{n.priority}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${n.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-bg-base text-text-dim'}`}>{n.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-purple-500/10 hover:text-purple-500 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((e, i) => (
                        <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-border-base group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Calendar className="w-20 h-20 text-purple-500" />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6"><Calendar className="w-6 h-6" /></div>
                            <h4 className="text-xl font-black text-text-main uppercase tracking-tighter mb-4">{e.title}</h4>
                            <div className="space-y-3 mb-8">
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2"><Clock className="w-3 h-3 text-purple-500" /> {e.date}</p>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2"><Megaphone className="w-3 h-3 text-purple-500" /> {e.location}</p>
                                <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest flex items-center gap-2"><Users className="w-3 h-3 text-purple-500" /> {e.attendees}</p>
                            </div>
                            <button className="w-full py-4 bg-purple-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all">Manage RSVPs</button>
                        </div>
                    ))}
                    <button className="h-full min-h-[250px] border-2 border-dashed border-border-base rounded-[3rem] flex flex-col items-center justify-center gap-4 text-text-dim hover:border-purple-500/50 hover:text-purple-500 transition-all group">
                         <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-black uppercase tracking-widest">Plan New Mega Event</span>
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default CommunicationManagement;
