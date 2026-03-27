import React, { useState } from 'react';
import { 
    BookOpen, 
    Layers, 
    Plus, 
    Clock, 
    Users, 
    MoreVertical, 
    Edit3,
    Trash2,
    CheckCircle2,
    Shapes,
    GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const AcademicManagement = () => {
    const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'subjects', 'timetable'

    const classes = [
        { name: 'Grade 10', sections: ['A', 'B', 'C'], teacher: 'Dr. Rajesh Kumar', students: 124 },
        { name: 'Grade 9', sections: ['A', 'B'], teacher: 'Mrs. Sunita Verma', students: 86 },
        { name: 'Grade 8', sections: ['A', 'B', 'C', 'D'], teacher: 'Mr. Arvind Singh', students: 156 },
    ];

    const subjects = [
        { name: 'Mathematics', code: 'MATH-101', class: 'Grade 10', teacher: 'Dr. Rajesh Kumar' },
        { name: 'Physics', code: 'PHYS-101', class: 'Grade 10', teacher: 'Mr. Arvind Singh' },
        { name: 'English Literature', code: 'ENG-101', class: 'Grade 9', teacher: 'Mrs. Sunita Verma' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card-base p-6 rounded-[2.5rem] border border-border-base shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" /> Academic Organization
                    </h3>
                    <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest mt-1">Manage Class Structures & Curriculum</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('classes')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'classes' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Classes & Sections</button>
                    <button onClick={() => setActiveTab('subjects')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'subjects' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Subject Pool</button>
                    <button onClick={() => setActiveTab('timetable')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'timetable' ? 'bg-primary text-white shadow-lg' : 'bg-bg-base text-text-dim border border-border-base'}`}>Timetable Engine</button>
                </div>
            </div>

            {activeTab === 'classes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border border-border-base group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">{cls.name.split(' ')[1]}</div>
                                <button className="p-2 hover:bg-bg-base rounded-xl transition-colors"><MoreVertical className="w-4 h-4 text-text-dim" /></button>
                            </div>
                            <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-4">{cls.name} Registry</h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {cls.sections.map(sec => (
                                    <span key={sec} className="px-3 py-1 bg-bg-base/50 border border-border-base rounded-lg text-[10px] font-black text-primary uppercase">Sec {sec}</span>
                                ))}
                                <button className="px-3 py-1 border border-dashed border-border-base rounded-lg text-[10px] font-black text-text-dim uppercase hover:border-primary/50 hover:text-primary transition-all">+ Add</button>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-border-base/50">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim">
                                    <span>Class Teacher</span>
                                    <span className="text-text-main">{cls.teacher}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-dim">
                                    <span>Registry Count</span>
                                    <span className="text-text-main">{cls.students} Students</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <button className="h-full min-h-[250px] border-2 border-dashed border-border-base rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-text-dim hover:border-primary/50 hover:text-primary transition-all group">
                         <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
                         <span className="text-xs font-black uppercase tracking-widest">Setup New Grade / Class</span>
                    </button>
                </div>
            )}

            {activeTab === 'subjects' && (
                <div className="space-y-6">
                    <div className="flex justify-end gap-2">
                        <div className="relative group max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                            <input type="text" placeholder="Search subjects..." className="w-full pl-11 pr-6 py-4 bg-bg-base/30 border border-border-base rounded-2xl text-xs font-bold text-text-main" />
                        </div>
                        <button className="px-6 py-3 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">+ Add Subject</button>
                    </div>
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-border-base/50">
                        <table className="w-full text-left">
                            <thead className="bg-bg-base/50 border-b border-border-base">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Subject Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Code</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Grade Level</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">Assigned Faculty</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub, i) => (
                                    <tr key={i} className="border-b border-border-base/30 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Shapes className="w-5 h-5" /></div>
                                                <span className="text-sm font-bold text-text-main uppercase tracking-tight">{sub.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-dim uppercase mr-10">{sub.code}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-main uppercase">{sub.class}</td>
                                        <td className="px-6 py-5 text-xs font-bold text-text-dim">{sub.teacher}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-primary/10 text-primary rounded-lg shadow-sm font-black"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shadow-sm font-black"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'timetable' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Active Classes', val: '24', sub: 'Across 6 Grades' },
                            { label: 'Total Subjects', val: '48', sub: 'Curriculum Sync' },
                            { label: 'Avg Faculty Load', val: '18h', sub: 'Per Week', color: 'text-emerald-500' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-[2rem] border border-border-base/50 bg-primary/5">
                                <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className={`text-xl font-black ${stat.color || 'text-primary'} tracking-tighter uppercase`}>{stat.val}</h4>
                                <p className="text-[8px] font-bold text-text-dim/50 uppercase mt-1">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-8 rounded-[3rem] border-border-base bg-bg-base/30">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                                <Clock className="w-4 h-4 text-primary" /> Grade 10-A Daily Snapshot
                            </h4>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-bg-base border border-border-base rounded-xl text-[9px] font-black uppercase tracking-widest text-text-dim">Mon</button>
                                <button className="px-4 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Tue</button>
                                <button className="px-4 py-2 bg-bg-base border border-border-base rounded-xl text-[9px] font-black uppercase tracking-widest text-text-dim">Wed</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-border-base">
                                    <tr>
                                        {['Period', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30'].map(time => (
                                            <th key={time} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-dim">{time}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border-base/30">
                                        <td className="px-6 py-5 text-[10px] font-black text-primary uppercase">Subject</td>
                                        <td className="px-6 py-5">
                                            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                                                <p className="text-[10px] font-black text-text-main uppercase">Mathematics</p>
                                                <p className="text-[8px] font-bold text-text-dim uppercase">Room 101B</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                                <p className="text-[10px] font-black text-text-main uppercase">Physics Lab</p>
                                                <p className="text-[8px] font-bold text-text-dim uppercase">Block C</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                <p className="text-[10px] font-black text-text-main uppercase">Biology</p>
                                                <p className="text-[8px] font-bold text-text-dim uppercase">Room 104</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                                <p className="text-[10px] font-black text-text-main uppercase">History</p>
                                                <p className="text-[8px] font-bold text-text-dim uppercase">Room 202</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 flex justify-center">
                             <button className="px-10 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/30">Generate Optimized Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AcademicManagement;
