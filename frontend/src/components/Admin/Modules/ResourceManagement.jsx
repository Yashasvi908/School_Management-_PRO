import React, { useState } from 'react';
import { 
    BookOpen, 
    Bus, 
    Plus, 
    Search, 
    MoreVertical, 
    Library, 
    Truck, 
    CheckCircle, 
    AlertCircle, 
    User,
    Clock,
    MapPin,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const ResourceManagement = () => {
    const [activeTab, setActiveTab] = useState('library'); // 'library', 'transport'

    const libraryStats = [
        { name: 'Mon', issued: 45, returned: 38 },
        { name: 'Tue', issued: 52, returned: 48 },
        { name: 'Wed', issued: 38, returned: 42 },
        { name: 'Thu', issued: 65, returned: 55 },
        { name: 'Fri', issued: 48, returned: 50 },
    ];

    const fleetStatus = [
        { name: 'On Route', value: 18, color: '#10b981' },
        { name: 'In Depot', value: 8, color: '#6366f1' },
        { name: 'Maintenance', value: 4, color: '#f43f5e' },
    ];

    const books = [
        { title: 'Advanced Physics', author: 'H.C. Verma', isbn: '978-01', status: 'Available', shelf: 'A-12' },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-02', status: 'Issued', shelf: 'B-04' },
    ];

    const routes = [
        { name: 'Route Alpha', bus: 'MP-04-AB-1234', driver: 'Sohan Lal', status: 'On Route', capacity: '45/52' },
        { name: 'Route Beta', bus: 'MP-04-CD-5678', driver: 'Manoj Singh', status: 'In Depot', capacity: '0/52' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Library className="w-6 h-6 text-indigo-500" /> Resource Inventory
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Infrastructure & Logistics Management</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Library System</button>
                    <button onClick={() => setActiveTab('transport')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transport' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Transport Fleet</button>
                </div>
            </div>

            {activeTab === 'library' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest">Circulation Intensity</h4>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-text-dim uppercase"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Issued</div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-text-dim uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Returned</div>
                            </div>
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={libraryStats}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                    <Bar dataKey="issued" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Volumes', val: '12,450', sub: '+120 this month' },
                            { label: 'Active Members', val: '840', sub: '92% participation' },
                            { label: 'Overdue Books', val: '14', sub: 'Requires Attention', color: 'text-rose-500' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-bg-base/30">
                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className={`text-xl font-black ${stat.color || 'text-text-main'} tracking-tighter`}>{stat.val}</h4>
                                <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'transport' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">Fleet Allocation</h4>
                        <div className="h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={fleetStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {fleetStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black text-text-main">30</span>
                                <span className="text-[8px] font-black text-text-dim uppercase">Vehicles</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                             {fleetStatus.map((s, i) => (
                                 <div key={i} className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                     <span className="text-text-dim flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div> {s.name}</span>
                                     <span className="text-text-main">{s.value}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Avg Fuel Economy', val: '4.2 km/L', sub: 'Target: 4.5' },
                                { label: 'Maintenance Cost', val: '₹1.2L', sub: 'This Quarter' },
                                { label: 'Driver Rating', val: '4.8/5.0', sub: 'Safety Score' },
                                { label: 'Service Alerts', val: '02', sub: 'Next 48 Hours', color: 'text-amber-500' },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card p-6 rounded-[2.5rem] border border-border-base/50 bg-bg-base/30">
                                    <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className={`text-lg font-black ${stat.color || 'text-text-main'} tracking-tighter`}>{stat.val}</h4>
                                    <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'library' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end gap-4">
                        <div className="flex-1 max-w-sm relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                            <input type="text" placeholder="Search book, author, ISBN..." className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-xs font-bold text-text-main" />
                        </div>
                        <button className="px-6 py-4 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20">+ Add New Book</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Publication / Book</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Author</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Location</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><BookOpen className="w-5 h-5" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main uppercase tracking-tight">{book.title}</p>
                                                <p className="text-[9px] font-bold text-text-dim uppercase">ISBN: {book.isbn}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-text-main">{book.author}</td>
                                        <td className="px-6 py-5 text-[10px] font-black text-text-dim uppercase tracking-widest">Shelf {book.shelf}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${book.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{book.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right"><MoreVertical className="w-4 h-4 text-text-dim" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'transport' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routes.map((route, i) => (
                            <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-border-base group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Truck className="w-20 h-20 text-indigo-500" />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Bus className="w-6 h-6" /></div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${route.status === 'On Route' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-bg-base text-text-dim'}`}>{route.status}</span>
                                </div>
                                <h4 className="text-xl font-black text-text-main uppercase tracking-tighter mb-6">{route.name}</h4>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-3 bg-bg-base/30 rounded-xl border border-border-base/50">
                                        <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Assigned Driver</p>
                                        <p className="text-xs font-black text-text-main flex items-center gap-2"><User className="w-3 h-3 text-indigo-500" /> {route.driver}</p>
                                    </div>
                                    <div className="p-3 bg-bg-base/30 rounded-xl border border-border-base/50">
                                        <p className="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Bus Occupancy</p>
                                        <p className="text-xs font-black text-text-main flex items-center gap-2 font-mono"><Users className="w-3 h-3 text-indigo-500" /> {route.capacity}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" /> GPS Track
                                    </button>
                                    <button className="flex-1 py-3 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Stoppages
                                    </button>
                                </div>
                            </div>
                        ))}
                         <button className="h-full min-h-[250px] border-2 border-dashed border-border-base rounded-[3rem] flex flex-col items-center justify-center gap-4 text-text-dim hover:border-indigo-500/50 hover:text-indigo-500 transition-all group">
                             <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform" />
                             <span className="text-xs font-black uppercase tracking-widest">Register New Vehicle / Route</span>
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ResourceManagement;
