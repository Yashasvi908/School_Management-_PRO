import React, { useState } from 'react';
import { 
    FileText, 
    ClipboardList, 
    CheckCircle, 
    Plus, 
    Upload, 
    MoreVertical, 
    Calendar, 
    BookOpen, 
    TrendingUp,
    Download,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const ExamManagement = () => {
    const [view, setView] = useState('schedule'); // 'schedule', 'marks', 'reports'

    const gradeData = [
        { grade: 'A+', students: 45, color: '#10b981' },
        { grade: 'A', students: 120, color: '#34d399' },
        { grade: 'B+', students: 180, color: '#6366f1' },
        { grade: 'B', students: 140, color: '#8b5cf6' },
        { grade: 'C', students: 60, color: '#f59e0b' },
        { grade: 'D/F', students: 15, color: '#f43f5e' },
    ];

    const exams = [
        { title: 'Final Term Examination', sessions: 'Morning / Evening', dates: 'Mar 15 - Mar 30', status: 'Scheduled' },
        { title: 'Mid-Term Assessment', sessions: 'Morning Only', dates: 'Oct 10 - Oct 20', status: 'Published' },
        { title: 'Unit Test III', sessions: 'Daily Classes', dates: 'Dec 05 - Dec 10', status: 'Completed' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <FileText className="w-6 h-6 text-rose-500" /> Examination Engine
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Manage National & Internal Assessments</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('schedule')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'schedule' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Exam Calendar</button>
                    <button onClick={() => setView('marks')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'marks' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Mark Entry</button>
                    <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'reports' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-bg-base text-text-dim border border-border-base'}`}>Report Cards</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8 rounded-[3rem] border border-border-base bg-rose-500/5">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-rose-500" /> Grade Distribution (Latest Exam)
                        </h4>
                        <span className="px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded-full tracking-widest">Final Term 2024</span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeData}>
                                <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card-base)', borderRadius: '12px', border: '1px solid var(--border-base)' }} />
                                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                                    {gradeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'School Avg Score', val: '78.4%', sub: '+2.1% improvement' },
                        { label: 'Pass Percentage', val: '98.5%', sub: 'Target: 100%', color: 'text-emerald-500' },
                        { label: 'Highest GPA', val: '4.92/5.0', sub: 'ID: ID-1022 - Grade 12', color: 'text-amber-500' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-bg-base/30">
                            <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className={`text-xl font-black ${stat.color || 'text-text-main'} tracking-tighter`}>{stat.val}</h4>
                            <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {view === 'schedule' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button className="px-6 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-rose-500/20">+ Create New Exam</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam, i) => (
                            <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-border-base relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Calendar className="w-20 h-20 text-rose-500" />
                                </div>
                                <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-4">{exam.title}</h4>
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest">
                                        <Clock className="w-3 h-3" /> {exam.sessions} sessions
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" /> {exam.dates}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${exam.status === 'Scheduled' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{exam.status}</span>
                                    <button className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'marks' && (
                <div className="glass-card p-12 rounded-[3rem] border-border-base bg-rose-500/5 block text-center border-dashed border-2">
                    <Upload className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                    <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">Bulk Marks Uploader</h4>
                    <p className="text-sm font-bold text-text-dim mt-2 tracking-widest opacity-60">Upload academic results for an entire class using our standardized Excel template.</p>
                    <div className="flex justify-center gap-4 mt-8">
                        <button className="px-8 py-4 bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-500/30">Select Excel File</button>
                        <button className="px-8 py-4 bg-bg-base border border-border-base text-text-dim text-[11px] font-black uppercase tracking-widest rounded-2xl">Manual Entry Mode</button>
                    </div>
                </div>
            )}

            {view === 'reports' && (
                <div className="glass-card p-12 rounded-[3rem] border-border-base block text-center">
                    <TrendingUp className="w-16 h-16 text-emerald-500 mx-auto mb-6 animate-bounce" />
                    <h4 className="text-xl font-black text-text-main uppercase tracking-tighter">Result Analysis & Report Cards</h4>
                    <p className="text-sm font-bold text-text-dim mt-2 tracking-widest opacity-60">Generate bulk report cards with automated grading system and performance graphs.</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <button className="px-8 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-2">
                             <Download className="w-4 h-4" /> Download All (PDF)
                        </button>
                        <select className="px-6 py-4 bg-bg-base border border-border-base rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-dim appearance-none cursor-pointer">
                            <option>Select Class</option>
                            <option>Grade 10</option>
                            <option>Grade 9</option>
                        </select>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ExamManagement;
