import React, { useState } from 'react';
import { 
    Users, 
    UserCheck, 
    Plus, 
    BookOpen, 
    Clock, 
    DollarSign, 
    MoreVertical, 
    Briefcase, 
    Award, 
    Mail, 
    Phone,
    ShieldCheck,
    Search,
    TrendingUp
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

const TeacherManagement = ({ setShowAddTeacher }) => {
    const [view, setView] = useState('list'); // 'list', 'hire'

    const subjectData = [
        { name: 'Math', value: 30, color: '#f59e0b' },
        { name: 'Science', value: 25, color: '#6366f1' },
        { name: 'English', value: 20, color: '#10b981' },
        { name: 'Other', value: 25, color: '#f43f5e' },
    ];

    const performanceData = [
        { name: 'Q1', score: 85 },
        { name: 'Q2', score: 92 },
        { name: 'Q3', score: 88 },
        { name: 'Q4', score: 95 },
    ];

    const teachers = [
        { name: 'Dr. Rajesh Kumar', subject: 'Mathematics', exp: '12 Years', classes: '10A, 10B, 11A', status: 'On Duty', salary: '₹65,000' },
        { name: 'Mrs. Sunita Verma', subject: 'English', exp: '8 Years', classes: '9A, 9B, 10A', status: 'On Duty', salary: '₹55,000' },
        { name: 'Mr. Arvind Singh', subject: 'Physics', exp: '5 Years', classes: '11B, 12A', status: 'In Meeting', salary: '₹50,000' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <Users className="w-6 h-6 text-secondary" /> Teaching Faculty
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">84 Active Faculty Members</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Faculty List</button>
                    <button onClick={() => setView('hire')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'hire' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>New Appointment</button>
                </div>
            </div>

            {view === 'list' && (
                <div className="space-y-6">
                    {/* Faculty Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-secondary/5">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-6 flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-secondary" /> Average Performance Scoring (Last 4 Quarters)
                            </h4>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                        <Bar dataKey="score" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="glass-card p-8 rounded-[3rem] border border-border-base bg-indigo-500/5 flex flex-col items-center justify-center">
                            <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest mb-4">Subject Expertise</h4>
                            <div className="h-32 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={subjectData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                                            {subjectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-xs font-black text-text-main">84</span>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
                                {subjectData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[7px] font-black text-text-dim uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div> {s.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teachers.map((teacher, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 rounded-[2.5rem] border border-border-base relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Award className="w-20 h-20 text-secondary" />
                                </div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl shadow-inner">{teacher.name[0]}</div>
                                    <div>
                                        <h4 className="text-md font-black text-text-main uppercase leading-none tracking-tight">{teacher.name}</h4>
                                        <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mt-1.5">{teacher.subject} Specialist</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6 relative z-10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Experience</span>
                                        <span className="text-text-main">{teacher.exp}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Classes</span>
                                        <span className="text-text-main truncate ml-4 text-right">{teacher.classes}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-dim">
                                        <span>Salary Status</span>
                                        <span className="text-emerald-500">{teacher.salary} / Mo</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <button className="flex-1 py-3 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">Assign Loads</button>
                                    <button className="px-4 py-3 bg-card-base border border-border-base text-text-dim rounded-xl hover:text-rose-500 hover:border-rose-500/30 transition-all"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'hire' && (
                <div className="glass-card p-10 rounded-[3rem] border-border-base bg-secondary/5 animate-in fade-in duration-500 max-w-4xl mx-auto">
                    <h4 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-8">Faculty <span className="text-secondary">Onboarding</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Full Name</label>
                            <input type="text" placeholder="Dr. Jane Smith" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Primary Subject</label>
                            <input type="text" placeholder="Quantum Physics" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Total Experience</label>
                            <input type="text" placeholder="5+ Years" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Proposed Salary</label>
                            <input type="text" placeholder="₹50,000" className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50" />
                        </div>
                         <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Academic Portfolio / BIO</label>
                            <textarea placeholder="Tell us about their expertise..." className="w-full px-6 py-4 bg-bg-base/50 border border-border-base rounded-2xl text-sm font-bold text-text-main focus:outline-none focus:border-secondary/50 min-h-[120px]" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-10">
                        <button className="px-12 py-4 bg-secondary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/30">Issue Appointment Letter</button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TeacherManagement;
