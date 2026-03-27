import React, { useState } from 'react';
import { 
    Users, 
    GraduationCap, 
    Plus, 
    Download, 
    Upload, 
    TrendingUp, 
    MoreVertical, 
    Search, 
    FileText, 
    Phone, 
    Shield, 
    Trash2, 
    ArrowUpCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const StudentManagement = ({ setShowAddStudent }) => {
    const [view, setView] = useState('list'); // 'list', 'admission', 'bulk'

    const admissionTrend = [
        { month: 'Jan', new: 45 },
        { month: 'Feb', new: 52 },
        { month: 'Mar', new: 38 },
        { month: 'Apr', new: 65 },
        { month: 'May', new: 48 },
        { month: 'Jun', new: 120 },
    ];

    const genderData = [
        { name: 'Male', value: 640, color: '#6366f1' },
        { name: 'Female', value: 600, color: '#f43f5e' },
    ];

    const students = [
        { name: 'Rahul Sharma', id: 'STU-1001', class: '10-A', status: 'Active', parent: 'Mr. Sharma', phone: '+91 98765 43210' },
        { name: 'Anita Gupta', id: 'STU-1002', class: '10-B', status: 'Active', parent: 'Mr. Gupta', phone: '+91 98765 43211' },
        { name: 'Sameer Khan', id: 'STU-1003', class: '9-A', status: 'On Leave', parent: 'Mr. Khan', phone: '+91 98765 43212' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Header / Sub-Nav */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-primary" /> Student Directory
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">1,240 Total Registered Students</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-primary text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>All Students</button>
                    <button onClick={() => setView('admission')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'admission' ? 'bg-primary text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>Admission Form</button>
                    <button onClick={() => setView('bulk')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'bulk' ? 'bg-primary text-white' : 'bg-bg-base text-text-dim border border-border-base'}`}>Bulk Import</button>
                </div>
            </div>

            {view === 'list' && (
                <div className="space-y-6">
                    {/* Search & Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-primary transition-colors" />
                            <input type="text" placeholder="Search by name, ID, or class..." className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50" />
                        </div>
                        <button className="px-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-dim flex items-center gap-2">
                             Filter <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Strategic Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-primary/5">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-6">New Admissions Trend (Last 6 Months)</h4>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={admissionTrend}>
                                        <defs>
                                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                        <Area type="monotone" dataKey="new" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5 flex flex-col items-center justify-center">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-4">Gender Balance</h4>
                            <div className="h-32 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={genderData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                            {genderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-black text-text-main">1.2K</span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-[8px] font-black text-text-dim uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> M
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-black text-text-dim uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> F
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Class/Section</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Parent / Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-lg">{student.name[0]}</div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">{student.name}</p>
                                                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{student.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-text-main">Grade {student.class}</td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-text-main">{student.parent}</p>
                                            <p className="text-[10px] font-bold text-text-dim uppercase">{student.phone}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><ArrowUpCircle className="w-4 h-4" /></button>
                                                <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><FileText className="w-4 h-4" /></button>
                                                <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'admission' && (
                <div className="glass-card p-10 rounded-[3rem] border-border-base bg-primary/5 animate-in slide-in-from-bottom-8 duration-500">
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-8">Admission <span className="text-primary">Wizard</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Full Identity Name</label>
                            <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-primary/50" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign Class</label>
                            <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main appearance-none">
                                <option>Grade 1</option>
                                <option>Grade 10</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Assign Section</label>
                            <select className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main appearance-none">
                                <option>Section A</option>
                                <option>Section B</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-10 p-10 border-2 border-dashed border-border-base rounded-[2.5rem] text-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h5 className="font-black text-text-main uppercase text-sm">Upload Student Documents</h5>
                        <p className="text-xs font-bold text-text-dim mt-2 tracking-widest opacity-60">Birth Certificate, Previous Marksheets (PDF/JPG)</p>
                    </div>
                    <div className="flex justify-end mt-10">
                        <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30">Generate Admission ID & Save</button>
                    </div>
                </div>
            )}

            {view === 'bulk' && (
                <div className="glass-card p-20 rounded-[3rem] border-border-base flex flex-col items-center justify-center text-center animate-in scale-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20">
                        <Download className="w-12 h-12" />
                    </div>
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter">Bulk Import Students</h4>
                    <p className="text-sm font-bold text-text-dim mt-2 max-w-sm mx-auto uppercase tracking-widest opacity-60">Upload your Excel/CSV file with the standardized template to register 100s of students at once.</p>
                    <div className="flex gap-4 mt-10">
                        <button className="px-8 py-4 bg-bg-base border border-border-base text-text-dim text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all flex items-center gap-2">
                             <Download className="w-4 h-4" /> Download Template
                        </button>
                        <button className="px-8 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-2">
                             <Upload className="w-4 h-4" /> Upload Excel File
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StudentManagement;
